'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Navbar } from '@/components/navbar'
import { getCurrentUser, type DemoUser, updateCurrentUser } from '@/lib/demo-auth'
import {
  User,
  FileText,
  Calendar,
  Heart,
  Settings,
  LogOut,
  Trash2,
  Download,
  Plus,
  MapPin,
  Mail,
  Phone,
  ShieldCheck,
} from 'lucide-react'

const tabs = ['overview', 'records', 'appointments', 'settings']

type RecordItem = {
  id: string
  title: string
  type: string
  date: string
  tags: string[]
}

type AppointmentItem = {
  id: string
  doctor: string
  specialty: string
  date: string
  time: string
  status: 'upcoming' | 'completed'
  location: string
}

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  const raw = localStorage.getItem(key)
  if (!raw) return fallback
  try {
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

function formatDate(value?: string) {
  if (!value) return 'Not completed'
  return new Date(value).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function daysAgo(value?: string) {
  if (!value) return 'Take assessment to update'
  const diff = Math.max(0, Math.round((Date.now() - new Date(value).getTime()) / 86400000))
  return diff === 0 ? 'Today' : `${diff} day${diff === 1 ? '' : 's'} ago`
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [user, setUser] = useState<DemoUser | null>(null)
  const [assessment, setAssessment] = useState<any>(null)
  const [weekly, setWeekly] = useState<any>(null)
  const [records, setRecords] = useState<RecordItem[]>([])
  const [appointments, setAppointments] = useState<AppointmentItem[]>([])
  const [newRecordTitle, setNewRecordTitle] = useState('')
  const [profileForm, setProfileForm] = useState({ name: '', email: '', phone: '', age: '', city: '' })

  useEffect(() => {
    const currentUser = getCurrentUser()
    setUser(currentUser)
    setProfileForm({
      name: currentUser?.name || '',
      email: currentUser?.email || '',
      phone: currentUser?.phone || '',
      age: currentUser?.age || '',
      city: currentUser?.city || '',
    })
    setAssessment(readJson('herguardian.latestAssessment', null))
    setWeekly(readJson('herguardian.latestWeeklyCheckup', null))

    const userId = currentUser?.id || 'guest'
    setRecords(readJson(`herguardian.records.${userId}`, []))
    setAppointments(readJson(`herguardian.appointments.${userId}`, []))
  }, [])

  const userId = user?.id || 'guest'
  const initials = useMemo(() => {
    const source = user?.name || user?.email || user?.phone || 'User'
    return source
      .split(/[.\s@_+-]+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('')
  }, [user])

  const healthScore = assessment?.analysis?.healthScore ?? '--'
  const healthStatus = assessment?.analysis?.status ?? 'Complete assessment to update'
  const memberSince = formatDate(user?.createdAt)
  const lastAssessmentDate = formatDate(assessment?.createdAt)

  const saveRecords = (next: RecordItem[]) => {
    setRecords(next)
    localStorage.setItem(`herguardian.records.${userId}`, JSON.stringify(next))
  }

  const saveAppointments = (next: AppointmentItem[]) => {
    setAppointments(next)
    localStorage.setItem(`herguardian.appointments.${userId}`, JSON.stringify(next))
  }

  const addRecord = () => {
    const title = newRecordTitle.trim()
    if (!title) return
    saveRecords([
      {
        id: crypto.randomUUID(),
        title,
        type: 'uploaded',
        date: new Date().toISOString().slice(0, 10),
        tags: ['user-added'],
      },
      ...records,
    ])
    setNewRecordTitle('')
  }

  const addAppointment = () => {
    saveAppointments([
      {
        id: crypto.randomUUID(),
        doctor: 'Select doctor from Doctors page',
        specialty: 'Gynecology',
        date: new Date().toISOString().slice(0, 10),
        time: 'To be confirmed',
        status: 'upcoming',
        location: user?.city ? `${user.city}, India` : 'Mumbai, India',
      },
      ...appointments,
    ])
  }

  const saveProfile = () => {
    if (!user) return
    const nextUser: DemoUser = {
      ...user,
      name: profileForm.name.trim() || user.name,
      email: profileForm.email.trim().toLowerCase(),
      phone: profileForm.phone.trim(),
      age: profileForm.age.trim(),
      city: profileForm.city.trim() || 'Mumbai',
    }
    updateCurrentUser(nextUser)
    setUser(nextUser)
  }

  const logout = () => {
    localStorage.removeItem('herguardian.currentUser')
    localStorage.removeItem('herguardian.sessionActive')
    window.location.href = '/login'
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 rounded-xl border border-border bg-card p-8"
        >
          <div className="flex flex-col items-center gap-8 md:flex-row">
            <div className="relative">
              <div className="flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-4xl font-bold text-white">
                {initials || <User className="h-16 w-16" />}
              </div>
            </div>

            <div className="flex-1 text-center md:text-left">
              <h1 className="mb-2 text-3xl font-bold">{user?.name || 'No user signed in'}</h1>
              <p className="mb-4 text-muted-foreground">
                Age: {user?.age || 'Not set'} | Member since {memberSince}
              </p>
              <div className="mb-4 flex flex-wrap justify-center gap-2 md:justify-start">
                <span className="rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">
                  {user?.provider ? `${user.provider} login` : 'Guest'}
                </span>
                <span className="rounded-full bg-accent/10 px-3 py-1 text-sm text-accent">Local account</span>
                <span className="rounded-full bg-secondary/10 px-3 py-1 text-sm text-secondary">{user?.role || 'user'}</span>
              </div>
              <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground md:justify-start">
                {user?.email && <span className="inline-flex items-center gap-1"><Mail className="h-4 w-4" />{user.email}</span>}
                {user?.phone && <span className="inline-flex items-center gap-1"><Phone className="h-4 w-4" />{user.phone}</span>}
                <span className="inline-flex items-center gap-1"><MapPin className="h-4 w-4" />{user?.city || 'Mumbai'}</span>
              </div>
            </div>

            <div className="flex flex-col gap-2 md:items-end">
              <button
                onClick={() => setActiveTab('settings')}
                className="rounded-lg border border-border px-6 py-2 transition-colors hover:bg-muted"
              >
                <Settings className="mr-2 inline h-4 w-4" />
                Settings
              </button>
              <button
                onClick={logout}
                className="rounded-lg border border-destructive/20 px-6 py-2 text-destructive transition-colors hover:bg-destructive/10"
              >
                <LogOut className="mr-2 inline h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </motion.div>

        <div className="mb-8 flex gap-2 overflow-x-auto border-b border-border">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap border-b-2 px-6 py-3 font-semibold capitalize transition-colors ${
                activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="rounded-lg border border-border bg-card p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-semibold">Health Score</h3>
                <Heart className="h-5 w-5 text-secondary" />
              </div>
              <p className="text-4xl font-bold text-primary">{healthScore}</p>
              <p className="text-sm text-muted-foreground">{healthStatus}</p>
            </div>

            <div className="rounded-lg border border-border bg-card p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-semibold">Last Assessment</h3>
                <Calendar className="h-5 w-5 text-accent" />
              </div>
              <p className="text-2xl font-bold">{lastAssessmentDate}</p>
              <p className="text-sm text-muted-foreground">{daysAgo(assessment?.createdAt)}</p>
            </div>

            <div className="rounded-lg border border-border bg-card p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-semibold">Saved Records</h3>
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <p className="text-4xl font-bold">{records.length}</p>
              <p className="text-sm text-muted-foreground">User-added medical documents</p>
            </div>
          </motion.div>
        )}

        {activeTab === 'records' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-xl font-bold">Medical Records</h2>
                <p className="text-sm text-muted-foreground">No fake sample reports are preloaded. Add only real user records here.</p>
              </div>
              <div className="flex gap-2">
                <input
                  value={newRecordTitle}
                  onChange={(event) => setNewRecordTitle(event.target.value)}
                  placeholder="Record title"
                  className="rounded-lg border border-border bg-background px-3 py-2"
                />
                <button onClick={addRecord} className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-primary-foreground">
                  <Plus className="h-4 w-4" />
                  Add
                </button>
              </div>
            </div>

            {records.length === 0 ? (
              <div className="rounded-lg border border-border bg-card p-8 text-center text-muted-foreground">
                No records added yet.
              </div>
            ) : (
              <div className="space-y-4">
                {records.map((record) => (
                  <div key={record.id} className="flex items-center justify-between rounded-lg border border-border bg-card p-6">
                    <div>
                      <h3 className="font-semibold">{record.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{record.date}</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="rounded-lg p-2 hover:bg-muted"><Download className="h-4 w-4" /></button>
                      <button
                        onClick={() => saveRecords(records.filter((item) => item.id !== record.id))}
                        className="rounded-lg p-2 text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'appointments' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">Appointments</h2>
                <p className="text-sm text-muted-foreground">Only user-created appointments are shown.</p>
              </div>
              <button onClick={addAppointment} className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-primary-foreground">
                <Plus className="h-4 w-4" />
                Add Appointment
              </button>
            </div>

            {appointments.length === 0 ? (
              <div className="rounded-lg border border-border bg-card p-8 text-center">
                <p className="mb-4 text-muted-foreground">No appointments fixed yet.</p>
                <Link href="/doctors" className="inline-flex rounded-lg bg-primary px-4 py-2 text-primary-foreground">
                  Find Mumbai gynecologists
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {appointments.map((apt) => (
                  <div key={apt.id} className="rounded-lg border border-border bg-card p-6">
                    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                      <div>
                        <h3 className="text-lg font-semibold">{apt.doctor}</h3>
                        <p className="text-sm text-muted-foreground">{apt.specialty}</p>
                        <p className="mt-2 text-sm text-muted-foreground">{apt.location}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{apt.date}</p>
                        <p className="text-sm text-muted-foreground">{apt.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'settings' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="rounded-lg border border-border bg-card p-6">
              <h3 className="mb-4 font-semibold">Personal Details</h3>
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  ['name', 'Full name', 'text'],
                  ['email', 'Email address', 'email'],
                  ['phone', 'Phone number', 'tel'],
                  ['age', 'Age', 'number'],
                  ['city', 'City', 'text'],
                ].map(([key, label, type]) => (
                  <div key={key}>
                    <label className="mb-2 block text-sm font-medium">{label}</label>
                    <input
                      type={type}
                      value={profileForm[key as keyof typeof profileForm]}
                      onChange={(event) => setProfileForm({ ...profileForm, [key]: event.target.value })}
                      className="w-full rounded-lg border border-border bg-background px-4 py-3 outline-none focus:border-primary"
                    />
                  </div>
                ))}
              </div>
              <button onClick={saveProfile} className="mt-4 rounded-lg bg-primary px-5 py-2 font-semibold text-primary-foreground">
                Save Details
              </button>
            </div>

            <div className="rounded-lg border border-border bg-card p-6">
              <h3 className="mb-4 font-semibold">Account Security</h3>
              <div className="space-y-3 text-sm">
                <p className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-accent" />Login ID: {user?.id || 'Not signed in'}</p>
                <p>Provider: {user?.provider || 'None'}</p>
                <p>Verification: Local demo account. No OTP or confirmation email has been sent.</p>
                <p>Weekly PHQ-9: {weekly?.phq?.total ?? 'Not completed'} {weekly?.phq?.severity ? `(${weekly.phq.severity})` : ''}</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </main>
  )
}
