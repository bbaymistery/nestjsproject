# 📜 Nx Monorepo İcra Olunan Əmrlər Və Addımlar Tarixçəsi (Command History Log)

Bu sənəddə **`new-poster-parlor-api`** monorepo layihəsində icra etdiyimiz bütün terminal əmrləri, onların məqsədi və hansı faylları yaratdığı addım-addım qeyd olunur.

---

## 📌 Addım 1: Monorepo Layihəsinin Yaradılması

* **İcra Olunan Əmr:**
  ```sh
  npx create-nx-workspace@latest new-poster-parlor-api --preset=@nx/nest --appName=api
  ```
* **Niyə İcra Etdik? (Məqsədi):**
  * Nx Monorepo arxitekturasını qurmaq üçün.
  * `apps/api` daxilində əsas NestJS Backend layihəmizi və onun yanına `apps/api-e2e` avtomatik test layihəsini yerləşdirmək üçün.
* **Nəticədə Nələr Yarandı?**
  * `apps/api/` — Əsas NestJS Backend API-si (Port 3000).
  * `apps/api-e2e/` — Backend endpoint-lərini avtomatik test edən E2E layihəsi.
  * `nx.json`, `tsconfig.base.json`, `package.json` — Monorepo tənzimləmə faylları.

---

## 📌 Addım 2: Ortaq Auth Kitabxanasının (Library) Yaradılması

* **İcra Olunan Əmr:**
  ```sh
  npx nx g @nx/nest:lib libs/auth
  ```
* **Niyə İcra Etdik? (Məqsədi):**
  * Autentifikasiya (JWT, Login, Register, Guards) kodlarını əsas `api` tətbiqindən ayıraraq təkrar istifadə oluna bilən ortaq **Library (Kitabxana)** kimi təcrid etmək üçün.
* **Nəticədə Nələr Yarandı?**
  * `libs/auth/src/lib/auth.module.ts` — Authentication modulu.
  * `libs/auth/src/index.ts` — Kitabxananın export nöqtəsi.

---

## 📌 Addım 3: Ortaq Database Kitabxanasının (Library) Yaradılması

* **İcra Olunan Əmr:**
  ```sh
  npx nx g @nx/nest:lib libs/database
  ```
* **Niyə İcra Etdik? (Məqsədi):**
  * Verilənlər bazası bağlantısını (TypeORM / PostgreSQL) müstəqil **Database Library** kimi təcrid etmək üçün.
* **Nəticədə Nələr Yarandı?**
  * `libs/database/src/lib/database.module.ts` — Database modulu.

---

## 📌 Addım 4-11: Qalan Kitabxanaların (Libs) Yaradılması

* **İcra Olunan Əmrlər:**
  ```sh
  npx nx g @nx/nest:lib libs/utils
  npx nx g @nx/nest:lib libs/inventory
  npx nx g @nx/nest:lib libs/order
  npx nx g @nx/nest:lib libs/models
  npx nx g @nx/nest:lib libs/config
  npx nx g @nx/nest:lib libs/logger
  npx nx g @nx/nest:lib libs/admin
  npx nx g @nx/nest:lib libs/shared
  ```
* **Niyə İcra Etdik? (Məqsədi):**
  * Modulyar Monorepo arxitekturasına uyğun olaraq anbar, sifarişlər, daxili modellər, loqlama və inzibatçı paneli kodlarını təcrid olunmuş müstəqil kitabxanalara bölmək üçün.

---

## 📌 Addım 12: `package.json` Skriptlərinin Əlavə Edilməsi

* **Qoşulan Skriptlər (`package.json`):**
  ```json
  "scripts": {
    "dev": "npx nx run api:serve:development --no-inspect",
    "start": "npx nx run api:serve:production --no-inspect",
    "build": "npx nx build api",
    "lint": "npx nx lint api",
    "clear": "npx nx reset && rm -rf dist node_modules && npm install"
  }
  ```
* **Niyə İcra Etdik? (Məqsədi):**
  * Terminalda uzun-uzadı `npx nx run api:serve:development` yazmaq əvəzinə `npm run dev` yazaraq layihəni anında başlatmaq üçün.

---

*(Növbəti icra ediləcək hər bir əmr bura avtomatik əlavə olunacaq...)*
