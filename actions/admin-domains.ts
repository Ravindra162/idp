"use server";
import { db } from "@/lib/db";
import { AddDomainSchema, UpdateDomainSchema } from "@/schemas";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export const getDomains = async () => {
  try {
    const domains = await db.domain.findMany();

    return { success: true, data: domains };
  } catch (error) {
    return { success: false, error: "Failed to fetch domains!" };
  }
};


export const addDomain = async (values: z.infer<typeof AddDomainSchema>) => {
  const validatedFields = AddDomainSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  try {
    const { name, base_url, description, userId } = validatedFields.data;

    const result = await db.$transaction(async (prisma) => {
      const newDomain = await prisma.domain.create({
        data: {
          name: name,
          base_url: base_url,
          description: description,
          settingsId: "",
        },
      });

      const newSettings = await prisma.settings.create({
        data: {
          domainId: newDomain.id,
          domainName: newDomain.name,
          
          autmVar: false,
          userId : userId
        },
      });

      const updatedDomain = await prisma.domain.update({
        where: { id: newDomain.id },
        data: { settingsId: newSettings.id },
      });

      return updatedDomain;
    });

    revalidatePath("/admin/panels/add");
    return { success: "Domain and settings added successfully!", data: result };
  } catch (error) {
    console.log(error);
    return { error: "Failed to add domain!" };
  }
};


export const updateDomain = async ( values: z.infer<typeof UpdateDomainSchema>) => {
    const validatedFields = UpdateDomainSchema.safeParse(values);
  
    if (!validatedFields.success) {
      return { error: "Invalid fields!" };
    }
  
    const { id, ...updateData } = validatedFields.data;
  
    try {
      const updatedDomain = await db.domain.update({
        where: { id },
        data: updateData,
      });
  
      revalidatePath("/admin/panels/edit");
      return { success: "Domain updated successfully!", data: updatedDomain };
    } catch (error) {
      return { error: "Failed to update domain!" };
    }
  };