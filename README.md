# 🦷 Dental Care Clinic

Sistem manajemen klinik gigi & booking appointment berbasis **React (Vite)**.

**Tech Stack:** React · React Router · Tailwind CSS · Shadcn UI · React Icons

## ✨ Fitur Utama
- 🔐 Autentikasi aman via Laravel Sanctum
- 🛡️ Protected routes dengan intent-based redirection
- 📅 Form booking interaktif (date picker, timeslot, anti double-booking)
- 📱 Responsive, mobile-first

## 🚀 Instalasi
```bash
git clone https://github.com/yosefflanes/dental-clinic-app.git
cd dental-clinic-app

# Frontend
npm install
echo "VITE_API_URL=http://localhost:8000/api" > .env
npm run dev

## 🔑 Akun Demo
| Role  | Email             | Password  |
|-------|-------------------|-----------|
| Admin | admin@example.com | admin123  |
| User  | user@example.com  | user123   |
