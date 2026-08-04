# 💍 eWedding — Digital Wedding Invitation Platform

A modern, full-featured digital wedding invitation platform built with **Next.js 15**. Create beautiful, mobile-first wedding invitation cards with RSVP, gift registry, guest management, visual design builder, and a powerful admin panel — fully in English.

<!-- ## 📸 Preview

![Preview](images/New%20Ver/panel%20mode.gif)
![Preview](images/New%20Ver/live%20website.gif) -->

## ✨ Features

### 🎉 eCard Invitation
- **Gate Screen** — Animated cover page with door opening animation and couple names
- **Invitation Hero** — Elegant wedding card with event details
- **Parents Section** — Family names with beautiful typography
- **Countdown Timer** — Live countdown to the wedding day
- **Programme / Event Schedule** — Scrollable event timeline
- **Gallery & Wishes** — Photo gallery with public wish board
- **Closing Screen** — Thank-you message with optional photo
- **Floating Navigation** — Quick access to RSVP, Calendar, Contact, Location, Money Gift, and Gift Registry
- **Light/Dark Theme** — Adaptive theme support

### ✨ Visual Design Builder Tab (`✨ Design Builder`) `[🧪 Experimental]`
- **🎬 Page Transition Effects [🧪 Experimental]** — 12 entrance transitions (Soft Fade, Slide Up, Slide Left, Zoom In, Page Turn 3D, Curtain Reveal, Blur Reveal, Float Up, Split Reveal, Glow Pulse, Bounce In) with live hover preview and ON/OFF enable/disable toggles per section.
- **🖼️ Decorative Frames & Borders [🧪 Experimental]** — 12 custom border frame styles (Gold Ornate, Regal Floral, Vintage Corner, Minimal Line, Soft Shadow, Arch Frame, etc.) with custom color pickers and line thickness sliders.
- **🖋️ Typography & Google Fonts [🧪 Experimental]** — Preset font pairings and Google Font dropdown selectors for Headings, Script Accents, and Body text.
- **🖼️ Background Darkness & Overlay [🧪 Experimental]** — Custom opacity sliders and color pickers for section background overlays.

### 🎥 iPhone 17 Pro Video & Screen Recorder `[🧪 Experimental]`
- Automatic video recording tool designed to record high-resolution MP4/WebM videos of mobile eCard invitations inside an iPhone 17 Pro mockup frame.
- Custom duration control, frame formatting, and high-quality audio recording integration.

### 💌 Guest Wish Record Manager (`💌 Wishes Record`)
- Dedicated management tab for guest wishes submitted via "Send Wish".
- Quick Stats Bar (Total Wishes, Visible Live, Hidden Messages) and filtering tabs (`All`, `Visible`, `Hidden`).
- **`👁️ Show / 🙈 Hide` Toggle**: Instantly hide inappropriate or malicious public messages from displaying on live website.
- Inline editing, deletion, and manual wish creation.

### 🎁 Gift Registry
- Couple-curated gift list with product images and prices
- Guest can suggest new gifts with link, image, and price
- **Smart Image Scraper** — Auto-fetch product images from Shopee, Lazada, Amazon, eBay, etc.
- **Search Engine Fallback** — If direct scraping fails, falls back to Yahoo Image search
- **Price Scraper** — Auto-extract prices from product URLs
- Full-screen lightbox photo viewer

### 💰 Money Gift
- Bank account details with QR code support
- Direct QR image upload from device

### 📋 RSVP System
- Guest RSVP with attendance confirmation and pax count
- Real-time RSVP statistics in admin panel

### 🔧 Admin Panel | Couple Panel (`/admin`)
- Full wedding configuration editor
- Theme & Visual Design Builder customization
- Section visibility toggles
- Dedicated Wish Messages Record manager (`💌 Wishes Record`)
- Gift management with image/price scrapers and settings
- RSVP list and statistics
- Bank & QR code management

### 👑 Super Admin Panel (`/super-admin`)
- Multi-couple account management & creation with subscription packages
- **Granular Feature Toggles**: Enable/disable feature modules (RSVP, Money, Gift, Gallery, Programme, Contacts, Location, Visual Builder, Music, Text Overrides) AND live section displays per couple.
- Global Text Editor (Admin/Login) with default system language control & custom `.json` language import.
- Financial tracker & account status management.

