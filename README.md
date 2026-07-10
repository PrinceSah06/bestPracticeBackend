# 🛡️ bestPracticeBackend - Secure Enterprise Node/Bun REST API

A production-ready, highly secure backend template focused on industry-standard best practices, implementing **Hono** web framework, **TypeScript**, **MongoDB (Mongoose)**, and **Redis/Valkey** running on the high-performance **Bun** runtime.

This repository serves as a showcase of modern backend architecture, focusing on security, performance, validation, and containerization, making it an excellent resource for technical interview preparation.

---

## 🚀 Key Architectural Features & Design Patterns

1. **Bun Runtime & Hono Framework**
   - Built on **Bun** for blisteringly fast startup times and execution speeds.
   - Utilizes **Hono**, a lightweight, highly-optimized router, featuring TypeScript-first support and compatibility with standard web APIs.

2. **Secure Token-Based Authentication (JWT Rotation & Blacklisting)**
   - **Double-Token Strategy**: Employs short-lived Access Tokens (1 hour) for stateless authorization and long-lived Refresh Tokens (7 days) for session maintenance.
   - **HttpOnly Cookies**: Refresh tokens are stored in `HttpOnly`, `SameSite: Strict` cookies to mitigate XSS (Cross-Site Scripting) and CSRF (Cross-Site Request Forgery) attacks.
   - **Token Rotation**: Every time a token is refreshed, a new refresh token is issued, and the previous one is immediately invalidated in Redis (mitigating token replay attacks).
   - **Token Blacklisting**: Active refresh tokens are tracked in Redis (`refresh:<userId>`). Logging out deletes the key from Redis, immediately blocking subsequent access.

3. **Multi-Level Rate Limiting (Redis-Powered)**
   - Rate limiting middleware backed by Redis memory store to prevent DDoS and Brute-Force attacks.
   - **Global/Registration Limiter**: Restricts endpoints (e.g., registration) based on Client IP (5 requests/minute).
   - **Login Limiter**: Protects login attempts based on IP + Email combo (5 attempts/minute) to stop credential stuffing.
   - **Refresh Limiter**: Limits token refresh actions based on IP + User ID (10 requests/minute).

4. **Fail-Fast Environment Validation (Zod Schema)**
   - Schema validation for `.env` variables at boot time using **Zod**.
   - If any required environment variables (e.g., `MONGO_URI`, `JWT_ACCESS_SECRET`) are missing or incorrectly typed, the application prints detailed validation errors and immediately terminates with a non-zero exit code (`process.exit(1)`).

5. **Robust Global Error Handling**
   - Centralized error handler capturing both operational errors (`AppError`) and programmer errors.
   - Standardizes response formats: errors return semantic HTTP status codes along with descriptive messages, hiding raw system errors from clients to prevent information disclosure.

6. **Enterprise Mongoose Database Patterns**
   - **Soft Delete Pattern**: Users are soft-deleted (`isDeleted: true`) rather than hard-purged. Soft-deleted accounts can be restored by an admin.
   - **Role-Based Access Control (RBAC)**: Custom middlewares allow routes to enforce authorization policies (e.g., `ADMIN`, `USER`). The first user registered in the system is automatically assigned the `ADMIN` role.
   - **MongoDB Aggregation Pipelines**: Admin dashboard utilizes Mongoose `aggregate` pipelines for calculating active/deleted/verified user statistics.

---

## 📁 Repository Directory Structure

```text
bestPracticeBackend/
├── .env.example             # Template file showing required configuration
├── Dockerfile               # Multi-stage build image for Bun runtime
├── docker-compose.yml       # Orchestrates App, MongoDB, and Valkey/Redis services
├── package.json             # Scripts and packages manifest
├── tsconfig.json            # Strict TypeScript configuration
├── server.ts                # Entrypoint server configuration (Bun.serve)
├── src/
│   ├── app.ts               # Core app initialization, route mappings, and error handler
│   ├── DB/
│   │   └── connectDB.ts     # Database connection driver (Mongoose)
│   ├── config/
│   │   ├── env.ts           # Zod environment schema and validation bootstrapper
│   │   └── radis.config.ts  # Redis/Valkey client instance configuration
│   ├── models/
│   │   └── user.model.ts    # User schema with pre-save hashing & compare password helper
│   ├── middleware/
│   │   ├── auth.middleware.ts  # JWT verification and RBAC middleware
│   │   ├── error.middleware.ts # Global express-style try/catch error wrapper
│   │   └── rateLimit.middleare.ts # Redis rate limiter middleware
│   ├── controller/
│   │   ├── auth.controller.ts  # Registration, login, logout, and token refresh controllers
│   │   └── admin.controller.ts # User management, RBAC updates, and stats controllers
│   ├── routes/
│   │   ├── auth.route.ts    # Authentication routes mapping
│   │   └── admin.routes.ts  # Secured administrative routes mapping
│   ├── services/
│   │   ├── auth.services.ts # Authentication business logic
│   │   ├── admin.services.ts# Database queries & aggregation logic
│   │   └── auth.test.ts     # Integration tests for auth endpoints
│   ├── test/
│   │   ├── admin/
│   │   │   └── admin.test.ts# Integration tests for admin endpoints
│   │   └── token/
│   │       └── token.test.ts# JWT generation/verification unit tests
│   ├── types/
│   │   └── hono.ts          # Hono Custom Variables typings
│   └── utils/
│       ├── AppError.ts      # Custom error class subclassing native Error
│       └── jwt.ts           # Token sign & verify utilities
```

