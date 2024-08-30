// types/next-auth.d.ts

import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string;
      role: "customer" | "instructor";
      credentials?: any;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "customer" | "instructor";
  }
}
