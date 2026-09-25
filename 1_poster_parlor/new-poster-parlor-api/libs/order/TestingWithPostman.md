# 🧪 Postman ilə Order & Stripe Payment API-lərini Test Etmək Bələdçisi

Bu sənəd **Order & Stripe Payment API-lərini (Stripe Publishable Key almaq, PaymentIntent yaratmaq, Ödəniş doğrulama, Sifariş tarixçəsi və Admin idarəetməsi)** Postman-da addım-addım necə test edəcəyinizi izah edir.

---

## 🔑 1. Təhlükəsizlik Və Auth Qaydası
Sifariş API-ləri daxil olmuş istifadəçi və ya Admin hüququ tələb edir:
* **Headers**: `Authorization: Bearer <ACCESS_TOKEN>` (və ya Postman-da `Auth -> Bearer Token` bölməsinə tokeninizi yapışdırın).
* **Cookie**: Postman-da daha əvvəl `/api/auth/google/login` etmisinizsə cookie avtomatik istifadə olunacaq.

---

## 🚀 2. Postman-da Addım-Addım Test Ssenariləri

Əsas URL: **`http://localhost:3000/api/order`**

---

### 🔑 TEST 1: Stripe Publishable Key-i Almaq (`GET /api/order/payment/key`)
* **Method**: `GET`
* **URL**: `http://localhost:3000/api/order/payment/key`
* **Auth**: 🔐 `@Auth()`
* **Cavab (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Stripe publishable key fetched",
    "data": {
      "publishableKey": "pk_test_51Nx..."
    }
  }
  ```

---

### 💳 TEST 2: Stripe PaymentIntent Başlatmaq (`POST /api/order/payment/initiate`)
* **Method**: `POST`
* **URL**: `http://localhost:3000/api/order/payment/initiate`
* **Auth**: 🔐 `@Auth()`
* **Headers**: `Content-Type: application/json`
* **Body** (`raw` -> `JSON`):
  ```json
  {
    "items": [
      {
        "posterId": "673f1a2b3c4d5e6f7a8b9c0d",
        "quantity": 2,
        "price": 29.99
      }
    ],
    "shippingAddress": {
      "addressLine1": "Nizami Kucesi 45",
      "city": "Baku",
      "state": "Baku",
      "pincode": "AZ1000"
    },
    "shippingCost": 5,
    "taxAmount": 6,
    "totalPrice": 70.98,
    "currency": "usd"
  }
  ```
* **Cavab (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Stripe PaymentIntent created successfully",
    "data": {
      "paymentIntentId": "pi_3MtwBwLkdIwHu7ix08aD5xYc",
      "clientSecret": "pi_3MtwBwLkdIwHu7ix08aD5xYc_secret_xyz123",
      "amount": 7098,
      "currency": "usd"
    }
  }
  ```
* 💡 **Mühüm**: Cavabdan gələn **`paymentIntentId`** məlumatını kopyalayın!

---

### 🛡️ TEST 3: Stripe Ödənişini Doğrulamaq Və Sifarişi Yaradılması (`POST /api/order/payment/verify`)
* **Method**: `POST`
* **URL**: `http://localhost:3000/api/order/payment/verify`
* **Auth**: 🔐 `@Auth()`
* **Body** (`raw` -> `JSON`):
  ```json
  {
    "paymentIntentId": "pi_3MtwBwLkdIwHu7ix08aD5xYc",
    "customer": {
      "name": "Elgun Ezmemmedov",
      "email": "elgun@example.com",
      "phone": "+994501234567"
    },
    "items": [
      {
        "posterId": "673f1a2b3c4d5e6f7a8b9c0d",
        "quantity": 2,
        "price": 29.99
      }
    ],
    "shippingAddress": {
      "addressLine1": "Nizami Kucesi 45",
      "city": "Baku",
      "state": "Baku",
      "pincode": "AZ1000"
    },
    "shippingCost": 5,
    "taxAmount": 6,
    "totalPrice": 70.98,
    "notes": "Qapıda zəng edin"
  }
  ```
* **Cavab (200 OK)**: Sifariş yaratdı, stok azaldı və `status: "PROCESSING"`, `isPaid: true` kimi saxlanıldı!

---

### 📦 TEST 4: Nağd (COD) / Birbaşa Sifariş Yaradılması (`POST /api/order`)
* **Method**: `POST`
* **URL**: `http://localhost:3000/api/order`
* **Auth**: 🔐 `@Auth()`
* **Body** (`raw` -> `JSON`):
  ```json
  {
    "items": [
      {
        "posterId": "673f1a2b3c4d5e6f7a8b9c0d",
        "quantity": 1,
        "price": 29.99
      }
    ],
    "shippingAddress": {
      "addressLine1": "28 May Kucesi 12",
      "city": "Baku",
      "state": "Baku",
      "pincode": "AZ1010"
    },
    "paymentDetails": {
      "method": "COD",
      "amount": 34.99,
      "currency": "USD"
    },
    "shippingCost": 5,
    "taxAmount": 0,
    "totalPrice": 34.99
  }
  ```

---

### 📜 TEST 5: İstifadəçinin Öz Sifariş Tarixçəsi (`GET /api/order`)
* **Method**: `GET`
* **URL**: `http://localhost:3000/api/order?page=1&limit=10`
* **Auth**: 🔐 `@Auth()`

---

### 🔍 TEST 6: Tək Sifariş Detalını Almaq (`GET /api/order/:id`)
* **Method**: `GET`
* **URL**: `http://localhost:3000/api/order/673f99993c4d5e6f7a8b9999`
* **Auth**: 🔐 `@Auth()`

---

### 👑 TEST 7: Bütün Sifarişləri Siyahılamaq (Admin) (`GET /api/order/admin/all`)
* **Method**: `GET`
* **URL**: `http://localhost:3000/api/order/admin/all`
* **Auth**: 🔐 `@Auth(UserRole.ADMIN)`

---

### 👑 TEST 8: Sifariş Statusunu Yeniləmək (Admin) (`PUT /api/order/admin/:id/status`)
* **Method**: `PUT`
* **URL**: `http://localhost:3000/api/order/admin/673f99993c4d5e6f7a8b9999/status`
* **Auth**: 🔐 `@Auth(UserRole.ADMIN)`
* **Body**:
  ```json
  {
    "status": "DELIVERED"
  }
  ```
