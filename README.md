# 🚀 IPO Watch - Phase 1

Modern, premium IPO tracking application built with React, Vite, and Zustand.

## 📱 Features (Phase 1)
- **Live IPO Listings**: Fetched from multiple status endpoints (Open, Upcoming, Announced, Closed).
- **Premium UI/UX**: Dark theme, glassmorphism, and smooth animations using Framer Motion.
- **Detailed Analytics**: Market overview and sector performance tracking.
- **Local Watchlist**: Track your favorite IPOs without any login.
- **Profile Management**: Local profile with editable details and app preferences.
- **Safe & Compliant**: Includes mandatory disclaimers and Play Store policy adherence.

## 📡 APIs Consumed
The app normalizes and merges data from:
- `https://api.ipoalerts.in/ipos?status=open`
- `https://api.ipoalerts.in/ipos?status=upcoming`
- `https://api.ipoalerts.in/ipos?status=announced`
- `https://api.ipoalerts.in/ipos?status=closed`

## 🛠 Tech Stack
- **Framework**: React 18 (TypeScript)
- **Build Tool**: Vite
- **Styling**: Custom CSS with Glassmorphism
- **State**: Zustand (with Persist middleware)
- **Icons**: Lucide React
- **Animations**: Framer Motion

## 🚀 How to Run Locally
1. **Install Dependencies**:
   ```bash
   npm install
   ```
2. **Start Development Server**:
   ```bash
   npm run dev
   ```
3. **Build for Production**:
   ```bash
   npm run build
   ```

## 📦 Mobile Implementation (APK)
This project is structured to be easily wrapped into an Android APK using **Capacitor**. 
To generate an APK:
1. Install Capacitor: `npm install @capacitor/core @capacitor/cli @capacitor/android`
2. Initialize: `npx cap init`
3. Add Android: `npx cap add android`
4. Sync & Open: `npx cap sync && npx cap open android`
5. Build APK in Android Studio.

---
*Created by IPO Watch AI Agent - Phase 1*
