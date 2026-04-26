# S2R2 IoT Manager - Complete System

## 🏠 New Features

### Home Page
- **URL:** http://localhost:3000/
- Beautiful landing page with company profile
- Scrolling client logos (Tata, Cummins, Hoerbiger, etc.)
- About, Products, Clients sections
- Footer with "Designed by Dorge Patil Group Teams"

### View Pages
- **Raw Materials:** http://localhost:3000/raw-materials.html
- **Finished Products:** http://localhost:3000/finished-products.html
- Complete details, search, and filters
- Connected from dashboard "View All" buttons

## 🚀 Quick Start

1. Install Node.js and PostgreSQL
2. Create database: `CREATE DATABASE s2r2_iot_db;`
3. Rename `.env.example` to `.env` and set password
4. Run: `npm install`
5. Run: `node setup-database-new.js`
6. Run: `npm start`
7. Open: http://localhost:3000/

## 🌐 All Pages

- **/** → Home page (landing)
- **/login** → Login page
- **/index.html** → Dashboard (after login)
- **/client-base.html** → Client management
- **/raw-materials.html** → Raw materials catalog
- **/finished-products.html** → Finished products catalog

## 📱 Navigation Flow

```
Home Page → Login → Dashboard
                      ├─> Raw Materials (View All)
                      ├─> Finished Products (View All)
                      └─> Client Base
```

## 🔐 Login

- Username: admin
- Password: admin123

All internal pages require login!

## 📄 Documentation

See `POSTGRESQL_SETUP.md` for complete installation guide.

---

**© 2025 S2R2 IoT Solutions | Designed by Dorge Patil Group Teams**
