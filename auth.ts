import { betterAuth } from 'better-auth'
import { Pool } from 'pg'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import * as schema from './db/schema'

const pool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
    })
  : null

const baseURL = process.env.BETTER_AUTH_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : undefined) ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined) ||
  process.env.V0_RUNTIME_URL ||
  'http://localhost:3000'

const trustedOrigins = [
  baseURL,
  process.env.VERCEL_PROJECT_PRODUCTION_URL && `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`,
  process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`,
  process.env.V0_RUNTIME_URL,
].filter(Boolean) as string[]

export const auth = betterAuth({
  ...(pool
    ? {
        database: drizzleAdapter(pool, {
          provider: 'pg',
          schema,
        }),
      }
    : {}),
  secret: process.env.BETTER_AUTH_SECRET || 'development-only-secret-change-in-production',
  baseURL: baseURL,
  baseURLPattern: new RegExp(`^${trustedOrigins.map(o => o.replace(/\./g, '\\.')).join('|')}(/.*)?$`),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    minPasswordLength: 8,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },
  advanced: {
    defaultCookieAttributes: {
      sameSite: process.env.NODE_ENV === 'development' ? 'none' : 'lax',
      secure: process.env.NODE_ENV === 'development' ? true : true,
    },
  },
})
