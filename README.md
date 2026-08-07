# 🍽️ Online Food Ordering System

A full-stack food ordering web application inspired by Swiggy and Zomato, built with **React 18** on the frontend and **Spring Boot 3.4** on the backend, backed by a **MySQL** database.

Users can sign up, browse restaurants and menus, add items to a cart, simulate a payment, and place orders. Admins can view and manage all orders from a dedicated dashboard.

---

## 🚀 Live Demo

> Run locally — see [How To Run](#how-to-run) below.  
> Deployable via Docker — see [Deployment](#deployment) below.

---

## 📸 Screenshots

| Login Page | Customer Dashboard | Cart & Checkout |
|---|---|---|
| Clean auth UI with form validation | Restaurant cards + menu grid with food images | Cart with quantity controls and payment modal |

| Order History | Admin Dashboard |
|---|---|
| Per-customer order tracking with status badges | Admin view of all orders with status update controls |

---

## 🧠 What This Project Demonstrates

This project was built to demonstrate end-to-end full-stack development skills including:

- Designing and consuming **REST APIs** from a React frontend
- Building a **Spring Boot** backend with layered architecture (Controller → Repository → DB)
- **JPA / Hibernate** ORM with MySQL for data persistence
- **Role-based routing** — CUSTOMER, RESTAURANT_OWNER, and ADMIN see different dashboards
- **Cart management** with quantity controls and real-time total calculation
- **Payment simulation** with UPI, Card, and Cash on Delivery flows
- **Order lifecycle management** — PENDING → CONFIRMED → READY → COMPLETED
- **Admin dashboard** to view all orders and update their status
- **Responsive UI** with a Swiggy/Zomato-inspired design using CSS Grid and Flexbox
- **LocalStorage** for persisting favorites and session data
- **Input validation** on both frontend and backend
- **CORS configuration** for cross-origin frontend-backend communication
- **Seed data** loaded via `data.sql` for instant demo readiness

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 18.2 | UI framework |
| React Router DOM | 6.20 | Client-side routing |
| Axios | 1.10 | HTTP client for API calls |
| React Hook Form | 7.48 | Form state and validation |
| React Query | 3.39 | Server state management |
| Redux Toolkit | 1.9 | Global state management |
| CSS (custom) | — | Swiggy-style responsive design |
| Jest + React Testing Library | — | Unit and component testing |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Java | 17 | Language |
| Spring Boot | 3.4 | Application framework |
| Spring Web | — | REST API layer |
| Spring Data JPA | — | Database abstraction |
| Spring Validation | — | Request validation |
| Hibernate | — | ORM / SQL generation |
| Thymeleaf | — | Server-side templates (legacy views) |
| Maven | — | Build and dependency management |

### Database
| Technology | Purpose |
|---|---|
| MySQL 8 | Primary relational database |
| data.sql | Seed data — restaurants, menus, users |

---

## 📁 Project Structure

```
Online Food Ordering System/
├── reactapp/                        # React frontend
│   ├── public/
│   └── src/
│       ├── components/
│       │   ├── Login.js             # Login page with validation
│       │   ├── Signup.js            # Signup page with validation
│       │   ├── CustomerDashboard.js # Main customer experience
│       │   ├── AdminDashboard.js    # Admin order management
│       │   ├── AddOrder.js          # Legacy order form
│       │   └── OrderList.js         # Legacy order list
│       ├── utils/
│       │   └── api.js               # Axios base config
│       ├── App.js                   # Routing + role-based dashboard
│       ├── auth.css                 # Login/Signup styles
│       └── dashboard.css            # Dashboard styles
│
├── springapp/                       # Spring Boot backend
│   └── src/main/java/com/examly/springapp/
│       ├── controller/
│       │   ├── AuthRestController.java        # POST /api/auth/signup, /login
│       │   ├── RestaurantRestController.java  # GET /api/restaurants
│       │   ├── MenuItemRestController.java    # GET /api/menu-items
│       │   ├── OrderRestController.java       # GET/POST /api/orders
│       │   └── FoodOrderController.java       # Legacy CRUD flow
│       ├── model/
│       │   ├── User.java            # Entity: id, name, email, password, role
│       │   ├── Restaurant.java      # Entity: id, name, address, cuisine, rating
│       │   ├── MenuItem.java        # Entity: id, name, price, stock, restaurantId
│       │   ├── Order.java           # Entity: id, customerId, totalPrice, status
│       │   ├── OrderItem.java       # Entity: orderId, menuItemId, quantity
│       │   └── FoodOrder.java       # Legacy entity
│       ├── repository/              # Spring Data JPA repositories
│       ├── dto/
│       │   └── OrderRequest.java    # Order creation payload
│       ├── exception/
│       │   └── GlobalExceptionHandler.java
│       └── configuration/
│           └── WebConfig.java       # CORS configuration
│   └── src/main/resources/
│       ├── application.properties   # DB config
│       └── data.sql                 # Seed data (5 restaurants, 25 menu items)
│
├── README.md
├── RUN.md
└── SETUP.md
```

---

## ✨ Features

### 👤 Authentication
- User signup with name, email, password
- Email format validation and minimum password length enforced on both frontend and backend
- Duplicate email detection with clear error messages
- Login returns user object with role — stored in `localStorage`
- Role-based redirect: CUSTOMER → Customer Dashboard, ADMIN → Admin Dashboard

### 🏠 Customer Dashboard
- **Restaurant cards** — name, cuisine, rating, delivery time, cover image
- **Menu grid** — food images, name, description, price, stock badge, rating
- **Search** — live filter across item name and description
- **Category filters** — All, Pizza, Burger, Biryani, Chinese, Indian
- **Add to cart** — with quantity increment/decrement and auto-total
- **Favorites** — heart items, persisted in `localStorage`
- **Payment modal** — choose UPI, Credit/Debit Card, or Cash on Delivery
- **Order placement** — sends order to backend, clears cart on success
- **Order history** — lists all past orders with status badges
- **Toast notifications** — success/error feedback for all actions

### 🛒 Cart
- Add, remove, and update item quantities
- Real-time subtotal and grand total
- Checkout triggers payment modal before placing order

### 💳 Payment (Simulated)
- UPI — enter UPI ID and confirm
- Card — enter card number, expiry, CVV
- Cash on Delivery — one-click confirm
- All flows simulate payment and then call the order API

### 🔧 Admin Dashboard
- View all orders across all customers
- See order ID, customer ID, restaurant, total, and current status
- Update order status: PENDING → CONFIRMED → READY → COMPLETED
- Status changes call `PATCH /api/orders/{id}/status` on the backend

### 🍕 Restaurants & Menu (Seed Data)
| Restaurant | Cuisine | Location |
|---|---|---|
| Spice Garden | North Indian | HSR Layout, Bengaluru |
| Burger Bros | American | Koramangala, Bengaluru |
| Pizza House | Italian | Indiranagar, Bengaluru |
| Biryani Palace | Hyderabadi | Banjara Hills, Hyderabad |
| Wok Express | Chinese | Jubilee Hills, Hyderabad |

25 menu items across all 5 restaurants with realistic names, descriptions, and prices in INR.

---

## 🔌 API Reference

### Authentication
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/signup` | Register a new customer |
| POST | `/api/auth/login` | Login and get user object |

### Restaurants
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/restaurants` | Get all restaurants |
| GET | `/api/restaurants/{id}` | Get restaurant by ID |

### Menu Items
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/menu-items` | Get all menu items |
| GET | `/api/menu-items/available` | Get in-stock items only |
| GET | `/api/menu-items/restaurant/{id}` | Get items by restaurant |

### Orders
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/orders` | Get all orders (admin) |
| GET | `/api/orders/customer/{id}` | Get orders by customer |
| GET | `/api/orders/restaurant/{id}` | Get orders by restaurant |
| POST | `/api/orders` | Place a new order |
| PATCH | `/api/orders/{id}/status` | Update order status (admin) |

### Request / Response Examples

**POST /api/auth/signup**
```json
// Request
{ "name": "Yasar", "email": "yasar@example.com", "password": "pass123" }

// Response
{ "success": true, "message": "Account created successfully" }
```

**POST /api/orders**
```json
// Request
{
  "customerId": 4,
  "restaurantId": 1,
  "totalPrice": 548.00,
  "status": "PENDING",
  "items": [
    { "menuItemId": 1, "quantity": 2 },
    { "menuItemId": 3, "quantity": 1 }
  ]
}

// Response
{ "success": true, "orderId": 12 }
```

**PATCH /api/orders/12/status**
```json
// Request
{ "status": "CONFIRMED" }

// Response
{ "success": true }
```

---

## ⚙️ How To Run

### Prerequisites
- Java 17+
- Node.js 18+ and npm
- MySQL 8 running locally
- A database named `OnlineFood`

### 1. Create the MySQL database
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

# macOS / Linux
./mvnw spring-boot:run

# Windows
mvnw.cmd spring-boot:run
```
Backend runs at: `http://localhost:8080`

### 4. Start the frontend
```bash
cd reactapp
npm install
npm start
```
Frontend runs at: `http://localhost:8081`

### 5. Default login credentials
| Role | Email | Password |
|---|---|---|
| Admin | admin@food.com | admin123 |
| Restaurant Owner | spice@owner.com | owner123 |
| Customer | Sign up yourself | your choice |

---

## 🐳 Deployment

### Deploy with Docker (run anywhere)

**1. Create `springapp/Dockerfile`:**
```dockerfile
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app
COPY target/*.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]
```

**2. Create `reactapp/Dockerfile`:**
```dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
```

**3. Create `docker-compose.yml` at project root:**
```yaml
version: '3.8'
services:
  mysql:
    image: mysql:8
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: OnlineFood
    ports:
      - "3306:3306"

  backend:
    build: ./springapp
    ports:
      - "8080:8080"
    environment:
      SPRING_DATASOURCE_URL: jdbc:mysql://mysql:3306/OnlineFood
      SPRING_DATASOURCE_USERNAME: root
      SPRING_DATASOURCE_PASSWORD: root
    depends_on:
      - mysql

  frontend:
    build: ./reactapp
    ports:
      - "8081:80"
    depends_on:
      - backend
```

**4. Build and run:**
```bash
# Build the Spring Boot jar first
cd springapp && mvnw.cmd package -DskipTests && cd ..

# Start everything
docker-compose up --build
```

App is now live at `http://localhost:8081` — works on any machine with Docker.

### Deploy to the Cloud

| Platform | How |
|---|---|
| **AWS** | Backend → Elastic Beanstalk or EC2. Frontend → S3 + CloudFront. DB → RDS MySQL |
| **Railway** | Connect GitHub repo, set env vars, deploy backend and frontend as separate services |
| **Render** | Free tier — deploy Spring Boot as a Web Service, React as a Static Site |
| **Vercel + Railway** | Frontend on Vercel (free), backend on Railway (free tier) |

---

## 🗄️ Database Schema

```
users
  id | name | email | password_hash | role (ADMIN, RESTAURANT_OWNER, CUSTOMER)

restaurants
  id | user_id | name | address | cuisine | image_url | rating | delivery_time

menu_items
  id | name | description | price | restaurant_id | stock | image_url | rating | category

orders
  id | customer_id | restaurant_id | total_price | status (PENDING, CONFIRMED, READY, COMPLETED)

order_items
  id | order_id | menu_item_id | quantity
```

---

## 🔮 Future Improvements

- [ ] Spring Security with BCrypt password hashing and JWT tokens
- [ ] Real payment gateway integration (Razorpay / Stripe)
- [ ] Restaurant owner dashboard — manage menu, view own orders
- [ ] Real-time order tracking with WebSockets
- [ ] Push notifications for order status changes
- [ ] Google Maps integration for delivery address
- [ ] Image upload for menu items (AWS S3)
- [ ] Pagination and infinite scroll for menu
- [ ] Review and rating system per order
- [ ] Coupon and discount code system

---

## 👨‍💻 Author

**Yasar**  
Full-Stack Developer  
Built with Java 17, Spring Boot 3.4, React 18, and MySQL

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
