// Data-driven case files. `null` = not yet supplied; the UI shows a placeholder.
// Fill github/live/screenshots/challenges with real values. Do not invent metrics.
const base = {
  problem: null,
  challenges: [],
  screenshots: [],
  github: "",
  live: "",
};

export const OPERATIONS = [
  // =====================================================
  // OPERATION 001 — PASSWORD SECURITY ANALYZER
  // =====================================================
  {
    ...base,
    id: "op:001",
    code: "OPERATION 001",
    slug: "op001-password-analyzer",
    title: "PASSWORD SECURITY ANALYZER",

    summary:
      "A password analysis and generation tool designed to help users understand and improve password security.",

    overview:
      "A web-based password security application that evaluates password strength using entropy calculations, character diversity, pattern detection and estimated cracking time. It also helps users generate stronger passwords and identify common password weaknesses.",

    problem:
      "Weak, predictable and reused passwords remain a major security risk. Many users create passwords without understanding their actual strength, predictability or resistance to brute-force attacks. This project makes password security easier to understand through measurable analysis and actionable feedback.",

    architecture: [
      "React + Vite frontend application",
      "FastAPI backend built with Python",
      "REST API communication between frontend and backend",
      "Password analysis and generation handled by backend services",
    ],

    tech: [
      "React",
      "Vite",
      "JavaScript",
      "Python",
      "FastAPI",
      "REST API",
    ],

    features: [
      "Password strength analysis",
      "Password entropy calculation",
      "Character-set and complexity analysis",
      "Common password detection",
      "Pattern-based weakness detection",
      "Estimated password cracking time",
      "Secure password generation",
      "Password security feedback",
    ],

    challenges: [
      "Translating password entropy into understandable security feedback",
      "Identifying predictable password patterns",
      "Separating password analysis from password generation services",
    ],

    github: "",

    live: "https://password-security-analyser.vercel.app",

  },

  // =====================================================
  // OPERATION 002 — CYBREWS
  // =====================================================
  {
    ...base,
    id: "op:002",
    code: "OPERATION 002",
    slug: "op002-cybrews",
    title: "CYBREWS",

    summary:
      "A cybersecurity news intelligence platform that brings security-related updates into one place.",

    overview:
      "CYBREWS is a cybersecurity-focused news aggregation platform designed to help users follow security developments, vulnerabilities and industry updates. It uses RSS-based content collection to bring information from multiple sources into a centralized interface.",

    problem:
      "Cybersecurity information is distributed across numerous websites, blogs and news sources. Keeping up with emerging threats and industry developments can be time-consuming. CYBREWS aims to simplify this process by providing a centralized place to discover cybersecurity news.",

    architecture: [
      "Next.js application for the frontend and application framework",
      "Tailwind CSS for interface styling",
      "Supabase for backend services and data storage",
      "RSS parser for collecting external news feeds",
      "GitHub Actions for automated feed update workflows",
      "Vercel for deployment",
    ],

    tech: [
      "Next.js",
      "React",
      "JavaScript",
      "Tailwind CSS",
      "Supabase",
      "RSS Parser",
      "GitHub Actions",
      "Vercel",
    ],

    features: [
      "Cybersecurity-focused news feed",
      "RSS-based news aggregation",
      "Automated news feed updates",
      "Centralized cybersecurity information",
      "Source attribution for collected articles",
      "Database-backed news storage",
    ],

    challenges: [
      "Collecting information from multiple RSS sources",
      "Handling differences in external feed formats",
      "Automating news collection and updates",
      "Maintaining source attribution",
    ],

    github: "",

    live: "",

  },

  // =====================================================
  // OPERATION 003 — CARDORA
  // =====================================================
  {
    ...base,
    id: "op:003",
    code: "OPERATION 003",
    slug: "op003-cardora",
    title: "CARDORA",

    summary:
      "A MERN-based digital business card and portfolio builder that gives users one link to share their professional identity.",

    overview:
      "Cardora is a digital identity platform that allows users to create and publish digital business cards with portfolio information. Users can manage their professional details, showcase projects, generate QR codes and track card engagement through analytics.",

    problem:
      "Traditional business cards provide limited information and are difficult to update. Professionals also need separate platforms to share their contact details, social profiles and project portfolios. Cardora combines these elements into a single shareable digital identity.",

    architecture: [
      "React + Vite frontend application",
      "Node.js + Express REST API",
      "MongoDB Atlas database",
      "Mongoose for database modelling",
      "Cookie-based JWT authentication",
      "CSRF and origin validation for protected operations",
      "Vercel frontend deployment",
      "Render backend deployment",
    ],

    tech: [
      "React",
      "Vite",
      "JavaScript",
      "Tailwind CSS",
      "Node.js",
      "Express.js",
      "MongoDB Atlas",
      "Mongoose",
      "JWT",
      "bcrypt",
      "Vercel",
      "Render",
    ],

    features: [
      "Digital business card creation",
      "Professional profile management",
      "Multiple card templates",
      "Draft and published card states",
      "Snapshot-based publishing",
      "QR code generation and PNG export",
      "Portfolio project showcase",
      "Social profile integration",
      "Card analytics",
      "Free plan with one card",
      "Maximum five visible portfolio projects",
      "Administrative API endpoints",
      "Protected authentication and publishing operations",
    ],

    challenges: [
      "Designing a flexible digital identity data model",
      "Separating draft changes from published card snapshots",
      "Implementing cookie-based JWT authentication",
      "Handling CSRF and origin validation",
      "Building a reusable template system",
      "Preparing frontend and backend for separate production deployments",
    ],

    github: "https://github.com/Anufazil/cardora",

    live: "https://cardora-j12n.onrender.com",

  },

  // =====================================================
  // OPERATION 004 — BARBERQUEUE
  // =====================================================
  {
    ...base,
    id: "op:004",
    code: "OPERATION 004",
    slug: "op004-barberqueue",
    title: "BARBERQUEUE",

    summary:
      "A queue management SaaS platform designed for barbershops and their customers.",

    overview:
      "BarberQueue is a queue management application designed to help barbershops organize customer waiting lists and manage daily service operations. It provides a digital alternative to manual queue management, helping customers and shop administrators coordinate appointments and waiting times.",

    problem:
      "Many barbershops manage customer queues manually, leading to confusion, unnecessary waiting and difficulty tracking service progress. BarberQueue aims to digitize the queue workflow and make customer and shop-side queue management easier.",

    architecture: [
      "React frontend application",
      "Node.js + Express backend API",
      "MongoDB database",
      "JWT-based authentication",
      "REST API communication",
      "Real-time queue update functionality",
    ],

    tech: [
      "React",
      "JavaScript",
      "Tailwind CSS",
      "Node.js",
      "Express.js",
      "MongoDB",
      "JWT",
      "Socket.IO",
      "React Query",
    ],

    features: [
      "Digital customer queue management",
      "Customer-facing queue workflow",
      "Barbershop management workflow",
      "Queue status updates",
      "Authentication and role-based access",
      "Administrative queue management",
      "Queue-related analytics",
      "REST API integration",
    ],

    challenges: [
      "Designing a queue workflow for multiple user roles",
      "Keeping queue information synchronized",
      "Managing access permissions",
      "Building a system suitable for daily business operations",
    ],

    github: "",

    live: "",

  },

  // =====================================================
  // OPERATION 005 — EXPENSO
  // =====================================================
  {
    ...base,
    id: "op:005",
    code: "OPERATION 005",
    slug: "op005-expenso",
    title: "EXPENSO",

    summary:
      "A MERN-stack personal finance application for tracking income, expenses and financial activity.",

    overview:
      "Expenso is a personal finance management application that allows users to organize financial transactions and monitor their income and expenses through a centralized dashboard. It uses a React frontend with a Node.js and Express backend connected to MongoDB.",

    problem:
      "Tracking personal income and expenses manually makes it difficult to understand spending habits and maintain an overview of financial activity. Expenso provides a centralized application for recording transactions and viewing financial summaries.",

    architecture: [
      "React frontend application",
      "Node.js + Express backend API",
      "MongoDB database",
      "JWT-based authentication",
      "bcrypt password hashing",
      "REST API communication",
      "Chart-based financial visualization",
    ],

    tech: [
      "React",
      "JavaScript",
      "Tailwind CSS",
      "Node.js",
      "Express.js",
      "MongoDB",
      "JWT",
      "bcrypt",
      "Chart.js",
    ],

    features: [
      "User authentication",
      "Income tracking",
      "Expense tracking",
      "Financial transaction management",
      "Personal finance dashboard",
      "Financial summaries",
      "Chart-based data visualization",
      "Responsive user interface",
      "REST API integration",
    ],

    challenges: [
      "Designing a structured transaction data model",
      "Managing authenticated financial records",
      "Connecting dashboard data with backend APIs",
      "Presenting financial information through visual summaries",
    ],

    github: "",

    live: "https://expenso-taupe.vercel.app",

  },

  // =====================================================
  // OPERATION 006 — TEXTOQUEST
  // =====================================================
  {
    ...base,
    id: "op:006",
    code: "OPERATION 006",
    slug: "op006-textoquest",
    title: "TEXTOQUEST",

    summary:
      "An AI-powered learning application that transforms study materials into interactive quizzes and learning content.",

    overview:
      "TextoQuest is an AI-assisted study platform that helps users convert their learning materials into quizzes and revision content. It uses Google's Gemini API to process supplied text and generate learning material, with support for document-based study workflows.",

    problem:
      "Students often spend significant time manually preparing revision notes and practice questions from lengthy study materials. TextoQuest aims to reduce this effort by using AI to transform existing content into more interactive learning resources.",

    architecture: [
      "React frontend application",
      "Google Gemini API for AI-powered content generation",
      "Document processing for supported study materials",
      "Authentication and user account functionality",
      "Notion integration",
      "Stripe-based payment integration for freemium functionality",
    ],

    tech: [
      "React",
      "JavaScript",
      "Google Gemini API",
      "Notion API",
      "PDF",
      "DOCX",
      "Authentication",
      "Stripe",
    ],

    features: [
      "AI-powered quiz generation",
      "Study material to quiz conversion",
      "Text-based learning content generation",
      "PDF document support",
      "DOCX document support",
      "Notion integration",
      "User authentication",
      "Freemium subscription model",
      "Stripe payment integration",
    ],

    challenges: [
      "Transforming unstructured study material into useful learning content",
      "Integrating an external generative AI API",
      "Handling different study material formats",
      "Designing a freemium learning application",
    ],

    github: "",

    live: "",

  },
];
