"use server";

import { db } from "@/lib/db";
import { AutomationStateSchema } from "@/schemas";
import { z } from "zod";

export const fetchAutomationState = async (
  domainId: string
): Promise<boolean> => {
  try {
    const setting = await db.settings.findFirst({
      where: {
        domainId: domainId,
      },
    });

    if (!setting) {
      throw new Error("Settings document not found");
    }

    return setting.autmVar;
  } catch (error) {
    console.error("Error fetching automation state:", error);
    return false;
  }
};

export const updateAutomationState = async (
  values: z.infer<typeof AutomationStateSchema>
) => {
  const validatedFields = AutomationStateSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { autmVar, userId, domainId } = validatedFields.data;

  try {
    const existingRecord = await db.settings.findFirst({
      where: {
        domainId: domainId,
      },
    });

    if (existingRecord) {
      await db.settings.update({
        where: { id: existingRecord.id },
        data: { autmVar: autmVar },
      });
      return {
        success: true,
        message: "Automation state updated successfully.",
      };
    } else {
      await db.settings.create({
        data: { autmVar: autmVar, domainId: domainId, userId: userId },
      });
      return {
        success: true,
        message: "Automation state created successfully.",
      };
    }
  } catch (error) {
    console.error("Error updating automation state:", error);
    return { success: false, message: "Internal server error." };
  }
};
