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

  const { email, password, name, number, domainUrl } = validatedFields.data;

  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return { error: "Email already in use!" };
  }

  let domain = null;
  if (domainUrl) {
    domain = await db.domain.findUnique({
      where: {
        base_url: domainUrl
      },
      select: {
        id: true
      }
    });
    console.log(domain)
  }

  try {
    await db.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        number,
        domainName: domainUrl,
      },
    });

    return { success: "User created!" };
  } catch (error) {
    console.error("Registration error:", error);
    return { error: "Error creating user. Please try again." };
  }
};
