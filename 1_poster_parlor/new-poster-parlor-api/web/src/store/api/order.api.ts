import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./base.query";
import { buildApiUrl } from "@/lib/helper";

// Poster image interface
export interface PosterImage {
  url: string;
  public_id: string;
  format?: string;
  width?: number;
  height?: number;
}

// Populated poster details (when order is fetched with populate)
export interface PopulatedPoster {
  _id: string;
  title: string;
  images: PosterImage[];
  dimensions: string;
  material?: string;
  category: string;
}

// Types matching the NestJS backend DTOs
export interface OrderItemDto {
  posterId: string | PopulatedPoster; // Can be string or populated poster
  quantity: number;
  price: number;
}

export interface ShippingAddressDto {
  addressLine1: string;
  city: string;
  state: string;
  pincode: string;
}

export interface PaymentDetailsDto {
  method: "STRIPE" | "COD";
  amount: number;
  currency: "INR" | "USD";
  paymentIntentId?: string;
}

export interface CustomerInfoDto {
  name: string;
  email?: string;
  phone: string;
  userId?: string;
}

export interface CreateOrderDto {
  customer?: CustomerInfoDto;
  userId?: string;
  items: { posterId: string; quantity: number; price: number }[];
  shippingAddress: ShippingAddressDto;
  paymentDetails: PaymentDetailsDto;
  status?: string;
  isPaid?: boolean;
  shippingCost?: number;
  taxAmount?: number;
  totalPrice?: number;
  notes?: string;
}

export type OrderStatus = | "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";

export interface OrderResponse {
  _id: string;
  customer: CustomerInfoDto | null;
  items: OrderItemDto[];
  shippingAddress: ShippingAddressDto;
  paymentDetails: PaymentDetailsDto;
  status: OrderStatus;
  isPaid: boolean;
  shippingCost: number;
  taxAmount: number;
  totalPrice: number;
  notes?: string;
  trackingNumber?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalOrders: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedOrdersResponse {
  orders: OrderResponse[];
  pagination: PaginationInfo;
}

export interface GetOrdersParams {
  page?: number;
  limit?: number;
}

// ==========================================
// 💳 STRIPE PAYMENT DTOs (NestJS Backend Integration)
// ==========================================

export interface InitiateStripePaymentDto {
  items: { posterId: string; quantity: number; price: number }[];
  shippingAddress: ShippingAddressDto;
  shippingCost: number;
  taxAmount: number;
  totalPrice: number;
}

export interface InitiateStripePaymentResponse {
  clientSecret: string;
  paymentIntentId: string;
  amount: number;
  currency: string;
}

export interface VerifyStripePaymentDto {
  paymentIntentId: string;
  orderId?: string;
}

export const orderApi = createApi({
  reducerPath: "orderApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Order"],
  endpoints: (builder) => ({

    // -------------------------------------------------------------
    // 🔗 Backend: GET /api/order/payment/key (OrderController -> getPaymentKey)
    // Stripe Publishable Key-i götürür
    // -------------------------------------------------------------
    getPaymentKey: builder.query<{ data: { publishableKey: string } }, void>({
      query: () => "/order/payment/key",
    }),

    // -------------------------------------------------------------
    // 🔗 Backend: POST /api/order/payment/initiate (OrderController -> initiatePayment)
    // Stripe PaymentIntent yaradır və clientSecret qaytarır
    // -------------------------------------------------------------
    initiatePayment: builder.mutation<{ data: InitiateStripePaymentResponse }, InitiateStripePaymentDto>({
      query: (paymentData) => ({ url: "/order/payment/initiate", method: "POST", body: paymentData, }),
    }),

    // -------------------------------------------------------------
    // 🔗 Backend: POST /api/order/payment/verify (OrderController -> verifyPayment)
    // Stripe tərəfindən ödənişin statusunu (succeeded) yoxlayır və DB-də sifarişi yaradır
    // -------------------------------------------------------------
    verifyPayment: builder.mutation<{ data: OrderResponse }, VerifyStripePaymentDto>({
      query: (verifyData) => ({ url: "/order/payment/verify", method: "POST", body: verifyData, }),
      invalidatesTags: ["Order"],
    }),

    // -------------------------------------------------------------
    // 🔗 Backend: POST /api/order (OrderController -> createOrder)
    // Birbaşa COD (Cash on Delivery) və ya manual sifariş yaradır
    // -------------------------------------------------------------
    createOrder: builder.mutation<{ data: OrderResponse }, CreateOrderDto>({
      query: (orderData) => ({ url: "/order", method: "POST", body: orderData, }),
      invalidatesTags: ["Order"],
    }),

    // -------------------------------------------------------------
    // 🔗 Backend: GET /api/order (OrderController -> getMyOrders)
    // Giriş etmiş istifadəçinin bütün sifarişlərini gətirir
    // -------------------------------------------------------------
    getMyOrders: builder.query<{ data: PaginatedOrdersResponse }, GetOrdersParams | void>({
      query: (params) => buildApiUrl("/order", { page: params?.page, limit: params?.limit, }),
      providesTags: ["Order"],
    }),

    // -------------------------------------------------------------
    // 🔗 Backend: GET /api/order/:id (OrderController -> getOrderById)
    // ID-yə görə tək sifarişin təfərrüatlarını gətirir
    // -------------------------------------------------------------
    getOrderById: builder.query<{ data: OrderResponse }, string>({
      query: (orderId) => `/order/${orderId}`,
      providesTags: (result, error, id) => [{ type: "Order", id }],
    }),
  }),
});

export const {
  useGetPaymentKeyQuery,
  useInitiatePaymentMutation,
  useVerifyPaymentMutation,
  useCreateOrderMutation,
  useGetMyOrdersQuery,
  useGetOrderByIdQuery,
  useLazyGetOrderByIdQuery,
} = orderApi;
