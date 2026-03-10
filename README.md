# 🌸 Sakura Personal Portfolio - Web Edition

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-blue)
![License](https://img.shields.io/badge/License-MIT-green)

> A dynamic, multilingual personal portfolio platform with an integrated Admin Dashboard and Dual-Core AI Assistant, built with Next.js.

---

## 📸 Preview

![Homepage Preview](./public/screenshots/homepage.png)

> Screenshot should include:
> - Sakura theme
> - AI chatbot opened
> - Background animation visible

---

# 🧠 Overview

Sakura Personal Portfolio is a dynamic full-stack portfolio system designed as:

- A professional online CV platform
- A Headless CMS backend for Android apps
- A centralized database-driven content system
- An AI-enhanced interactive experience

---

# ❗ Problem Statement

Traditional portfolio websites are:

- Hardcoded
- Static
- Hard to update
- Not scalable across platforms

This project introduces:

- Dynamic database content
- Centralized backend API
- Cross-platform synchronization

---

# ✨ Core Features

## 🌍 Multilingual System
- English
- Vietnamese
- Japanese

## 🛠 Dynamic Content Management
- Hero
- About
- Skills
- Experience
- Contact
- Blog & Projects (CRUD)

## 🤖 Dual-Core AI Chatbot
- Sakura Mode (Friendly personality)
- Hacker Mode (Logical personality)

---

## 🎨 UI Modes

| Sakura Mode | Hacker Mode |
|-------------|-------------|
| ![](./public/screenshots/sakura.png) | ![](./public/screenshots/hacker.png) |

---

## 🧩 Admin Dashboard

- Secure admin route
- Manage sections
- Manage blog posts
- Real-time updates

---

## 🔐 Admin Panel Preview

![Admin Dashboard](./public/screenshots/admin_login.png)

![Admin Blogs](./public/screenshots/admin_blogs.png)

![Admin Sections](./public/screenshots/admin_sections.png)

---

# 🏗 Architecture

## High-Level Architecture

```
Client
  ↓
Next.js (App Router)
  ↓
Server Actions / API Routes
  ↓
Prisma ORM
  ↓
PostgreSQL
```

![Architecture Diagram](./public/screenshots/architecture.png)

---

# 🛠 Tech Stack

| Category | Technology |
|----------|------------|
| Language | TypeScript |
| Framework | Next.js |
| Styling | Tailwind CSS |
| Animation | Framer Motion |
| Database | PostgreSQL |
| ORM | Prisma |
| Deployment | Vercel |

---

# ⚙ Installation

## Prerequisites

- Node.js >= 18
- PostgreSQL
- npm or yarn

## Clone Repository

```bash
git clone https://github.com/VuTriDung1123/Personal_Portfolio_VuTriDung_Sakura_DynamicWeb
cd Personal_Portfolio_VuTriDung_Sakura_DynamicWeb
```

## Install Dependencies

```bash
npm install
```

## Setup Database

```bash
npx prisma generate
npx prisma db push
```

## Run Development Server

```bash
npm run dev
```

Visit:

```
http://localhost:3000
```

---

# 🔧 Environment Variables

Create `.env` file:

```
DATABASE_URL="postgresql://user:password@localhost:5432/sakuradb"
ADMIN_PASSWORD="your_secure_password" (Not show)
GEMINI_API_KEY="your_api_key_here" (Not show)
```

---

# ▶ Usage

## User Mode
- Visit homepage
- Switch language
- Toggle theme
- Chat with AI assistant

## Admin Mode
- Visit `/admin`
- Login with ADMIN_PASSWORD
- Manage content dynamically

---

# 🌐 API Documentation

## GET /api/sections?key={section_key}

```json
{
  "id": "cuid",
  "sectionKey": "hero",
  "contentEn": "...",
  "contentVi": "...",
  "contentJp": "..."
}
```

---

## GET /api/posts

```json
[
  {
    "id": "uuid",
    "title": "DuckTrack App",
    "tag": "uni_projects",
    "language": "vi",
    "createdAt": "2026-02-13T00:00:00Z"
  }
]
```

---

# 🚀 Performance

- Server Components reduce client JS
- Optimized images via Next/Image
- Database indexing
- Efficient SSR rendering

## 📊 Lighthouse Score

### 💻 Desktop
![Desktop](./public/screenshots/lighthouse-desktop.png)

### 📱 Mobile
![Mobile](./public/screenshots/lighthouse-mobile.png)

---

# 🔐 Security

⚠ Admin currently uses static password via environment variable.  
For production:

- Use NextAuth/Auth.js
- Add CSRF protection
- Implement role-based access control

Prisma protects against SQL Injection by default.

---

# 🗺 Roadmap

- Android App integration
- Markdown blog editor
- Analytics dashboard
- Cloud image upload

---

# ⚠ Limitations

- No built-in image upload
- Public read-only APIs
- AI depends on third-party API

---

# 📜 License

MIT License

---

# 👤 Author

Vũ Trí Dũng  
GitHub: https://github.com/VuTriDung1123  
Email: dungvutri25@gmail.com  

---

⭐ If you find this project useful, please give it a star.
