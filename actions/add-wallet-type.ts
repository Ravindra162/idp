"use server";
import { db } from "@/lib/db";
import { AddWalletTypeSchema, UpdateWalletTypeSchema } from "@/schemas"; // Assuming you have a schema for validating wallet types
import { PaymentType } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export const getWalletTypes = async () => {
  try {
    const walletTypes = await db.walletType.findMany();

    return { success: true, data: walletTypes };
  } catch (error) {
    return { success: false, error: "Failed to fetch wallet types!" };
  }
};

export const addWalletType = async (values: z.infer<typeof AddWalletTypeSchema>) => {
  const validatedFields = AddWalletTypeSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  try {
      const { name, currencyCode, description, domainId, paymentType, cstpaymentId } = validatedFields.data;

    const parsedDomainIds = domainId.map((item: { type: string }) => item.type);
    const parsedPaymentTypes = paymentType.map((item: { type: string }) => {
      if (Object.values(PaymentType).includes(item.type as PaymentType)) {
        return item.type as PaymentType; 
      } else {
        throw new Error(`Invalid payment type: ${item.type}`);
      }
    });
    


    const result = await db.walletType.create({
      data: {
        name: name,
        currencyCode: currencyCode,
        description: description || null,
        domainId: parsedDomainIds,
        paymentType: parsedPaymentTypes,
        cstpaymentId: cstpaymentId,
      },
    });

    revalidatePath("/admin/panels/add");
    return { success: "Wallet type added successfully!", data: result };
  } catch (error) {
    console.log(error);
    return { error: "Failed to add wallet type!" };
  }
};


export const updateWalletType = async (values: any) => {
  // Step 1: Validate the incoming values
  const validatedFields = UpdateWalletTypeSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  // Step 2: Extract the required fields from validated data
  const { name, domainId, currencyCode, paymentType, cstpaymentId, description } = validatedFields.data;

  // Step 3: Parse domainId and paymentType
  const parsedDomainIds = domainId.map((item: { type: string }) => item.type);
  const parsedPaymentTypes = paymentType.map((item: { type: string }) => {
    if (Object.values(PaymentType).includes(item.type as PaymentType)) {
      return item.type as PaymentType; 
    } else {
      throw new Error(`Invalid payment type: ${item.type}`);
    }
  });
  

  const updatedData = {
    name,
    currencyCode,
    description: description || null, 
    domainId: parsedDomainIds,
    paymentType: parsedPaymentTypes,
    cstpaymentId,
  };

  try {
    const updatedWalletType = await db.walletType.update({
      where: {
        id: values.id, 
      },
      data: {
        name: updatedData.name,
        domainId : updatedData.domainId,
        description: updatedData.description,
        currencyCode: updatedData.currencyCode,
        paymentType : updatedData.paymentType,
        cstpaymentId : updatedData.cstpaymentId
      },
    });

    revalidatePath("/admin/panels/edit");

    return { success: "Wallet type updated successfully!", data: updatedWalletType };
  } catch (error) {
    console.error(error);
    return { error: "Failed to update wallet type!" };
  }
};