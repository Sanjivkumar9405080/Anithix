# ANTHIX — Full Stack Architecture & Authentication System

**Tagline:** Ideas Into Impact.

This repository contains the complete full-stack codebase for **ANTHIX**, featuring:
- **Backend**: Node.js, Express, MongoDB (Mongoose), TypeScript, MVC architecture, secure session management (HttpOnly cookies + JWT), password hashing (bcrypt), Email OTP verification for registration and passwordless login, and role-based access control (RBAC) for the dedicated Admin Dashboard.
- **Frontend**: React 18, TypeScript, Tailwind CSS, GSAP, Three.js, React Router with protected route enforcement, AuthContext, accessible OTP verification, and a responsive Admin Console with analytics, message management, and user auditing.

---

## Workspace Structure (MVC Architecture)

```text
Anithix/
├── backend/                             # Express + TypeScript + MongoDB MVC Backend
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.ts                    # Mongoose lifecycle, error handling & status
│   │   │   ├── email.ts                 # Nodemailer SMTP transport & dev mock logger
│   │   │   └── env.ts                   # Validated environment variables
│   │   ├── models/
│   │   │   ├── User.ts                  # User schema (indexed email, passwordHash, status)
│   │   │   ├── OTPVerification.ts       # Hashed OTP schema with TTL index & attempts
│   │   │   └── Contact.ts               # Contact schema linked to authenticated userId
│   │   ├── controllers/
│   │   │   ├── authController.ts        # Register, login, OTP verify, resend, logout, me
│   │   │   ├── adminController.ts       # Secure admin dashboard, messages, users & CSV
│   │   │   ├── contactController.ts     # Protected inquiry submission & retrieval
│   │   │   └── userController.ts        # Authenticated user profile retrieval
│   │   ├── services/
│   │   │   ├── authService.ts           # Password hashing, JWT signing & cookie management
│   │   │   ├── otpService.ts            # Crypto OTP generator, bcrypt hashing & cooldowns
│   │   │   └── emailService.ts          # ANTHIX branded HTML email templates
│   │   ├── routes/
│   │   │   ├── authRoutes.ts            # /api/auth endpoints
│   │   │   ├── adminRoutes.ts           # /api/admin endpoints (Protected by requireAdmin)
│   │   │   ├── contactRoutes.ts         # /api/contact endpoints (Protected)
│   │   │   ├── userRoutes.ts            # /api/users endpoints (Protected)
│   │   │   └── healthRoutes.ts          # /api/health endpoint (Public)
│   │   ├── middleware/
│   │   │   ├── authenticate.ts          # HttpOnly cookie/JWT verifier & requireAdmin guard
│   │   │   ├── validateRequest.ts       # Generic Zod validation middleware
│   │   │   ├── rateLimiter.ts           # IP-based rate limiting (API, Auth, OTP)
│   │   │   ├── notFound.ts              # 404 Route handler
│   │   │   └── errorHandler.ts          # Centralized error handler
│   │   ├── validators/
│   │   │   ├── authValidators.ts        # Zod schemas for register, login, OTP
│   │   │   ├── adminValidators.ts       # Zod schemas for status update, notes, pagination
│   │   │   └── contactValidators.ts     # Zod schemas for project inquiry submission
│   │   ├── scripts/
│   │   │   └── createAdmin.ts           # Server-side setup script for admin provisioning
│   │   ├── utils/
│   │   │   └── apiResponse.ts           # Standardized JSON response formatters
│   │   ├── app.ts                       # Express application configuration
│   │   └── server.ts                    # HTTP server & graceful shutdown handlers
│   ├── test-api.js                      # 53 automated integration & E2E tests
│   ├── .env.example                     # Backend environment template
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                            # React 18 + TypeScript + Vite + Tailwind CSS
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/
│   │   │   │   └── AdminRoute.tsx       # RBAC Route Guard with 403 Forbidden screen
│   │   │   └── common/
│   │   │       ├── Navbar.tsx           # Public & authenticated user state header
│   │   │       ├── ProtectedRoute.tsx   # Enforces login for protected routes
│   │   │       ├── Button.tsx
│   │   │       └── Footer.tsx
│   │   ├── context/
│   │   │   └── AuthContext.tsx          # Authentication provider (session, adminLogin, isAdmin)
│   │   ├── layouts/
│   │   │   ├── MainLayout.tsx           # Public website layout (Navbar + Footer)
│   │   │   └── AdminLayout.tsx          # Admin layout (responsive sidebar, drawer, header)
│   │   ├── services/
│   │   │   └── api.ts                   # Centralized API service with admin endpoints & CSV export
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   │   ├── AdminLogin.tsx       # Dedicated administrator sign-in
│   │   │   │   ├── AdminDashboard.tsx   # Live DB metrics, inquiries status, service distribution
│   │   │   │   ├── AdminMessages.tsx    # Inquiries list with search, status/service filter & CSV
│   │   │   │   ├── AdminMessageDetail.tsx # Full message view, status manager, internal notes
│   │   │   │   └── AdminUsers.tsx       # Registered users directory with inquiry histories
│   │   │   ├── auth/
│   │   │   │   ├── Login.tsx            # Passwordless email OTP login
│   │   │   │   ├── Register.tsx         # User registration with password strength rules
│   │   │   │   └── VerifyOtp.tsx        # 6-digit OTP input with resend countdown
│   │   │   ├── contact/
│   │   │   │   └── Contact.tsx          # Protected contact inquiry page (prefilled)
│   │   │   ├── home/                    # Public Home page & 3D hero scene
│   │   │   ├── about/                   # Public About page
│   │   │   ├── services/                # Public Services page
│   │   │   ├── projects/                # Public Projects showcase
│   │   │   ├── approach/                # Public Our Approach page
│   │   │   └── faq/                     # Public FAQ page with scroll scrub
│   │   ├── App.tsx                      # Main router with protected client & admin routes
│   │   └── main.tsx
│   ├── .env.example
│   ├── package.json
│   └── tailwind.config.js
│
├── package.json                         # Root monorepo workspace runner scripts
└── README.md
```

