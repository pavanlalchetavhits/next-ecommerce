import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import db from "@/lib/db";
import { authConfig } from "@/lib/auth.config";

class AccountBlockedError extends CredentialsSignin {
  code = "ACCOUNT_BLOCKED";
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "Credentials",

      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials) {
        if (
          !credentials?.email ||
          !credentials?.password
        ) {
          return null;
        }

        const [rows] = await db.query(
          `
          SELECT
            id,
            name,
            email,
            password,
            phone,
            role,
            status
          FROM users
          WHERE email = ?
          LIMIT 1
          `,
          [credentials.email]
        );

        const users = rows as any[];

        if (users.length === 0) {
          return null;
        }

        const user = users[0];

        const passwordMatch = await bcrypt.compare(
          String(credentials.password),
          user.password
        );

        if (!passwordMatch) {
          return null;
        }

        // Only active users can login
        if (user.status !== "active") {
          throw new AccountBlockedError();
        }

        // Update last login
        await db.query(
          `
          UPDATE users
          SET last_login_at = CURRENT_TIMESTAMP
          WHERE id = ?
          `,
          [user.id]
        );

        return {
          id: String(user.id),
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status,
        };
      },
    }),
  ],
});