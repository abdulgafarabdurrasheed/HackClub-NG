import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { eq, or } from "drizzle-orm";
import { db } from "@/lib/db";
import { outreachUsers } from "@/lib/db/schema";
import { verifyPassword } from "@/lib/password";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Outreach account",
      credentials: {
        login: { label: "Username or email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const login = String(credentials?.login ?? "").trim().toLowerCase();
        const password = String(credentials?.password ?? "");
        if (!db || !login || !password || password.length > 128) return null;

        const [account] = await db
          .select({
            email: outreachUsers.email,
            name: outreachUsers.name,
            username: outreachUsers.username,
            passwordHash: outreachUsers.passwordHash,
          })
          .from(outreachUsers)
          .where(or(eq(outreachUsers.email, login), eq(outreachUsers.username, login)))
          .limit(1);

        if (!account?.passwordHash || !(await verifyPassword(password, account.passwordHash))) {
          return null;
        }

        return {
          id: account.email,
          email: account.email,
          name: account.name,
          outreachAccount: true,
        };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  pages: { signIn: "/account/sign-in" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.outreachAccount = user.outreachAccount === true;
      return token;
    },
    async session({ session, token }) {
      if (session.user) session.user.outreachAccount = token.outreachAccount === true;
      return session;
    },
  },
};
