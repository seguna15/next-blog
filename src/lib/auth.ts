import {betterAuth} from "better-auth";
import {drizzleAdapter} from "better-auth/adapters/drizzle"
import {db} from "@/lib/db";
import * as schema from "@/lib/db/schema"


export const auth = betterAuth({
  appName: "Next Blog",
  secret: process.env.BETTER_AUTH_SECRET || "BETTER_AUTH_SECRET",
  baseURL: process.env.BASE_URL || "http://localhost:3000",
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      ...schema,
      user: schema.users,
      session: schema.sessions,
      account: schema.accounts,
      post: schema.posts,
    },
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    minPasswordLength: 6,
    maxPasswordLength: 128,
    autoSignIn: false,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5,
    },
    disableSessionRefresh: true,
  },
  advanced: {
    useSecureCookies: process.env.NODE_ENV === "production",
    defaultCookieAttributes: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    },
  },
});