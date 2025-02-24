"use server";

import { z } from "zod";
import { EditTeamSchema, TeamCreateSchema } from "@/schemas";
import { db } from "@/lib/db";
import { generateRandomCode } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { getUserById } from "@/data/user";

export async function createTeam(values: z.infer<typeof TeamCreateSchema>) {
  try {

    const leader = await getUserById(values.teamLeader);
    console.log(values)

    if (!leader) {
      return { error: "Selected team leader not found" };
    }

    const refCode = generateRandomCode(); 

    const team = await db.team.create({
      data: {
        name: values.teamName,
        leaderId: values.teamLeader,
        referralCode: refCode,
        teamId : refCode,
        description : values.teamDescription || "",
        domainId : values.domainId
      },
    });


    console.log("Team - ", team);

    if (leader.role !== "LEADER") {
      await db.user.update({
        where: { id: values.teamLeader },
        data: { role: "LEADER", teamId: team.id },
      });
    }

    revalidatePath("/teams");
    return { success: "Team created successfully" };
  } catch (error) {
    console.error("TEAM_CREATION_ERROR", error);
    if (error instanceof z.ZodError) {
      return { error: "Invalid form data. Please check your inputs." };
    }

    if (error instanceof Error) {
      if (error.message.includes("Unique constraint")) {
        return { error: "Team name or reference code already exists" };
      }
    }

    return { error: "Something went wrong. Please try again." };
  }
}


export async function editTeam(values: z.infer<typeof EditTeamSchema>) {
  try {
    const team = await db.team.findUnique({ where: { id: values.id } });

    if (!team) {
      return { error: "Team not found" };
    }

    const leader = await getUserById(values.teamLeader);
    if (!leader) {
      return { error: "Selected team leader not found" };
    }

    const updatedTeam = await db.team.update({
      where: { id: values.id },
      data: {
        name: values.teamName,
        leaderId: values.teamLeader,
        description: values.teamDescription || "",
        domainId: values.domainId,
      },
    });

    console.log("Updated Team - ", updatedTeam);

    if (leader.role !== "LEADER") {
      await db.user.update({
        where: { id: values.teamLeader },
        data: { role: "LEADER", teamId: values.id },
      });
    }

    revalidatePath("/teams");
    return { success: "Team updated successfully" };
  } catch (error) {
    console.error("TEAM_UPDATE_ERROR", error);
    if (error instanceof z.ZodError) {
      return { error: "Invalid form data. Please check your inputs." };
    }

    return { error: "Something went wrong. Please try again." };
  }
}