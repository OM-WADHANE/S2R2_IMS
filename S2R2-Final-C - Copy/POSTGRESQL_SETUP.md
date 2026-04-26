# S2R2 IoT Manager - PostgreSQL Setup Guide

## 📋 Overview
This is a complete IoT Inventory Management System with PostgreSQL database integration. It includes authentication, client management, and inventory tracking.

## 🗂️ Project Structure
```
S2R2/
├── config/
│   └── database.js          # PostgreSQL connection configuration
├── routes/
│   ├── auth.js              # Authentication routes (login, register)
│   └── clients.js           # Client management routes (CRUD operations)
├── server.js                # Main Express server
├── setup-database-new.js    # Database setup script
├── .env                     # Environment variables (configure this!)
├── login.html               # Login page (client-side)
├── index.html               # Main dashboard
└── client-base.html         # Client management page
```

## ⚙️ Prerequisites
1. **Node.js** (v14 or higher)
2. **PostgreSQL** (v12 or higher) - Must be running!
3. **npm** package manager

## 🚀 Installation Steps

### 1. Install Dependencies
```bash
npm install
```

This will install:
- express
- pg (PostgreSQL client)
- bcryptjs (password hashing)
- jsonwebtoken (JWT authentication)
- cors
- dotenv
- helmet
- express-rate-limit

### 2. Configure PostgreSQL

**Option A: Using existing PostgreSQL**
Edit the `.env` file with your PostgreSQL credentials:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=s2r2_iot_db
DB_USER=your_postgres_username
DB_PASSWORD=your_postgres_password
PORT=3000
JWT_SECRET=your_super_secret_jwt_key_here
```

**Option B: Create new PostgreSQL database**
```sql
-- Connect to PostgreSQL as superuser
psql -U postgres

-- Create database
CREATE DATABASE s2r2_iot_db;

-- Create user (optional)
CREATE USER s2r2_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE s2r2_iot_db TO s2r2_user;
```

### 3. Setup Database Tables
Run the setup script to create all tables and insert sample data:
```bash
node setup-database-new.js
```

This will create:
- ✓ users table
- ✓ raw_materials table
- ✓ components table
- ✓ devices table
- ✓ finished_products table
- ✓ clients table
- ✓ connections table
- ✓ inventory_movements table

And create an admin user:
- Username: `admin`
- Password: `admin123`

### 4. Start the Server
```bash
npm start
```

The server will run on `http://localhost:3000`

## 📱 Application Pages

### 1. Login Page
- **URL**: `http://localhost:3000/login.html`
- **Credentials**: 
  - Username: `admin`
  - Password: `admin123`

### 2. Dashboard
- **URL**: `http://localhost:3000/index.html`
- Features: Raw materials, components, devices, finished products
- Export to Excel functionality

### 3. Client Base
- **URL**: `http://localhost:3000/client-base.html`
- Features: Add, view, search clients
- Import/Export Excel
- Sequential numbering column

## 🔌 API Endpoints

### Authentication
```
POST /api/auth/login          # Login
POST /api/auth/register       # Register new user
GET  /api/auth/me             # Get current user (requires auth)
POST /api/auth/reset-admin    # Reset admin password
```

### Clients
```
GET    /api/clients           # Get all clients
GET    /api/clients/:id       # Get single client
POST   /api/clients           # Create new client
PUT    /api/clients/:id       # Update client
DELETE /api/clients/:id       # Delete client
POST   /api/clients/bulk-import  # Bulk import clients
GET    /api/clients/search/:query  # Search clients
```

### Health Check
```
GET /api/health               # Check server status
```

## 🔐 Authentication

The system uses **JWT (JSON Web Tokens)** for authentication.

**How to use:**
1. Login via `/api/auth/login` to get a token
2. Include token in subsequent requests:
   ```
   Authorization: Bearer YOUR_TOKEN_HERE
   ```

**Example:**
```javascript
const response = await fetch('http://localhost:3000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username: 'admin', password: 'admin123' })
});

const { token } = await response.json();

// Use token for authenticated requests
fetch('http://localhost:3000/api/clients', {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

## 💾 Database Schema

### Users Table
```sql
id, username, email, password, role, created_at, updated_at
```

### Clients Table
```sql
id, name, area, contact_person, email, phone, join_date, created_at
```

### Raw Materials Table
```sql
id, name, category, description, quantity, unit, supplier, 
location, status, min_stock_level, created_at, updated_at
```

### Devices Table
```sql
id, name, type, model, serial_number, device_id, rack_no, 
device_case, mac_address, ip_address, status, location, 
installation_date, last_maintenance, specifications
```

## 🛠️ Development

### Run in Development Mode
```bash
npm run dev
```
Uses `nodemon` for auto-restart on file changes.

### Database Reset
If you need to reset the database:
```bash
# Drop and recreate database
psql -U postgres -c "DROP DATABASE s2r2_iot_db;"
psql -U postgres -c "CREATE DATABASE s2r2_iot_db;"

# Run setup again
node setup-database-new.js
```

## 📊 Features

### ✅ Implemented
- User authentication with JWT
- Client management (CRUD)
- Bulk client import from Excel
- Excel export for clients and inventory
- Sequential numbering in client list
- Search functionality
- PostgreSQL database integration
- Secure password hashing
- API rate limiting
- CORS protection

### 🚧 Coming Soon
- Real-time device monitoring
- Inventory alerts
- User role management
- Advanced reporting
- Mobile app integration

## 🐛 Troubleshooting

### Database Connection Error
```
❌ Database connection failed
```
**Solution:**
1. Check if PostgreSQL is running
2. Verify credentials in `.env` file
3. Ensure database exists

### Port Already in Use
```
Error: listen EADDRINUSE :::3000
```
**Solution:**
1. Change PORT in `.env` file
2. Or kill process using port 3000:
   ```bash
   # Windows
   netstat -ano | findstr :3000
   taskkill /PID <PID> /F
   
   # Linux/Mac
   lsof -ti:3000 | xargs kill -9
   ```

### Login Not Working
**Solution:**
1. Reset admin password:
   ```bash
   node -e "require('./routes/auth'); fetch('http://localhost:3000/api/auth/reset-admin', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({newPassword: 'admin123'})})"
   ```

## 📞 Support

For issues or questions, check:
1. Server logs in the console
2. Browser console for frontend errors
3. PostgreSQL logs for database errors

## 🔄 Updates

### Version 1.0.0
- Initial release with PostgreSQL
- Client management system
- Authentication system
- Excel import/export
- Dashboard with inventory

---

**Built with ❤️ for S2R2 IoT Manager**
