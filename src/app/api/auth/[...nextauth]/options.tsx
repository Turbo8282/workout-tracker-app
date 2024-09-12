import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { query } from "@/lib/db";
export const options: NextAuthOptions = {
  providers: [
      GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    // This callback is called after the user successfully logs in
    async signIn({ user }) {
      // Check if the user already exists in the database
      const { name, email } = user;

      try {
        // Check if the user already exists in the database
        const result = await query(
          'SELECT * FROM "user" WHERE email = $1 AND username = $2',
          [email, name]
        );

        if (result.rows.length === 0) {
          // If the user doesn't exist, insert them into the database
          await query(
            'INSERT INTO "user" (username, email) VALUES ($1, $2) RETURNING *',
            [name, email]
          );
        }

        // Continue with the sign-in process
        return true;
      } catch (error) {
        console.error("Error inserting or querying user in database:", error);
        return false;
      }
    },
  },
};
