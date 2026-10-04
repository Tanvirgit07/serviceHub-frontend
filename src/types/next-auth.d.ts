import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email: string;
      role: string;
      profileImage?: string | null;
      accessToken: string;
      refreshToken?: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    name?: string | null;
    email: string;
    role: string;
    profileImage?: string | null;
    accessToken: string;
    refreshToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    name?: string | null;
    email: string;
    role: string;
    profileImage?: string | null;
    accessToken: string;
    refreshToken?: string;
  }
}