"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";

import { db } from "@/lib/db";
import { RegisterSchema } from "@/schemas";
import { getUserByEmail } from "@/data/user";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, password, name, number, domainId } = validatedFields.data;

  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return { error: "Email already in use!" };
  }

  try {
    return await db.$transaction(
      async (tx) => {
        let domain = null;
        let walletTypes = null;


        const createdUser = await tx.user.create({
          data: {
            email,
            password: hashedPassword,
            name,
            number,
            domainId,
          },
        });

        if (domain !== null) {
          walletTypes = await tx.walletType.findMany({
            where: {
              domainId: {
                has: domainId,
              },
            },
          });

          walletTypes = walletTypes.filter((w) => w.createdAt !== null);

          console.log(walletTypes);

          const createdWallets = await Promise.all(
            walletTypes.map(async (walletType) => {
              return tx.wallet.create({
                data: {
                  userId: createdUser.id,
                  currencyCode: walletType.currencyCode,
                  walletTypeId: walletType.id,
                  walletName: walletType.name,
                  
                  balance: 0,
                },
              });
            })
          );

          await tx.user.update({
            where: { id: createdUser.id },
            data: {
              wallets: {
                connect: createdWallets.map((wallet) => ({ id: wallet.id })),
              },
            },
            include: {
              wallets: true,
            },
          });
        }

        return { success: "User created!" };
      },
      { timeout: 10000 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return { error: "Error creating user. Please try again." };
  }
};
