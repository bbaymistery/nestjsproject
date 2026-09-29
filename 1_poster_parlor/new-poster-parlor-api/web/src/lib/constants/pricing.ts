/**
 * 💰 PRICING & SHIPPING CONSTANTS
 * 
 * Bu fayl tətbiqdə istifadə olunan çatdırılma haqqı, vergi dərəcəsi (GST) və regional 
 * çatdırılma məhdudiyyətləri üçün sabit (constant) qiymət parametrlərini saxlayır.
 */

/**
 * 📍 Qeydiyyat və Sifariş pəncərəsində çatdırılma ünvanı üçün ştatlar siyahısı
 */
export const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu and Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Ladakh",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Delhi",
] as const;

export type IndianState = (typeof INDIAN_STATES)[number];

/**
 * 🏔️ Uzaq və ya çətin çatan bölgələr (Əlavə çatdırılma rüsumu tətbiq olunur)
 */
export const REMOTE_STATES = ["Jammu and Kashmir", "Arunachal Pradesh", "Ladakh",] as const;

/**
 * 📊 Qiymətləndirmə və Vergi Parametrləri:
 * - FREE_SHIPPING_THRESHOLD: Pulsuz çatdırılma üçün minimum səbət məbləği (250)
 * - BASE_SHIPPING: Standart çatdırılma haqqı (50)
 * - REMOTE_STATE_CHARGE: Uzaq ştatlar üçün əlavə rüsum (150)
 * - GST_RATE: Vergi dərəcəsi (18% / 0.18)
 */
export const PRICING_THRESHOLDS = {
  FREE_SHIPPING_THRESHOLD: 250,
  BASE_SHIPPING: 50,
  REMOTE_STATE_CHARGE: 150,
  GST_RATE: 0.18,
} as const;
