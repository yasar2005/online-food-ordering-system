# 🚀 Quick Start Guide

## ✅ Ready to Run!

### 🎯 One Command Start
```bash
./start-all.sh
```

### 🔧 Manual Start (Recommended)

**Terminal 1 - Backend:**
```bash
cd springapp
./mvnw spring-boot:run
```

**Terminal 2 - Frontend:**
```bash
cd reactapp
npm start
```

### 📱 Access Your Application
- **Frontend**: http://localhost:8081
- **Backend API**: http://localhost:8080/api/orders
- **Database Console**: http://localhost:8080/h2-console
  - JDBC URL: `jdbc:h2:file:./data/fooddb`
  - Username: `sa`
  - Password: (empty)

### 🎉 What's Fixed
- ✅ API endpoints aligned (`/api/orders`)
- ✅ Form validation fixed (only required fields)
- ✅ Persistent H2 database with sample data
- ✅ Submit button now works properly
- ✅ Success/error messages added

### 🧪 Test the Connection
1. Open http://localhost:8081
2. Fill required fields (marked with *)
3. Submit order (button now works!)
4. See orders in the list below
5. Data persists between restarts

**Required Fields Only:**
- Restaurant Name *
- Menu Item Name *
- Price *
- Quantity *