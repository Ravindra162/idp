"use server"

import { db } from "@/lib/db";

export const fetchWalletsByUserId = async (userId: string) => {
    const wallets = await db.wallet.findMany({
      where: {
        userId,
      },
    });
    console.log("User Wallets:", wallets);
    return wallets
  };