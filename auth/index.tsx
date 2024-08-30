// auth/index.tsx

import NextAuth, { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { User, Customer, Instructor } from "@/models/Schema";
import { connect } from "@/utils/db";

// Extend the NextAuth session type
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      username?: string;
      image?: string;
      role: string;
      customerDetails?: any; // Adjust these types as needed
      instructorDetails?: any; // Adjust these types as needed
    };
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
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
        } catch (err) {
          console.error("Error in authorize:", err);
          throw new Error("Authorization failed");
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
    async signIn({ user, account }) {
      await connect();

      if (account?.provider === "google") {
        try {
          const existingUser = await User.findOne({ email: user.email });

          if (!existingUser) {
            const username = user.email?.split("@")[0] || "user";

            const newUser = new User({
              email: user.email,
              username,
              role: "customer",
              image: user.image,
            });
            await newUser.save();
          } else if (!existingUser.image) {
            existingUser.image = user.image;
            await existingUser.save();
          }

          return true;
        } catch (err) {
          console.error("Error saving user during signIn:", err);
          return false;
        }
      }

      return true;
    },
    async session({ session, token }) {
      await connect();

      const dbUser = await User.findOne({ email: session.user.email });
      if (dbUser) {
        session.user.role = dbUser.role;
        session.user.username = dbUser.username;
        session.user.image = dbUser.image || session.user?.image;

        if (dbUser.role === "customer") {
          const customer = await Customer.findOne({ user: dbUser._id });
          if (customer) {
            session.user.customerDetails = customer.toObject();
          }
        } else if (dbUser.role === "instructor") {
          const instructor = await Instructor.findOne({ user: dbUser._id });
          if (instructor) {
            session.user.instructorDetails = instructor.toObject();
          }
        }
      }
      session.user.id = token.sub;
      return session;
    },
  },
};

export const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
