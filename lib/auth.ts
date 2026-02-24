import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { dbPromise } from "./mongodb";
import { getEnv, getOptionalEnv } from "./env";

const db = await dbPromise;

export const auth = betterAuth({
  database: mongodbAdapter(db),
  
  socialProviders: {
    google: {
      clientId: getOptionalEnv("GOOGLE_CLIENT_ID") || "",
      clientSecret: getOptionalEnv("GOOGLE_CLIENT_SECRET") || "",
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
  
  databaseHooks: {
    user: {
      create: {
        before: async (user: any) => {
          const adminEmail = getOptionalEnv("ADMIN_EMAIL");
          if (adminEmail && user.email === adminEmail) {
            return { data: { ...user, role: "admin" } };
          }
          return { data: { ...user, role: "patient" } };
        },
      },
    },
  },
  
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
