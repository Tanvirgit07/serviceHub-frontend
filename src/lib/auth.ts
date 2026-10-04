/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextAuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,

  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60,
  },

  cookies: {
    sessionToken: {
      name: "next-auth.session-token-website",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "email" },
        password: { label: "Password", type: "password", placeholder: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter your email and password");
        }

        try {
          const baseUrl =
            process.env.NEXT_PUBLIC_BACKEND_API_URL ||
            "http://localhost:5000/api/v1";

          const res = await fetch(`${baseUrl}/auth/signin`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          const response = await res.json();

          if (
            !res.ok ||
            response?.success === false ||
            response?.status === false
          ) {
            throw new Error(response?.message || "Invalid email or password");
          }

          const account = response?.data?.account;
          const accessToken = response?.data?.accessToken;
          const refreshToken = response?.data?.refreshToken;

          if (!account || !accessToken) {
            throw new Error(response?.message || "Login failed");
          }

          return {
            id: account.id,
            name: account.name,
            email: account.email,
            role: account.role,
            profileImage: null,
            refreshToken,
            accessToken,
          };
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Authentication failed. Please try again.";

          throw new Error(errorMessage);
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: any }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
        token.profileImage = user.profileImage;
        token.refreshToken = user.refreshToken;
        token.accessToken = user.accessToken;
      }

      return token;
    },

    async session({ session, token }: { session: any; token: JWT }) {
      session.user = {
        id: token.id,
        name: token.name,
        email: token.email,
        role: token.role,
        profileImage: token.profileImage,
        refreshToken: token.refreshToken,
        accessToken: token.accessToken,
      };

      return session;
    },
  },
};