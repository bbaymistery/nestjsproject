# 🚀 Poster Parlor — Frontend Step-by-Step Development Roadmap

Welcome to the **Next.js 16 (App Router)** Frontend client for **Poster Parlor**! This document defines the exact step-by-step development roadmap for building our full-stack application step by step.

---

## 📌 STEP-BY-STEP DEVELOPMENT ROADMAP

```
[ Step 1: Layout & API Docs ] ──► [ Step 2: Auth & Session ] ──► [ Step 3: Catalog & Details ]
                                                                        │
[ Step 6: Product Reviews ]   ◄── [ Step 5: Stripe Checkout ] ◄── [ Step 4: Cart System ]
            │
            ▼
[ Step 7: Admin Control Center ]
```

---

### 🟢 STEP 1: Core Layout & API Documentation (COMPLETED)
- [x] **Header Component**: Logo, Navigation Links, Cart Counter, and API Docs link.
- [x] **Footer Component**: Stack info, quick links, and copyright.
- [x] **API Documentation Page (`/api-docs`)**: Interactive reference in English for all 5 NestJS modules (`Auth`, `Inventory`, `Order`, `Review`, `Admin`).

---

### 🔵 STEP 2: Authentication & Session Management (NEXT STEP)
- [ ] **Google OAuth Button & Login Modal/Page**: Integration with `@react-oauth/google`.
- [ ] **User Header Badge**: Shows user name, avatar, role (`USER` / `ADMIN`), and Logout action.
- [ ] **Auth State Sync**: Connect with `auth.api.ts` (`loginWithGoogle`, `logout`, `getCurrentUser`) and `auth.slice.ts`.

---

### 🟡 STEP 3: Poster Catalog & Product Showcase
- [ ] **Catalog Page (`/posters`)**: Grid of poster cards with images, titles, and prices.
- [ ] **Filtering & Search**: Category selector, price slider, search input, and pagination.
- [ ] **Poster Detail Page (`/posters/:id`)**: Gallery carousel, material specifications, dimensions, and stock indicators.
- [ ] **RTK Query Integration**: Connect with `inventory.api.ts` (`getAllInventory`, `getInventoryItemById`).

---

### 🟠 STEP 4: Shopping Cart & Local Persistence
- [ ] **Cart Drawer / Page (`/cart`)**: Item list, quantity increment/decrement, and item removal.
- [ ] **Price Summary**: Subtotal, shipping cost calculator, and tax calculation (`calculateOrderTotal`).
- [ ] **State Persistence**: Connect with `cart.slice.ts` and `localStorage`.

---

### 🟣 STEP 5: Checkout & Stripe Payment Integration
- [ ] **Checkout Form (`/checkout`)**: Shipping address inputs (US States dropdown).
- [ ] **Stripe Elements Widget**: Integrated Stripe card input using `publishableKey`.
- [ ] **Payment Workflow**:
  1. Call `POST /api/order/payment/initiate` to get `clientSecret`.
  2. Confirm payment via Stripe SDK.
  3. Call `POST /api/order/payment/verify` to confirm order creation.
- [ ] **Order History Page (`/myorder`)**: List user's past purchases and status.

---

### 🔴 STEP 6: Product Reviews & Ratings
- [ ] **Review Section**: Rating breakdown (1-5 stars) on poster detail page.
- [ ] **Write Review Form**: Star selector, comment text, and image attachment upload.
- [ ] **Edit / Delete Review**: Manage user's own reviews via `review.api.ts`.

---

### 👑 STEP 7: Admin Control Center
- [ ] **Admin Dashboard (`/dashboard`)**: Overview stats (Revenue, Orders, Customers).
- [ ] **Inventory Management**: Create new poster (Multipart FormData upload), edit, soft delete.
- [ ] **Order Fulfillment Table**: Update order status (`PENDING` ➔ `PROCESSING` ➔ `SHIPPED` ➔ `DELIVERED`).
- [ ] **Revenue Analytics**: Interactive chart data (`getRevenueAnalytics`).

---

## 🛠️ How to Run the Project

1. **Start Backend (NestJS):**
   ```bash
   cd api
   npm run start
   ```

2. **Start Frontend (Next.js):**
   ```bash
   cd web
   npm run dev
   ```
