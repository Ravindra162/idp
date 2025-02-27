"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function searchTeams(query: string, productId: string) {
  try {
    const product = await db.product.findUnique({
      where: { id: productId },
      select: { 
        includedTeams : {
          select: {
            id: true,
            teamId: true,
            name: true,
            domainId: true,
            leader: true,
            leaderId: true,
          }
        },
        includedTeamIds : true
       },
    });

    const currentTeamIds = product?.includedTeamIds || [];

    const teams = await db.team.findMany({
      where: {
        AND: [
          {
            OR: [
              { name: { contains: query, mode: "insensitive" } },
              { leader: { name: { contains: query, mode: "insensitive" } } },
            ],
          },
          {
            NOT: {
              id: { in: currentTeamIds },
            },
          },
        ],
      },
      select: {
        id: true,
        teamId: true,
        name: true,
        domainId: true,
        leader: true,
        leaderId: true,
      },
      take: 5,
    });

    return { teams };
  } catch (error) {
    console.error("Error searching teams:", error);
    throw new Error("Failed to search teams");
  }
}

export async function includeTeamInProduct(productId: string, teamId: string) {
  try {
    const [product, team] = await Promise.all([
      db.product.findUnique({
        where: { id: productId },
        select: {
          id: true,
          productName: true,
          price: true,
          minProduct: true,
          maxProduct: true,
        },
      }),
      db.team.findUnique({
        where: { id: teamId },
        select: { products: true },
      }),
    ]);

    if (!product || !team) {
      throw new Error("Product or team not found");
    }

    await db.product.update({
      where: { id: productId },
      data: {
        includedTeamIds: {
          push: teamId,
        },
      },
    });
    const currentProducts = (team.products as any[]) || [];
    const newProduct = {
      id: product.id,
      name: product.productName,
      minProduct: product.minProduct,
      maxProduct: product.maxProduct,
      price: product.price,
    };

    await db.team.update({
      where: { id: teamId },
      data: {
        products: [...currentProducts, newProduct],
      },
    });

    revalidatePath("/admin/product");
    return { success: true, message: "Team added successfully" };
  } catch (error) {
    console.error("Error including team:", error);
    return { success: false, message: "Failed to add team" };
  }
}

export async function excludeTeamFromProduct(
  productId: string,
  teamId: string
) {
  try {
    // Get current teamIds and team details
    const [product, team] = await Promise.all([
      db.product.findUnique({
        where: { id: productId },
        select: { teamIds: true, productName: true },
      }),
      db.team.findUnique({
        where: { id: teamId },
        select: { products: true },
      }),
    ]);

    if (!product || !team) {
      throw new Error("Product or team not found");
    }

    const updatedTeamIds = product.teamIds.filter((id) => id !== teamId);

    const currentProducts = (team.products as any[]) || [];
    const updatedProducts = currentProducts.filter(
      (p) => p.name !== product.productName
    );

    await db.$transaction([
      db.product.update({
        where: { id: productId },
        data: {
          teamIds: updatedTeamIds,
        },
      }),
      db.team.update({
        where: { id: teamId },
        data: {
          products: updatedProducts,
        },
      }),
    ]);

    revalidatePath("/admin/product");
    return { success: true, message: "Team removed successfully" };
  } catch (error) {
    console.error("Error excluding team:", error);
    return { success: false, message: "Failed to remove team" };
  }
}
