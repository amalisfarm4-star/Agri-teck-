
# 🌱 AGRI-INTELLIGENCE SYSTEM 360°

The world's most advanced agricultural platform integrating AI, IoT, and comprehensive farm management.

## 🏗️ Tech Stack

*   **Framework:** [Next.js 14](https://nextjs.org/) (App Router, Server Components)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS + Lucide React
*   **Database & Auth:** [Supabase](https://supabase.com/)
*   **AI Core:** Google Gemini 2.5 Flash & 3 Pro (via `@google/genai`)
*   **Mobile:** React Native / Expo (in `/mobile` folder)
*   **3D Visualization:** Three.js / React Three Fiber

## 🚀 Getting Started

### 1. Installation

```bash
npm install
# or
pnpm install
```

### 2. Environment Configuration

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Fill in your keys:
*   `GEMINI_API_KEY`: Get from [Google AI Studio](https://aistudio.google.com/)
*   `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase Project URL
*   `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase Public Key

### 3. Database Setup (Supabase)

Run the SQL scripts provided in the documentation to create the following tables:
*   `users`, `farms`, `fields`
*   `sensors`, `irrigation_zones`
*   `invoices`, `transactions`
*   `marketplace_listings`
*   `notifications`
*   `digital_twin_config`

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## 📱 Mobile App

The mobile application is located in the `/mobile` folder.

```bash
cd mobile
npm install
npx expo start
```

## 📂 Project Structure

```
/app
  /(main)           # Protected routes with Sidebar
    /dashboard      # AI Farm Overview
    /vision         # Crop Diagnosis
    /irrigation     # Smart Water Management
    /digital-twin   # 3D Farm Simulation
    /accounting     # OCR & Ledger
    /marketplace    # B2B Commerce
    /grants         # Business Plan Generator
  /api              # Server-side API Routes
    /ai             # Centralized AI Endpoints
/components         # Reusable UI Components
/lib
  ai.ts             # Central AI Service (Gemini)
  supabase.ts       # Database Client
  i18n-context.tsx  # Localization Provider
/locales            # Translation JSONs
/mobile             # Expo React Native App
```

## 🚢 Deployment

This project is optimized for **Vercel**.

1.  Push to GitHub.
2.  Import project in Vercel.
3.  Add Environment Variables (`GEMINI_API_KEY`, etc.).
4.  Deploy.
