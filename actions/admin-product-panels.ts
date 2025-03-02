import { db } from "@/lib/db";
import { EditPanelQuantitySchema } from "@/schemas";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export const includePanelInfo = async (
  values: z.infer<typeof EditPanelQuantitySchema>
) => {
  const parsedData = EditPanelQuantitySchema.parse(values);

  const { id, name, domainId, minProduct, maxProduct, price } = parsedData;

  try {
    console.log(domainId);

    const existingProductInfo = await db.productInfo.findFirst({
      where: { productId: id, domainId },
    });

    let updatedProductInfo;
    if (existingProductInfo) {
      updatedProductInfo = await db.productInfo.update({
        where: { id: existingProductInfo.id }, // Using unique id for update
        data: { Min: minProduct, Max: maxProduct, Price: price },
      });
    } else {
      updatedProductInfo = await db.productInfo.create({
        data: {
          productId: id,
          name: name,
          Min: minProduct,
          Max: maxProduct,
          Price: price,
          domain: {
            connect: { id : domainId },
          },
        },
      });
    }

    await db.product.update({
      where: { id },
      data: {
        includedDomains: { connect: { id : domainId } },
      },
    });

    await db.domain.update({
      where: { id : domainId },
      data: {
        includedIn: { connect: { id : domainId } },
      },
    });

    console.log("---------------");
    revalidatePath("/admin/product/product-table");
    return { success: "Team Included Successfully!", data: updatedProductInfo };
  } catch (error) {
    console.error("Error updating product info:", error);
    return { error: "Failed to update product info" };
  }
};

export const excludePanelInfo = async (
  values: z.infer<typeof EditPanelQuantitySchema>
) => {
    const parsedData = EditPanelQuantitySchema.parse(values);

    const { id, name, domainId, minProduct, maxProduct, price } = parsedData;
  
    try {
      console.log(domainId);
  
      const existingProductInfo = await db.productInfo.findFirst({
        where: { productId: id, domainId },
      });
  
      let updatedProductInfo;
      if (existingProductInfo) {
        updatedProductInfo = await db.productInfo.update({
          where: { id: existingProductInfo.id }, // Using unique id for update
          data: { Min: minProduct, Max: maxProduct, Price: price },
        });
      } else {
        updatedProductInfo = await db.productInfo.create({
          data: {
            productId: id,
            name: name,
            Min: 0,
            Max: 0,
            Price: 0,
            domain: {
              connect: { id : domainId },
            },
          },
        });
      }
  
      await db.product.update({
        where: { id },
        data: {
          includedDomains: { connect: { id : domainId } },
        },
      });
  
      await db.domain.update({
        where: { id : domainId },
        data: {
          includedIn: { connect: { id : domainId } },
        },
      });
  
      console.log("---------------");
      revalidatePath("/admin/product/product-table");
      return { success: "Team Included Successfully!", data: updatedProductInfo };
    } catch (error) {
      console.error("Error updating product info:", error);
      return { error: "Failed to update product info" };
    }
  };
  
export const removeIncludeDomainInfo = async (
  domainId: string,
  productId: string
) => {
  try {
    // Find the existing ProductInfo record
    const existingProductInfo = await db.productInfo.findFirst({
      where: {
        productId,
        domainId,
        Max: { gt: 0 },
        Min: { gt: 0 },
        Price: { gt: 0 },
      },
    });

    if (!existingProductInfo) {
      return { error: "No matching ProductInfo found to remove." };
    }

    // Delete the ProductInfo record
    await db.productInfo.delete({
      where: { id: existingProductInfo.id },
    });

    // Update Product model to disconnect the team
    await db.product.update({
      where: { id: productId },
      data: {
        includedDomains: { disconnect: { id : domainId } }, // Remove team from includedTeams
      },
    });

    // Update Team model to disconnect the product
    await db.domain.update({
      where: { id : domainId },
      data: {
        includedIn: { disconnect: { id: productId } }, // Remove product from includedIn
      },
    });
    revalidatePath("/admin/product/product-table");
    return { success: "Panel removed successfully from Product!" };
  } catch (error) {
    console.error("Error removing panel from product:", error);
    return { error: "Failed to remove panel from product." };
  }
};

export const removeExcludeTeamInfo = async (
  domainId: string,
  productId: string
) => {
  try {
    // Find the existing ProductInfo record
    const existingProductInfo = await db.productInfo.findFirst({
      where: { productId, domainId, Max: 0, Min: 0, Price: 0 },
    });

    if (!existingProductInfo) {
      return { error: "No matching ProductInfo found to remove." };
    }

    // Delete the ProductInfo record
    await db.productInfo.delete({
      where: { id: existingProductInfo.id },
    });

    // Update Product model to disconnect the team
    await db.product.update({
      where: { id: productId },
      data: {
        excludedDomains: { disconnect: { id : domainId } }, // Remove team from includedTeams
      },
    });

    // Update Team model to disconnect the product
    await db.domain.update({
      where: { id : domainId },
      data: {
        excludedFrom: { disconnect: { id: productId } }, // Remove product from includedIn
      },
    });
    revalidatePath("/admin/product/product-table");
    return { success: "Panel removed successfully from Product!" };
  } catch (error) {
    console.error("Error removing panel from product:", error);
    return { error: "Failed to remove panel from product." };
  }
};