---

## 1. Prerequisites

- **Node.js**: v18+ or v20+ recommended
- **MongoDB**: MongoDB Atlas URI or local instance (e.g. `mongodb://127.0.0.1:27017/anthix`)
- **SMTP Provider (Optional in dev)**: Gmail, SendGrid, Mailgun, Brevo, AWS SES, or any standard SMTP host. *In development without SMTP credentials, the backend automatically uses a safe console logger displaying the generated OTP code.*

---

## 2. Environment Configuration

### Backend (`backend/.env`)
Copy `backend/.env.example` to `backend/.env`:
```env
PORT=5000
NODE_ENV=development

# MongoDB Connection String
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.ann00ws.mongodb.net/Anithix

# Client Origin (CORS & cookie domain)
CLIENT_URL=http://localhost:5173
FRONTEND_URL=http://localhost:5173

# Authentication Security
JWT_SECRET=anthix_dev_jwt_secret_key_8923419827349182374
COOKIE_NAME=anthix_session

# Optional Real SMTP Email Delivery (leave empty in dev for mock logger)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=ANTHIX Security <no-reply@anthix.com>

# Security Policies
OTP_EXPIRY_MINUTES=5
OTP_MAX_ATTEMPTS=5
OTP_RESEND_COOLDOWN_SECONDS=60
```

### Frontend (`frontend/.env`)
Copy `frontend/.env.example` to `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000
```

---

## 3. Running the Application

### Option A: Monorepo Root Scripts (Recommended)

1. **Install Dependencies**:
   ```bash
   npm --prefix backend install
   npm --prefix frontend install
   ```

2. **Run Backend API Server**:
   ```bash
   npm run dev:backend
   ```
   > API server runs on `http://localhost:5000`.

3. **Run Frontend Application** (in a separate terminal):
   ```bash
   npm run dev:frontend
   ```
   > Web application runs on `http://localhost:5173`.

4. **Run Backend Integration & E2E Test Suite**:
   ```bash
   npm run test:backend
   ```

5. **Provision Administrator Account**:
   Administrators cannot register publicly through the normal user registration flow. Create an authorized admin using the secure server CLI script:
   ```bash
   npm run admin:create -- --email admin@anthix.com --password YourStrongPassword123! --name "ANTHIX Administrator"
   ```

6. **Build Both for Production**:
   ```bash
   npm run build
   ```

---

## 4. Required User Flows Implemented

### A. Public Website Browsing
All informational pages remain completely open to visitors without requiring login:
- **Home** (`/`)
- **About** (`/about`)
- **Services** (`/services`)
- **Our Approach** (`/approach`)
- **Projects** (`/projects`)
- **FAQ** (`/faq`)

### B. Contact Access Requires Authentication
- When an unauthenticated visitor clicks "Contact" or "Let's Talk", `ProtectedRoute` redirects to `/login` with friendly message: *"Please register or log in to contact ANTHIX."*
- The original destination is preserved so the user is seamlessly returned to `/contact` upon authentication.

### C. Registration with Email OTP
1. Visitor navigates to `/register` and provides Name, Email, Password (8+ chars, uppercase, lowercase, number), and Confirm Password.
2. Form validated client-side and server-side using **Zod**.
3. Password hashed with **bcrypt** (salt rounds: 12).
4. Cryptographically secure 6-digit OTP generated via `crypto.randomInt()`, hashed with bcrypt, and stored in `OTPVerification` with 5-minute expiry.
5. Email OTP sent via **Nodemailer** (or logged to development console).
6. User enters OTP on `/verify-otp`.
7. Once verified, account is activated, an authenticated session is established via an **HttpOnly cookie**, and user is navigated to `/contact`.
8. Registered accounts always receive standard `role: 'user'` permissions and can never self-escalate.

