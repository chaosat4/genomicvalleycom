import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import clientPromise from "./mongodb";
import { getEnv, getOptionalEnv } from "./env";

export const auth = betterAuth({
  database: mongodbAdapter(clientPromise as any),
  
  providers: {
    google: {
      clientId: getOptionalEnv("GOOGLE_CLIENT_ID", "") || "",
      clientSecret: getOptionalEnv("GOOGLE_CLIENT_SECRET", "") || "",
    },
  },
  
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  
  user: {
    modelName: "users",
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "patient",
        required: false,
      },
    },
  },
  
  session: {
    modelName: "sessions",
  },
  
  account: {
    modelName: "accounts",
  },
  
  verification: {
    modelName: "verifications",
  },
  
  secret: getEnv("BETTER_AUTH_SECRET"),
  
  baseURL: getEnv("BETTER_AUTH_URL"),
  
  callbacks: {
    async session(session: any) {
      return {
        ...session,
        user: {
          ...session.user,
          role: session.user.role || "patient",
        },
      };
    },
  },
});
