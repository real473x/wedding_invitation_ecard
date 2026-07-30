# 💍 eWedding — Digital Wedding Invitation Platform

A modern, full-featured digital wedding invitation platform built with **Next.js 15**. Create beautiful, mobile-first wedding invitation cards with RSVP, gift registry, guest management, and a powerful admin panel — all in Bahasa Melayu.

## 📸 Preview

<!-- Replace the placeholder paths below with your actual screenshot filenames -->
![Preview](images/New%20Ver/panel%20mode.gif)
![Preview](images/New%20Ver/live%20website.gif)

## ✨ Features

### 🎉 eCard Invitation
- **Gate Screen** — Animated cover page with couple names
- **Invitation Hero** — Elegant wedding card with event details
- **Parents Section** — Family names with beautiful typography
- **Countdown Timer** — Live countdown to the wedding day
- **Programme / Aturcara** — Scrollable event timeline
- **Gallery & Wishes** — Photo gallery with public wish board
- **Closing Screen** — Thank-you message with optional photo
- **Floating Navigation** — Quick access to RSVP, Calendar, Contact, Location, Money Gift, and Gift Registry
- **Light/Dark Theme** — Adaptive theme support

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
- Theme customization
- Section visibility toggles
- Gift management with image/price scrapers and gear settings
- RSVP & wishes viewer with statistics
- Bank & QR code management

### 👑 Super Admin Panel (`/super-admin`)
- Multi-couple management
- Account creation with subscription packages
- Payment/accounting tracker
- Credential management & password reset

## 🆕 Recent Updates
- **Comprehensive Text Editability**: 100% of live invitation screen texts (Parents, Hero Date/Venue, Gallery, Countdown) are now exposed for editing via the admin dictionary, allowing full localization
- **Updated Financial Tracker**: Full CRUD functionality added.
- **Texts Global UI Overhaul**: Super Admin text settings revamped with a responsive grid layout, auto-resizing textareas, override toggle switches, and a dedicated 'Default' reset button.
- **Enchance UI Theme**: Adopted a sleek, high-contrast dark-grey aesthetic. Refactored hundreds of inline CSS colors into dynamic variables, ensuring flawless text visibility and contrast across both Dark and Light themes.
- **Language Toggle Removal**: Streamlined the admin interface by removing the `en|ms` toggle from the dashboards and login pages.

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
│       ├── couple/        # Couple CRUD, upload, gifts
│       ├── invitation/    # Public invitation data
│       ├── scrape-link/   # Product image scraper
│       ├── scrape-price/  # Product price scraper
│       ├── search-image/  # Yahoo image search fallback
│       ├── search-price/  # Yahoo price search fallback
│       └── super-admin/   # Super admin API
├── components/
│   ├── invitation/        # Invitation section components
│   ├── nav/               # Floating navigation
│   └── popups/            # Modal popups (RSVP, Gift, etc.)
├── data/
│   └── db.example.json    # Database template (copy to db.json)
├── lib/
│   ├── db.ts              # Database read/write utilities
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

## 📝 Notes

- The database is a simple JSON file (`data/db.json`). For production, consider migrating to a proper database.
- User-uploaded files are stored in `public/uploads/`.
- The product image and price scrapers work without API keys by parsing HTML metadata and search engine results.

## 📄 License & Disclaimer

This project is free for **non-commercial use only**. Any commercial use, redistribution, or deployment for commercial purposes is strictly prohibited unless prior written agreement and explicit permission are granted by the project owner.

## 📸 Screen Shot 
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
