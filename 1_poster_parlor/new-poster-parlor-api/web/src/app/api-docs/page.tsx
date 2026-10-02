"use client";

import { useState } from "react";
import {
  Code2,
  Lock,
  Unlock,
  ShieldCheck,
  Search,
  Copy,
  Check,
  Server,
  ChevronDown,
  ChevronRight,
  BookOpen,
  KeyRound,
  CreditCard,
  UploadCloud,
  HelpCircle,
} from "lucide-react";

interface ApiEndpoint {
  id: string;
  module: "Auth" | "Inventory" | "Order" | "Review" | "Admin";
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;
  title: string;
  description: string;
  whyNeeded: string; // Explains WHY this endpoint exists for frontend developers!
  authType: "Public" | "User" | "Admin";
  queryParams?: Record<string, string>;
  requestBody?: Record<string, any>;
  responseExample?: Record<string, any>;
}

const API_ENDPOINTS: ApiEndpoint[] = [
  // ================= Auth Module =================
  {
    id: "auth-login",
    module: "Auth",
    method: "POST",
    path: "/api/auth/google/login",
    title: "Google OAuth Login / Register",
    description: "Authenticates user using Google Credential idToken.",
    whyNeeded: "WHY IT IS NEEDED: Performs 1-click Google Login/Registration. Backend verifies Google token and sets 2 HttpOnly cookies (access_token & refresh_token) in browser.",
    authType: "Public",
    requestBody: {
      idToken: "string (Google Credential Token from Google SDK)",
    },
    responseExample: {
      success: true,
      message: "Authentication successful",
      data: {
        user: { id: "65d123...", name: "John Doe", email: "john@gmail.com", role: "USER" },
        accessToken: "eyJhbGciOi...",
      },
    },
  },
  {
    id: "auth-refresh",
    module: "Auth",
    method: "POST",
    path: "/api/auth/google/refresh",
    title: "Refresh JWT Access Token (Silent Re-Auth)",
    description: "Refreshes expired Access Token automatically in background using HttpOnly Refresh Cookie.",
    whyNeeded: "WHY REFRESH IS NEEDED: Access Token expires in 15 minutes for maximum security. When Access Token expires, backend returns HTTP 401. Frontend RTK Query (baseQueryWithReauth) catches 401, calls this endpoint silently using HttpOnly refresh_token cookie, gets a new Access Token cookie, and retries the failed request seamlessly without logging the user out!",
    authType: "Public",
    responseExample: {
      success: true,
      message: "Token refreshed successfully",
      data: { accessToken: "eyJhbGciOi..." },
    },
  },
  {
    id: "auth-logout",
    module: "Auth",
    method: "POST",
    path: "/api/auth/google/logout",
    title: "User Logout",
    description: "Clears HttpOnly authentication cookies from browser and invalidates user session.",
    whyNeeded: "WHY IT IS NEEDED: Clears both access_token and refresh_token cookies from the browser header, ending the authenticated session cleanly.",
    authType: "User",
    responseExample: {
      success: true,
      message: "Logged out successfully",
    },
  },
  {
    id: "auth-me",
    module: "Auth",
    method: "GET",
    path: "/api/auth/google/me",
    title: "Get Current Authenticated User Profile",
    description: "Fetches current logged-in user profile details (name, email, role).",
    whyNeeded: "WHY IT IS NEEDED: Used on application load (page refresh) to check if user has an active session and populate user state in Redux store.",
    authType: "User",
    responseExample: {
      success: true,
      data: { id: "65d123...", name: "John Doe", email: "john@gmail.com", role: "USER" },
    },
  },

  // ================= Inventory Module =================
  {
    id: "inv-list",
    module: "Inventory",
    method: "GET",
    path: "/api/inventory",
    title: "Get All Posters (With Filters & Pagination)",
    description: "Fetches poster items with filtering (category, price range, search query, tags) and pagination.",
    whyNeeded: "WHY IT IS NEEDED: Powers the Catalog page (/posters) and search bar. Allows filtering posters by category, price, keywords, and page index.",
    authType: "Public",
    queryParams: {
      page: "number (default: 1)",
      limit: "number (default: 10)",
      category: "string (e.g. Movies, Anime, Vintage)",
      search: "string (keyword search)",
      sortBy: "price | stock | createdAt | title",
      sortOrder: "asc | desc",
    },
    responseExample: {
      data: {
        posters: [{ id: "1", title: "Cyberpunk Poster", price: 19.99, stock: 50 }],
        pagination: { page: 1, limit: 10, total: 45, pages: 5 },
      },
    },
  },
  {
    id: "inv-featured",
    module: "Inventory",
    method: "GET",
    path: "/api/inventory/featured",
    title: "Get Featured Posters",
    description: "Fetches curated featured posters for home page showcase.",
    whyNeeded: "WHY IT IS NEEDED: Populates the Home page featured posters carousel.",
    authType: "Public",
  },
  {
    id: "inv-get-one",
    module: "Inventory",
    method: "GET",
    path: "/api/inventory/:id",
    title: "Get Poster Details By ID",
    description: "Fetches full poster details, dimensions, materials, and Cloudinary image URLs.",
    whyNeeded: "WHY IT IS NEEDED: Powers the Poster Detail Page (/posters/:id).",
    authType: "Public",
  },
  {
    id: "inv-categories",
    module: "Inventory",
    method: "GET",
    path: "/api/inventory/categories/list",
    title: "Get All Categories & Filter Counts",
    description: "Fetches list of available poster categories along with item counts.",
    whyNeeded: "WHY IT IS NEEDED: Populates category filter sidebar dropdowns in catalog.",
    authType: "Public",
  },
  {
    id: "inv-create",
    module: "Inventory",
    method: "POST",
    path: "/api/inventory",
    title: "Create New Poster Item (Admin Upload)",
    description: "Creates a new poster item with uploaded images (Multipart FormData). Admin authorization required.",
    whyNeeded: "WHY IT IS NEEDED: Admin panel product creation form. Backend uploads images to Cloudinary CDN automatically.",
    authType: "Admin",
    requestBody: {
      title: "Cyberpunk City",
      description: "Futuristic neon poster",
      category: "Sci-Fi",
      dimensions: "24x36 inches",
      price: 24.99,
      stock: 100,
      images: "File[] (Multipart FormData)",
    },
  },
  {
    id: "inv-update",
    module: "Inventory",
    method: "PUT",
    path: "/api/inventory/:id",
    title: "Update Poster Item",
    description: "Updates poster details and manages image gallery. Admin authorization required.",
    whyNeeded: "WHY IT IS NEEDED: Admin panel product editing form.",
    authType: "Admin",
  },
  {
    id: "inv-delete",
    module: "Inventory",
    method: "DELETE",
    path: "/api/inventory/:id",
    title: "Soft Delete Poster",
    description: "Deactivates poster item from public catalog (Soft Delete). Admin authorization required.",
    whyNeeded: "WHY IT IS NEEDED: Admin panel product deactivation without destroying purchase order records.",
    authType: "Admin",
  },

  // ================= Order & Stripe Module =================
  {
    id: "order-stripe-key",
    module: "Order",
    method: "GET",
    path: "/api/order/payment/key",
    title: "Get Stripe Publishable Key",
    description: "Retrieves Stripe Publishable Key used by frontend Stripe Elements widget.",
    whyNeeded: "WHY IT IS NEEDED: Step 1 of Checkout. Frontend initializes Stripe Elements SDK with this key.",
    authType: "User",
    responseExample: {
      data: { publishableKey: "pk_test_51..." },
    },
  },
  {
    id: "order-stripe-initiate",
    module: "Order",
    method: "POST",
    path: "/api/order/payment/initiate",
    title: "Initiate Stripe PaymentIntent",
    description: "Creates Stripe PaymentIntent and returns clientSecret for checkout widget.",
    whyNeeded: "WHY IT IS NEEDED: Step 2 of Checkout. Calculates subtotal, shipping cost, tax in USD, creates Stripe PaymentIntent, and returns clientSecret to mount credit card input.",
    authType: "User",
    requestBody: {
      items: [{ posterId: "65d123...", quantity: 2, price: 19.99 }],
      shippingAddress: { addressLine1: "123 Main St", city: "New York", state: "NY", pincode: "10001" },
      shippingCost: 5.0,
      taxAmount: 3.2,
      totalPrice: 48.18,
    },
    responseExample: {
      data: {
        clientSecret: "pi_3M..._secret_...",
        paymentIntentId: "pi_3M...",
        amount: 4818,
        currency: "usd",
      },
    },
  },
  {
    id: "order-stripe-verify",
    module: "Order",
    method: "POST",
    path: "/api/order/payment/verify",
    title: "Verify Stripe Payment & Create Order",
    description: "Verifies Stripe payment status (succeeded) and generates new Order document in MongoDB.",
    whyNeeded: "WHY IT IS NEEDED: Step 3 of Checkout. After credit card payment succeeds, frontend calls this endpoint to confirm payment status with Stripe API and save the order in database.",
    authType: "User",
    requestBody: {
      paymentIntentId: "pi_3M...",
      orderId: "string (optional)",
    },
  },
  {
    id: "order-get-mine",
    module: "Order",
    method: "GET",
    path: "/api/order",
    title: "Get Authenticated User Orders",
    description: "Fetches order history for current logged-in user.",
    whyNeeded: "WHY IT IS NEEDED: Powers the My Orders page (/myorder).",
    authType: "User",
  },
  {
    id: "order-get-one",
    module: "Order",
    method: "GET",
    path: "/api/order/:id",
    title: "Get Order Details By ID",
    description: "Fetches single order details and item breakdown.",
    whyNeeded: "WHY IT IS NEEDED: Shows order confirmation and shipping status tracking details.",
    authType: "User",
  },

  // ================= Review Module =================
  {
    id: "review-get-poster",
    module: "Review",
    method: "GET",
    path: "/api/review/:posterId",
    title: "Get Poster Reviews",
    description: "Fetches ratings, reviews, and uploaded photos for a specific poster.",
    whyNeeded: "WHY IT IS NEEDED: Displays customer reviews section on Poster Detail Page.",
    authType: "Public",
    queryParams: {
      page: "number (default: 1)",
      limit: "number (default: 10)",
      sort: "newest | oldest | highest | lowest",
      rating: "1..5 (filter by rating)",
      hasImage: "true (only with photos)",
    },
  },
  {
    id: "review-create",
    module: "Review",
    method: "POST",
    path: "/api/review/:posterId",
    title: "Create Product Review",
    description: "Submits a review rating (1-5 stars), text comment, and optional image attachments.",
    whyNeeded: "WHY IT IS NEEDED: Allows verified buyers to post star rating and review photos.",
    authType: "User",
    requestBody: {
      rating: 5,
      comment: "Amazing poster quality!",
      images: "File[] (Multipart FormData)",
    },
  },
  {
    id: "review-update",
    module: "Review",
    method: "PUT",
    path: "/api/review/:id",
    title: "Update Review",
    description: "Allows user to update their existing product review.",
    whyNeeded: "WHY IT IS NEEDED: Allows review author to edit their comment or rating.",
    authType: "User",
  },
  {
    id: "review-delete",
    module: "Review",
    method: "DELETE",
    path: "/api/review/:id",
    title: "Delete Review",
    description: "Deletes review item (Admin or Review Owner only).",
    whyNeeded: "WHY IT IS NEEDED: Allows review author or Admin to delete a review.",
    authType: "User",
  },

  // ================= Admin Module =================
  {
    id: "admin-stats",
    module: "Admin",
    method: "GET",
    path: "/api/admin/stats",
    title: "Get Dashboard Overview Stats",
    description: "Fetches admin dashboard metrics (revenue, order counts, customer totals, growth percentages).",
    whyNeeded: "WHY IT IS NEEDED: Populates top metric cards on Admin Dashboard (/dashboard).",
    authType: "Admin",
  },
  {
    id: "admin-recent-orders",
    module: "Admin",
    method: "GET",
    path: "/api/admin/orders/recent",
    title: "Get Recent Orders",
    description: "Fetches latest incoming orders list for admin dashboard.",
    whyNeeded: "WHY IT IS NEEDED: Populates recent orders table on Admin Dashboard.",
    authType: "Admin",
  },
  {
    id: "admin-all-orders",
    module: "Admin",
    method: "GET",
    path: "/api/admin/orders",
    title: "Get All Orders (Admin Filters & Pagination)",
    description: "Fetches all orders with search, status filtering, and pagination for admin management.",
    authType: "Admin",
    whyNeeded: "WHY IT IS NEEDED: Admin Order Fulfillment page to search orders by customer name, status, or date.",
  },
  {
    id: "admin-update-order-status",
    module: "Admin",
    method: "PATCH",
    path: "/api/admin/orders/:id/status",
    title: "Update Order Status",
    description: "Updates order fulfillment status (PENDING -> PROCESSING -> SHIPPED -> DELIVERED).",
    whyNeeded: "WHY IT IS NEEDED: Admin changes order status and enters tracking number when shipping.",
    authType: "Admin",
    requestBody: {
      status: "SHIPPED",
      trackingNumber: "TRK-987654321USA",
    },
  },
  {
    id: "admin-cancel-order",
    module: "Admin",
    method: "PATCH",
    path: "/api/admin/orders/:id/cancel",
    title: "Cancel Order (Admin)",
    description: "Cancels order and restores poster stock quantities.",
    whyNeeded: "WHY IT IS NEEDED: Admin cancels an order and automatically increments product inventory stock back.",
    authType: "Admin",
    requestBody: {
      reason: "Customer requested cancellation",
    },
  },
  {
    id: "admin-customers",
    module: "Admin",
    method: "GET",
    path: "/api/admin/customers",
    title: "Get All Customers List",
    description: "Fetches registered customer accounts with order count and total spend analytics.",
    whyNeeded: "WHY IT IS NEEDED: Admin Customers page to inspect customer purchase history.",
    authType: "Admin",
  },
  {
    id: "admin-top-products",
    module: "Admin",
    method: "GET",
    path: "/api/admin/products/top",
    title: "Get Top Selling Products",
    description: "Fetches top selling posters by unit sales and revenue.",
    whyNeeded: "WHY IT IS NEEDED: Admin analytics page for best-selling poster reports.",
    authType: "Admin",
  },
  {
    id: "admin-revenue-analytics",
    module: "Admin",
    method: "GET",
    path: "/api/admin/analytics/revenue",
    title: "Get Revenue Analytics Chart Data",
    description: "Fetches revenue analytics chart dataset for specified time period (week, month, year).",
    whyNeeded: "WHY IT IS NEEDED: Renders revenue trend chart on Admin Dashboard.",
    authType: "Admin",
    queryParams: {
      period: "week | month | year",
    },
  },
];

