# Zora News Platform

## Project Overview

Zora is a Laravel-based news platform supporting multi-language (English/Urdu) articles, with an admin panel, article management, and user authentication. The frontend uses Inertia.js and React.

---

## Project Structure

- **app/Models/**
  - `Article.php` - Main article model, supports multi-language, soft deletes, and relations to images.
  - `Image.php` - Stores image metadata for articles.
  - `Trash.php` - Stores deleted articles for recovery/audit.
  - `User.php` - User model with admin support.

- **app/Http/Controllers/**
  - `ArticleController.php` - Handles public article listing, filtering, and viewing.
  - `AdminController.php` - Handles admin dashboard, article CRUD, and trash.
  - `Settings/ProfileController.php`, `Settings/PasswordController.php` - User profile and password management.
  - `Auth/` - Authentication, registration, password reset, and email verification.

- **routes/**
  - `web.php` - Public and admin routes, including secret admin URL and fallback.
  - `console.php` - Artisan command routes.

- **resources/views/**
  - `app.blade.php` - Main HTML template, supports dark mode and Inertia.js.

---


## Current Features

- **Multi-language articles**: Supports English, Urdu, or both for all articles, including title, summary, and content fields.
- **Article categories, types, regions, and countries**: Articles are organized by category (e.g., News, Politics, Sports), type (e.g., Breaking, Exclusive), region, and country.
- **Trending, featured, breaking, and top story articles**: Special flags for articles to highlight them in different sections (is_trending, is_featured, is_breaking, is_top_story, show_in_section, section_priority).
- **News page**: Dedicated News page with hero/top stories and sections by type, only for articles where category = 'News'.
- **Article images**: Each article can have images, displayed on both list and detail pages.
- **Admin panel**: Protected admin dashboard for managing articles, including create, edit, delete, and trash (soft delete) functionality.
- **Full CRUD for articles**: Admins can create, edit, and delete articles, including all new fields (breaking, top story, show in section, section priority).
- **User authentication**: Register, login, password reset, and email verification.
- **User profile and password management**: Users can update their profile and change their password.
- **Dark/light mode**: UI supports both dark and light themes, with toggle in header and admin panel.
- **Navigation**: Header navigation with links to News, categories, and other key sections.
- **Fallback route for 404s**: Non-existent routes redirect to home.
- **Debug endpoints**: For article stats and region/language debugging.
- **Inertia.js + React frontend**: Modern SPA experience with React components and Inertia.js routing.

## Suggested Features to Add Next

1. **Article Search Improvements**  
   - Enhance search to support advanced filters (by tags, author, date range, etc.).
2. **Article Comments**  
   - Enable users to comment on articles, with moderation tools for admins.
3. **User Roles & Permissions**  
   - Add granular roles (editor, moderator, contributor) beyond just admin.
4. **Article Restore from Trash**  
   - Allow admins to restore deleted articles from trash.
5. **Article Scheduling**  
   - Schedule articles for future publication dates.
6. **Rich Text Editor**  
   - Use a WYSIWYG editor for article content in the admin panel.
7. **Multiple Images/Gallery**  
   - Support multiple images and galleries per article.
8. **SEO Enhancements**  
   - Add meta tags, Open Graph, and sitemap support for better discoverability.
9. **API Endpoints**  
   - Provide REST API for articles, categories, and user actions.
10. **User Avatars & Profiles**  
    - Allow users to upload avatars and expand profile features.
11. **Notifications**  
    - Notify users/admins of important events (new comments, article published, etc.).
12. **Analytics Dashboard**  
    - Show article views, user stats, and trends in the admin panel.
13. **Localization**  
    - Translate UI and admin panel to Urdu and other languages (beyond articles).
14. **Newsletter/Subscriptions**  
    - Allow users to subscribe to newsletters or article updates.
15. **Social Sharing**  
    - Add social media sharing buttons for articles.
16. **Bookmarking/Favorites**  
    - Let users bookmark or favorite articles for later reading.
17. **Related Articles**  
    - Show related articles on article detail pages.
18. **Performance Optimizations**  
    - Improve page load times and image handling for large news sites.
19. **Accessibility Improvements**  
    - Ensure the site is accessible to all users (WCAG compliance).
20. **Mobile App/Responsive Enhancements**  
    - Further optimize for mobile and consider a companion app.

---

## Getting Started

1. Clone the repo and install dependencies.
2. Set up your `.env` file and database.
3. Run migrations and seeders.
4. Start the development server.

---

## License

MIT (or your chosen license)