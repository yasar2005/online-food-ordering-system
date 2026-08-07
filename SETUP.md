# Food Ordering System - Setup Guide

## Project Structure
- `springapp/` - Spring Boot backend (Java)
- `reactapp/` - React frontend
- `start-all.sh` - Script to run both frontend and backend

## Quick Start

### Option 1: Run Everything Together
```bash
./start-all.sh
```

### Option 2: Run Separately

#### Backend (Terminal 1):
```bash
./start-backend.sh
```

#### Frontend (Terminal 2):
```bash
./start-frontend.sh
```

## Access URLs
- **Frontend**: http://localhost:8081
- **Backend API**: http://localhost:8080/api/orders
- **H2 Database Console**: http://localhost:8080/h2-console

## API Endpoints
- `GET /api/orders` - Get all orders
- `POST /api/orders` - Create new order
- `GET /api/orders/{id}` - Get order by ID
- `PUT /api/orders/{id}` - Update order
- `DELETE /api/orders/{id}` - Delete order

## Database
- Uses H2 in-memory database (no setup required)
- Data resets on application restart
- Access console at: http://localhost:8080/h2-console
  - JDBC URL: `jdbc:h2:mem:testdb`
  - Username: `sa`
  - Password: (empty)

## Requirements
- Java 17+
- Node.js 14+
- Maven (included via wrapper)

## Troubleshooting
- If ports are busy, stop other services or change ports in configuration
- Backend must start before frontend for proper connection
- Check console logs for any errors