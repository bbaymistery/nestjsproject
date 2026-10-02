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
} from "lucide-react";

interface ApiEndpoint {
  id: string;
  module: "Auth" | "Inventory" | "Order" | "Review" | "Admin";
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;
  title: string;
  description: string;
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
    description: "Authenticates user using Google idToken. Sets HttpOnly Access and Refresh Cookies in the browser.",
    authType: "Public",
    requestBody: {
      idToken: "string (Google Credential Token)",
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
    title: "Refresh JWT Access Token",
    description: "Refreshes expired Access Token automatically in background using HttpOnly Refresh Cookie.",
    authType: "Public",
    responseExample: {
      success: true,
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
    title: "Get Current Authenticated User",
    description: "Fetches current logged-in user profile details (name, email, role).",
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
    authType: "Public",
  },
  {
    id: "inv-get-one",
    module: "Inventory",
    method: "GET",
    path: "/api/inventory/:id",
    title: "Get Poster By ID",
    description: "Fetches full poster details, dimensions, materials, and image URLs by poster ID.",
    authType: "Public",
  },
  {
    id: "inv-categories",
    module: "Inventory",
    method: "GET",
    path: "/api/inventory/categories/list",
    title: "Get All Categories & Filters",
    description: "Fetches list of available poster categories along with item counts.",
    authType: "Public",
  },
  {
    id: "inv-create",
    module: "Inventory",
    method: "POST",
    path: "/api/inventory",
    title: "Create New Poster Item",
    description: "Creates a new poster item with uploaded images (Multipart FormData). Admin authorization required.",
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
    authType: "Admin",
  },
  {
    id: "inv-delete",
    module: "Inventory",
    method: "DELETE",
    path: "/api/inventory/:id",
    title: "Soft Delete Poster",
    description: "Deactivates poster item from public catalog (Soft Delete). Admin authorization required.",
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
    authType: "User",
  },
  {
    id: "order-get-one",
    module: "Order",
    method: "GET",
    path: "/api/order/:id",
    title: "Get Order Details By ID",
    description: "Fetches single order details and item breakdown.",
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
    authType: "User",
  },
  {
    id: "review-delete",
    module: "Review",
    method: "DELETE",
    path: "/api/review/:id",
    title: "Delete Review",
    description: "Deletes review item (Admin or Review Owner only).",
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
    authType: "Admin",
  },
  {
    id: "admin-recent-orders",
    module: "Admin",
    method: "GET",
    path: "/api/admin/orders/recent",
    title: "Get Recent Orders",
    description: "Fetches latest incoming orders list for admin dashboard.",
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
  },
  {
    id: "admin-update-order-status",
    module: "Admin",
    method: "PATCH",
    path: "/api/admin/orders/:id/status",
    title: "Update Order Status",
    description: "Updates order fulfillment status (PENDING -> PROCESSING -> SHIPPED -> DELIVERED).",
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
    authType: "Admin",
  },
  {
    id: "admin-top-products",
    module: "Admin",
    method: "GET",
    path: "/api/admin/products/top",
    title: "Get Top Selling Products",
    description: "Fetches top selling posters by unit sales and revenue.",
    authType: "Admin",
  },
  {
    id: "admin-revenue-analytics",
    module: "Admin",
    method: "GET",
    path: "/api/admin/analytics/revenue",
    title: "Get Revenue Analytics Chart Data",
    description: "Fetches revenue analytics chart dataset for specified time period (week, month, year).",
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
      endpoint.description.toLowerCase().includes(searchQuery.toLowerCase());
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
      <div className="flex flex-col gap-4 mb-10 border-b border-border/40 pb-8">
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
              Interactive reference for all NestJS HTTP Endpoints, security guards, and request parameters.
            </p>
          </div>
        </div>

        {/* Info Banner */}
        <div className="flex items-center gap-3 p-4 rounded-xl bg-secondary/40 border border-border/50 text-xs text-muted-foreground">
          <Server className="h-4 w-4 text-amber-500 flex-shrink-0" />
          <span>
            Backend Base URL: <code className="font-mono text-foreground font-bold bg-background px-2 py-0.5 rounded">http://localhost:3000</code>
          </span>
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
                  
                  {/* Description */}
                  <div>
                    <h4 className="font-bold text-foreground mb-1">Description:</h4>
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
