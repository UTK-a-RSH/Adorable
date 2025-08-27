<p align="center">
  <img src="public/logo1.svg" alt="Adorable Logo" width="150" />
</p>

# Adorable

Adorable is a modern, full-stack AI-powered project workspace and code sandbox platform. It features real-time collaboration, project management, code execution, and beautiful UI/UX built with Next.js, Prisma, Clerk, TRPC, and Shadcn UI. Designed for developers, teams, and AI agents to build, test, and manage projects efficiently.

---

## 🚀 Features
- **AI Agent Integration:** Run, test, and interact with AI agents in a secure sandbox.
- **Project Management:** Create, edit, and manage multiple projects with real-time updates.
- **Code Execution:** Safe, isolated code execution using E2B sandboxes.
- **Authentication:** Secure sign-in/sign-up with Clerk.
- **Usage Tracking:** Rate-limited API usage and project quotas.
- **Rich UI/UX:** Responsive, accessible, and themeable interface using Shadcn UI and Tailwind CSS.
- **Fragmented Code View:** Preview and explore code fragments and outputs.
- **Error Boundaries:** Robust error handling for a seamless experience.

---

## 🛠️ Tech Stack
- **Frontend:** Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, Shadcn UI
- **Backend:** Prisma ORM, PostgreSQL, TRPC, Clerk Auth, E2B Sandboxes
- **State/Data:** React Query, Zustand, SuperJSON
- **Other:** Framer Motion, Lucide Icons, Radix UI, LDRS loaders

---

## ⚙️ Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/UTK-a-RSH/Adorable.git
cd adorable/adorable
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory with the following variables:

```
# Database
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE

# Clerk Auth
CLERK_SECRET_KEY=your-clerk-secret-key
CLERK_PUBLISHABLE_KEY=your-clerk-publishable-key

# E2B Sandboxes
E2B_API_KEY=your-e2b-api-key

# OpenAI / Gemini (if using AI agents)
OPENAI_API_KEY=your-openai-api-key
GEMINI_API_KEY=your-gemini-api-key
```

> **Note:** Replace all placeholder values with your actual credentials.

### 4. Run Database Migrations
```bash
npx prisma migrate dev
```

### 5. Start the Development Server
```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

---

## 📁 Project Structure
- `src/app/` — Next.js app directory (pages, layouts, API routes)
- `src/components/` — UI components (Shadcn, custom, etc.)
- `src/modules/` — Feature modules (projects, messages, usage, etc.)
- `src/lib/` — Utilities, database, and usage logic
- `prisma/` — Prisma schema and migrations
- `public/` — Static assets (including `logo1.svg`)

---

## 📝 Contributing
Pull requests and issues are welcome! Please open an issue to discuss your ideas or report bugs.

---



