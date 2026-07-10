import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema'

export const hasDatabase = Boolean(process.env.DATABASE_URL)

export const pool = hasDatabase
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
    })
  : null

const unavailableDb = new Proxy(
  {},
  {
    get() {
      throw new Error('DATABASE_URL is not configured')
    },
  }
)

export const db = hasDatabase && pool ? drizzle(pool, { schema }) : (unavailableDb as ReturnType<typeof drizzle>)

export type Database = typeof db