---

## 🛠️ API Endpoint Specifications

### 🔑 Authentication Routes (`/auth`)

| Method | Endpoint | Auth Required | Rate Limited | Description |
| :--- | :--- | :---: | :---: | :--- |
| `POST` | `/auth/register` | No | Yes (IP) | Registers a new user. The first user to register becomes `ADMIN`. |
| `POST` | `/auth/login` | No | Yes (IP+Email) | Authenticates credentials, returns Access Token, sets HTTP-only Refresh Token cookie. |
| `POST` | `/auth/logout` | Yes | Yes (IP) | Clears session cookie and invalidates Refresh Token in Redis. |
| `POST` | `/auth/refresh` | No | Yes (IP+User) | Evaluates Refresh Token cookie, rotates token pair, returns new Access Token. |

### 👑 Administrative Routes (`/admin`)
*All Admin endpoints require a valid `ADMIN` bearer token.*

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/admin/users` | Lists all active (non-deleted) users from the database. |
| `PATCH` | `/admin/users/:id/delete` | Soft deletes a user by ID (sets `isDeleted: true`). |
| `PATCH` | `/admin/users/:id/restore` | Restores a soft-deleted user (sets `isDeleted: false`). |
| `PATCH` | `/admin/users/:id/update` | Updates specific profile fields (name, isActive, isVerified, etc.). |
| `PATCH` | `/admin/users/:id/role` | Changes user's RBAC role (e.g. upgrades a user to `ADMIN`). |
| `PATCH` | `/admin/users/stats` | Aggregates and returns database metrics (total, active, deleted, verified users). |

---

## 🔧 Getting Started

### Prerequisites
- [Bun Runtime](https://bun.sh/) (v1.0.0 or higher) installed locally, **OR**
- [Docker & Docker Compose](https://www.docker.com/)

### Local Development Setup

1. **Install dependencies**
   ```bash
   bun install
   ```

2. **Configure environment variables**
   Copy the example environment template and populate it with your local credentials:
   ```bash
   cp .env.example .env
   ```
   *Modify the values in `.env` if your local MongoDB or Redis port configuration differs.*

3. **Start the local database dependencies**
   Ensure your local MongoDB and Redis instances are running.

4. **Launch development server (with hot reload)**
   ```bash
   bun run dev
   ```
   The backend will connect to database engines and start listening on port `3000`.

### Running Tests

This codebase utilizes Bun's built-in test runner. Tests run in integration mode using a mocking-free approach against Hono's in-memory request system.

```bash
bun test
```

### Running with Docker Compose

To spin up the entire application (Node/Bun server, MongoDB, and Valkey/Redis) in a isolated network with single-command orchestration:

```bash
docker-compose up --build
```
This boots:
- **`app`**: Listening on port `3000`.
- **`mongo`**: Persisting database records to Docker volume.
- **`valkey`**: Running Valkey (Redis-compatible memory cache) on port `6379`.

---

## 💡 Tech Interview Q&A Cheatsheet (Prep Material)

### Q1: Why Hono and Bun over traditional Node.js & Express?
- **Bun** utilizes the WebKit JavaScriptCore engine instead of V8, which provides superior execution speed, built-in support for TypeScript (no `ts-node` or compilation steps required), and a native high-speed test runner.
- **Hono** is built on standard Web APIs (Request/Response) rather than Node-specific streams, making it extremely lightweight (under 20KB). It uses a Trie-based routing engine (RegExpRouter) which outperforms Express's linear route matching by orders of magnitude.

### Q2: What is "Token Rotation" and how does it secure applications?
- Token Rotation (specifically for refresh tokens) means that each time a client requests a new access token using a refresh token, the server returns both a **new access token** and a **new refresh token**. The old refresh token is deleted or invalidated.
- This mitigates the risk of a compromised refresh token. If a hacker intercepts a refresh token, they will try to use it. If the legitimate user also attempts a refresh, the server detects that the token is being replayed (since one of the requests will fail the Redis lookup), allowing the server to revoke all active sessions for that user.

### Q3: Why store Refresh Tokens in HttpOnly Cookies and Access Tokens in JS Memory?
- **HttpOnly Cookies** cannot be read by browser JavaScript. This protects the long-lived refresh token from being stolen via Cross-Site Scripting (XSS) scripts.
- **SameSite: Strict** ensures cookies are not sent with cross-site requests, mitigating Cross-Site Request Forgery (CSRF).
- Keeping the short-lived Access Token in browser memory (variable state) prevents persistent disk storage leaks. Even if XSS occurs, the access token will expire quickly (e.g. 1 hour).

### Q4: How is Redis leveraged for Security and Performance in this backend?
- **Authentication Blacklisting**: Upon logout, the server invalidates the session by deleting the active key `refresh:<userId>` from Redis. This prevents the stateless JWT from being reused even if the cookie is still valid on the client side.
- **Dynamic Rate Limiting**: Implements memory-efficient sliding counters in Redis (`redis.incr` and `redis.expire`) to restrict API abuse, ensuring protection against DDoS and automated dictionary attacks without bottlenecking the primary database (MongoDB).

---

## 🔒 License
This project is open-source and available under the [MIT License](LICENSE).
