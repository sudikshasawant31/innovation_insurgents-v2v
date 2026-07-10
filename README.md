# HerGuardian AI

**The Idea:** HerGuardian AI is an AI-powered preventive healthcare companion built especially for women. It helps users track health signals, complete wellness assessments, book appointments, explore women’s health resources, receive alerts, and access an AI chatbot for general health guidance. The goal is to support early awareness, safer decision-making, and easier access to preventive care.

## Important Links

- **Live Deployment Link:** https://her-guardian-ai-app-updated.vercel.app/
- **Demo Video Link:** [Add your YouTube/Google Drive demo video link here]

## Features

- **AI Health Dashboard:** Personalized dashboard showing health score, mental wellness, activity status, reports, and recommendations.
- **Assessment System:** PHQ-9, GAD-7, weekly checkups, mood tracking, and wellness analysis.
- **Wellness & Preventive Care:** Burnout and stress, breast health, and bone health screening support.
- **Women’s Health Calendar:** Tracks periods, appointments, lab tests, health checkups, and reminders.
- **Doctor Booking:** Search doctors, view specialists, book appointments, and schedule reminders.
- **Testing Agencies:** Mumbai-focused testing agency directory for blood tests, body checkups, women’s health panels, and home sample collection.
- **AI Chatbot:** Health-focused chatbot for general guidance, symptoms, tests, appointments, and preventive care education.
- **Female Health Facts:** Educational section with articles, videos, thumbnails, links, and “Did You Know?” cards.
- **Emergency & Health Alerts:** Supports call, SMS, and email alert flows using Twilio configuration.
- **Authentication:** Email/password login, Google login setup, OTP login support, and user registration.
- **Payments & Support:** Razorpay-ready payment flow with UPI, cards, net banking, and user-entered payment amount.
- **PDF Reports:** Generates health analysis summaries and doctor-ready reports.
- **Responsive UI:** Mobile-first healthcare interface with light/dark mode support.

## Tech Stack & Tools

- **Frontend:** Next.js App Router, React, TypeScript
- **Styling:** Tailwind CSS, shadcn-style UI components, Lucide icons
- **Animations:** Framer Motion
- **Charts:** Recharts
- **Forms & Validation:** React Hook Form, Zod
- **Database:** PostgreSQL using Neon or another Postgres provider
- **ORM:** Drizzle ORM
- **Authentication:** Better Auth / custom auth routes
- **AI Chatbot:** OpenAI / Gemini / Puter.js-compatible chatbot setup
- **SMS, OTP & Calling:** Twilio
- **Payments:** Razorpay Checkout
- **Deployment:** Vercel
- **Database Hosting:** Neon PostgreSQL
- **Version Control:** GitHub

## Documentation

### Problem Statement

Women often need to manage multiple aspects of health at once, including menstrual cycles, mental wellness, preventive checkups, doctor appointments, nutrition, bone health, and emergency support. Existing apps usually focus on only one area, such as period tracking or appointments.

HerGuardian AI combines preventive healthcare, education, reminders, AI support, and appointment access in one platform.

### How It Works

The app provides a central dashboard where the user can access different healthcare modules. Users can complete assessments, track symptoms, view recommendations, book appointments, browse testing agencies, and generate reports.

The chatbot provides general educational support and helps users understand symptoms, tests, and next steps.

Health information can be stored using PostgreSQL through Neon. The app uses Drizzle ORM for database tables such as users, assessments, mood entries, appointments, invoices, medical records, nutrition logs, chat history, and emergency alerts.

### Medical Safety

HerGuardian AI is designed to provide screening support, health education, preventive guidance, and timely awareness for women’s wellbeing.

The platform focuses on:
- Helping users understand possible health patterns and risk signals
- Encouraging early conversations with qualified healthcare professionals
- Supporting safer next steps through reports, reminders, and appointment booking
- Promoting preventive care, health literacy, and emergency awareness
- Keeping medical decisions with certified doctors and healthcare providers

When serious symptoms or red flags are detected, HerGuardian AI gently guides the user toward professional care, emergency support, or booking a doctor appointment through the platform.

### Payment Flow

The support/payment section uses Razorpay Checkout. The user selects a payment method, enters the amount they want to pay, and proceeds to Razorpay.

Supported payment options include:
- UPI apps
- UPI ID / QR
- Net banking
- Debit and credit cards
