# ⚙️ PromptForge Studio  
### 🧠 _AI Prompt Engineering Workbench with Real-Time LLM Comparison_

🔗 **Live Demo:** [https://promptforge-studio.vercel.app](https://promptforge-studio.vercel.app)

![App Preview](./screenshots/compare-models.png)

---

## 🚀 Overview

**PromptForge Studio** is a full-stack **Prompt Management and AI Testing Platform** built with **React, Supabase, and OpenAI API**.  
It enables AI engineers and developers to **create, organize, version, and compare prompts** across multiple LLMs — all in one clean, interactive dashboard.

---

## 🧠 Key Features

✅ **Secure Authentication (Supabase)** — Email-based login & logout  
✅ **Prompt Management** — Create, edit, and delete reusable prompt templates  
✅ **Automatic Version Control** — Each prompt version is saved for comparison  
✅ **AI Model Comparison** — Run the same prompt on `GPT-4o-mini` and `GPT-4-turbo`  
✅ **Visual Diff Viewer** — Highlights response differences side-by-side using Diff2Html  
✅ **Clean & Responsive UI** — Built with Tailwind CSS and React Hooks  
✅ **Real-Time Feedback** — Instant toast notifications for all actions  

---

## 🧰 Tech Stack

| Layer | Tools |
|-------|--------|
| **Frontend** | React 19, TypeScript, Tailwind CSS |
| **Backend / DB** | Supabase (PostgreSQL + Auth) |
| **AI Integration** | OpenAI API |
| **Utilities** | Diff2Html, React Hot Toast |
| **Deployment** | Vercel (Production), Localhost (Development) |

---

## ⚙️ Setup & Installation

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/Vipsa28/promptforge-studio.git
cd promptforge-studio

2️⃣ Install Dependencies
npm install --legacy-peer-deps

3️⃣ Create a .env File in the Project Root
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_OPENAI_API_KEY=your_openai_api_key


⚠️ Make sure your .env file is listed in .gitignore before committing to GitHub.

4️⃣ Start the App (Development)
npm run dev


Open http://localhost:5173
 to view the app locally.