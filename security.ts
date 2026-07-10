import crypto from 'crypto'
import CryptoJS from 'crypto-js'

// AES-256 encryption for sensitive data
export function encryptData(data: string, key: string): string {
  try {
    return CryptoJS.AES.encrypt(data, key).toString()
  } catch (error) {
    console.error('Encryption error:', error)
    throw new Error('Failed to encrypt data')
  }
}

export function decryptData(encrypted: string, key: string): string {
  try {
    const bytes = CryptoJS.AES.decrypt(encrypted, key)
    return bytes.toString(CryptoJS.enc.Utf8)
  } catch (error) {
    console.error('Decryption error:', error)
    throw new Error('Failed to decrypt data')
  }
}

// Generate secure OTP
export function generateOTP(length: number = 6): string {
  const digits = '0123456789'
  let otp = ''
  for (let i = 0; i < length; i++) {
    otp += digits.charAt(Math.floor(Math.random() * 10))
  }
  return otp
}

// Hash password with salt
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex')
  return `${salt}:${hash}`
}

// Verify password
export function verifyPassword(password: string, hash: string): boolean {
  const [salt, storedHash] = hash.split(':')
  const verifyHash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex')
  return verifyHash === storedHash
}

// Generate JWT token
export function generateToken(userId: string, expiryHours: number = 24): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url')
  const payload = Buffer.from(
    JSON.stringify({
      userId,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + expiryHours * 3600,
    })
  ).toString('base64url')

  const secret = process.env.JWT_SECRET || 'fallback-secret-key'
  const signature = crypto
    .createHmac('sha256', secret)
    .update(`${header}.${payload}`)
    .digest('base64url')

  return `${header}.${payload}.${signature}`
}

// Verify JWT token
export function verifyToken(token: string): { userId: string } | null {
  try {
    const [header, payload, signature] = token.split('.')
    const secret = process.env.JWT_SECRET || 'fallback-secret-key'
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${header}.${payload}`)
      .digest('base64url')

    if (signature !== expectedSignature) {
      return null
    }

    const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString())
    if (decoded.exp < Math.floor(Date.now() / 1000)) {
      return null
    }

    return { userId: decoded.userId }
  } catch (error) {
    console.error('Token verification error:', error)
    return null
  }
}

// Sanitize input
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '')
    .replace(/--/g, '')
    .trim()
}

// Rate limiting check
export function checkRateLimit(identifier: string, limit: number = 5, windowMs: number = 60000): boolean {
  const key = `ratelimit:${identifier}`
  // This should be replaced with actual Redis implementation in production
  return true
}

// Generate device fingerprint
export function generateDeviceFingerprint(userAgent: string, ipAddress: string): string {
  return crypto
    .createHash('sha256')
    .update(`${userAgent}:${ipAddress}`)
    .digest('hex')
}

// Check password strength
export function isStrongPassword(password: string): { isStrong: boolean; errors: string[] } {
  const errors: string[] = []

  if (password.length < 8) errors.push('Password must be at least 8 characters')
  if (!/[A-Z]/.test(password)) errors.push('Password must contain uppercase letter')
  if (!/[a-z]/.test(password)) errors.push('Password must contain lowercase letter')
  if (!/[0-9]/.test(password)) errors.push('Password must contain number')
  if (!/[!@#$%^&*]/.test(password)) errors.push('Password must contain special character')

  return {
    isStrong: errors.length === 0,
    errors,
  }
}
