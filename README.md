# HerGuardian AI

**The Idea:** HerGuardian AI is an AI-powered preventive healthcare companion built especially for women. It helps users track health signals, complete wellness assessments, book appointments, explore women’s health resources, receive alerts, and access an AI chatbot for general health guidance. The goal is to support early awareness, safer decision-making, and easier access to preventive care.

## Important Links

- **Live Deployment Link:** https://her-guardian-ai-app-updated.vercel.app/
- **Demo Video Link:** https://drive.google.com/file/d/1CF_Y2zPKLILmuMLfU_huGzbE6pEwGXuc/view?usp=sharing

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
- **AI Development Assistant:** OpenAI Codex for planning, coding, debugging, UI improvements, README writing, and deployment guidance
- **AI Content Support:** ChatGPT-style AI assistance for structuring health education content, demo script writing, feature documentation, and project explanation
- **AI Health Guidance Layer:** Prompt-based AI chatbot flow for educational health support and safer next-step suggestions
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

### How We Coordinated With AI Tools

AI tools were used throughout the project as a development and planning assistant. OpenAI Codex helped us understand the existing code structure, debug errors, improve UI/UX, add new modules, fix authentication issues, integrate payment flow, prepare deployment steps, and generate project documentation.

We used AI support in the following ways:

- **Feature Planning:** AI helped break the platform into clear modules such as dashboard, assessments, doctors, weekly checkup, health calendar, testing agencies, female health facts, chatbot, support, and wellness preventive care.
- **Code Development:** AI assisted in creating and updating Next.js pages, API routes, UI components, forms, charts, reports, and navigation flows.
- **Debugging:** AI helped fix build errors, missing dependencies, incorrect imports, broken buttons, Razorpay payment issues, database setup problems, and deployment configuration.
- **UI/UX Improvements:** AI helped redesign the interface with a more premium healthcare look, light/dark mode, better layouts, visual assets, and more engaging wellness sections.
- **Health Content Structuring:** AI helped organize educational content about PCOS, menopause, menstrual health, mental wellness, reproductive health, nutrition, bone health, and preventive care.
- **Safety Language:** AI helped frame medical safety content in a positive way, making it clear that HerGuardian AI supports awareness, screening, reports, and professional consultation.
- **Demo and Documentation:** AI helped prepare the GitHub README, project explanation, deployment instructions, environment variable setup, and video demo script.

AI was used as a collaborative assistant, while the final project decisions, testing, feature selection, and implementation direction were handled by the team.
