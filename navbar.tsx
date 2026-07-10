'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Heart, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { motion } from 'framer-motion'

const navItems = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Assessment', href: '/assessment' },
  { label: 'Doctors', href: '/doctors' },
  { label: 'Weekly Checkup', href: '/weekly-checkup' },
  { label: 'Calendar', href: '/health-calendar' },
  { label: 'Testing', href: '/testing-agencies' },
  { label: 'Facts', href: '/female-health-facts' },
  { label: 'Chatbot', href: '/chatbot' },
  { label: 'Profile', href: '/profile' },
  { label: 'Support', href: '/support' },
]

export function Navbar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto max-w-[92rem] px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary">
              <Heart className="w-6 h-6 text-primary-foreground" fill="white" />
            </div>
            <span className="hidden sm:inline font-bold text-lg bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              HerGuardian AI
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex flex-wrap items-center justify-end gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground hover:bg-muted'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden pb-4 space-y-2"
          >
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground hover:bg-muted'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
          </motion.div>
        )}
      </div>
    </nav>
  )
}
