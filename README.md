# 🦷 Dental Clinic Management App (Frontend)

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)

A modern, responsive, and secure Single Page Application (SPA) built with **React, Vite, and Tailwind CSS** to serve as the user and admin interface for the Dental Clinic Management System. It features strict role-based access control, interactive appointment booking, service catalogs, and a comprehensive management dashboard.

---
## 🌐 Live Demo using Vercel
Experience the live application here:  
👉 **https://dental-clinic-lanz2.vercel.app/**

---

## ✨ Core Features

- **Strict Role-Based Routing (RBAC)**: 
  - Isolated access ensuring Patients cannot access Admin panels and vice versa.
  - Smart fallback routing that automatically redirects unauthorized users or typos to their designated areas.
- **Patient Portal**:
  - Interactive Home & Services catalog with real-time pricing and details.
  - Appointment booking system mapping doctors, dates, practice hours, and complaints.
  - Personal appointment history tracker (`/appointment/my`).
- **Admin Management Dashboard**:
  - Operational overview cards (Total Appointments, Estimated Revenue, Pending/Completed stats).
  - Top services analytics and full appointment lifecycle management.
- **Smooth UI/UX**:
  - Powered by *Lenis* for buttery-smooth scrolling experiences.
  - Fully responsive design optimized for both mobile screens and desktop monitors.
  - Clean styling using Tailwind CSS with Lucide React icons.

---

## 🛠️ Tech Stack

- **Library**: React 18+ (Vite bundler)
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM (v6) with Custom Protected Routes
- **Smooth Scroll**: Lenis React
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **UI Components**: Shadcn/UI (Radix UI primitives & Tailwind CSS)
  
---

## 🗂️ Route Structure & Security

| Path | Description | Access Level |
| :--- | :--- | :--- |
| `/` | Landing page & Public information | Public |
| `/services` | Clinic services list | Patient / User Only |
| `/appointment` | Book a new dental appointment | Patient / User Only |
| `/appointment/my` | View patient's booking history | Patient / User Only |
| `/admin/dashboard` | Main operational statistics & reports | Admin Only |
| `/admin/appointments` | Manage all patient appointments | Admin Only |
| `/admin/services` | Manage clinic services (CRUD) | Admin Only |

---

## 🚀 Getting Started (Installation)

Follow these instructions to run the frontend application locally.

### Prerequisites
- Node.js installed on your local machine (v16+ recommended)
- The backend API (`dental-clinic-api`) up and running locally or on a remote server.

### Step-by-Step Setup

1. **Clone the repository**
```bash
git clone [https://github.com/yosefflanes/dental-clinic-app.git](https://github.com/yosefflanes/dental-clinic-app.git)
cd dental-clinic-app
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**
Create a `.env` file in the root directory (or copy from `.env.example`) and configure your backend API URL:
```env
VITE_API_BASE_URL=http://localhost:8000/api
```

4. **Run the Development Server**
```bash
npm run dev
```
*The application will be accessible at `http://localhost:5173`*

