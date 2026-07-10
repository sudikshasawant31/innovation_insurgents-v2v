export type DemoUser = {
  id: string
  name: string
  email?: string
  phone?: string
  age?: string
  city?: string
  role: 'user' | 'guardian' | 'admin'
  provider: 'phone' | 'email' | 'google'
  createdAt: string
}

const CURRENT_USER_KEY = 'herguardian.currentUser'
const ACCOUNTS_KEY = 'herguardian.localAccounts'

type LocalAccount = {
  user: DemoUser
  password: string
  credentials: string[]
}

function normalizeEmail(value: string) {
  return value.trim().toLowerCase()
}

function normalizePhone(value: string) {
  const digits = value.replace(/\D/g, '')
  if (!digits) return ''
  return digits.length === 10 ? `+91${digits}` : `+${digits.replace(/^91/, '91')}`
}

function normalizeCredential(value: string) {
  const trimmed = value.trim()
  return trimmed.includes('@') ? normalizeEmail(trimmed) : normalizePhone(trimmed)
}

function readAccounts(): LocalAccount[] {
  if (typeof window === 'undefined') return []
  const raw = localStorage.getItem(ACCOUNTS_KEY)
  if (!raw) return []
  try {
    return JSON.parse(raw)
  } catch {
    return []
  }
}

function writeAccounts(accounts: LocalAccount[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts))
}

export function saveCurrentUser(user: DemoUser) {
  if (typeof window === 'undefined') return
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user))
  localStorage.setItem(`herguardian.user.${user.id}`, JSON.stringify(user))
  localStorage.setItem('herguardian.sessionActive', 'true')
}

export function getCurrentUser(): DemoUser | null {
  if (typeof window === 'undefined') return null
  const raw = localStorage.getItem(CURRENT_USER_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function demoUserIdFromCredential(credential: string) {
  return `user_${credential.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '') || crypto.randomUUID()}`
}

export function saveRegisteredAccount(user: DemoUser, password: string) {
  const credentials = [user.email ? normalizeEmail(user.email) : '', user.phone ? normalizePhone(user.phone) : ''].filter(Boolean)
  const accounts = readAccounts()
  const existingIndex = accounts.findIndex((account) =>
    account.credentials.some((credential) => credentials.includes(credential))
  )
  const account = { user, password, credentials }
  const nextAccounts =
    existingIndex >= 0
      ? accounts.map((item, index) => (index === existingIndex ? account : item))
      : [...accounts, account]

  writeAccounts(nextAccounts)
  saveCurrentUser(user)
}

export function authenticateLocalAccount(credential: string, password: string) {
  const normalized = normalizeCredential(credential)
  const account = readAccounts().find((item) => item.credentials.includes(normalized))
  if (!account || account.password !== password) return null
  saveCurrentUser(account.user)
  return account.user
}

export function localAccountExists(credential: string) {
  const normalized = normalizeCredential(credential)
  return readAccounts().some((item) => item.credentials.includes(normalized))
}

export function findLocalAccount(credential: string) {
  const normalized = normalizeCredential(credential)
  return readAccounts().find((item) => item.credentials.includes(normalized))?.user || null
}

export function updateCurrentUser(nextUser: DemoUser) {
  saveCurrentUser(nextUser)
  const accounts = readAccounts()
  const credentials = [nextUser.email ? normalizeEmail(nextUser.email) : '', nextUser.phone ? normalizePhone(nextUser.phone) : ''].filter(Boolean)
  writeAccounts(
    accounts.map((account) =>
      account.user.id === nextUser.id ? { ...account, user: nextUser, credentials } : account
    )
  )
}