export default function ApiDocsPage() {
  const [selectedModule, setSelectedModule] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const modules = ["All", "Auth", "Inventory", "Order", "Review", "Admin"];

  const filteredEndpoints = API_ENDPOINTS.filter((endpoint) => {
    const matchesModule = selectedModule === "All" || endpoint.module === selectedModule;
    const matchesSearch =
      endpoint.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
      endpoint.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      endpoint.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      endpoint.whyNeeded.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesModule && matchesSearch;
  });

  const handleCopy = (path: string, id: string) => {
    const fullUrl = `http://localhost:3000${path}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getMethodBadgeClass = (method: ApiEndpoint["method"]) => {
    switch (method) {
      case "GET":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "POST":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case "PUT":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "PATCH":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      case "DELETE":
        return "bg-rose-500/10 text-rose-500 border-rose-500/20";
    }
  };

  const getAuthBadge = (authType: ApiEndpoint["authType"]) => {
    switch (authType) {
      case "Public":
        return (
          <span className="flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Unlock className="h-3 w-3" /> Public
          </span>
        );
      case "User":
        return (
          <span className="flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Lock className="h-3 w-3" /> Auth User
          </span>
        );
      case "Admin":
        return (
          <span className="flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <ShieldCheck className="h-3 w-3" /> Admin Only
          </span>
        );
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-8 py-10 max-w-6xl">
      
      {/* Page Header */}
      <div className="flex flex-col gap-4 mb-8 border-b border-border/40 pb-8">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500 via-purple-600 to-indigo-600 shadow-lg">
            <BookOpen className="h-6 w-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-black tracking-tight">NestJS API Documentation</h1>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20">
                v1.0 (NestJS + Stripe)
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">
              Comprehensive Frontend Developer Guide for NestJS API endpoints, security guards, and request parameters.
            </p>
          </div>
        </div>

        {/* Base URL info */}
        <div className="flex items-center gap-3 p-4 rounded-xl bg-secondary/40 border border-border/50 text-xs text-muted-foreground">
          <Server className="h-4 w-4 text-amber-500 flex-shrink-0" />
          <span>
            Backend Base URL: <code className="font-mono text-foreground font-bold bg-background px-2 py-0.5 rounded">http://localhost:3000</code>
          </span>
        </div>
      </div>

      {/* 💡 ARCHITECTURE GUIDE CAROUSEL FOR FRONTEND DEVELOPERS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        
        {/* Guide 1: Auth & Silent Refresh */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-background to-secondary/40 border border-amber-500/20 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-amber-500 font-bold text-sm">
            <KeyRound className="h-4 w-4" />
            1. Auth & Silent Refresh
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            NestJS sets 2 HttpOnly cookies (<code className="text-amber-400">access_token</code> & <code className="text-amber-400">refresh_token</code>). When Access Token expires (15 min), backend returns <code className="text-red-400">401</code>. RTK Query automatically calls <code className="text-emerald-400">POST /api/auth/google/refresh</code> silently and retries the original request!
          </p>
        </div>

        {/* Guide 2: Stripe Checkout Flow */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-500/10 via-background to-secondary/40 border border-blue-500/20 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
            <CreditCard className="h-4 w-4" />
            2. Stripe Checkout Flow
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Step 1: Get publishable key (<code className="text-blue-400">/payment/key</code>). Step 2: Initiate PaymentIntent (<code className="text-blue-400">/payment/initiate</code>) to receive <code className="text-emerald-400">clientSecret</code>. Step 3: Mount Stripe Elements card widget. Step 4: Verify payment (<code className="text-blue-400">/payment/verify</code>) to generate MongoDB Order.
          </p>
        </div>

        {/* Guide 3: Image Uploads */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-500/10 via-background to-secondary/40 border border-purple-500/20 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
            <UploadCloud className="h-4 w-4" />
            3. Multipart Image Uploads
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Posters and review photos use <code className="text-purple-400">multipart/form-data</code> with <code className="text-emerald-400">images</code> file field. NestJS interceptor uploads files directly to Cloudinary CDN and returns secure HTTPS image URLs.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        
        {/* Module Categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
          {modules.map((mod) => (
            <button
              key={mod}
              onClick={() => setSelectedModule(mod)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 whitespace-nowrap ${
                selectedModule === mod
                  ? "bg-amber-500 text-black font-bold shadow-md shadow-amber-500/20"
                  : "bg-secondary/60 text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              {mod === "All" ? "All Endpoints" : `${mod} Module`}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search endpoint..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs font-medium rounded-lg bg-secondary/50 border border-border/50 focus:outline-none focus:border-amber-500/50 transition-colors"
          />
        </div>
      </div>

      {/* Endpoints Count */}
      <div className="text-xs text-muted-foreground mb-4 font-medium">
        Showing <span className="text-foreground font-bold">{filteredEndpoints.length}</span> API endpoints
      </div>

      {/* Endpoints List */}
      <div className="flex flex-col gap-3">
        {filteredEndpoints.map((endpoint) => {
          const isExpanded = expandedId === endpoint.id;
          const isCopied = copiedId === endpoint.id;

          return (
            <div
              key={endpoint.id}
              className="group border border-border/40 hover:border-border/80 bg-card rounded-xl transition-all duration-200 shadow-sm overflow-hidden"
            >
              {/* Header Card */}
              <div
                onClick={() => setExpandedId(isExpanded ? null : endpoint.id)}
                className="flex items-center justify-between p-4 cursor-pointer select-none hover:bg-secondary/30 transition-colors"
              >
                <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
                  {/* Method Badge */}
                  <span
                    className={`font-mono text-xs font-black px-2.5 py-1 rounded-md border ${getMethodBadgeClass(
                      endpoint.method
                    )}`}
                  >
                    {endpoint.method}
                  </span>

                  {/* Path */}
                  <code className="font-mono text-sm font-bold text-foreground tracking-tight">
                    {endpoint.path}
                  </code>

                  {/* Title */}
                  <span className="text-xs text-muted-foreground font-medium hidden md:inline">
                    • {endpoint.title}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {getAuthBadge(endpoint.authType)}

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopy(endpoint.path, endpoint.id);
                    }}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                    title="Copy URL"
                  >
                    {isCopied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                  </button>

                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="p-4 border-t border-border/40 bg-secondary/20 flex flex-col gap-4 text-xs">
                  
                  {/* Why Needed Explanation */}
                  <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-200 flex items-start gap-2">
                    <HelpCircle className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-amber-400">Developer Architecture Note:</span>
                      <p className="mt-0.5 text-[11px] leading-relaxed text-amber-200/90">{endpoint.whyNeeded}</p>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <h4 className="font-bold text-foreground mb-1">Overview:</h4>
                    <p className="text-muted-foreground leading-relaxed">{endpoint.description}</p>
                  </div>

                  {/* Query Parameters */}
                  {endpoint.queryParams && (
                    <div>
                      <h4 className="font-bold text-foreground mb-2">Query Parameters:</h4>
                      <div className="bg-background rounded-lg p-3 border border-border/40 font-mono text-[11px] flex flex-col gap-1">
                        {Object.entries(endpoint.queryParams).map(([key, value]) => (
                          <div key={key} className="flex items-center justify-between">
                            <span className="text-amber-500 font-semibold">{key}:</span>
                            <span className="text-muted-foreground">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Request Body */}
                  {endpoint.requestBody && (
                    <div>
                      <h4 className="font-bold text-foreground mb-2">Request Body (JSON Format):</h4>
                      <pre className="bg-background rounded-lg p-3 border border-border/40 font-mono text-[11px] text-emerald-400 overflow-x-auto">
                        {JSON.stringify(endpoint.requestBody, null, 2)}
                      </pre>
                    </div>
                  )}

                  {/* Response Example */}
                  {endpoint.responseExample && (
                    <div>
                      <h4 className="font-bold text-foreground mb-2">Response Example:</h4>
                      <pre className="bg-background rounded-lg p-3 border border-border/40 font-mono text-[11px] text-blue-400 overflow-x-auto">
                        {JSON.stringify(endpoint.responseExample, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