### D. Passwordless Login via Email OTP
1. Registered user enters email on `/login`.
2. Backend checks if account exists (unregistered emails rejected with HTTP 404).
3. 6-digit login OTP generated and sent to email.
4. User enters code on `/verify-otp`.
5. Upon verification, session established via HttpOnly cookie and user returned to their intended destination.
6. 60-second cooldown enforced on resend requests.

### E. Authenticated Contact Submission
1. Contact page is unlocked. Name and email prefill from user profile.
2. Submitting inquiry sends payload to `POST /api/contact` with HttpOnly cookie.
3. Backend validates session, attaches `userId`, and saves inquiry to MongoDB.
4. User remains authenticated across page refreshes via `GET /api/auth/me`.
5. Navbar displays user initials avatar, user name, and a **Logout** option which clears session cookies.

---

## 5. Admin Console & Management System

### A. Dedicated Administrator Sign-In (`/admin/login`)
- Separate, password-authenticated login for authorized administrators.
- Rejects non-admin credentials with an authentication error.

### B. Role-Based Route Guard (`<AdminRoute>`)
- Enforces both active authentication and server-verified `role === 'admin'`.
- Unauthenticated requests are redirected to `/admin/login` preserving target location.
- Authenticated regular users (`role: 'user'`) attempting to access any admin URL are stopped with a strict **403 Forbidden** screen and a button returning them to the main website.

### C. Executive Dashboard (`/admin`)
- Real database aggregates: Total Inquiries, New Inquiries, In Progress, Replied, Closed, and Registered Users count.
- Service demand breakdown visualizing which offerings receive the most client inquiries.
- Quick-access table of the latest client submissions with one-click inspection.

### D. Inquiries Management (`/admin/messages`)
- Real-time search across client names, emails, organizations, and message bodies.
- Multi-dimensional filtering by inquiry status (`new`, `in_progress`, `replied`, `closed`) and service offering.
- Sorting by newest or oldest submissions.
- Paginated table showing full client context and status badges.
- **CSV Data Export** (`/api/admin/export/messages`): Downloads inquiries with current search and filters applied, sanitized against CSV formula injection (`=`, `+`, `-`, `@`).

### E. Detailed Inquiry Workspace (`/admin/messages/:id`)
- Complete submission dossier: client full name, verified email, direct phone number, organization, service requested, and full message text.
- Live status workflow switcher (`New` ➔ `In Progress` ➔ `Replied` ➔ `Closed`).
- **Private Internal Notes**: Administrator scratchpad for internal team updates, customer phone notes, or proposal drafts.
- **Strict Data Privacy**: Internal notes and archival flags are strictly scrubbed on public/client-facing endpoints and never returned to the inquiry submitter.
- **Soft-Delete Message Archival**: Allows safe archiving without breaking historical references.

### F. User Directory (`/admin/users`)
- Searchable user accounts list with name, email, verification status, and registration date.
- Real-time aggregated inquiry counts per user.
- Detail drawer with full user dossier and chronological history of their submitted inquiries.

---

## 6. Security Checklist

- [x] **Role-Based Access Control (RBAC)**: Enforced at database schema, server controller, middleware (`requireAdmin`), and React Router guard layers.
- [x] **Strict Privilege Separation**: Normal registration never assigns `admin` role; public registration can never escalate privileges.
- [x] **HttpOnly & SameSite Cookies**: Tokens never accessible to client JavaScript; protected from XSS and CSRF.
- [x] **No Plaintext Passwords or OTPs**: Passwords hashed with bcrypt (12 rounds); OTPs hashed with bcrypt (10 rounds).
- [x] **CSV Formula Injection Mitigation**: All CSV fields starting with `=`, `+`, `-`, or `@` are safely prefixed with single quotes.
- [x] **Data Isolation**: Private `adminNotes` and internal tracking fields are excluded from all public and user endpoints.
- [x] **Single-Use OTPs & Expired Token Cleanup**: MongoDB TTL index automatically purges expired codes.
- [x] **Rate Limiting**: IP-based rate limiting on all API, auth, and OTP endpoints.
- [x] **Credential Scrubbing**: MongoDB connection strings are masked in logs.
- [x] **Strict CORS & Helmet**: Only trusted origins permitted.
- [x] **10kb Request Body Limits**: Protection against large payload Denial of Service (DoS) attacks.
- [x] **53 Automated Integration Tests**: Comprehensive automated test suite verifying auth, contacts, admin RBAC, and data privacy.
