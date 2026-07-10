'use server'

import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { db, hasDatabase } from '@/lib/db'
import { session as sessionTable } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function getUserId(_legacyHeaders?: unknown) {
  const headersList = await headers()

  try {
    const session = await auth.api.getSession({ headers: headersList })
    if (session?.user) {
      return session.user.id
    }
  } catch {
    // Fall through to the phone OTP session used by the custom OTP flow.
  }

  const cookie = headersList.get('cookie') || ''
  const customSession = cookie
    .split(';')
    .map((item) => item.trim())
    .find((item) => item.startsWith('session='))
    ?.split('=')[1]

  if (customSession && hasDatabase) {
    const rows = await db.select().from(sessionTable).where(eq(sessionTable.token, customSession)).limit(1)
    const activeSession = rows[0]
    if (activeSession && activeSession.expiresAt > new Date()) {
      return activeSession.userId
    }
  }

  if (customSession) {
    return 'demo-user'
  }

  throw new Error('Unauthorized: No active session')
}

export async function getSession() {
  const session = await auth.api.getSession({ headers: await headers() })
  return session
}

export async function getCurrentUser() {
  const session = await getSession()
  return session?.user || null
}

export async function getIpAddress() {
  const headersList = await headers()
  return headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'unknown'
}
