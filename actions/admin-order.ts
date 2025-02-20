"use server";

import { db } from "@/lib/db";
import { RejectOrderSchema } from "@/schemas";
import { revalidatePath } from "next/cache";
import * as z from "zod";
import { v2 as cloudinary } from "cloudinary";

type Product = {
  name: string;
  quantity: number;
  stock: number;
};

export const rejectOrder = async (
  values: z.infer<typeof RejectOrderSchema>
) => {
  const validatedFields = RejectOrderSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields!!" };
  }

  const order = await db.order.findUnique({
    where: { id: values.id },
  });

  const products = await db.product.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!order?.products) {
    return { error: "Order not found!" };
  }

  const rejectedProducts: Product[] = (order.products as Product[]).map(
    (product: Product) => {
      const existingProduct = products.find(
        (p) => p.productName === product.name
      );

      return {
        name: product.name,
        quantity: product.quantity,
        stock: existingProduct?.stock ?? 0,
      };
    }
  );

  try {
    await db.order.update({
      where: { id: values.id },
      data: { status: "FAILED", reason: values.reason },
    });

    const user = await db.user.findUnique({
      where: { id: values.userId },
      select: {
        totalMoney: true,
      },
    });

    const userMoney_updation = db.user.update({
      where: { id: values.userId },
      data: {
        totalMoney: (user?.totalMoney ?? 0) + values.amount,
      },
    });

    const stock_updation = rejectedProducts.forEach(async (product) => {
      await db.product.update({
        where: { productName: product.name },
        data: {
          stock: product.stock + product.quantity,
        },
      });
    });

    const walletFlow_deletion = db.walletFlow.delete({
      where: {
        moneyId: order.orderId,
      },
    });

    await Promise.all([
      userMoney_updation,
      stock_updation,
      walletFlow_deletion,
    ]);
  } catch (error) {
    console.log(error);
    return { error: "Error while rejecting the Invoice!" };
  }

  revalidatePath("/admin/orders");
  return { success: "Invoice rejected" };
};

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

async function convertFilesToBase64(formData: FormData) {
  const fileEntries = Array.from(formData.entries());
  const files = fileEntries.filter((entry): entry is [string, File] =>
    entry[0].includes("files")
  );

  const base64Promises = files.map(async (fileEntry) => {
    const [fieldName, file] = fileEntry;
    const fileContent = await file.arrayBuffer();
    const base64 = Buffer.from(fileContent).toString("base64");
    return base64;
  });

  return Promise.all(base64Promises);
}

async function uploadFilestoCloudinary(buffer: string[]) {
  const uploadPromises = buffer.map(async (base64) => {
    return cloudinary.uploader.upload(
      `data:application/octet-stream;base64,${base64}`,
      {
        folder: "GrowonsMedia",
        resource_type: "raw",
        type: "authenticated",
      },
      (err) => {
        return { error: err?.message };
      }
    );
  });

  return Promise.all(uploadPromises);
}

export const acceptOrder = async (formData: FormData) => {
  const filesBase64 = await convertFilesToBase64(formData);
  const files = await uploadFilestoCloudinary(filesBase64);
  const id = formData.get("id")?.toString();
  const orderId = formData.get("orderId")?.toString();
  try {
    const order_updation = await db.order.update({
      where: { id: id },
      data: {
        status: "SUCCESS",
        files: files.map((file, index) => ({
          public_id: file.public_id,
          secure_url: file.secure_url,
          fileName: formData.get(`fileName[${index}][fileName]`)?.toString(),
          fileType: formData.get(`fileType[${index}][fileType]`)?.toString(),
        })),
      },
    });

    const walletflow_updation = await db.walletFlow.update({
      where: { moneyId: orderId },
      data: {
        status: "SUCCESS",
      },
    });

    await Promise.all([order_updation, walletflow_updation]);
  } catch (error) {
    console.log(error);
    return { error: "Error while accepting the order!" };
  }

  revalidatePath("/admin/orders");
  revalidatePath("/admin/user/");
  return { success: "Order accepted!" };
};
