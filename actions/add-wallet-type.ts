"use server";
import { db } from "@/lib/db";
import {
  AddWalletTypeSchema,
  UpdateWalletTypeSchema,
  WalletPaymentSchema,
} from "@/schemas"; // Assuming you have a schema for validating wallet types
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

export const addWalletType = async (
  values: z.infer<typeof AddWalletTypeSchema>
) => {
  const validatedFields = AddWalletTypeSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  try {
    const { name, currencyCode, description, domainIds, payments } =
      validatedFields.data;

    const parsedDomainIds = domainIds?.map(
      (item: { type: string }) => item.type
    );

    const parsedPaymentTypes = payments.map(
      (item: { type: string; details: any[] }) => {
        if (Object.values(PaymentType).includes(item.type as PaymentType)) {
          return {
            type: item.type,
            details: item.details.map((detail) => ({
              id: detail.id,
              public_id: detail.public_id,
              secure_url: detail.secure_url,
              upiid: detail.upiid,
              upinumber: detail.upinumber,
              accountDetails: detail.accountDetails,
              ifsccode: detail.ifsccode,
              accountType: detail.accountType,
              name: detail.name,
              bankName: detail.bankName,
            })),
          };
        } else {
          throw new Error(`Invalid payment type: ${item.type}`);
        }
      }
    );

    const result = await db.$transaction(async (prisma) => {
      // Create the WalletType record
      const walletType = await prisma.walletType.create({
        data: {
          name,
          currencyCode,
          description: description || null,
          domainIds: parsedDomainIds,
          payments: {
            create: parsedPaymentTypes.flatMap((payment) =>
              payment.details.map((detail) => ({
                paymentTypeId: detail.id,
                paymentType: payment.type as PaymentType,
              }))
            ),
          },
        },
      });

      console.log("WalletType and associated payments created:", walletType);

      return walletType;
    });

    revalidatePath("/admin/wallet-types/table");
    return { success: "Wallet type added successfully!", data: result };
  } catch (error) {
    console.log(error);
    return { error: "Failed to add wallet type!" };
  }
};

export const addPaymentMethod = async (
  values: z.infer<typeof WalletPaymentSchema>,
  walletTypeId: string
) => {
  const validatedFields = WalletPaymentSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  try {
    const item = validatedFields.data;

    item.details = item.details.map((detail) => ({
      id: detail.id,
      public_id: detail.public_id,
      secure_url: detail.secure_url,
      upiid: detail.upiid,
      upinumber: detail.upinumber,
      accountDetails: detail.accountDetails,
      ifsccode: detail.ifsccode,
      accountType: detail.accountType,
      name: detail.name,
      bankName: detail.bankName,
    }));

    console.log("-----------------");
    const result = await db.$transaction(async (prisma) => {
      const walletType = await prisma.walletType.update({
        where: { id: walletTypeId },
        data: {
          payments: {
            create: item.details.map((detail) => ({
              paymentTypeId: detail.id,
              paymentType: item.type as PaymentType,
            })),
          },
        },
      });

      console.log("WalletType and associated payments created:", walletType);
      return walletType;
    });

    revalidatePath("/admin/wallet-types/table");
    return { success: "Wallet Payment type added successfully!", data: result };
  } catch (error) {
    console.log(error);
    return { error: "Failed to add wallet type!" };
  }
};

export const addDomain = async (domainId: string, walletTypeId: string) => {
  try {
    console.log("Adding domain ID:", domainId);

    const result = await db.$transaction(async (prisma) => {
      // Fetch the current walletType
      const walletType = await prisma.walletType.findUnique({
        where: { id: walletTypeId },
        select: { domainIds: true },
      });

      if (!walletType) {
        throw new Error("Wallet type not found!");
      }

      // Check if the domainId already exists
      if (walletType.domainIds.includes(domainId)) {
        throw new Error("Domain ID already exists!");
      }

      // Add the new domainId
      const updatedWalletType = await prisma.walletType.update({
        where: { id: walletTypeId },
        data: {
          domainIds: {
            push: domainId,
          },
        },
      });

      console.log("Updated WalletType:", updatedWalletType);
      return updatedWalletType;
    });

    revalidatePath("/admin/wallet-types/table");
    return { success: "Domain ID added successfully!", data: result };
  } catch (error: any) {
    console.error(error);
    return { error: error.message || "Failed to add domain ID!" };
  }
};

export const removeDomain = async (domainId: string, walletTypeId: string) => {
  try {
    const result = await db.walletType.update({
      where: { id: walletTypeId },
      data: {
        domainIds: {
          set:
            (
              await db.walletType.findUnique({
                where: { id: walletTypeId },
                select: { domainIds: true },
              })
            )?.domainIds.filter((id) => id !== domainId) || [],
        },
      },
    });

    revalidatePath("/admin/wallet-types/table");
    return { success: "Domain removed successfully!", data: result };
  } catch (error) {
    console.error(error);
    return { error: "Failed to remove domain!" };
  }
};

export const removePaymentMethod = async (
  walletTypeId: string,
  paymentMethodId: string
) => {
  try {
    const result = await db.$transaction(async (prisma) => {
      await prisma.walletTypePayment.deleteMany({
        where: {
          walletTypeId: walletTypeId,
          paymentTypeId: paymentMethodId,
        },
      });

      return { success: "Payment method removed successfully!" };
    });

    revalidatePath("/admin/wallet-types/table");
    return { success: "Wallet type added successfully!", data: result };
  } catch (error) {
    console.log(error);
    return { error: "Failed to remove payment method!" };
  }
};

export const updateWalletType = async (values: any) => {
  const validatedFields = UpdateWalletTypeSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { name, currencyCode, description, id } = validatedFields.data;

  const updatedData = {
    name,
    currencyCode,
    description: description || null,
  };

  try {
    await db.walletTypePayment.deleteMany({
      where: {
        walletTypeId: id,
      },
    });

    const updatedWalletType = await db.walletType.update({
      where: {
        id: id,
      },
      data: {
        name: updatedData.name,
        description: updatedData.description,
        currencyCode: updatedData.currencyCode,
      },
    });

    revalidatePath("/admin/wallet-types/table");
    return {
      success: "Wallet type updated successfully!",
      data: updatedWalletType,
    };
  } catch (error) {
    console.error(error);
    return { error: "Failed to update wallet type!" };
  }
};

export const deleteWalletType = async ({ id }: { id: string }) => {
  try {
    await db.$transaction(async (tx) => {
      await tx.wallet.deleteMany({
        where: { walletTypeId: id },
      });

      await tx.walletTypePayment.deleteMany({
        where: { walletTypeId: id },
      });

      await tx.walletType.delete({
        where: { id },
      });
    });

    revalidatePath("/admin/wallet-types/table");
    return {
      success: "Wallet type and all related records deleted successfully.",
    };
  } catch (error) {
    console.error("Error deleting wallet type:", error);
    return { error: "Failed to delete wallet type." };
  }
};
