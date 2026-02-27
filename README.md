🔐 SecureServer – Production-Grade Authentication API

SecureServer is a production-ready authentication backend built using Bun, Hono, MongoDB, Valkey (Redis), and JWT.
It implements a secure access/refresh token architecture with Redis-based session management.

🚀 Tech Stack

Runtime: Bun

Framework: Hono

Language: TypeScript (Strict Mode)

Database: MongoDB (Mongoose)

Cache / Session Store: Valkey (Redis compatible)

Authentication: JWT (Access + Refresh Tokens)

Security: bcrypt, HTTP-only cookies

Validation: Zod

Containerization: Docker

🔐 Authentication Architecture

This project implements:

Short-lived Access Tokens

Long-lived Refresh Tokens

Refresh token storage in Valkey

Token expiration (TTL)

Redis-backed session invalidation

Secure password hashing using bcrypt

Token Flow

User logs in

Access + Refresh tokens generated

Refresh token stored in Valkey with TTL

Access token used for protected routes

Refresh token used to issue new access tokens

📂 Project Structure
src/
  controllers/
  services/
  middleware/
  routes/
  config/
  utils/
  types/

This structure follows clean architecture principles for scalability and maintainability.

🐳 Running With Docker

Make sure Docker is installed.

Start MongoDB and Valkey containers:

docker compose up -d
🛠 Installation
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
ACCESS_TOKEN_SECRET=your_secret
REFRESH_TOKEN_SECRET=your_secret
🎯 Features Implemented

User authentication

JWT-based authorization

Redis-backed refresh tokens

Token expiration management

Secure password hashing

Modular backend architecture

📈 Future Improvements

Refresh token rotation

Role-based access control (RBAC)

Rate limiting

API documentation (Swagger)

Unit & integration tests

Deployment setup

👨‍💻 Author

Built as part of a production-level backend engineering practice project.
