# Project Details

## 1) Project Overview
- Framework: Laravel (backend) + Inertia.js + React (frontend).
- Styling: Tailwind CSS.
- Purpose: Content/news website with Admin and Moderator roles; moderators can create/edit their own articles; admins have a secret admin panel.
- App structure highlights:
  - Backend app code: `app/Http/Controllers`, `app/Models`, `app/Http/Middleware`.
  - Frontend pages: `resources/js/Pages/*` (Inertia React pages).
  - Shared UI components: `resources/js/components/`.
  - Contexts and SPA root: `resources/js/contexts/ThemeContext.jsx`, `resources/js/app.jsx`.

## 2) Tech Stack / Languages
- PHP (Laravel) — server, routing, controllers, models, migrations, middleware.
- JavaScript / JSX (React + Inertia) — client pages and components under `resources/js`.
- Tailwind CSS — utility-first styling.
- MySQL (typical) — database; migrations under `database/migrations`.
- Composer and NPM for dependency management and build tasks.

## 3) Data Flow (high-level request lifecycle)
1. Browser sends request (user navigates or submits a form).
2. Inertia intercepts SPA navigation (client-side) and makes an XHR to Laravel routes.
3. Laravel route receives request (middleware runs - e.g., locale, auth, admin secret).
4. Controller method executes (in `app/Http/Controllers/*`), interacts with Eloquent models (`app/Models/*`) and the database.
5. Controller returns an Inertia response (Inertia::render) or redirect; Inertia updates the client page without a full reload.
6. For forms with file uploads, controllers handle `Request` and store files in `storage/` and generate `Image` records.
7. Moderator/admin actions may log activity into `admin_logs` or `moderator_logs` tables.

Notes:
- Moderator workflows are restricted on both UI and backend: moderator pages show edit links only for articles authored by the moderator; controllers enforce ownership checks.
- Theme toggling and dark-mode are handled client-side by `ThemeContext` and persisted to `localStorage`.

## 4) Database (tables & schema summary)
Files: `database/migrations/*.php` — key migrations:

- `0001_01_01_000000_create_users_table.php` (base `users` table): typical Laravel users table; later migrations add `is_admin` and `role`.
- `2025_11_24_000001_add_role_to_users_table.php` — adds `role` column (enum 'admin','moderator' or string) to `users`.
- `2025_07_11_194234_create_articles_table.php` — `articles` table fields:
  - `id`, `title`, `summary`, `content` (English)
  - `title_urdu`, `summary_urdu`, `content_urdu` (Urdu)
  - `language` ENUM('en','ur','multi')
  - `category`, `region`, `country`, `type`, `slug`, `tags` (comma-separated)
  - `image_url`, `image_public_id` (legacy/flattened image columns)
  - `author` (string, often 'Admin' or moderator name)
  - booleans: `is_featured`, `is_trending`, etc.
  - timestamps `created_at`, `updated_at`
- `2025_07_11_214317_create_images_table.php` — `images` table:
  - `id`, `article_id` (foreign key), `path`, `original_name`, `mime_type`, timestamps.
- `2025_07_20_000001_create_admin_logs_table.php` — `admin_logs` (tracks admin actions).
- `2025_11_24_000002_create_moderator_logs_table.php` — `moderator_logs` (tracks moderator actions):
  - `id`, `moderator_id`, `action`, `model_type`, `model_id`, `details`, `ip_address`, `user_agent`
  - article counts: `created_articles_en`, `created_articles_ur`, `created_articles_multi`
  - timestamps and indexes on `moderator_id`, `model_type`.
- `150131_create_trashes_table.php` — `trashes` table for soft-deleted items (project-specific).

Models (in `app/Models`):
- `User.php` — `$fillable` updated to include `role`; helper `isModerator()` added.
- `Article.php` — Eloquent model representing `articles`.
- `Image.php` — Eloquent model for `images` (belongsTo Article).
- `ModeratorLog.php` — model for `moderator_logs`, `$fillable` includes action fields.
- `AdminLog.php`, `Trash.php` — project-specific models.

Primary keys: standard `id`/`bigIncrements`. Relations:
- Article hasMany Images; Image belongsTo Article.
- ModeratorLog references `moderator_id` (users.id) but migration uses unsignedBigInteger (FK not enforced in migration file as visible).

## 5) Routes (summary & mapping)
Main route file: `routes/web.php` — highlights:

