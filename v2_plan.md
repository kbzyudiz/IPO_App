# IPO Watch V2 - Implementation Plan

## 1. Objective
Build a next-generation "Version 2" of the IPO application, retaining the robust scheduling and scraping logic from V1 but completely replacing the User Interface with a "Premium", "Wow-factor" design.

## 2. Migration Strategy
To ensure safety and reversibility:
1.  **Backup**: Rename the current `src` folder to `src_v1`.
2.  **Initialize**: Create a fresh `src` directory.
3.  **Port Logic**: Copy the essential logic modules directly to V2:
    *   `src/data/` (Services, Store, Scraper)
    *   `src/core/` (Types)
4.  **Clean Slate**: All UI components (`presentation/`) will be built from scratch.

## 3. Design System: "Neo-Fintech"
The new UI will focus on **Trust**, **Speed**, and **Clarity**.

### 3.1. Visual Identity
*   **Theme**: Deep Dark Mode (Default).
*   **Background**: Subtle mesh gradients (dark blues/purples) to give depth, not flat black.
*   **Glassmorphism**: Heavy use of `backdrop-filter: blur()` for cards and overlays to create hierarchy.
*   **Typography**:
    *   *Headings*: **Outfit** or **Space Grotesk** (Modern, geometric).
    *   *Body*: **Inter** (Clean, highly readable).
*   **Micro-interactions**: Framer Motion for list staggering, page transitions, and button presses.

### 3.2. Color Palette
*   **Canvas**: `#0B0C10` (Rich Black)
*   **Surface**: `rgba(255, 255, 255, 0.05)` (Glass)
*   **Primary**: `#6366F1` (Indigo Neon) -> Gradient to `#8B5CF6`
*   **Success**: `#10B981` (Emerald) for GMP/Profits
*   **Critical**: `#EF4444` (Red) for Closed/Loss

## 4. Architecture & Features

### 4.1. The "Pulse" Dashboard (Home)
*   **Hero Section**: A "Cover Flow" or horizontal scroll of **Active IPOs** with a countdown timer.
*   **Live Ticker**: Scrolling marquee of latest GMP changes at the top.
*   **Quick Actions**: Floating Action Button (FAB) for "Check Allotment".

### 4.2. Smart Discovery
*   **Filters**: Pill-shaped filters for "SME", "Mainboard", "High GMP".
*   **Visual Status**: Color-coded glowing borders indicating status (Open = Green Glow).

### 4.3. Market Intelligence
*   **GMP Charts**: Sparkline graphs showing GMP trends over the last 5 days (using the historical logic).
*   **Subscription Bar**: Visual progress bars for subscription levels (Retail/QIB).

## 5. Execution Steps
1.  [ ] Rename `src` to `src_v1`.
2.  [ ] Setup new `src` structure and install animations library (`framer-motion`).
3.  [ ] Create `ThemeContext` and Global CSS modules.
4.  [ ] Port `data` and `core` layers.
5.  [ ] Build `AppLayout` (Shell).
6.  [ ] Implement `HomeScreen` (The "Wow" factor).
