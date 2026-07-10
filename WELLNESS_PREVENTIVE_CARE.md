# Wellness & Preventive Care Setup

The `/wellness-preventive-care` section adds Burnout & Stress, Breast Health, and Bone Health modules.

- Screening outputs are educational wellness estimates, not diagnoses.
- Sensitive entries require explicit consent before saving.
- Data is persisted in browser storage to match the current demo architecture, so refreshes preserve assessments, reminders, logs, check-ins, nutrition, and activity entries on the same device.
- Reports download as real JSON files and pages are print-friendly through the browser print button.
- Production database deployment should map these records to the requested PostgreSQL/Prisma models before collecting real patient data.
- Twilio/email reminder actions should use the existing Twilio environment variables already documented in `.env.example`; if not configured, production SMS/email should show a configuration error rather than silently pretending to send.
- Reviewed medical resources referenced in the UI include WHO, NIMH, womenshealth.gov, NHS, Mayo Clinic, Cleveland Clinic, MedlinePlus, and Johns Hopkins Medicine.

Recommended production checklist:

1. Add authenticated server storage for the wellness models.
2. Add Vercel Cron or another scheduler for reminders.
3. Add private object storage with signed URLs before enabling uploads.
4. Run `npm run build` before deployment.
