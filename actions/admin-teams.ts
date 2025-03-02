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
    console.log(values);

    if (!leader) {
      return { error: "Selected team leader not found" };
    }

    const refCode = generateRandomCode();

    const team = await db.team.create({
      data: {
        name: values.teamName,
        leaderId: values.teamLeader,
        referralCode: refCode,
        teamId: refCode,
        description: values.teamDescription || "",
        domainId: values.domainId,
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

export const deleteTeam = async (teamId: string, domainId: string) => {
  try {
    console.log("Deleting team:", teamId);

    const result = await db.$transaction(async (prisma) => {
      const team = await prisma.team.findUnique({
        where: { id: teamId },
        include: { leader: true },
      });

      if (!team) {
        throw new Error("Team not found!");
      }

      const productsWithIncludedTeam = await prisma.product.findMany({
        where: { includedTeamIds: { has: teamId } },
        select: { id: true, includedTeamIds: true },
      });

      await Promise.all(
        productsWithIncludedTeam.map(async (product) => {
          await prisma.product.update({
            where: { id: product.id },
            data: {
              includedTeamIds: product.includedTeamIds.filter(
                (id) => id !== teamId
              ),
            },
          });
        })
      );

      const productsWithExcludedTeam = await prisma.product.findMany({
        where: { excludedTeamIds: { has: teamId } },
        select: { id: true, excludedTeamIds: true },
      });

      await Promise.all(
        productsWithExcludedTeam.map(async (product) => {
          await prisma.product.update({
            where: { id: product.id },
            data: {
              excludedTeamIds: product.excludedTeamIds.filter(
                (id) => id !== teamId
              ),
            },
          });
        })
      );

      if (team.leader.role === "LEADER") {
        await prisma.user.update({
          where: { id: team.leaderId },
          data: { role: "USER", teamId: null },
        });
      }

      const teamMembers = await prisma.user.findMany({
        where: { teamId: teamId },
        select: { id: true },
      });

      const teamMemberIds = teamMembers.map((member) => member.id);

      if (teamMemberIds.length > 0) {
        await prisma.proUser.deleteMany({
          where: { userId: { in: teamMemberIds } },
        });

        await prisma.user.updateMany({
          where: { id: { in: teamMemberIds } },
          data: { teamId: null, role: "USER" },
        });
      }

      await prisma.team.delete({ where: { id: teamId } });

      console.log("Team deleted successfully:", teamId);
      revalidatePath(`/admin/team/table/${domainId}`);

      return { success: "Team deleted successfully!" };
    });

    return { success: "Team Deleted Successfully", data: result };
  } catch (error: any) {
    console.error("TEAM_DELETION_ERROR", error);
    return { error: error.message || "Failed to delete team!" };
  }
};
