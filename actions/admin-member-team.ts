"use server";

import { db } from "@/lib/db";
import { UpdateTeamAmountLimitSchema } from "@/schemas";
import { UserRole } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Fetch team details along with admin check
export async function fetchTeamMembers(teamId: string) {
  try {
    const teamMembers = await db.user.findMany({
      where: { teamId, role: { in: ["USER", "PRO"] } },
      select: {
        id: true,
        name: true,
        email: true,
        proUser: { select: { id: true } },
      },
    });

    return teamMembers.map((member) => ({
      id: member.id,
      name: member.name,
      email: member.email,
      isPro: !!member.proUser,
    }));
  } catch (error) {
    console.error("Error fetching team members:", error);
    throw new Error("Failed to fetch team members.");
  }
}

export async function editAmountLimitTeam(
  values: z.infer<typeof UpdateTeamAmountLimitSchema>
) {
  try {
    const team = await db.team.findUnique({ where: { id: values.teamId } });

    if (!team) {
      return { error: "Team not found" };
    }

    const updatedTeam = await db.team.update({
      where: { id: values.teamId },
      data: {
        amountLimit: values.amountLimit,
      },
    });

    console.log("Updated Team - ", updatedTeam);

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

export async function searchUsers(query: string) {
  return await db.user.findMany({
    where: {
      teamId: "",
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { email: { contains: query, mode: "insensitive" } },
        { number: { contains: query, mode: "insensitive" } },
      ],
      role: { in: ["USER", "PRO"] },
    },
    orderBy: { id: "desc" },
    take: 5,
  });
}

export async function saveTeamDetails(teamId: string, data: FormData) {
  const name = data.get("name") as string;
  const amountLimitRaw = data.get("amountLimit") as string;
  const addMemberEmails = data.get("addMemberEmails") as string;
  const removeMemberIds = data.get("removeMemberIds") as string;

  // Validate inputs
  if (!name || typeof name !== "string" || name.trim() === "") {
    throw new Error("Team name is required and must be a valid string.");
  }

  const amountLimit = parseInt(amountLimitRaw, 10);
  if (isNaN(amountLimit) || amountLimit < 0) {
    throw new Error("Amount limit must be a valid positive number.");
  }

  const emailArray = addMemberEmails
    ? addMemberEmails
        .split(",")
        .map((email) => email.trim())
        .filter(Boolean)
    : [];

  const memberIdsArray = removeMemberIds
    ? removeMemberIds
        .split(",")
        .map((id) => id.trim())
        .filter(Boolean)
    : [];

  try {
    // Start a transaction for atomicity
    await db.$transaction(async (tx) => {
      // Add new members
      for (const email of emailArray) {
        const user = await tx.user.findUnique({ where: { email } });
        if (!user) {
          throw new Error(`User with email "${email}" not found.`);
        }

        // Check if the user is already a member
      }

      // Update team details
      await tx.team.update({
        where: { id: teamId },
        data: {
          name,
          amountLimit: amountLimit,
        },
      });
    });
  } catch (error: any) {
    console.error("Error saving team details:", error);
    throw new Error(`Failed to save team details: ${error.message}`);
  }
}

// Add multiple members to the team
export async function addMember(teamId: string, userIds: string[]) {
  try {
    const team = await db.team.findUnique({
      where: { id: teamId },
    });

    if (!team) {
      throw new Error(`Team with id "${teamId}" not found.`);
    }

    const results = await db.$transaction(async (tx) => {
      const addedUsers = [];
      const errors = [];

      for (const userId of userIds) {
        try {
          const user = await tx.user.findUnique({
            where: { id: userId },
            select: { id: true, email: true, proUser: true, role: true },
          });

          if (!user) {
            errors.push(`User with ID "${userId}" not found.`);
            continue;
          }

          if (user.role == "PRO") {
            await tx.proUser.delete({
              where: { userId },
            });
          }

          await tx.user.update({
            where: { id: userId },
            data: { teamId, role: "USER" },
          });

          addedUsers.push(user.email);
        } catch (error: any) {
          errors.push(`Failed to add user ${userId}: ${error.message}`);
        }
      }

      return { addedUsers, errors };
    });

    const successMessage =
      results.addedUsers.length > 0
        ? `Successfully added users: ${results.addedUsers.join(", ")}`
        : "";
    const errorMessage =
      results.errors.length > 0 ? `Errors: ${results.errors.join("; ")}` : "";

    const message = [successMessage, errorMessage].filter(Boolean).join(". ");

    return {
      success: results.addedUsers.length > 0,
      message,
      addedCount: results.addedUsers.length,
      errorCount: results.errors.length,
    };
  } catch (error: any) {
    console.error("Error adding members:", error);
    throw new Error(error.message);
  }
}

export async function removeMember(teamId: string, userId: string) {
  try {
    const team = await db.team.findUnique({
      where: { id: teamId },
    });

    if (!team) {
      throw new Error(`Team with id "${teamId}" not found.`);
    }

    const results = await db.$transaction(async (tx) => {
      const removedUsers = [];
      const errors = [];

      try {
        // Fetch user details
        const user = await tx.user.findUnique({
          where: { id: userId },
          select: {
            id: true,
            email: true,
            proUser: true,
            teamId: true,
            role: true,
          },
        });

        if (!user) {
          errors.push(`User with ID "${userId}" not found.`);
        }

        // Ensure the user is actually in the team
        if (user?.teamId !== teamId) {
          errors.push(`User with ID "${userId}" is not in the team.`);
        }

        if (user?.role === "PRO") {
          await tx.proUser.delete({
            where: { userId },
          });
        }

        // Remove teamId from the user
        await tx.user.update({
          where: { id: userId },
          data: { teamId: "", role: "USER" },
        });

        removedUsers.push(user?.email);
      } catch (error: any) {
        errors.push(`Failed to remove user ${userId}: ${error.message}`);
      }

      return { removedUsers, errors };
    });

    const successMessage =
      results.removedUsers.length > 0
        ? `Successfully removed users: ${results.removedUsers.join(", ")}`
        : "";
    const errorMessage =
      results.errors.length > 0 ? `Errors: ${results.errors.join("; ")}` : "";

    const message = [successMessage, errorMessage].filter(Boolean).join(". ");

    return {
      success: results.removedUsers.length > 0,
      message,
      removedCount: results.removedUsers.length,
      errorCount: results.errors.length,
    };
  } catch (error: any) {
    console.error("Error removing members:", error);
    throw new Error(error.message);
  }
}
