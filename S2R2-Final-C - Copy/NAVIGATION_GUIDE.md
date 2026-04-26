# 🗺️ S2R2 IoT Manager - Complete Navigation Guide

## 📍 All Pages & URLs

```
┌─────────────────────────────────────────────────────────────┐
│                    S2R2 IoT MANAGER                         │
│                    Complete System Map                       │
└─────────────────────────────────────────────────────────────┘

🏠 HOME PAGE (Public - No Login Required)
   URL: http://localhost:3000/
   
   Features:
   ├─ Company Profile
   ├─ About S2R2
   ├─ Products Showcase
   ├─ Client Logos (Scrolling)
   │  ├─ Tata Group
   │  ├─ Cummins India
   │  ├─ Hoerbiger
   │  ├─ Kalyani Technoforge
   │  ├─ JBM Group
   │  ├─ BRS Precision
   │  ├─ Antolin
   │  └─ Cybernetik
   ├─ Statistics
   ├─ Contact Info
   └─ Footer: "Designed by Dorge Patil Group Teams"
   
   → Click "Login" button → Goes to Login Page

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔐 LOGIN PAGE
   URL: http://localhost:3000/login
   
   Credentials:
   ├─ Username: admin
   ├─ Password: admin123
   └─ Also works: s2r2 / s2r2@2025
   
   → After Login → Goes to Dashboard

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 DASHBOARD (Requires Login)
   URL: http://localhost:3000/index.html
   
   Sections:
   ├─ 📦 Raw Materials (with sample data)
   │  └─ [View All Materials] → /raw-materials.html
   │
   ├─ 📦 Finished Products (with sample data)
   │  └─ [View All Products] → /finished-products.html
   │
   ├─ 📈 Recent Activity
   └─ 📊 Export to Excel buttons
   
   Sidebar Navigation:
   ├─ Dashboard (current page)
   ├─ Raw Materials → /raw-materials.html
   ├─ Finished Products → /finished-products.html
   └─ Client Base → /client-base.html

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📦 RAW MATERIALS PAGE (Requires Login)
   URL: http://localhost:3000/raw-materials.html
   
   Features:
   ├─ Search materials
   ├─ Filter by Category (Electronics, Sensors)
   ├─ Filter by Status (Active, Low Stock, Out of Stock)
   └─ Material Cards showing:
      ├─ Name, Category, Description
      ├─ Quantity, Unit, Min Stock
      ├─ Supplier, Location
      ├─ Unit Price
      ├─ Last Updated
      └─ Edit button
   
   Sample Data:
   ├─ PLC Controller (48 pcs)
   ├─ RFID Antenna (12 pcs)
   ├─ ESP32 Module (87 pcs)
   ├─ Power Supply (5 pcs - LOW STOCK)
   ├─ Temperature Sensor (156 pcs)
   └─ LED Strip (34 m)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📦 FINISHED PRODUCTS PAGE (Requires Login)
   URL: http://localhost:3000/finished-products.html
   
   Features:
   ├─ Search products
   ├─ Filter by Type (Sensor, Actuator, Controller)
   ├─ Filter by Quality (Passed, Testing, Failed)
   └─ Product Cards showing:
      ├─ Name, Type, Icon
      ├─ Serial Number, Batch Number
      ├─ Specifications (detailed)
      ├─ Stock, Location
      ├─ Unit Price
      ├─ Manufacturing Date
      ├─ Quality Status Badge
      └─ Edit/Download/Info buttons
   
   Sample Data:
   ├─ Temperature Sensor Unit (45 units)
   ├─ Smart Lighting Unit (32 units)
   ├─ Access Control Unit (12 units - TESTING)
   ├─ Surveillance Camera (28 units)
   ├─ Motion Sensor Pro (67 units)
   └─ Smart Relay Module (41 units)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

👥 CLIENT BASE PAGE (Requires Login)
   URL: http://localhost:3000/client-base.html
   
   Features:
   ├─ Add Client (button)
   ├─ Import from Excel
   ├─ Export to Excel
   ├─ Search clients
   └─ Client Table with:
      ├─ No. (Sequential number)
      ├─ Client Name
      ├─ Area
      ├─ Contact Person
      ├─ Email
      └─ Phone
   
   Connected to PostgreSQL database!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## 🔄 Navigation Flow

```
START HERE ↓

┌──────────────┐
│  Home Page   │ ← http://localhost:3000/
│  (Public)    │
└──────┬───────┘
       │ Click "Login"
       ↓
┌──────────────┐
│  Login Page  │ ← http://localhost:3000/login
│              │    Username: admin
└──────┬───────┘    Password: admin123
       │ After successful login
       ↓
┌──────────────────────────────────────┐
│         Dashboard                    │ ← http://localhost:3000/index.html
│  ┌─────────┬──────────┬────────────┐│
│  │Raw Mats │Finished  │Client Base ││
│  │         │Products  │            ││
│  └────┬────┴────┬─────┴──────┬─────┘│
└───────┼─────────┼────────────┼──────┘
        │         │            │
        ↓         ↓            ↓
    ┌───────┐ ┌──────┐  ┌────────────┐
    │  Raw  │ │Finish│  │   Client   │
    │Materia│ │Prods │  │    Base    │
    │  Page │ │ Page │  │    Page    │
    └───────┘ └──────┘  └────────────┘
```

## 🎯 Quick Access URLs

Copy-paste these to access directly:

```
🏠 Home:              http://localhost:3000/
🔐 Login:             http://localhost:3000/login
📊 Dashboard:         http://localhost:3000/index.html
📦 Raw Materials:     http://localhost:3000/raw-materials.html
📦 Finished Products: http://localhost:3000/finished-products.html
👥 Client Base:       http://localhost:3000/client-base.html
```

## 🔒 Login Protection

```
✅ Public Pages (No login required):
   └─ Home page (/)

🔐 Protected Pages (Login required):
   ├─ Dashboard (/index.html)
   ├─ Raw Materials (/raw-materials.html)
   ├─ Finished Products (/finished-products.html)
   └─ Client Base (/client-base.html)

If not logged in → Automatically redirected to /login
```

## 📱 Sidebar Navigation (All Protected Pages)

Every protected page has a sidebar with:

```
┌─────────────────────┐
│    Navigation       │
├─────────────────────┤
│ 📊 Dashboard        │
│ 📦 Raw Materials    │
│ 📦 Finished Products│
│ 👥 Client Base      │
└─────────────────────┘
```

## 🎨 Design Credits

**Footer on Home Page:**
```
© 2025 S2R2 IoT Solutions. All rights reserved.
Designed & Developed by Dorge Patil Group Teams
```

## 🚀 Getting Started

1. Start server: `npm start`
2. Open: http://localhost:3000/
3. Explore home page
4. Click "Login"
5. Enter: admin / admin123
6. Explore dashboard
7. Click "View All" buttons or sidebar links

---

**Everything is connected and working! Enjoy! 🎉**
