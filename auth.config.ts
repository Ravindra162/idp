import bcrypt from "bcryptjs";
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { LoginSchema } from "@/schemas";
import { getUserByEmail } from "@/data/user";

export default {
  providers: [
    Credentials({
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials);

        console.log(validatedFields)
        let user;

        if (validatedFields.success) {
          const { username, password, browserUrl } = validatedFields.data;

          if (username.includes("@")) {
            user = await getUserByEmail(username);
          }

          if (!user || !user.password) return null;
          
          if (user.domainUrl && user.domainUrl !== browserUrl) {
            throw new Error("wrong Panel Login");
          }

          const passwordsMatch = await bcrypt.compare(password, user.password);
          
          if (passwordsMatch) return user;
        }

        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;