'use client'

import Link from 'next/link'
import { ArrowRight, Heart, Shield, Zap, TrendingUp, MessageCircle, Brain } from 'lucide-react'
import { motion } from 'framer-motion'
import { Navbar } from '@/components/navbar'

const features = [
  {
    icon: Shield,
    title: 'Early Risk Detection',
    description: 'AI-powered assessment identifies health risks like PCOS, anemia, thyroid conditions, and more.'
  },
  {
    icon: Brain,
    title: 'Mental Wellness',
    description: 'Comprehensive mood tracking, stress assessment, and personalized mental health support.'
  },
  {
    icon: TrendingUp,
    title: 'Personalized Insights',
    description: 'Get tailored recommendations based on your unique health profile and lifestyle.'
  },
  {
    icon: MessageCircle,
    title: 'Doctor Reports',
    description: 'Generate beautiful PDF reports ready to share with your healthcare provider.'
  },
  {
    icon: Zap,
    title: 'Voice Assistant',
    description: 'Hands-free health guidance and emergency contact flow with one voice command.'
  },
  {
    icon: Heart,
    title: 'Holistic Care',
    description: 'Nutrition tracking, wellness tips, and continuous healthcare companionship.'
  },
]

const testimonials = [
  {
    name: 'Sarah M.',
    role: 'Healthcare Professional',
    text: 'HerGuardian AI transformed how I approach preventive healthcare. The risk assessment is incredibly accurate.'
  },
  {
    name: 'Jessica P.',
    role: 'Patient',
    text: 'I love the mental wellness features. The AI-generated reports are perfect for my doctor appointments.'
  },
  {
    name: 'Dr. Priya K.',
    role: 'Gynecologist',
    text: 'My patients are more informed and engaged with their health data. Highly recommend to all practitioners.'
  },
]

const stats = [
  { label: 'Health Conditions Detected', value: '7+' },
  { label: 'Mental Wellness Assessments', value: 'PHQ-9 & GAD-7' },
  { label: 'User Satisfaction', value: '98%' },
]

export default function Home() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Left Content */}
            <div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-block mb-6 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20"
              >
                <span className="text-sm font-semibold text-secondary">Preventive Healthcare Revolution</span>
              </motion.div>

              <motion.h1
                className="text-5xl md:text-6xl font-bold mb-6 leading-tight"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  Prevent Today.
                </span>
                <br />
                <span className="text-foreground">Empower Tomorrow.</span>
              </motion.h1>

              <motion.p
                className="text-xl text-muted-foreground mb-8 leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                AI-powered preventive healthcare companion built for women. Early risk detection, personalized guidance, and continuous support for your wellbeing.
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Link
                  href="/assessment"
                  className="inline-flex items-center justify-center px-8 py-4 rounded-lg bg-gradient-to-r from-primary to-secondary text-primary-foreground font-semibold hover:shadow-lg hover:scale-105 transition-all"
                >
                  Start Assessment
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <Link
                  href="#features"
                  className="inline-flex items-center justify-center px-8 py-4 rounded-lg border border-border bg-background text-foreground font-semibold hover:bg-muted transition-colors"
                >
                  Learn More
                </Link>
              </motion.div>

              {/* Stats */}
              <motion.div
                className="mt-12 grid grid-cols-3 gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                {stats.map((stat, i) => (
                  <div key={i}>
                    <p className="text-2xl font-bold text-primary">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right Illustration */}
            <motion.div
              className="relative h-96 md:h-full rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20 overflow-hidden"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                  className="w-48 h-48 rounded-full border-2 border-dashed border-primary/30"
                />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                  className="w-32 h-32 rounded-full border-2 border-dashed border-secondary/30"
                />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Heart className="w-16 h-16 text-primary" fill="currentColor" />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-card/50">
        <div className="mx-auto max-w-7xl">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Comprehensive Health Support</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need for proactive women&apos;s healthcare in one intelligent platform.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {features.map((feature, i) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={i}
                  variants={item}
                  className="p-8 rounded-xl border border-border bg-background hover:border-primary/50 hover:shadow-lg transition-all group"
                >
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-4 group-hover:from-primary group-hover:to-secondary transition-all">
                    <Icon className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-colors" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Trusted by Women & Professionals</h2>
            <p className="text-xl text-muted-foreground">
              Join thousands who are taking control of their preventive healthcare.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {testimonials.map((testimonial, i) => (
              <motion.div
                key={i}
                variants={item}
                className="p-8 rounded-xl border border-border bg-card hover:shadow-lg transition-all"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <span key={j} className="text-secondary text-xl">★</span>
                  ))}
                </div>
                <p className="text-foreground mb-6 italic">&ldquo;{testimonial.text}&rdquo;</p>
                <div>
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary to-secondary">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
              Ready to Take Control?
            </h2>
            <p className="text-xl text-primary-foreground/90 mb-8">
              Start your preventive health journey today. Early detection saves lives.
            </p>
            <Link
              href="/assessment"
              className="inline-flex items-center justify-center px-8 py-4 rounded-lg bg-background text-primary font-semibold hover:shadow-lg hover:scale-105 transition-all"
            >
              Begin Assessment
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border px-4 sm:px-6 lg:px-8 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Heart className="w-6 h-6 text-primary" fill="currentColor" />
                <span className="font-bold">HerGuardian AI</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Preventive women&apos;s healthcare powered by artificial intelligence.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">Dashboard</Link></li>
                <li><Link href="/assessment" className="text-muted-foreground hover:text-foreground transition-colors">Assessment</Link></li>
                <li><Link href="/reports" className="text-muted-foreground hover:text-foreground transition-colors">Reports</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">About</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Blog</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Privacy</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Terms</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2026 HerGuardian AI. All rights reserved. Built with precision and care.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
