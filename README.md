# 🔐 SecureServer

Enterprise-Style Authentication & API Platform built with **Bun + Hono + MongoDB + Valkey (Redis)**.

This project demonstrates a production-ready JWT authentication system with Redis-backed refresh token management and clean backend architecture.

---

## 🚀 Tech Stack

- **Runtime:** Bun
- **Framework:** Hono
- **Language:** TypeScript (Strict Mode)
- **Database:** MongoDB (Mongoose)
- **Cache / Session Store:** Valkey (Redis compatible)
- **Authentication:** JWT (Access + Refresh Tokens)
- **Validation:** Zod
- **Password Hashing:** bcrypt
- **Containerization:** Docker

---

## 🏗 Architecture Overview

### Authentication Flow

1. User logs in
2. Access token (short-lived) is generated
3. Refresh token (long-lived) is generated
4. Refresh token stored in Redis with TTL
5. Access token used for protected routes
6. Refresh token used to generate new access token

---

## 🔐 Refresh Token Strategy

Refresh tokens are stored in Redis using:


refresh:<userId> → refreshToken


Each key includes a TTL aligned with token expiration.

Example:


refresh:69a070b88c28c912602c1c13


---

## 📂 Project Structure


src/
controllers/
services/
repositories/
middleware/
config/
utils/
types/


This structure follows clean architecture principles.

---

## 🐳 Running With Docker

Start MongoDB and Valkey:

```bash
docker compose up -d
📦 Installation
bun install
▶️ Run Development Server
bun run dev

Server runs at:

http://localhost:3000
🔎 Type Checking
bun run type-check
🔐 Environment Variables

Create a .env file:

PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/myDB
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
ACCESS_TOKEN_SECRET=your_access_secret
REFRESH_TOKEN_SECRET=your_refresh_secret
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d
