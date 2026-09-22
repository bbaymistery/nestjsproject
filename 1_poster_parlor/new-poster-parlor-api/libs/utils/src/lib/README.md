# 🧰 Utility Helpers Və Parsers (`libs/utils/src/lib`)

Bu qovluqda tətbiq daxilində tez-tez istifadə olunan **xüsusi HTTP exception-lar, cavab yardımçıları (Response Utilities) və stack trace parser-ləri** yerləşir.

---

## 📁 Faylların Tərkibi Və Müəllim İzahı

### 📄 1. `http-exception.ts` (Custom Exceptions)
* Standard NestJS `HttpException` klassını genişləndirir.
* Xüsusi xəta sinifləri təqdim edir:
  - `CustomHttpException`
  - `ValidationException` (`422 Unprocessable Entity`)
  - `NotFoundCustomException` (`404 Not Found`)
  - `UnauthorizedCustomException` (`401 Unauthorized`)
  - `ForbiddenCustomException` (`403 Forbidden`)

---

### 📄 2. `http-response.ts` (`HttpResponseUtil`)
* Statik metodlar təqdim edən köməkçi sinif:
  - `HttpResponseUtil.success(data, message)`
  - `HttpResponseUtil.created(data, message)`
  - `HttpResponseUtil.updated(data, message)`
  - `HttpResponseUtil.deleted(message)`

---

### 📄 3. `stack-trace-parser.ts` (`parseStackTrace`)
* **Nə iş görür?** JavaScript `Error.stack` mətnini analiz edərək xətanın tam olaraq **hansı faylda, hansı sətirdə və sütunda** baş verdiyini təmiz `StackFrame[]` massivi şəklində çıxarır.
* Yalnız `NODE_ENV === 'development'` rejimində işləyir ki, tərtibatçı xətanın harada olduğunu konsolda dərhal görə bilsin.

---

## 🍽️ Restoran Analogiyası İlə Tam İzah (Hər Şey Bir Arada)

Gəl bütün bu sistemi (`Interceptor`, `Filter`, `Handlers` və `lib` köməkçilərini) **Restoran Analogiyası** ilə bir yerdə tam aydınlaşdıraq:

### 🍔 Əsas Aktyorlar:
* **HTTP İstəyi (Request)** = Restorana daxil olan **Müştəri**.
* **Controller & Service** = Yeməyi bişirən **Mətbəx Və Aşpaz**.

---

### 1️⃣ 🤵‍♂️ `ResponseInterceptor` (Restoranın Diqqətli Ofisiantı)
Sorğunu 2 mərhələdə idarə edir:
* **🟡 BEFORE PHASE (Giriş):** Müştəri restorana girir. Ofisiant dərhal saatına baxır: *"Sorğu saat 17:00:00-da gəldi (`startTime`)"*. Sifarişi mətbəxə aparır (`next.handle()`).
* **🟢 AFTER PHASE (Çıxış):** Yemək hazır olanda ofisiant onu zərfə bükür: `{ success: true, statusCode: 200, duration: "14ms", data: yemək }` və loq faylına yazır.

---

### 2️⃣ 🚨 `GlobalExceptionFilter` (Restoranın Təhlükəsizlik Və Xəta Müdiri)
* Mətbəxdə xəta baş verərsə (`throw Error`), ofisiant yemək verə bilmir.
* Təhlükəsizlik Müdiri (`GlobalExceptionFilter`) işə düşür, xətanı tutur və müştəriyə nazikliklə xəta cavabı verir: `{ success: false, statusCode: 404, message: "..." }`.

---

### 3️⃣ 🧑‍🔧 Handlers (Xüsusi Xəta Usta-Köməkçiləri)
Təhlükəsizlik Müdiri xətanı tutduqdan sonra öz 5 mütəxəssis ustasını çağırır:
* 🔹 **`http-error.handler.ts`**: HTTP 404 Tapılmadı, 401 İcazəsiz giriş və ya 400 Səhv sorğu xətasıdırsa.
* 🔹 **`mongo-error.handler.ts`**: MongoDB-də unikal email təkrar daxil edilibsə (`code === 11000`, 409 Conflict).
* 🔹 **`validation-error.handler.ts`**: Mongoose Validation xətasıdırsa (Məs: Vacib sahə boş buraxılıb).
* 🔹 **`mongoose-cast-error.handler.ts`**: Yanlış ID formatı daxil edilibsə (Məs: 24 simvolluq MongoDB ID-si əvəzinə `'123'` göndərilibsə).
* 🔹 **`generic-error.handler.ts`**: Gözlənilməz kənar JavaScript sistem xətaları baş verdikdə (500 Internal Server Error).

---

### 4️⃣ 🧰 `libs/utils/src/lib` (Aşpaz Və Ofisiantın Xüsusi Alətlər Qutusu)

* **📄 `http-exception.ts` (Xüsusi Həyəcan Zəngləri):**
  * Problem yarandıqda kodda sadəcə "Xəta var" demirik, dəqiq həyəcan düyməsini basırıq:
    * 🚫 `NotFoundCustomException` (404): *"Bu yemək menyuda yoxdur!"*
    * 🛑 `UnauthorizedCustomException` (401): *"Müştəri bilet göstərməyib!"*
    * ⛔ `ForbiddenCustomException` (403): *"Bu VIP masaya girməyə icazə yoxdur!"*
    * 📝 `ValidationException` (422): *"Sifariş vərəqəsi səhv doldurulub!"*

* **📄 `http-response.ts` (Hazır Bəzəkli Cavab Qutuları):**
  * Aşpaz yeməyi hazırlayanda hazır zərflərdən istifadə edir:
    * 🎁 `HttpResponseUtil.success(data)`: *"Standart uğurlu yemək qutusu (200 OK)"*
    * ✨ `HttpResponseUtil.created(data)`: *"Yeni yaradılmış hədiyyəli qutu (201 Created)"*
    * 🔄 `HttpResponseUtil.updated(data)`: *"Yenilənmiş menyu qutusu"*
    * 🗑️ `HttpResponseUtil.deleted()`: *"Silindi mesajı"*

* **📄 `stack-trace-parser.ts` (Detektiv Qara Qutusu / GPS Axtaranı):**
  * Xəta baş verəndə detektiv kimi işə düşür! Xətanın dəqiq **hansı faylda, hansı sətirdə və sütunda** baş verdiyini təyin edir (Məs: `user.service.ts:L45`) ki, tərtibatçı dərhal gedib həmin sətiri düzeltsin! 🕵️‍♂️

