"use server";

import { db } from "@/lib/db";
import { CustomUserCreateSchema } from "@/schemas";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export const addCustomUser = async (
  values: z.infer<typeof CustomUserCreateSchema>
) => {
  const validatedFields = CustomUserCreateSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  try {
    const { userId, modules } = validatedFields.data;

    const result = await db.$transaction(async (prisma) => {
      const newCustomRole = await prisma.customRole.create({
        data: {
          userId: userId,
          modules: modules,
        },
      });

      const updatedUser = await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          role: "CUSTOM_ROLE",
        },
      });

      return newCustomRole;
    });

    revalidatePath("/admin/custom_user/table");
    return { success: "Custom User Added successfully!", data: result };
  } catch (error) {
    console.log(error);
    return { error: "Failed to add Custom User!" };
  }
};

export const editCustomUser = async (
  values: z.infer<typeof CustomUserCreateSchema>
) => {
  const validatedFields = CustomUserCreateSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  try {
    const { userId, modules } = validatedFields.data;

    const result = await db.$transaction(async (prisma) => {
      const updatedCustomRole = await prisma.customRole.update({
        where: {
          userId: userId,
        },
        data: {
          userId: userId,
          modules: modules,
        },
      });

      const updatedUser = await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          role: "CUSTOM_ROLE",
        },
      });

      return updatedCustomRole;
    });

    revalidatePath("/admin/custom_user/table");
    return { success: "Custom User updated successfully!", data: result };
  } catch (error) {
    console.log(error);
    return { error: "Failed to update Custom User!" };
  }
};

export const removeCustomUser = async (userId: string) => {
  try {
    const result = await db.$transaction(async (prisma) => {
      await prisma.customRole.delete({
        where: {
          userId: userId,
        },
      });
      const updatedUser = await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          role: "USER",
        },
      });

      return updatedUser;
    });

    revalidatePath("/admin/custom_user/table");
    return { success: "Custom User deleted successfully!", data: result };
  } catch (error) {
    console.log(error);
    return { error: "Failed to deletion of Custom User!" };
  }
};
