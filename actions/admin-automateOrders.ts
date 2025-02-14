"use server";

import { db } from "@/lib/db";
import { AutomationStateSchema } from "@/schemas";
import { z } from "zod";

export const fetchAutomationStates = async () => {
  try {
    const settings = await db.settings.findMany({});
    return settings;
  } catch (error) {
    console.error("Error fetching automation states:", error);
    return [];
  }
};

export const fetchAutomationStateByDomainId = async (domainId : string) => {
  try{
    const settingRecord = await db.settings.findFirst({
      where : {
        domainId : domainId
      }
    });
    return settingRecord;
  }
  catch(error){
    console.error("Error fetching setting record:", error);
    return;
  }
}

export const updateAutomationState = async (
  values: z.infer<typeof AutomationStateSchema>
) => {
  const validatedFields = AutomationStateSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { domainId, domainName, userId, autmVar } = validatedFields.data;

  try {
    const existingRecord = await db.settings.findFirst({
      where: {
        domainId: domainId,
      },
    });

    if (existingRecord) {
      await db.settings.update({
        where: { id: existingRecord.id },
        data: {
          autmVar: autmVar,
          userId: userId,
        },
      });
      return {
        success: true,
        message: "Automation state updated successfully.",
      };
    } else {
      await db.settings.create({
        data: {
          domainId: domainId,
          domainName: domainName,
          autmVar: autmVar,
          userId: userId,
        },
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
