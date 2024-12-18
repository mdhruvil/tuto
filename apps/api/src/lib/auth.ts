import { betterAuth } from "better-auth";
import { getContext } from "hono/context-storage";
import { Env } from "..";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db";
import { NeonHttpDatabase } from "drizzle-orm/neon-http";
import { openAPI } from "better-auth/plugins";

export const auth = () => {
  const { env } = getContext<Env>();
  return getAuth({
    secret: env.BETTER_AUTH_SECRET,
    db: db(),
    trustedOrigins: env.TRUSTED_ORIGINS.split(","),
  });
};

// we create this getAuth function to reuse when generating the db schema from auth.dev.ts
export function getAuth({
  secret,
  db,
  trustedOrigins,
}: {
  secret: string;
  db: any;
  trustedOrigins: string[];
}) {
  return betterAuth({
    secret,
    database: drizzleAdapter(db, {
      provider: "pg",
    }),
    emailAndPassword: {
      enabled: true,
    },
    plugins: [openAPI({ path: "/ref" })],
    trustedOrigins,
    advanced: {
      defaultCookieAttributes: {
        sameSite: "none",
        secure: true,
        httpOnly: true,
      },
    },
  });
}
