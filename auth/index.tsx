import NextAuth from "next-auth";
import { Account, User as AuthUser } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { User } from "@/models/Schema";
import { connect } from "@/utils/db";

export const authOptions: any = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any) {
        await connect();
        try {
          const user = await User.findOne({ email: credentials.email });
          if (
            user &&
            (await bcrypt.compare(credentials.password, user.password))
          ) {
            return user;
          }
          return null;
        } catch (err: any) {
          throw new Error(err);
        }
      },
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID ?? "",
      clientSecret: process.env.GITHUB_SECRET ?? "",
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID ?? "",
      clientSecret: process.env.GOOGLE_SECRET ?? "",
    }),
  ],
  callbacks: {
    async signIn({ user, account }: { user: AuthUser; account: Account }) {
      await connect();

      if (account?.provider === "github" || account?.provider === "google") {
        try {
          if (!user.email) {
            console.log("User email is missing");
            return false;
          }

          const existingUser = await User.findOne({ email: user.email });
          if (!existingUser) {
            // Generate username from email
            const username = user.email.split("@")[0];
            const newUser = new User({
              email: user.email,
              username, // Set the generated username
              role: "customer", // Default role
            });
            await newUser.save();
          }
          return true;
        } catch (err) {
          console.log("Error saving user", err);
          return false;
        }
      }

      return true;
    },
    async session({ session, token }: { session: any; token: any }) {
      await connect();
      const dbUser = await User.findOne({ email: session.user.email });
      if (dbUser) {
        session.user.role = dbUser.role;
        session.user.username = dbUser.username; // Include username in session
      }
      return session;
    },
  },
};

export const handler = NextAuth(authOptions);
