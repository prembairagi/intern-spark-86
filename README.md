# InternHub — Internship Management Portal

A polished, full-stack-style internship portal with three roles (Student, Company, Admin) built with TanStack Start, React, and Tailwind. Data is stored client-side in `localStorage` so the project runs with zero backend setup — perfect for exporting to GitHub and deploying anywhere static.

## Demo accounts

- **Student** — `priya@student.edu` / `student123`
- **Company** — `hr@nimbusworks.com` / `company123`
- **Admin** — `admin@portal.com` / `admin123`

## Features

- Landing page, login, register
- Student: browse / filter internships, apply, upload resume, track applications, notifications, profile
- Company: post / pause / delete internships, manage applicants, update statuses
- Admin: approve/reject companies, manage students/internships, analytics dashboard
- Role-based sidebar dashboard with mobile-friendly nav
- Empty states, success/error messages, status badges

## Project structure

```
src/
  components/        # SiteHeader, SiteFooter, DashboardLayout, status badges, ui-bits
    ui/              # shadcn/ui primitives
  lib/
    data.ts          # Mock DB (users, internships, applications, …) in localStorage
    auth.ts          # useAuth / useDb hooks
  routes/
    index.tsx                       # Landing
    login.tsx, register.tsx
    internships.tsx                 # List + filters
    internships.$id.tsx             # Detail
    apply.$id.tsx                   # Application form
    _app.tsx                        # Dashboard layout (auth-gated)
    _app.dashboard.tsx              # Role-aware overview
    _app.applications.tsx
    _app.notifications.tsx
    _app.profile.tsx
    _app.analytics.tsx
    _app.company.internships.tsx
    _app.company.applicants.tsx
    _app.admin.companies.tsx
    _app.admin.students.tsx
    _app.admin.internships.tsx
```

## Run locally

```bash
bun install
bun run dev
```

## Export to GitHub

The codebase is plain TypeScript/React with no external services. Push to a new GitHub repo and deploy on any static host (Vercel, Netlify, Cloudflare Pages).
