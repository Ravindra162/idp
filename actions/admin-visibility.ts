"use server";
import { db } from "@/lib/db";

export const fetchVisibilityState = async (productId: string, field: string) => {
    try {
      const product = await db.product.findUnique({
        where: { id: productId },
        select: { [field]: true }, // Ensure this returns only the needed field
      });
  
      // Ensure it returns a boolean, defaulting to false if the field is undefined
      return product ? Boolean(product[field]) : false;
    } catch (error) {
      console.error(`Error fetching ${field} state:`, error);
      return false; // Return a valid boolean value in case of an error
    }
  };
  

export const updateVisibilityState = async ({
  productId,
  newState,
  field,
}: {
  productId: string;
  newState: boolean;
  field: string;
}) => {
  try {
    await db.product.update({
      where: { id: productId },
      data: { [field]: newState },
    });

    return { success: true, message: `${field} updated successfully.` };
  } catch (error) {
    console.error(`Error updating ${field} state:`, error);
    return { success: false, message: "Internal server error." };
  }
};
