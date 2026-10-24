# WASLA (وَصْلَة) — Comprehensive App Documentation & Architecture Overview

> **Version:** 2.4.0 (Production Release)  
> **Brand:** WASLA (وَصْلَة) — Formerly FARZA  
> **Target Market:** Yemen Intercity Travel (Toyota Hilux Fleet & Shared Intercity Transport)  
> **Theme:** Royal Blue (`#0056B3`), Electric Blue (`#007AFF`), Charcoal Dark (`#202633`), Pure White (`#FFFFFF`)

---

## 1. System Architecture

### 1.1 Technical Stack
* **Framework:** React 19 + TypeScript (SPA on Vite)
* **Styling & Design System:** Tailwind CSS v4, Lucide React icons, Motion (Framer Motion)
* **PWA & Offline:** Service Worker, Web App Manifest (`manifest.json`), Apple Touch Icons (`?v=3` cache-busted), `window.addEventListener('online'/'offline')` detection
* **State Management:** React Top-Level State (`useState`, `useEffect`), Browser History Navigation API (`pushState`, `popState`), and Session Storage for Admin Auth Gates.

---

### 1.2 Component Hierarchy & Screen Architecture

```
App.tsx (Root Shell & Router)
│
├── SplashScreen.tsx (10s Cinematic Intro: GPS Vector Map, Toyota Hilux Fleet, Wasla Logo, Skip Button)
│
├── Header.tsx (Global Navigation Bar, Wasla Logo, Offline Badge, Support Direct, Role Switcher)
│
├── Main Workspace (Controlled by currentRole)
│   ├── [currentRole === null]
│   │   └── MainRoleSelectScreen.tsx (Hero, Passenger / Driver Cards, Feature Highlights, Support)
│   │
│   ├── [currentRole === 'passenger']
│   │   └── PassengerView.tsx
│   │       ├── Intercity Trip Search (From City -> To City, Date Filter)
│   │       ├── Trip Cards (Seats Left, Driver Rating, Toyota Hilux Details, Seat Pricing in YER)
│   │       ├── Seat Selection Modal (Front, Window, Rear Seat Picker)
│   │       └── My Bookings Tab (Trip Status, Direct Driver Chat, Rate Driver)
│   │
│   ├── [currentRole === 'driver']
│   │   └── DriverView.tsx
│   │       ├── Driver Profile & Verification Badge Status
│   │       ├── Publish Intercity Trip Form (Origin, Destination, Departure Time, Seat Price)
│   │       ├── Active Trips Management (Passenger Manifest, Pickup Points)
│   │       ├── Booking Requests (Accept / Reject)
│   │       └── 20% Platform Commission Submission (Kuraimi / Al-Najm / OneCash Transfer Receipt Upload)
│   │
│   └── [currentRole === 'admin']
│       └── AdminView.tsx (Gated with Admin Master Key Challenge)
│           ├── Overview Metrics (Total Platform Commissions in YER, Active Trips, Verification Queue)
│           ├── Driver Verification Queue (Civil ID, Driving License, Hilux Vehicle Plate)
│           ├── Commission Auditing (Verify Bank Transfer Reference Number, Approve/Reject)
│           └── System Settings & Emergency Announcement Banners
│
├── Modals & Overlays
│   ├── AuthLoginModal.tsx (Phone OTP with Yemen/Gulf Codes, Google OAuth, Apple Sign-In)
│   ├── ChatModal.tsx (End-to-End Chat Gated by Confirmed Booking / Commission Approval)
│   ├── CustomerSupportModal.tsx (Direct Call to 739992781, WhatsApp One-Tap Support)
│   ├── InstallIPhoneModal.tsx (Visual Step-by-Step PWA Add to Home Screen for iOS Safari)
│   ├── PrivacyCenterModal.tsx & PublicLegalPage.tsx (Privacy Policy, Terms of Service, Account Deletion)
│   ├── PassengerSettingsModal.tsx (Notification preferences, Favorite Cities, Seat Preferences)
│   ├── DriverSettingsModal.tsx (Vehicle Details, Plate Number Protection, Document Updates)
│   └── NotificationsModal.tsx (Real-time updates on Booking Confirmations, Approvals)
│
└── BottomNavBar.tsx (Persistent App Dock: الرئيسية, رحلاتي/حجوزاتي, الإشعارات, حسابي)
```

---

### 1.3 Database Architecture (Supabase / PostgreSQL Schemas)

