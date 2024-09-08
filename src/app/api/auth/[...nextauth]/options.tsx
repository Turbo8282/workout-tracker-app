import type { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { query } from "@/lib/db";
export const options: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
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
        const result = await query('SELECT * FROM "user" WHERE email = $1', [
          email,
        ]);

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

    /* // This callback is called to include custom user info in the session
    async session({ session, token, user }) {
      try {
        // Query the user to get their PostgreSQL `user_id`
        const result = await pool.query(
          "SELECT id FROM users WHERE github_id = $1",
          [token.sub] // GitHub user ID stored in `token.sub`
        );

        if (result.rows.length > 0) {
          session.user.userId = result.rows[0].id; // Add `user_id` to session
        }
        return session;
      } catch (error) {
        console.error("Error fetching user_id:", error);
        return session;
      }
    }, */
  },
};
