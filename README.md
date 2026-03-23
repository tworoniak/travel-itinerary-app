# ✈️ Horizons — Travel Itinerary Planner

Horizons is a full-stack travel itinerary planning app built with React, TypeScript, Tailwind CSS, and Supabase. It allows users to create trips, organize daily activities in a drag-and-drop timeline, track travel budgets, and get AI-powered activity suggestions — all in a clean, responsive interface.

The project focuses on thoughtful UX, modern full-stack architecture, and scalable component design.

---

## 🚀 Live Demo

[horizons — travel-itinerary-app-alpha.vercel.app](https://travel-itinerary-app-alpha.vercel.app)

---

## ✨ Features

### 🔐 Auth & User Accounts

- Email/password sign up and sign in via Supabase Auth
- Protected routes — unauthenticated users are redirected to login
- Row Level Security ensures users only access their own data
- Avatar dropdown with sign out in the navbar

### 🧳 Trip Management

- Create, edit, and delete itineraries
- Track destination, dates, travelers, budget, currency, and trip notes
- Cover image support per trip
- Trip status: Planning, Confirmed, In Progress, Completed

### 📅 Timeline-Based Planning

- Day-by-day activity timeline auto-generated from trip dates
- Add, edit, and remove activities per day
- Drag-and-drop reordering of untimed activities (dnd-kit)
- Timed activities sorted automatically by time
- Support for activity type, location, reservation number, cost, and notes

### 💰 Budget Tracking

- Track planned spending per activity
- Trip-level budget overview with remaining balance
- Visual budget progress bar
- Cost breakdown donut chart by activity category (Recharts)

### 🤖 AI Activity Suggestions

- "Suggest Activities" powered by the Anthropic Claude API
- Context-aware suggestions based on destination and existing activities
- Proxied securely through a Supabase Edge Function
- Add suggestions directly to any day with one click

### 🎨 Modern UI

- Built with shadcn/ui, Radix UI, and Tailwind CSS
- Loading skeletons on the dashboard and detail page
- Sticky trip toolbar with mobile-responsive layout
- Responsive design with mobile navigation menu

### 🔔 UX Enhancements

- Confirmation dialogs before deleting trips or activities
- Toast notifications for all user actions
- Empty states and error states throughout
- Scroll-to-top button on long pages

---

## 🛠 Tech Stack

| Layer       | Technology                                       |
| ----------- | ------------------------------------------------ |
| Frontend    | React 19, TypeScript, Vite                       |
| Routing     | React Router v7                                  |
| Styling     | Tailwind CSS, shadcn/ui, Radix UI                |
| Forms       | React Hook Form, Zod                             |
| Drag & Drop | dnd-kit                                          |
| Charts      | Recharts                                         |
| Backend     | Supabase (Auth, PostgreSQL, RLS)                 |
| AI          | Anthropic Claude API via Supabase Edge Functions |
| Deployment  | Vercel                                           |

---

## 🏗 Architecture

The frontend is a React + TypeScript SPA with a feature-first folder structure. All Supabase calls are centralized in a single API module with camelCase/snake_case mappers keeping the app layer decoupled from the database schema.

Auth state is managed via a `useAuth` hook that subscribes to Supabase session changes. Row Level Security policies enforce data isolation at the database level — no user can read or write another user's data.

AI suggestions are proxied through a Supabase Edge Function to keep the Anthropic API key server-side. The function receives the destination and existing activity titles to generate context-aware recommendations.

---

## 🎯 Project Goals

This project was built to explore:

- Full-stack React + TypeScript + Supabase architecture
- Auth and data isolation with Row Level Security
- Practical UX patterns for real-world applications
- AI feature integration via secure server-side proxying
- Building portfolio-quality products end to end

---

## 📌 Planned Improvements

- Drag items between days
- Cover image upload to Supabase Storage
- Shareable read-only trip links
- OAuth login (Google / GitHub)
- Trip duplication
- Export itinerary as PDF
- Map integration for destinations
