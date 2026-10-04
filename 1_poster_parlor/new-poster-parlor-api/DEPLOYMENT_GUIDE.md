# 🚀 Full-Stack NestJS + Next.js Pulsuz (100% FREE) Canlıya Yayım (Deployment) Bələdçisi

Bu sənəd proyektinizi (NestJS Backend + Next.js Frontend + MongoDB Atlas + Cloudinary) **heç bir domen və ya hosting ödənişi etmədən (100% PULSUZ)** canlıya qaldırmaq üçün addım-ba-addım hazırlanmış rəsmi bələdçidir.

---

## 🏗️ Pulsuz İnfrastruktur Arxitekturası (Free Tech Stack)

| Hissə | Platforma | Domen / URL Formatı | Ödəniş |
| :--- | :--- | :--- | :--- |
| **Frontend (Next.js)** | [Vercel.com](https://vercel.com) | `https://poster-parlor.vercel.app` | **0 ₼ (100% Pulsuz)** |
| **Backend (NestJS)** | [Render.com](https://render.com) | `https://poster-parlor-api.onrender.com` | **0 ₼ (100% Pulsuz)** |
| **Verilənlər Bazası** | [MongoDB Atlas](https://mongodb.com) | Shared M0 Cluster | **0 ₼ (100% Pulsuz)** |
| **Media / Şəkillər** | [Cloudinary](https://cloudinary.com) | Cloudinary Media API | **0 ₼ (100% Pulsuz)** |

---

## 📌 MƏRHƏLƏ 1: Proyekti GitHub-a Push Etmək

1. Kodlarınızın son versiyasını GitHub repo-nuza push edin:
   ```bash
   git add .
   git commit -m "feat: ready for free production deployment"
   git push origin main
   ```

---

## 📌 MƏRHƏLƏ 2: Backend (NestJS) Render.com-da Deploy Etmək

[Render.com](https://render.com) Node.js / NestJS tətbiqləri üçün pulsuz SSL və avtomatik GitHub inteqrasiyası təqdim edir.

### Addımlar:
1. [Render.com](https://render.com) saytında pulsuz hesab açın (GitHub hesabınızla daxil olun).
2. **New +** düyməsinə sıxıb **Web Service** seçin.
3. GitHub reponuzu bağlayın və bu proyekti seçin.
4. Tənzimləmələri aşağıdakı kimi doldurun:
   * **Name:** `poster-parlor-api` (və ya istədiyiniz ad)
   * **Region:** Frankfurt (Europe) - Azərbaycan üçün ən yaxın regiondur.
   * **Branch:** `main`
   * **Root Directory:** `api`
   * **Environment:** `Node`
   * **Build Command:** `npm install && npm run build`
   * **Start Command:** `node dist/apps/api/main.js` (və ya `npm run start:prod`)
   * **Instance Type:** `Free` ($0/mo)

5. **Environment Variables (Ətraf Mühit Dəyişənləri):**
   Render menyusunda **Environment** bölməsinə keçin və `.env` faylınızdakı açarları əlavə edin:
   ```env
   NODE_ENV=production
   PORT=3000
   MONGODB_URI=mongodb+srv://... (Sizin MongoDB Atlas URI-niz)
   JWT_SECRET=sizin_super_gizli_jwt_acariniz
   CLOUDINARY_CLOUD_NAME=sizin_cloudinary_cloud_name
   CLOUDINARY_API_KEY=sizin_cloudinary_api_key
   CLOUDINARY_API_SECRET=sizin_cloudinary_api_secret
   FRONTEND_URL=https://poster-parlor.vercel.app
   ```
6. **Create Web Service** düyməsini sıxın. 2-3 dəqiqə ərzində Backend canlıya qalxacaq və sizə canlı link verəcək (məsələn: `https://poster-parlor-api.onrender.com`).

---

## 📌 MƏRHƏLƏ 3: Frontend (Next.js) Vercel.com-da Deploy Etmək

[Vercel.com](https://vercel.com) Next.js-in yaradıcısıdır və Next.js tətbiqləri üçün dünyada ən sürətli və pulsuz platformadır.

### Addımlar:
1. [Vercel.com](https://vercel.com) saytına daxil olun və GitHub hesabınızla daxil olun.
2. **Add New...** -> **Project** seçin.
3. GitHub reponuzu seçib **Import** düyməsini sıxın.
4. Tənzimləmələri edin:
   * **Framework Preset:** Next.js
   * **Root Directory:** `web` (Edit düyməsinə basıb `web` qovluğunu seçin)
   * **Build Command:** `npm run build`
5. **Environment Variables:**
   ```env
   NEXT_PUBLIC_API_URL=https://poster-parlor-api.onrender.com/api
   ```
   *(Qeyd: `NEXT_PUBLIC_API_URL` hissəsinə Render-də aldığınız backend URL-ini yazın!)*

6. **Deploy** düyməsini sıxın. 1 dəqiqəyə saytınız pulsuz `https://poster-parlor.vercel.app` ünvanında canlıya qalxacaq!

---

## 📌 MƏRHƏLƏ 4: CORS (Cross-Origin Resource Sharing) İcazələri

Brauzerin frontend-dən backend-ə sorğuları bloklamaması üçün:
1. Render-dəki `poster-parlor-api` servisinə daxil olun.
2. **Environment** bölməsində `FRONTEND_URL` dəyişəninin dəyərini Vercel-də aldığınız domen edin:
   `FRONTEND_URL=https://poster-parlor.vercel.app`
3. Dəyişiklikləri saxlayın (**Save Changes**). Render backend-i avtomatik re-deploy edəcək.

---

## 📌 MƏRHƏLƏ 5: Yoxlama Və Test (Live Verification)

Təbrik edirik! 🎉 Proyektiniz 100% PULSUZ olaraq canlıdadır:

* 🌐 **Canlı Sayt (Frontend):** `https://poster-parlor.vercel.app`
* ⚡ **Canlı API (Backend):** `https://poster-parlor-api.onrender.com/api`
* 📚 **API Sənədləşməsi (Swagger):** `https://poster-parlor-api.onrender.com/api/docs`

### 💡 Pulsuz Hosting Haqqında Vacib Qeydlər:
* **Render Free Tier Sleep Mode:** Render.com pulsuz serverləri 15 dəqiqə heç bir sorğu gəlmədikdə serveri "yuxu rejiminə" keçirir. 15 dəqiqədən sonra ilk dəfə sayta girdikdə serverin oyanması **30-40 saniyə** çəkə bilər. Qalan bütün sorğular anında işləyəcək.
* **Vercel CDN:** Next.js frontend şəkilləri və səhifələri dünyadakı bütün serverlərdə (edge caching) pulsuz kesh edir, saytınız ildırım kimi açılacaq.
