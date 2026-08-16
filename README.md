# 🍽️ FeedMeNow — Online Food Ordering System

A production-ready, full-stack food ordering web application inspired by **Zomato** and **Swiggy**.

**React 18** frontend · **Spring Boot 3.4** backend · **MySQL 8** database · **Docker** ready · **CI/CD** via GitHub Actions

[![CI](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/ci.yml/badge.svg)](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/ci.yml)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-black?logo=vercel)](https://your-app.vercel.app)
[![Backend](https://img.shields.io/badge/Backend-Railway-purple?logo=railway)](https://your-backend.up.railway.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 🚀 Live Demo

| Service | URL |
|---|---|
| Frontend (Vercel) | **[your-app.vercel.app](https://your-app.vercel.app)** |
| Backend API (Railway) | **[your-backend.up.railway.app/api/restaurants](https://your-backend.up.railway.app/api/restaurants)** |

### Demo Credentials

| Role | Email | Password |
|---|---|---|
| Admin | admin@food.com | admin123 |
| Restaurant Owner | spice@owner.com | owner123 |
| Customer | customer@food.com | customer123 |

> Or sign up as a new customer — no email verification required.

---

## ✨ Features

### 👤 Authentication
- Signup with name, email, password — validated on both frontend and backend
- Duplicate email detection with clear error messages
- Role-based redirect: **CUSTOMER → Customer Dashboard**, **RESTAURANT_OWNER → Owner Dashboard**, **ADMIN → Admin Dashboard**
- Session persisted in `localStorage`

### 🏠 Customer Dashboard
- Restaurant cards with cuisine, rating, delivery time
- Menu grid with food images, stock badges, ratings
- Live search across item name, description, and restaurant name
- Category filters: All, Indian, Biryani, Pizza, Burger, Chinese
- Restaurant filter strip — click to show only that restaurant's menu
- Add to cart with quantity controls and real-time total
- Favorites — heart items, persisted in `localStorage`
- Order cancellation for PENDING orders
- Order history with visual timeline tracker (PENDING → CONFIRMED → READY → COMPLETED)
- Toast notifications for all actions

### 🛒 Cart & Checkout
- Multi-item cart with quantity increment/decrement
- Cross-restaurant cart guard (warns before clearing)
- Coupon code validation via API (`WELCOME20`, `FLAT50`, `PIZZA10`, `SAVE100`, `BIRYANI30`)
- Delivery address input
- Payment modal: UPI, Credit/Debit Card, Cash on Delivery
- Real-time subtotal, discount, and grand total

### 🔧 Admin Dashboard
- Stats: total orders, pending, active, completed, total revenue
- Filter orders by status
- Advance order status: PENDING → CONFIRMED → READY → COMPLETED
- View all restaurants with order counts

### 🏪 Restaurant Owner Dashboard
- View only their restaurant's orders with full details
- Advance order status with one click
- Edit menu items (name, price, stock, description) via modal
- Revenue and order stats

### 🏷️ Coupons
- Percentage and flat-amount discount types
- Minimum order amount enforcement
- Seeded codes: `WELCOME20`, `FLAT50`, `PIZZA10`, `BIRYANI30`, `SAVE100`

### ⭐ Reviews
- Customers can review menu items after ordering
- One review per item per order enforced
- Reviews stored with rating (1–5) and comment

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 18.2 | UI framework |
| React Router DOM | 6.20 | Client-side routing |
| Axios | 1.10 | HTTP client |
| CSS (custom) | — | Zomato/Swiggy-inspired responsive design |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Java | 17 | Language |
| Spring Boot | 3.4 | Application framework |
| Spring Data JPA | — | Database abstraction |
| Spring Validation | — | Request validation |
| Hibernate | — | ORM |
| Maven | — | Build tool |

### Infrastructure
| Technology | Purpose |
|---|---|
| MySQL 8 | Primary relational database |
| Docker + Docker Compose | Containerised local setup |
| GitHub Actions | CI — build & test on every push |
| Vercel | Frontend hosting (free tier) |
| Railway | Backend + MySQL hosting (free tier) |

---

## 📁 Project Structure

```
Online Food Ordering System/
├── reactapp/                        # React 18 frontend
│   ├── public/images/               # SVG food & restaurant images
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.js             # Role-based login
│   │   │   ├── Signup.js            # Customer registration
│   │   │   ├── CustomerDashboard.js # Full ordering experience
│   │   │   ├── AdminDashboard.js    # Order management + stats
│   │   │   └── OwnerDashboard.js    # Menu + order management
│   │   ├── utils/api.js             # Axios base config
│   │   ├── App.js                   # Routing + role-based redirect
│   │   ├── auth.css                 # Login/Signup styles
│   │   └── dashboard.css            # Dashboard styles
│   ├── Dockerfile                   # Production nginx build
│   ├── nginx.conf                   # SPA routing config
│   └── vercel.json                  # Vercel SPA rewrite rules
│
├── springapp/                       # Spring Boot 3.4 backend
│   └── src/main/java/com/examly/springapp/
│       ├── controller/              # REST controllers
│       ├── model/                   # JPA entities
│       ├── repository/              # Spring Data repositories
│       ├── dto/OrderRequest.java    # Order creation payload
│       ├── exception/               # Global exception handler
│       └── configuration/WebConfig.java  # CORS config
│   └── src/main/resources/
│       ├── application.properties   # DB config (env-var driven)
│       └── data.sql                 # Seed: 5 restaurants, 25 items, coupons
│   └── Dockerfile                   # Production JRE build
│   └── railway.json                 # Railway deployment config
│
├── .github/workflows/ci.yml         # GitHub Actions CI
├── docker-compose.yml               # Full stack: MySQL + backend + frontend
└── README.md
```

---

## 🔌 API Reference

### Authentication
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/signup` | Register a new customer |
| POST | `/api/auth/login` | Login and get user object |
| GET | `/api/auth/users` | List all users |

### Restaurants
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/restaurants` | Get all restaurants |
| GET | `/api/restaurants/{id}` | Get restaurant by ID |

### Menu Items
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/menu-items` | Get all menu items |
| GET | `/api/menu-items/available` | In-stock items only |
| GET | `/api/menu-items/restaurant/{id}` | Items by restaurant |
| POST | `/api/menu-items` | Create menu item |
| PUT | `/api/menu-items/{id}` | Update menu item |
| DELETE | `/api/menu-items/{id}` | Delete menu item |

### Orders
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/orders` | All orders (admin) |
| GET | `/api/orders/customer/{id}` | Orders by customer |
| GET | `/api/orders/restaurant/{id}` | Orders by restaurant |
| POST | `/api/orders` | Place a new order |
| PATCH | `/api/orders/{id}/status` | Update order status |
| PATCH | `/api/orders/{id}/cancel` | Cancel a PENDING order |

### Coupons
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/coupons` | List all coupons |
| POST | `/api/coupons/validate` | Validate and calculate discount |

### Reviews
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/reviews/menu-item/{id}` | Reviews for a menu item |
| GET | `/api/reviews/customer/{id}` | Reviews by a customer |
| POST | `/api/reviews` | Submit a review |

---

## ⚙️ Run Locally

### Prerequisites
- Java 17+, Maven
- Node.js 18+, npm
- MySQL 8 running locally

### 1. Create the database
```sql
CREATE DATABASE OnlineFood;
```

### 2. Configure the backend
Edit `springapp/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/OnlineFood
spring.datasource.username=root
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update
spring.sql.init.mode=always
```

### 3. Start the backend
```bash
cd springapp
mvnw.cmd spring-boot:run      # Windows
./mvnw spring-boot:run        # macOS / Linux
```
Backend runs at `http://localhost:8080`

### 4. Start the frontend
```bash
cd reactapp
npm install
npm start
```
Frontend runs at `http://localhost:8081`

---

## 🐳 Run with Docker (no MySQL install needed)

```bash
# Start everything — MySQL + backend + frontend
docker-compose up --build
```

App: `http://localhost:8081` — works on any machine with Docker installed.

---

## ☁️ Deploy to the Cloud (Free Tier)

### Step 1 — Push to GitHub

```bash
git init
git add .
git commit -m "feat: initial production-ready release"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### Step 2 — Backend → Railway

1. Go to [railway.app](https://railway.app) → **New Project** → **Deploy from GitHub**
2. Select the repo and set **Root Directory** to `springapp`
3. Add a **MySQL** plugin inside Railway
4. Set these environment variables in Railway:

```
SPRING_DATASOURCE_URL=jdbc:mysql://<railway-mysql-host>:3306/railway
SPRING_DATASOURCE_USERNAME=root
SPRING_DATASOURCE_PASSWORD=<railway-password>
SPRING_JPA_HIBERNATE_DDL_AUTO=update
SPRING_SQL_INIT_MODE=always
```

5. Railway auto-detects the `Dockerfile` and deploys. Copy the public URL (e.g. `https://foodiehub.up.railway.app`).

### Step 3 — Frontend → Vercel

1. Go to [vercel.com](https://vercel.com) → **New Project** → Import from GitHub
2. Set **Root Directory** to `reactapp`
3. Add environment variable:
```
REACT_APP_API_URL=https://your-railway-backend.up.railway.app
```
4. Deploy. Vercel handles the React build automatically.

### Step 4 — Update CORS on backend

Add your Vercel URL to Railway env vars:
```
CORS_ALLOWED_ORIGINS=https://your-app.vercel.app
```

---

## 🗺️ Architecture

```
Browser (React 18)
    │  Axios HTTP
    ▼
Spring Boot 3.4 REST API  ──►  MySQL 8
    │
    ├── /api/auth          AuthRestController
    ├── /api/restaurants   RestaurantRestController
    ├── /api/menu-items    MenuItemRestController
    ├── /api/orders        OrderRestController
    ├── /api/coupons       CouponRestController
    └── /api/reviews       ReviewRestController
```

### Database Schema
```
users         id | name | email | password_hash | role
restaurants   id | user_id | name | address | cuisine | image_url | rating | delivery_time
menu_items    id | name | description | price | restaurant_id | stock | image_url | rating | category
orders        id | customer_id | restaurant_id | total_price | discount_amount | payment_method | delivery_address | status | created_at
order_items   id | order_id | menu_item_id | quantity
coupons       id | code | description | discount_type | discount_value | min_order_amount | active
reviews       id | customer_id | menu_item_id | order_id | rating | comment | customer_name | created_at
```

---

## 🔮 Future Improvements

- [ ] Spring Security + BCrypt password hashing + JWT tokens
- [ ] Real payment gateway (Razorpay / Stripe)
- [ ] Real-time order tracking with WebSockets
- [ ] Push notifications for order status changes
- [ ] Image upload for menu items (AWS S3)
- [ ] Pagination and infinite scroll
- [ ] Google Maps delivery address autocomplete
- [ ] Email confirmation on signup

---

## 👨‍💻 Author

**Yasar** — Full-Stack Developer
Java 17 · Spring Boot 3.4 · React 18 · MySQL · Docker · GitHub Actions · Deployed on Railway + Vercel

---

## 📄 License

MIT License — see [LICENSE](LICENSE)