Public / article routes:
- `GET /` -> `ArticleController@index` (named `home`)
- `GET /articles` -> `ArticleController@list` (named `articles.list`)
- `GET /articles/{article}` -> `ArticleController@show` (named `articles.show`)
- `GET /category/{category}` -> `ArticleController@byCategory`
- `GET /type/{type}` -> `ArticleController@byType`
- `GET /region/{region}`, `GET /country/{country}`
- `GET /news` -> `ArticleController@newsPage`
- `GET /search` -> `ArticleController@search`
- `POST /set-language` -> language set endpoint (session + cookie)
- `fallback` route redirects to `/?language=...` to avoid 404s

Admin (secret) routes:
- Admin secret prefix (configured in `routes/web.php` as `$adminSecret = 'admin-SECRET123'`).
- `GET /{secret}/login` -> shows admin login page (`auth/admin-login`)
- `POST /{secret}/login` -> `AdminController@login`
- Protected by middleware `admin.secret` and `admin.auth`:
  - `GET /{secret}` -> `AdminController@dashboard` (named `admin.dashboard`)
  - `GET /{secret}/articles` -> `AdminController@allArticles` (named `admin.articles`)
  - `GET /{secret}/articles/create` -> `AdminController@createArticle`
  - `POST /{secret}/articles` -> `AdminController@storeArticle`
  - `GET /{secret}/articles/{id}/edit` -> `AdminController@editArticle`
  - `POST /{secret}/articles/{id}/update` -> `AdminController@updateArticle`
  - `DELETE /{secret}/articles/{id}` -> `AdminController@deleteArticle`
  - `GET /{secret}/logs` -> `AdminController@adminLogs`

Moderator routes (publicly accessible endpoints for moderators):
- `GET /moderator/register` -> `ModeratorAuthController@showRegister`
- `POST /moderator/register` -> `ModeratorAuthController@register`
- `GET /moderator/login` -> `ModeratorAuthController@showLogin`
- `POST /moderator/login` -> `ModeratorAuthController@login`
- `POST /moderator/logout` -> `ModeratorAuthController@logout`
- `GET /moderator` -> `ModeratorController@dashboard` (named `moderator.dashboard`)
- `GET /moderator/articles` -> `ModeratorController@articles` (list moderator articles)
- `GET /moderator/articles/create` -> `ModeratorController@createArticle`
- `POST /moderator/articles` -> `ModeratorController@storeArticle`
- `GET /moderator/articles/{id}/edit` -> `ModeratorController@editArticle`
- `POST /moderator/articles/{id}/update` -> `ModeratorController@updateArticle`
- `POST /moderator/articles/{id}/remove-image/{imageId}` -> `ModeratorController@removeImage`

Note: Many client-side links use route names with `route('moderator.articles.edit', {id})` in React.

## 6) Controllers (files & responsibilities)
Location: `app/Http/Controllers`
- `ArticleController.php` — public-facing article listing, filtering, search, article view, news page.
- `AdminController.php` — admin authentication (login/logout), admin dashboard, CRUD for articles, admin logs.
- `ModeratorAuthController.php` — moderator register/login/logout and views for auth pages.
- `ModeratorController.php` — moderator dashboard, moderator-specific article CRUD, image removal, ownership checks, and logging to `moderator_logs`.
- `Controller.php` — base controller.

Each controller method typically:
- Validates requests via `$request->validate(...)` or `FormRequest` classes (check `app/Http/Requests` if present).
- Uses Eloquent (`Article`, `Image`, `User`, `ModeratorLog`) to read/write data.
- Returns `Inertia::render('...')` for pages or redirects after POSTs.

## 7) Middleware
Files: `app/Http/Middleware/*` — key middleware and purpose:
- `SetLocale.php` — chooses app language (query > cookie > session) and sets session/cookie; sets `app()->setLocale($language)`.
- `SetAppLocale.php` — (related to locale, check file for specifics).
- `HandlePreferences.php` — applies user preferences (e.g., UI preferences) to requests (see file for specifics).
- `HandleInertiaRequests.php` — Inertia middleware used to share props (CSRF token, flash messages, language, etc.).
- `HandleAppearance.php` — applies appearance settings such as dark mode.
- `AdminSecretMiddleware.php` — ensures admin secret route prefix handling (extracts secret param into request attributes).
- `AdminAuthMiddleware.php` — verifies admin session login and redirects to admin login if missing.

Middleware are registered in `app/Http/Kernel.php` (global or route middleware groups). Routes like the admin panel use `admin.secret` and `admin.auth` to protect admin routes.

## 8) Frontend (React + Inertia)
Files are under `resources/js`.

