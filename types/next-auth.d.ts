import NextAuth from "next-auth";
import { DefaultUser } from "next-auth";

declare module "next-auth" {
  interface User {
    role?: string; // Add role property if not present
  }

  interface Session {
    user: DefaultUser & {
      email: string;
      role?: string; // Make sure role is included here
    };
  }
}
