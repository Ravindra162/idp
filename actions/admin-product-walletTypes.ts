"use server";

import { db } from "@/lib/db";
import { EditTeamQuantitySchema, EditWalletTypeQuantitySchema } from "@/schemas";
import { connect } from "http2";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export const includeWalletTypeInfo = async (
  values: z.infer<typeof EditWalletTypeQuantitySchema>
) => {
  const parsedData = EditWalletTypeQuantitySchema.parse(values);

  const { id, name, walletTypeId, minProduct, maxProduct, price } = parsedData;

  try {

    console.log(walletTypeId);

    const existingProductInfo = await db.productInfo.findFirst({
      where: { productId: id, walletTypeId },
    });

    let updatedProductInfo;
    if (existingProductInfo) {
      updatedProductInfo = await db.productInfo.update({
        where: { id: existingProductInfo.id }, // Using unique id for update
        data: { Min: minProduct, Max: maxProduct, Price: price },
      });
    } else {
      updatedProductInfo = await db.productInfo.create({
        data: {
          productId: id,
          name: name,
          Min: minProduct,
          Max: maxProduct,
          Price: price,
          walletType: {
            connect: { id : walletTypeId },
          },
        },
      });
    }


    await db.product.update({
      where: { id },
      data: {
        includedWalletTypes: { connect: { id : walletTypeId } },
      },
    });

    console.log("---------------");

    await db.walletType.update({
      where: { id : walletTypeId  },
      data: {
        includedIn: { connect: { id } },
      },
    });

    revalidatePath("/admin/product/product-table");
    return { success: "WalletType Included Successfully!", data: updatedProductInfo };
  } catch (error) {
    console.error("Error updating product info:", error);
    return { error: "Failed to update product info" };
  }
};

export const excludeWalletTypeInfo = async (
  values: z.infer<typeof EditWalletTypeQuantitySchema>
) => {
  const parsedData = EditWalletTypeQuantitySchema.parse(values);

  const { id, name, walletTypeId, minProduct, maxProduct, price } = parsedData;

  try {

    console.log(walletTypeId);

    const existingProductInfo = await db.productInfo.findFirst({
      where: { productId: id, walletTypeId },
    });

    let updatedProductInfo;
    if (existingProductInfo) {
      updatedProductInfo = await db.productInfo.update({
        where: { id: existingProductInfo.id }, // Using unique id for update
        data: { Min: minProduct, Max: maxProduct, Price: price },
      });
    } else {
      updatedProductInfo = await db.productInfo.create({
        data: {
          productId: id,
          name: name,
          Min: 0,
          Max: 0,
          Price: 0,
          walletType: {
            connect: { id : walletTypeId },
          },
        },
      });
    }


    await db.product.update({
      where: { id },
      data: {
        excludedWalletTypes: { connect: { id : walletTypeId } },
      },
    });

    console.log("---------------");

    await db.walletType.update({
      where: { id : walletTypeId  },
      data: {
        excludedFrom: { connect: { id } },
      },
    });

    revalidatePath("/admin/product/product-table");
    return { success: "WalletType Excluded Successfully!", data: updatedProductInfo };
  } catch (error) {
    console.error("Error updating product info:", error);
    return { error: "Failed to update product info" };
  }
};

export const removeIncludeWalletTypeInfo = async (
  walletTypeId: string,
  productId: string
) => {
  try {
    // Find the existing ProductInfo record
    const existingProductInfo = await db.productInfo.findFirst({
      where: {
        productId,
        walletTypeId,
        Max: { gt: 0 },
        Min: { gt: 0 },
        Price: { gt: 0 },
      },
    });

    if (!existingProductInfo) {
      return { error: "No matching ProductInfo found to remove." };
    }

    // Delete the ProductInfo record
    await db.productInfo.delete({
      where: { id: existingProductInfo.id },
    });

    // Update Product model to disconnect the team
    await db.product.update({
      where: { id: productId },
      data: {
        includedWalletTypes: { disconnect: { id: walletTypeId } }, // Remove team from includedTeams
      },
    });

    // Update Team model to disconnect the product
    await db.walletType.update({
      where: { id : walletTypeId },
      data: {
        includedIn: { disconnect: { id: productId } }, // Remove product from includedIn
      },
    });
    revalidatePath("/admin/product/product-table");
    return { success: "WalletType removed successfully from Product!" };
  } catch (error) {
    console.error("Error removing team from product:", error);
    return { error: "Failed to remove team from product." };
  }
};

export const removeExcludeWalletTypeInfo = async (
  walletTypeId: string,
  productId: string
) => {
  try {
    // Find the existing ProductInfo record
    const existingProductInfo = await db.productInfo.findFirst({
      where: { productId, walletTypeId , Max : 0, Min : 0, Price: 0 },
    });

    if (!existingProductInfo) {
      return { error: "No matching ProductInfo found to remove." };
    }

    // Delete the ProductInfo record
    await db.productInfo.delete({
      where: { id: existingProductInfo.id },
    });

    // Update Product model to disconnect the team
    await db.product.update({
      where: { id: productId },
      data: {
        excludedWalletTypes: { disconnect: { id : walletTypeId } }, // Remove team from includedTeams
      },
    });

    // Update Team model to disconnect the product
    await db.walletType.update({
      where: { id : walletTypeId },
      data: {
        excludedFrom: { disconnect: { id: productId } }, // Remove product from includedIn
      },
    });
    revalidatePath("/admin/product/product-table");
    return { success: "WalletType removed successfully from Product!" };
  } catch (error) {
    console.error("Error removing team from product:", error);
    return { error: "Failed to remove team from product." };
  }
};
