import { pgTable, text, timestamp, integer, decimal, boolean, jsonb, uniqueIndex } from 'drizzle-orm/pg-core'

// Better Auth Tables
export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name'),
  email: text('email').notNull().unique(),
  emailVerified: boolean('emailVerified').default(false),
  image: text('image'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull().references(() => user.id, { onDelete: 'cascade' }),
  expiresAt: timestamp('expiresAt').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const account = pgTable(
  'account',
  {
    id: text('id').primaryKey(),
    userId: text('userId').notNull().references(() => user.id, { onDelete: 'cascade' }),
    accountId: text('accountId').notNull(),
    providerId: text('providerId').notNull(),
    accessToken: text('accessToken'),
    refreshToken: text('refreshToken'),
    accessTokenExpiresAt: timestamp('accessTokenExpiresAt'),
    refreshTokenExpiresAt: timestamp('refreshTokenExpiresAt'),
    scope: text('scope'),
    password: text('password'),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
    updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  },
  (table) => ({
    uniq: uniqueIndex('accountUniqueIndex').on(table.userId, table.providerId, table.accountId),
  })
)

export const verification = pgTable(
  'verification',
  {
    id: text('id').primaryKey(),
    identifier: text('identifier').notNull(),
    value: text('value').notNull(),
    expiresAt: timestamp('expiresAt').notNull(),
    createdAt: timestamp('createdAt').defaultNow(),
    updatedAt: timestamp('updatedAt').defaultNow(),
  },
  (table) => ({
    uniq: uniqueIndex('verificationUniqueIndex').on(table.identifier, table.value),
  })
)

// Application Tables
export const healthAssessment = pgTable('health_assessment', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull().references(() => user.id, { onDelete: 'cascade' }),
  age: integer('age'),
  weight: decimal('weight', { precision: 5, scale: 2 }),
  height: decimal('height', { precision: 5, scale: 2 }),
  menstrualCycleLength: integer('menstrualCycleLength'),
  cycleRegularity: text('cycleRegularity'),
  symptoms: text('symptoms').array().default([]),
  medicalHistory: text('medicalHistory').array().default([]),
  medications: text('medications').array().default([]),
  riskScores: jsonb('riskScores').default({}),
  assessmentDate: timestamp('assessmentDate').notNull().defaultNow(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const moodEntry = pgTable('mood_entry', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull().references(() => user.id, { onDelete: 'cascade' }),
  moodScore: integer('moodScore').notNull(),
  depressionScore: integer('depressionScore'),
  anxietyScore: integer('anxietyScore'),
  sleepQuality: integer('sleepQuality'),
  stressLevel: integer('stressLevel'),
  notes: text('notes'),
  entryDate: timestamp('entryDate').notNull().defaultNow(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const wellnessRecommendation = pgTable('wellness_recommendation', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull().references(() => user.id, { onDelete: 'cascade' }),
  category: text('category').notNull(),
  title: text('title').notNull(),
  description: text('description'),
  priority: text('priority').notNull().default('medium'),
  isCompleted: boolean('isCompleted').default(false),
  completedAt: timestamp('completedAt'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const doctorReport = pgTable('doctor_report', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull().references(() => user.id, { onDelete: 'cascade' }),
  assessmentId: text('assessmentId').notNull().references(() => healthAssessment.id, { onDelete: 'cascade' }),
  reportType: text('reportType').notNull(),
  healthScores: jsonb('healthScores'),
  recommendations: jsonb('recommendations'),
  riskSummary: text('riskSummary'),
  generatedAt: timestamp('generatedAt').notNull().defaultNow(),
  pdfUrl: text('pdfUrl'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

export const emergencyContact = pgTable('emergency_contact', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull().references(() => user.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  phone: text('phone').notNull(),
  relationship: text('relationship'),
  isPrimary: boolean('isPrimary').default(false),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const chatMessage = pgTable('chat_message', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull().references(() => user.id, { onDelete: 'cascade' }),
  role: text('role').notNull(),
  content: text('content').notNull(),
  messageType: text('messageType').default('text'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

export const nutritionLog = pgTable('nutrition_log', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull().references(() => user.id, { onDelete: 'cascade' }),
  mealType: text('mealType').notNull(),
  foods: text('foods').array().default([]),
  calories: integer('calories'),
  protein: decimal('protein', { precision: 5, scale: 2 }),
  carbs: decimal('carbs', { precision: 5, scale: 2 }),
  fats: decimal('fats', { precision: 5, scale: 2 }),
  logDate: timestamp('logDate').notNull().defaultNow(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

export const appointment = pgTable('appointment', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull().references(() => user.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  doctorName: text('doctorName'),
  specialization: text('specialization'),
  appointmentDate: timestamp('appointmentDate').notNull(),
  location: text('location'),
  notes: text('notes'),
  status: text('status').default('scheduled'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const auditLog = pgTable('audit_log', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull().references(() => user.id, { onDelete: 'cascade' }),
  action: text('action').notNull(),
  resourceType: text('resourceType'),
  resourceId: text('resourceId'),
  details: jsonb('details'),
  ipAddress: text('ipAddress'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

// New Tables for Advanced Features
export const phoneVerification = pgTable('phone_verification', {
  id: text('id').primaryKey(),
  userId: text('userId').references(() => user.id, { onDelete: 'cascade' }),
  phoneNumber: text('phoneNumber').notNull().unique(),
  otp: text('otp').notNull(),
  attempts: integer('attempts').default(0),
  expiresAt: timestamp('expiresAt').notNull(),
  isVerified: boolean('isVerified').default(false),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

export const subscription = pgTable('subscription', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull().references(() => user.id, { onDelete: 'cascade' }),
  plan: text('plan').notNull(),
  status: text('status').default('active'),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  currency: text('currency').default('INR'),
  billingCycle: text('billingCycle'),
  startDate: timestamp('startDate').notNull().defaultNow(),
  endDate: timestamp('endDate'),
  stripeSubscriptionId: text('stripeSubscriptionId').unique(),
  stripeCustomerId: text('stripeCustomerId'),
  autoRenew: boolean('autoRenew').default(true),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const invoice = pgTable('invoice', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull().references(() => user.id, { onDelete: 'cascade' }),
  subscriptionId: text('subscriptionId').references(() => subscription.id),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  currency: text('currency').default('INR'),
  status: text('status').default('pending'),
  stripeInvoiceId: text('stripeInvoiceId').unique(),
  description: text('description'),
  dueDate: timestamp('dueDate'),
  paidAt: timestamp('paidAt'),
  invoiceNumber: text('invoiceNumber').unique(),
  pdfUrl: text('pdfUrl'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const medicalRecord = pgTable('medical_record', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull().references(() => user.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  type: text('type').notNull(),
  description: text('description'),
  fileUrl: text('fileUrl'),
  tags: text('tags').array().default([]),
  recordDate: timestamp('recordDate').notNull().defaultNow(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const doctorProfile = pgTable('doctor_profile', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email'),
  phone: text('phone').notNull(),
  specialization: text('specialization').notNull(),
  qualification: text('qualification'),
  experience: integer('experience'),
  location: text('location').notNull(),
  latitude: decimal('latitude', { precision: 10, scale: 8 }),
  longitude: decimal('longitude', { precision: 11, scale: 8 }),
  city: text('city'),
  state: text('state'),
  rating: decimal('rating', { precision: 3, scale: 2 }).default('5.0'),
  totalReviews: integer('totalReviews').default(0),
  isVerified: boolean('isVerified').default(false),
  profileImage: text('profileImage'),
  bio: text('bio'),
  consultationFee: decimal('consultationFee', { precision: 7, scale: 2 }),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const doctorSlot = pgTable('doctor_slot', {
  id: text('id').primaryKey(),
  doctorId: text('doctorId').notNull().references(() => doctorProfile.id, { onDelete: 'cascade' }),
  date: text('date').notNull(),
  startTime: text('startTime').notNull(),
  endTime: text('endTime').notNull(),
  isBooked: boolean('isBooked').default(false),
  bookedBy: text('bookedBy').references(() => user.id, { onDelete: 'set null' }),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const weeklyCheckup = pgTable('weekly_checkup', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull().references(() => user.id, { onDelete: 'cascade' }),
  weekStartDate: text('weekStartDate').notNull(),
  moodScore: integer('moodScore'),
  energyLevel: integer('energyLevel'),
  sleepQuality: integer('sleepQuality'),
  exerciseDays: integer('exerciseDays'),
  waterIntake: integer('waterIntake'),
  medicationAdherence: integer('medicationAdherence'),
  notes: text('notes'),
  isCompleted: boolean('isCompleted').default(false),
  completedAt: timestamp('completedAt'),
  reminderSentAt: timestamp('reminderSentAt'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const smsLog = pgTable('sms_log', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull().references(() => user.id, { onDelete: 'cascade' }),
  phoneNumber: text('phoneNumber').notNull(),
  messageType: text('messageType').notNull(),
  messageContent: text('messageContent').notNull(),
  status: text('status').default('pending'),
  sentAt: timestamp('sentAt'),
  smsProvider: text('smsProvider'),
  externalId: text('externalId'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

// Commercial Features Tables
export const userRole = pgTable('user_role', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull().references(() => user.id, { onDelete: 'cascade' }),
  role: text('role').notNull().default('user'), // user, guardian, admin
  permissions: jsonb('permissions').default({}),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const guardianProfile = pgTable('guardian_profile', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull().references(() => user.id, { onDelete: 'cascade' }),
  guardianUserId: text('guardianUserId').notNull().references(() => user.id, { onDelete: 'cascade' }),
  relationship: text('relationship').notNull(), // mother, father, spouse, etc
  phoneNumber: text('phoneNumber').notNull(),
  canViewHealth: boolean('canViewHealth').default(true),
  canViewLocation: boolean('canViewLocation').default(false),
  canReceiveAlerts: boolean('canReceiveAlerts').default(true),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const biometricAuth = pgTable('biometric_auth', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull().references(() => user.id, { onDelete: 'cascade' }),
  biometricType: text('biometricType').notNull(), // fingerprint, face, iris
  biometricHash: text('biometricHash').notNull(),
  deviceId: text('deviceId').notNull(),
  isEnabled: boolean('isEnabled').default(true),
  lastUsed: timestamp('lastUsed'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const userSession = pgTable('user_session', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull().references(() => user.id, { onDelete: 'cascade' }),
  deviceId: text('deviceId').notNull(),
  deviceName: text('deviceName'),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  lastActivity: timestamp('lastActivity').notNull().defaultNow(),
  expiresAt: timestamp('expiresAt').notNull(),
  isActive: boolean('isActive').default(true),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

export const locationTracking = pgTable('location_tracking', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull().references(() => user.id, { onDelete: 'cascade' }),
  latitude: decimal('latitude', { precision: 10, scale: 8 }).notNull(),
  longitude: decimal('longitude', { precision: 11, scale: 8 }).notNull(),
  accuracy: integer('accuracy'),
  status: text('status').notNull(), // active, sos, idle
  sosActive: boolean('sosActive').default(false),
  sosStartTime: timestamp('sosStartTime'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

export const sosAlert = pgTable('sos_alert', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull().references(() => user.id, { onDelete: 'cascade' }),
  alertType: text('alertType').notNull(), // sos, health_alert, medication_reminder
  severity: text('severity').notNull(), // critical, high, medium, low
  message: text('message').notNull(),
  guardianNotified: boolean('guardianNotified').default(false),
  emergencyContactCalled: boolean('emergencyContactCalled').default(false),
  location: jsonb('location'),
  isResolved: boolean('isResolved').default(false),
  resolvedAt: timestamp('resolvedAt'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

export const auditLog2 = pgTable('audit_log_2', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull().references(() => user.id, { onDelete: 'cascade' }),
  action: text('action').notNull(),
  resourceType: text('resourceType'),
  resourceId: text('resourceId'),
  status: text('status'), // success, failure
  details: jsonb('details'),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

export const paymentTransaction = pgTable('payment_transaction', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull().references(() => user.id, { onDelete: 'cascade' }),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  currency: text('currency').default('INR'),
  paymentMethod: text('paymentMethod').notNull(), // upi, card, netbanking
  razorpayPaymentId: text('razorpayPaymentId').unique(),
  razorpayOrderId: text('razorpayOrderId'),
  status: text('status').notNull(), // pending, success, failed
  description: text('description'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const pushNotification = pgTable('push_notification', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull().references(() => user.id, { onDelete: 'cascade' }),
  fcmToken: text('fcmToken'),
  title: text('title').notNull(),
  body: text('body').notNull(),
  data: jsonb('data'),
  sentAt: timestamp('sentAt'),
  status: text('status').default('pending'), // pending, sent, failed
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

export const chatHistory = pgTable('chat_history', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull().references(() => user.id, { onDelete: 'cascade' }),
  conversationId: text('conversationId').notNull(),
  role: text('role').notNull(), // user, assistant
  content: text('content').notNull(),
  metadata: jsonb('metadata'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})