Key files & locations:
- SPA root: `resources/js/app.jsx` — mounts Inertia app and wraps with `ThemeProvider`.
- Theme context: `resources/js/contexts/ThemeContext.jsx` — provides dark mode state and toggle (persisted in `localStorage`).
- Components: `resources/js/components/*` — header, moderator navbar, other shared components (e.g., `Header.jsx`, `ModeratorNavbar.jsx`).
- Pages:`resources/js/Pages/*` (selected list):
  - `Home.jsx`, `Article.jsx`, `Articles.jsx`, `News.jsx`, `SearchResults.jsx`, `AboutUs.jsx`, `PrivacyPolicy.jsx`
  - `auth/admin-login.jsx`, `auth/moderator-login.jsx` (moderator login), `auth/Register.jsx` (moderator register)
  - `Admin/*` pages: `Dashboard.jsx`, `AllArticles.jsx`, `CreateArticle.jsx`, `EditArticle.jsx`, `AdminLogs.jsx`
  - `Moderator/*` pages: `Dashboard.jsx`, `Articles.jsx`, `CreateArticle.jsx`, `EditArticle.jsx`

Frontend behaviors:
- Inertia `useForm` is used for forms (preserve scroll/state options for failed validation).
- Uploads use `FormData` and `router.post(..., { forceFormData: true })`.
- Theme toggling uses a single `ThemeProvider` at app root to prevent remounts.
- Language switcher in `Header.jsx` sets cookie via POST to `/set-language`.

## 9) Seeds
- Seeders exist in `database/seeders/` including `AdminUserSeeder.php`, `ModeratorUserSeeder.php`, `ArticleSeeder.php`, and `DatabaseSeeder.php` to populate initial users/articles.
- If you add new Seeder classes, run `composer dump-autoload` before executing `php artisan db:seed --class=...` to avoid "Target class does not exist" errors.

## 10) Important files / paths
- Routes: `routes/web.php`
- Controllers: `app/Http/Controllers/*.php`
- Middleware: `app/Http/Middleware/*.php`
- Models: `app/Models/*.php`
- Migrations: `database/migrations/*.php`
- Frontend pages: `resources/js/Pages/**/*` (React/Inertia)
- Frontend components: `resources/js/components/*`
- SPA entry: `resources/js/app.jsx` and `resources/js/ThemeContext.jsx`

## 11) How to run (developer notes)
1. Install PHP dependencies:

```powershell
composer install
```

2. Install JavaScript dependencies and build dev assets:

```powershell
npm install
npm run dev
```

3. Environment: copy `.env.example` to `.env` and set DB credentials.

4. Run migrations & seeders:

```powershell
php artisan migrate
php artisan db:seed
```

If a newly created seeder class is not discovered, run:

```powershell
composer dump-autoload
php artisan db:seed --class=Database\\Seeders\\YourSeeder
```

5. Serve the app:

```powershell
php artisan serve
```

## 12) Security & behavior notes
- Admin panel is hidden under a secret path (`admin-SECRET123`) and requires both `admin.secret` and `admin.auth` middleware. Change the secret and secure admin auth in production.
- Moderator access:
  - UI: moderator pages only show edit links for articles where `article.author === moderatorName` (string match) — this was implemented in the frontend.
  - Backend: `ModeratorController` enforces ownership checks before allowing updates/deletes and logs actions to `moderator_logs`.
- Language cookie uses a plain code stored in cookie/session (SetLocale middleware ensures only allowed values are used).

## 13) Suggested improvements
- Use `author_id` (user id) on `articles` to strictly associate articles with users instead of a string `author` (string matching is fragile and case-sensitive). Then update frontend and controllers to check `article.author_id === auth()->id()`.
- Add foreign key constraints for `moderator_logs.moderator_id` to `users.id` for integrity.
- Centralize validation via `FormRequest` classes under `app/Http/Requests` for reusability.
- Add tests (PHPUnit / Pest + Cypress/Playwright) for moderator ownership enforcement and admin routes.

## 14) Quick references
- Admin secret routes: `routes/web.php` near top (variable `$adminSecret`).
- Moderator routes: `/moderator` paths in `routes/web.php`.
- Key frontend entry: `resources/js/app.jsx`.

---
If you want, I can:
- Convert `author` to `author_id` across DB, models, controllers and frontend (I can draft migration + code changes), or
- Produce a more detailed per-file inventory (showing method signatures for each controller), or
- Add a diagram (Mermaid) showing data flow and key table relationships.