## 🆕 Recent Updates
- **Visual Design Builder `[🧪 Experimental]`**: Added 🎬 Page Transition Effects, 🖼️ Decorative Frames, 🖋️ Custom Typography, and 🖼️ Overlay Controls with instant live iframe hover previews and individual ON/OFF disable toggles.
- **🎥 iPhone 17 Pro Video Recorder `[🧪 Experimental]`**: Pop-up video recorder tool featuring iPhone 17 Pro mockup frame and audio capture.
- **💌 Dedicated Wish Record Manager (`💌 Wishes Record`)**: Full moderation suite (View, Edit, Delete, Manual Add, and Hide/Unhide toggle) to prevent malicious or unwanted guest wishes on live invitations.
- **👑 Granular SuperAdmin Feature Module & Live Section Toggles**: Complete control per couple account to toggle feature modules and live invitation screens on or off.
- **🌐 English-First & Custom JSON Language Support**: Default primary language set to English, with SuperAdmin capability to import custom `.json` language files.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/ewedding.git
cd ewedding

# Install dependencies
npm install

# Set up the database
cp data/db.example.json data/db.json

# Run the development server
npm run dev
```

Open [http://localhost:3000/demo](http://localhost:3000/demo) to see the demo invitation.

### First-Time Setup

1. Copy `data/db.example.json` → `data/db.json`
2. Run `npm run dev`
3. Visit `/super-admin` to set up the super admin password
4. Create couple accounts from the super admin panel
5. Each couple logs in at `/admin` to customise their invitation

## 📁 Project Structure

```
ewedding/
├── app/
│   ├── [coupleId]/        # Dynamic invitation pages
│   ├── admin/             # Couple admin panel
│   ├── super-admin/       # Super admin panel
│   ├── login/             # Login page
│   └── api/               # API routes
│       ├── couple/        # Couple CRUD, upload, gifts, wishes
│       ├── invitation/    # Public invitation data
│       ├── scrape-link/   # Product image scraper
│       ├── scrape-price/  # Product price scraper
│       ├── search-image/  # Yahoo image search fallback
│       ├── search-price/  # Yahoo price search fallback
│       └── super-admin/   # Super admin API
├── components/
│   ├── admin/             # Admin tabs & iPhone Recorder Modal
│   ├── invitation/        # Invitation section components & SectionFrame
│   ├── nav/               # Floating navigation
│   └── popups/            # Modal popups (RSVP, Gift, etc.)
├── data/
│   └── db.example.json    # Database template (copy to db.json)
├── lib/
│   ├── db.ts              # Database read/write utilities
│   ├── i18n.ts            # Admin & Live dictionary definitions
│   ├── transitions.ts     # 12 Page Transition Effect presets
│   ├── decorations.ts     # 12 Border Frame presets
│   ├── typography.ts      # Font pairings & Google Fonts
│   └── themes.ts          # Theme definitions
├── hooks/                 # Custom React hooks
└── public/
    ├── themes/            # Theme assets
    └── uploads/           # User-uploaded files
```

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Vanilla CSS with CSS Variables
- **Auth**: bcryptjs password hashing
- **Database**: JSON file-based (no external DB required)
- **Image Processing**: Built-in scraper APIs

## 📄 License & Disclaimer

This project is free for **non-commercial use only**. Any commercial use, redistribution, or deployment for commercial purposes is strictly prohibited unless prior written agreement and explicit permission are granted by the project owner.

## 📸 Screenshots

**Panel**
<details>
<summary>Click to expand Panel Screenshots</summary>

![Preview](images/New%20Ver/1.png)
![Preview](images/New%20Ver/2.png)
![Preview](images/New%20Ver/3.png)
![Preview](images/New%20Ver/4.png)
![Preview](images/New%20Ver/5.png)
![Preview](images/New%20Ver/6.png)
![Preview](images/New%20Ver/7.png)
![Preview](images/New%20Ver/8.png)
![Preview](images/New%20Ver/9.png)
![Preview](images/New%20Ver/10.png)
![Preview](images/New%20Ver/11.png)
![Preview](images/New%20Ver/12.png)
![Preview](images/New%20Ver/13.png)
![Preview](images/New%20Ver/14.png)
![Preview](images/New%20Ver/15.png)
![Preview](images/New%20Ver/16.png)
</details>

**Live Web**
<details>
<summary>Click to expand Live Web Screenshots</summary>

![Preview](images/New%20Ver/L1.png)
![Preview](images/New%20Ver/L2.png)
![Preview](images/New%20Ver/L3.png)
![Preview](images/New%20Ver/L4.png)
![Preview](images/New%20Ver/L5.png)
![Preview](images/New%20Ver/L6.png)
![Preview](images/New%20Ver/L7.png)
![Preview](images/New%20Ver/L8.png)
![Preview](images/New%20Ver/L9.png)
![Preview](images/New%20Ver/L10.png)
![Preview](images/New%20Ver/L11.png)
![Preview](images/New%20Ver/L12.png)
![Preview](images/New%20Ver/L13.png)
![Preview](images/New%20Ver/L14.png)
![Preview](images/New%20Ver/L15.png)
</details>
