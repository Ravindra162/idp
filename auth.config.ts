import bcrypt from "bcryptjs";
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { LoginSchema } from "@/schemas";
import { getUserByEmail, getUserByNumber } from "@/data/user";

export default {
  providers: [
    Credentials({
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials);

        console.log(validatedFields);
        let user;

        if (validatedFields.success) {
          const { username, password, domainId } = validatedFields.data;

          if (username.includes("@")) {
            user = await getUserByEmail(username);
          }
          else if(/^\d{10}$/.test(username)) {
            user = await getUserByNumber(username);
          }

          if (!user || !user.password) return null;

          if (user.role !== "ADMIN") {
            if (user.domainId && user.domainId !== domainId) {
              throw new Error("wrong Panel Login");
            }
          }

          const passwordsMatch = await bcrypt.compare(password, user.password);

          if (passwordsMatch) return user;
        }

        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
