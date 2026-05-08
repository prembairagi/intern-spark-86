// Mock data store for the Internship Management Portal.
// Uses localStorage so data persists across page reloads in the browser.

export type Role = "student" | "company" | "admin";

export type ApplicationStatus =
  | "submitted"
  | "under_review"
  | "shortlisted"
  | "rejected"
  | "accepted";

export type CompanyStatus = "pending" | "approved" | "rejected";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  createdAt: string;
}

export interface StudentProfile {
  userId: string;
  university: string;
  degree: string;
  graduationYear: number;
  skills: string[];
  bio: string;
  resumeName?: string;
}

export interface CompanyProfile {
  userId: string;
  companyName: string;
  industry: string;
  website: string;
  description: string;
  status: CompanyStatus;
}

export interface Internship {
  id: string;
  companyId: string;
  companyName: string;
  title: string;
  domain: string;
  location: string;
  mode: "Remote" | "Hybrid" | "On-site";
  stipend: number;
  durationWeeks: number;
  description: string;
  requirements: string[];
  postedAt: string;
  active: boolean;
}

export interface Application {
  id: string;
  internshipId: string;
  internshipTitle: string;
  companyName: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  status: ApplicationStatus;
  coverLetter: string;
  resumeName: string;
  appliedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface AdminLog {
  id: string;
  action: string;
  target: string;
  createdAt: string;
}

interface DB {
  users: User[];
  studentProfiles: StudentProfile[];
  companyProfiles: CompanyProfile[];
  internships: Internship[];
  applications: Application[];
  notifications: Notification[];
  adminLogs: AdminLog[];
  session: { userId: string | null };
}

const KEY = "imp_db_v1";

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function seed(): DB {
  const now = new Date().toISOString();
  const admin: User = {
    id: "u_admin",
    name: "Portal Admin",
    email: "admin@portal.com",
    password: "admin123",
    role: "admin",
    createdAt: now,
  };
  const company1: User = {
    id: "u_c1",
    name: "Aarav Mehta",
    email: "hr@nimbusworks.com",
    password: "company123",
    role: "company",
    createdAt: now,
  };
  const company2: User = {
    id: "u_c2",
    name: "Lina Park",
    email: "talent@brightleaf.io",
    password: "company123",
    role: "company",
    createdAt: now,
  };
  const company3: User = {
    id: "u_c3",
    name: "Diego Ruiz",
    email: "people@harborlabs.dev",
    password: "company123",
    role: "company",
    createdAt: now,
  };
  const student1: User = {
    id: "u_s1",
    name: "Priya Sharma",
    email: "priya@student.edu",
    password: "student123",
    role: "student",
    createdAt: now,
  };
  const student2: User = {
    id: "u_s2",
    name: "Marcus Chen",
    email: "marcus@student.edu",
    password: "student123",
    role: "student",
    createdAt: now,
  };

  return {
    users: [admin, company1, company2, company3, student1, student2],
    studentProfiles: [
      {
        userId: student1.id,
        university: "Indian Institute of Technology, Delhi",
        degree: "B.Tech Computer Science",
        graduationYear: 2026,
        skills: ["React", "TypeScript", "Python", "SQL"],
        bio: "Frontend-leaning full-stack developer interested in design systems and developer tools.",
        resumeName: "priya_sharma_resume.pdf",
      },
      {
        userId: student2.id,
        university: "University of Toronto",
        degree: "BSc Data Science",
        graduationYear: 2025,
        skills: ["Python", "PyTorch", "Pandas", "SQL"],
        bio: "Aspiring ML engineer with two research projects on time-series forecasting.",
        resumeName: "marcus_chen_resume.pdf",
      },
    ],
    companyProfiles: [
      {
        userId: company1.id,
        companyName: "Nimbus Works",
        industry: "Cloud Infrastructure",
        website: "https://nimbusworks.com",
        description:
          "We build observability tooling used by engineering teams at fast-growing startups.",
        status: "approved",
      },
      {
        userId: company2.id,
        companyName: "Brightleaf",
        industry: "FinTech",
        website: "https://brightleaf.io",
        description: "Personal finance products for first-time investors across emerging markets.",
        status: "approved",
      },
      {
        userId: company3.id,
        companyName: "Harbor Labs",
        industry: "Developer Tools",
        website: "https://harborlabs.dev",
        description: "Open-source CLI tooling and SDKs for modern API development.",
        status: "pending",
      },
    ],
    internships: [
      {
        id: "i_1",
        companyId: company1.id,
        companyName: "Nimbus Works",
        title: "Frontend Engineering Intern",
        domain: "Software Engineering",
        location: "Bengaluru, India",
        mode: "Hybrid",
        stipend: 45000,
        durationWeeks: 12,
        description:
          "Work alongside our product team to ship features for our observability dashboard. You'll own meaningful surfaces of the app and pair-program with senior engineers.",
        requirements: ["React", "TypeScript", "Strong CSS fundamentals"],
        postedAt: now,
        active: true,
      },
      {
        id: "i_2",
        companyId: company1.id,
        companyName: "Nimbus Works",
        title: "Site Reliability Intern",
        domain: "DevOps",
        location: "Remote",
        mode: "Remote",
        stipend: 50000,
        durationWeeks: 16,
        description:
          "Help us scale our ingest pipeline. You'll write runbooks, build alerting, and contribute to incident reviews.",
        requirements: ["Linux", "Python or Go", "Curiosity about distributed systems"],
        postedAt: now,
        active: true,
      },
      {
        id: "i_3",
        companyId: company2.id,
        companyName: "Brightleaf",
        title: "Product Design Intern",
        domain: "Design",
        location: "Singapore",
        mode: "On-site",
        stipend: 3500,
        durationWeeks: 12,
        description:
          "Partner with PMs and engineers to design onboarding and investing flows. Portfolio review required.",
        requirements: ["Figma", "Strong portfolio", "Interest in fintech"],
        postedAt: now,
        active: true,
      },
      {
        id: "i_4",
        companyId: company2.id,
        companyName: "Brightleaf",
        title: "Data Science Intern",
        domain: "Data Science",
        location: "Remote",
        mode: "Remote",
        stipend: 40000,
        durationWeeks: 10,
        description:
          "Build models that personalize the user investing journey. Work with our growth and risk teams.",
        requirements: ["Python", "Pandas", "Statistics"],
        postedAt: now,
        active: true,
      },
    ],
    applications: [
      {
        id: "a_1",
        internshipId: "i_1",
        internshipTitle: "Frontend Engineering Intern",
        companyName: "Nimbus Works",
        studentId: student1.id,
        studentName: "Priya Sharma",
        studentEmail: student1.email,
        status: "shortlisted",
        coverLetter:
          "I've shipped two production React apps and would love to contribute to your dashboard.",
        resumeName: "priya_sharma_resume.pdf",
        appliedAt: now,
      },
      {
        id: "a_2",
        internshipId: "i_4",
        internshipTitle: "Data Science Intern",
        companyName: "Brightleaf",
        studentId: student2.id,
        studentName: "Marcus Chen",
        studentEmail: student2.email,
        status: "under_review",
        coverLetter: "My research on time-series forecasting maps directly to your risk team's work.",
        resumeName: "marcus_chen_resume.pdf",
        appliedAt: now,
      },
    ],
    notifications: [
      {
        id: "n_1",
        userId: student1.id,
        title: "Application shortlisted",
        message: "Nimbus Works shortlisted your application for Frontend Engineering Intern.",
        read: false,
        createdAt: now,
      },
      {
        id: "n_2",
        userId: company1.id,
        title: "New application",
        message: "Priya Sharma applied to Frontend Engineering Intern.",
        read: false,
        createdAt: now,
      },
    ],
    adminLogs: [
      { id: "l_1", action: "Approved company", target: "Nimbus Works", createdAt: now },
      { id: "l_2", action: "Approved company", target: "Brightleaf", createdAt: now },
    ],
    session: { userId: null },
  };
}

function load(): DB {
  if (typeof window === "undefined") return seed();
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) {
      const s = seed();
      window.localStorage.setItem(KEY, JSON.stringify(s));
      return s;
    }
    return JSON.parse(raw) as DB;
  } catch {
    return seed();
  }
}

function save(db: DB) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(db));
  window.dispatchEvent(new Event("imp_db_change"));
}

export const db = {
  get: load,
  set: save,
  reset() {
    if (typeof window === "undefined") return;
    const s = seed();
    window.localStorage.setItem(KEY, JSON.stringify(s));
    window.dispatchEvent(new Event("imp_db_change"));
  },
  uid,
};