#### PostgreSQL / Supabase Schema (DDL)
```sql
-- 1. Enum Types
CREATE TYPE user_role AS ENUM ('passenger', 'driver', 'admin');
CREATE TYPE driver_verification_status AS ENUM ('new', 'pending', 'verified', 'rejected', 'suspended');
CREATE TYPE booking_status AS ENUM (
  'pending_driver',
  'accepted_unpaid_commission',
  'commission_pending_verification',
  'confirmed',
  'rejected',
  'completed',
  'cancelled'
);
CREATE TYPE trip_status AS ENUM (
  'draft', 'published', 'active', 'full', 'in_transit', 'arrived', 'completed', 'cancelled'
);

-- 2. Profiles Table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'passenger',
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL UNIQUE,
  email TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Drivers Table
CREATE TABLE drivers (
  id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  national_id_number TEXT NOT NULL,
  verification_status driver_verification_status NOT NULL DEFAULT 'new',
  verified_badge BOOLEAN NOT NULL DEFAULT false,
  base_city TEXT NOT NULL,
  serviced_cities TEXT[] NOT NULL DEFAULT '{}',
  vehicle_model TEXT NOT NULL DEFAULT 'تويوتا هايلكس غمارة / غمارتين',
  vehicle_plate TEXT NOT NULL,
  vehicle_color TEXT NOT NULL,
  vehicle_year INT NOT NULL,
  total_seats INT NOT NULL DEFAULT 4,
  rating NUMERIC(3,2) NOT NULL DEFAULT 5.0,
  rating_count INT NOT NULL DEFAULT 0,
  completed_trips_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Trips Table
CREATE TABLE trips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id UUID NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,
  from_city TEXT NOT NULL,
  from_area TEXT NOT NULL,
  to_city TEXT NOT NULL,
  to_area TEXT NOT NULL,
  departure_date DATE NOT NULL,
  departure_time TIME NOT NULL,
  total_seats INT NOT NULL DEFAULT 4,
  available_seats INT NOT NULL DEFAULT 4,
  price_per_seat INT NOT NULL, -- in YER
  notes TEXT,
  status trip_status NOT NULL DEFAULT 'published',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Bookings Table
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  passenger_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  seats_count INT NOT NULL DEFAULT 1,
  seat_numbers INT[] DEFAULT '{}',
  price_per_seat INT NOT NULL,
  total_amount INT NOT NULL, -- in YER
  commission_amount INT NOT NULL, -- 20% of total_amount
  status booking_status NOT NULL DEFAULT 'pending_driver',
  payment_bank TEXT,
  payment_ref TEXT,
  payment_receipt_url TEXT,
  commission_paid_at TIMESTAMPTZ,
  commission_approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Messages Table (Chat)
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  sender_role user_role NOT NULL,
  text TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

#### Firebase / Firestore NoSQL Collections Structure
* `/profiles/{userId}`: `{ fullName, phone, role, avatarUrl, createdAt }`
* `/drivers/{driverId}`: `{ nationalIdNumber, verificationStatus, vehicle: { model, plateNumber, totalSeats }, rating, completedTrips }`
* `/trips/{tripId}`: `{ driverId, fromCity, toCity, departureTime, pricePerSeat, availableSeats, status }`
* `/bookings/{bookingId}`: `{ tripId, passengerId, seatsCount, totalAmount, commissionAmount, status, paymentRef, receiptUrl }`
* `/bookings/{bookingId}/messages/{messageId}`: `{ senderId, senderRole, text, timestamp, isRead }`
* `/settings/global`: `{ commissionRatePercent: 20, customerServicePhone: '739992781', splashDurationSeconds: 10 }`

---

## 2. User Flows & Features

### 2.1 Passenger User Flow
1. **Intro & Discovery:** User watches the 10-second cinematic intro (or clicks "تخطي المقدمة") and lands on `MainRoleSelectScreen`.
2. **Search:** Selects "دخول كراكب" -> Views available intercity routes (e.g., Sana'a to Aden, Taiz to Sana'a, Mukalla to Marib).
3. **Seat Selection:** Passenger picks specific seats in the Hilux cabin (Front Passenger Seat, Rear Window Seat, etc.).
4. **Booking Dispatch:** Request dispatched to Driver with status `pending_driver`.
5. **Confirmation & Direct Chat:** Once driver accepts and commission is cleared, direct passenger-driver phone coordinates and chat unlock.
6. **Trip Completion & Driver Rating:** Passenger rates driver after reaching the target city.

### 2.2 Driver User Flow
1. **Onboarding & Verification:** Driver registers with National ID, Driving License, and Toyota Hilux plate number. Status is marked `pending`.
2. **Trip Publishing:** Verified driver lists a new intercity route with departure date, pickup neighborhood, and seat price in Yemeni Rials.
3. **Booking Acceptance:** Driver receives booking alerts with passenger pickup details.
4. **20% Platform Commission Payment:** 
   - Driver transfers 20% platform commission via Kuraimi (`الكريمي مميز`) or Al-Najm exchange.
   - Driver enters the transfer reference number and attaches the receipt image.
5. **Admin Clearance & Trip Execution:** Once admin validates commission, driver proceeds with transit and passenger contact.

### 2.3 Staff / Administrator Flow
1. **Secure Admin Authentication Gate:**
   - The admin link is completely removed from public customer and driver views.
   - Access to the admin dashboard requires the Master Passkey (`Admin Master Key`).
   - Session token `wasla_admin_auth` is securely verified in `sessionStorage`.
2. **Verification Management:**
   - Approves / Rejects new driver applications with document previews.
3. **Commission Auditing:**
   - Audits incoming bank receipts against booking amounts, approving or rejecting with one click.
4. **Platform Control:**
   - Updates commission rate (default 20%), emergency contact number, and app banners.

---

## 3. State & Logic Management

### 3.1 Role Selection & Routing Strategy
The app uses a unified SPA router in `src/App.tsx`:
* `currentRole === null`: Main landing & role selection screen.
* `currentRole === 'passenger'`: Intercity trip search, seat booking, passenger history.
* `currentRole === 'driver'`: Driver fleet dashboard, trip dispatch, commission center.
* `currentRole === 'admin'`: Super admin management (requires passkey).

### 3.2 Deep Links & Hardware Back Button Handling
* **Browser History Integration:** Any modal opening or role navigation pushes a history state via `window.history.pushState({ modal, role }, '', url)`.
* **Hardware Back Button (`popstate`):** On Android or PWA swipe-back:
  1. Closes any open modal (Notifications, Support, Chat, Settings).
  2. If inside a role view (`passenger` or `driver`), smoothly returns to `MainRoleSelectScreen` without quitting the PWA.

### 3.3 Persistent Bottom Navigation Bar (Dock) & Auth Visibility Rule
* **Global Authentication Gate:** The Bottom Navigation Bar is hidden globally on unauthenticated sessions (`!isAuthenticated`). It only displays once the user completes phone verification (OTP) or OAuth login.
* Visible on main views for authenticated users, fixed to the bottom with high z-index and iOS safe-area support (`env(safe-area-inset-bottom)`).
* 4 tabs:
  1. **الرئيسية (Home):** Returns to main dashboard or search.
  2. **رحلاتي / حجوزاتي (Trips):** Displays active bookings count with live counter badge.
  3. **الإشعارات (Notifications):** Unread alerts on booking approvals and messages.
  4. **حسابي (Profile):** Opens profile, security, and preferences modal.
* **Auto-hiding / Smart Display:** Dock respects full-screen modals like Chat and Public Legal terms.

---

## 4. Enhanced UX & Core Features (v2.4.0)

### 4.1 Detailed Pickup & Drop-Off Assembly Points (الفرزات ونقاط التجمع)
* Passengers can specify both city and local assembly points (e.g., فرزة باب اليمن - جولة خولان ↔ الشيخ عثمان - جولة السفينة).
* Popular presets are mapped across Sana'a, Aden, Taiz, Ibb, Dhamar, Mukalla, Marib, and Hodeidah with datalist autosuggestion.

### 4.2 Interactive Toyota Hilux Cabin Seat Picker
* Visual cabin blueprint showing the Driver steering position alongside Front VIP Passenger Seat (مقعد المقدمة VIP رقم 1).
* Rear cabin displays Window Left (2), Center (3), and Window Right (4) seats with instant click selection and dynamic price totals.

### 4.3 Driver Dynamic Seat Management & Intermediate Stops
* **Dynamic Seat Stepper:** Drivers can increment (+) or decrement (-) available seats on active trips on the fly.
* **Intermediate Stops:** Drivers can specify milestones along routes (e.g., ذمار ← يريم ← إب ← لحج), visible on passenger search cards.

### 4.4 WhatsApp Trip Sharing & Safety (مشاركة الأمان)
* Dedicated button to format and share driver name, vehicle model (Hilux), car plate number, departure time, and emergency support (739992781) directly via WhatsApp.
