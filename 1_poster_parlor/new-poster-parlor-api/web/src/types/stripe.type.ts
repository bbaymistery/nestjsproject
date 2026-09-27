// Stripe payment type declarations for frontend & backend integration

export interface InitiateStripePaymentRequest {
  orderId?: string;
  items?: Array<{
    posterId: string;
    quantity: number;
  }>;
}

export interface InitiateStripePaymentResponse {
  clientSecret: string;
  paymentIntentId: string;
  amount: number;
  currency: string;
}

export interface VerifyStripePaymentRequest {
  paymentIntentId: string;
  orderId?: string;
}

export interface VerifyStripePaymentResponse {
  success: boolean;
  message: string;
  orderId?: string;
  status: "succeeded" | "failed" | "pending";
}
