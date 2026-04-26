# S2R2 IoT Manager - Setup Instructions

## 📋 What's Included

You have 3 main HTML files that work together:

1. **login.html** - Login page (no server needed!)
2. **index.html** - Main Dashboard with IoT inventory & Excel export
3. **client-base.html** - Client management with Excel import/export

## 🔐 Login Credentials

**Username:** admin  
**Password:** admin123

**Username:** user  
**Password:** user123

**Username:** s2r2  
**Password:** s2r2@2025

## 🚀 How to Use

### Step 1: Start Here
1. Open **login.html** in your browser
2. Enter username and password
3. Click "Sign In"

### Step 2: Dashboard
- After login, you'll be redirected to **index.html**
- This is your main dashboard with:
  - IoT device overview
  - Raw materials inventory
  - Finished products inventory
  - **Export to Excel** buttons for both inventories

### Step 3: Client Base
- Click "Client Base" in the sidebar
- Manage your clients
- Features:
  - ✅ Sequential row numbers (No. column)
  - ✅ Add new clients
  - ✅ Search clients
  - ✅ Export to Excel
  - ✅ Import from Excel

### Step 4: Logout
- Click on the **profile picture** in the header (top right)
- Confirm logout
- You'll be redirected back to login page

## 📁 File Structure

```
├── login.html          → Login page (START HERE)
├── index.html          → Main dashboard (after login)
└── client-base.html    → Client management (after login)
```

## ✨ Features

### ✅ All Pages
- No server required
- Works entirely in browser
- Protected with login
- Logout by clicking profile picture

### ✅ Index.html (Dashboard)
- IoT device statistics
- Raw materials tracking
- Finished products tracking
- Excel export for inventories
- Real-time data display

### ✅ Client-base.html
- Sequential numbering (No. column)
- Add/Search/Filter clients
- Excel import/export
- Clean table layout

## 🔧 Customization

### Change Login Credentials
Edit the `login.html` file and find this section:
```javascript
const VALID_USERS = {
  'admin': 'admin123',
  'user': 'user123',
  's2r2': 's2r2@2025'
};
```
Add or modify usernames and passwords as needed.

### Add More Users
Just add new lines in the VALID_USERS object:
```javascript
const VALID_USERS = {
  'admin': 'admin123',
  'yourname': 'yourpassword',
  'newuser': 'newpass123'
};
```

## 🎯 Important Notes

1. **Always start with login.html** - This protects your dashboard
2. **All data is stored in browser** - Clear browser data will reset everything
3. **No server needed** - Everything runs client-side
4. **Excel export works offline** - Uses SheetJS library from CDN

## 💡 Tips

- Use the search box in Client Base to quickly find clients
- Export data regularly to keep backups
- Import Excel files must have matching column names
- Profile picture click = instant logout option

## 🆘 Troubleshooting

**Problem:** Can't login  
**Solution:** Make sure you're using correct username/password (case-sensitive)

**Problem:** Redirected to login after being logged in  
**Solution:** Check if browser's localStorage is enabled

**Problem:** Export buttons not working  
**Solution:** Make sure you have internet connection (SheetJS loads from CDN)

---

## 📞 Need Help?

All files are standalone HTML - just open them in any modern browser!

**Recommended browsers:** Chrome, Firefox, Edge, Safari

---

**Version:** 2.0  
**Updated:** February 2025  
**Author:** S2R2 Team
