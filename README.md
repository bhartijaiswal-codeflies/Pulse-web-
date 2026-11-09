# Pulse - Modern Employee Management Dashboard

A modern, responsive Employee Management Dashboard built with **React 18**, **Tailwind CSS**, and **Vite**, designed following the visual design system of enterprise CRM applications.

![Pulse HR Dashboard](public/logo.png)

---

## 🌟 Key Features & Modules

### 1. 📊 Executive Dashboard (`/`)
- **Synchronized 3-Column Grid**: Balanced baseline alignment across all widget rows.
- **On Leave Today (2-Row Span)**: Team time-off roster with absence category chips, leave types, and a direct *"+ Apply Leave"* interactive modal.
- **CheckIns & Time Tracker**: Live digital punch clock (`HH:MM:SS`), shift progress indicator (`72% of 8h 00m`), work location selector (*In Office*, *Remote*, *Client Site*), and Web Punch In/Out button.
- **Celebrating Birthday**: Circular avatar display, celebration dates, and one-click congratulations kudos.
- **Celebrating Work Anniversary**: Avatars with milestone service badges (e.g. 5, 3, 2 years) and recognition actions.
- **Working Remotely**: Remote workforce roster with live geo-locations and shift start times.
- **Inbox Leave Requests**: Pending leave approvals inbox with quick *Approve* and *Reject* actions.
- **Upcoming Holidays (2-Column Span)**: 3 festive cards displayed side-by-side (Thanksgiving, Day After Thanksgiving, Winter Break & Christmas) with badges and countdowns.

### 2. ⏱️ Attendance Management (`/attendance`)
- Daily check-in and check-out logs with duration and work locations.
- Tabular record view with status filters (*On Time*, *Late*, *On Leave*).
- Monthly attendance calendar view.
- CSV report export action.

### 3. 🎯 Candidate Management (`/candidates`)
- Recruitment pipeline tracking (*Screening*, *Interview*, *Offered*, *Hired*, *Archived*).
- Candidate cards with ratings, experience, interview schedules, and contact info.
- Interactive *"+ Add Candidate"* modal with form validation.

### 4. 💳 My Finances (`/finances`)
- Salary breakdown and annual compensation overview.
- Monthly payslips list with simulated PDF download.
- Expense claims tracking and *"+ Submit Expense Claim"* modal.

### 5. 👥 User Management (`/users`)
- Employee directory with search and department filtering (*Engineering*, *Design*, *Marketing*, *People Ops*).
- Active/Inactive employee status toggles.
- Add Employee and Edit Employee modals.
- Detailed Employee Profile drawer.

### 6. 💻 Asset Management (`/assets`)
- Hardware inventory tracking (*MacBook Pros*, *Displays*, *Headphones*, *Phones*).
- Asset assignment and return status workflow.
- **Firebase Cloud Import**: Simulated data sync with realistic network latency, loading spinner, and error handling toggle.

### 7. 📅 Organization Calendar (`/calendar`)
- Multi-view calendar supporting **Month**, **Week**, and **Day** views.
- Category filters for *Company Events*, *Holidays*, *Birthdays*, and *Anniversaries*.
- Schedule event modal.

### 8. 👤 My Profile (`/profile`)
- Employee information, role placement, and contact info.
- Account settings with Two-Factor Authentication (2FA) and notification preferences.
- Interactive Edit Profile modal.

---

## 🎨 Design System

- **Font Family**: Plus Jakarta Sans primary, Inter secondary:
  ```css
  font-family: "Plus Jakarta Sans", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  ```
- **Color Palette**:
  - Sidebar: `#060A18` / `#080D20`
  - Primary Blue: `#2563EB`
  - Page Background: `#F7F9FC`
  - Card Background: `#FFFFFF`
  - Primary Text: `#172033`
  - Secondary Text: `#8292AD`
  - Borders: `#E5EAF2`
  - Status Accents: Emerald (`#10B981`), Amber (`#F59E0B`), Rose (`#EF4444`)
- **Navigation Sidebar**: 76px compact rail, 46px circular glowing brand logo, 62x54px tiles with 10px labels and notification badges.
- **Top Header**: Minimal white header with `[⌘K]` search shortcut, current date display, notification dropdown, and user profile avatar.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18.0 or higher
- npm 9.0 or higher

### Installation
```bash
# Clone repository
git clone https://github.com/codefliestech/Pulse-Web-Admin.git

# Navigate to project directory
cd Pulse-Web-Admin

# Install dependencies
npm install
```

### Development
```bash
# Start local Vite development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application in your browser.

### Production Build
```bash
# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 📁 Project Structure

```text
Pulse/
├── public/
│   └── logo.png              # Brand icon
├── src/
│   ├── assets/               # Static assets
│   ├── components/
│   │   ├── common/           # DataTable, Modal, PageHeader, SearchBar, StatusBadge
│   │   ├── dashboard/        # OnLeaveTodayWidget, CheckInsCard, BirthdaysCard, etc.
│   │   └── layout/           # Sidebar, Header, MobileDrawer, MainLayout
│   ├── context/              # NotificationContext (Toast Alert System)
│   ├── data/                 # mockData.js (Employees, candidates, attendance, assets, finances)
│   ├── pages/                # Dashboard, Attendance, Candidates, MyFinances, Users, Assets, Calendar, Profile
│   ├── services/             # employeeService, attendanceService, candidateService, financeService, assetService
│   ├── App.jsx               # React Router configuration
│   ├── index.css             # Tailwind utilities & custom scrollbar styles
│   └── main.jsx              # React DOM entry point
├── index.html                # App HTML template with Plus Jakarta Sans web fonts
├── tailwind.config.js        # Custom colors, fonts & box shadows
└── vite.config.js            # Vite build configuration (Port 3000)
```

---

## 📄 License
This project is proprietary and confidential. Developed by Codeflies.

