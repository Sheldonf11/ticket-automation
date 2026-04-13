import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { APIError } from "better-auth/api";
import prisma from "../db";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      role: {
        type: ["admin", "agent"] as const,
        required: false,
        defaultValue: "agent",
        input: true,
      },
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async () => {
          if (process.env.ALLOW_SEED_SIGNUP === "true") {
            return; // Bypass block for seed script
          }
          throw new APIError("BAD_REQUEST", {
            message: "Signup is currently disabled.",
          });
        },
      },
    },
  },
});

export type Session = typeof auth.$Infer.Session;
