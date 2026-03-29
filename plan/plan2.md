# ROLE

You are a senior Full-Stack Architect, Database Engineer, and UX Systems Designer.

Your task is to **analyze, fix, and redesign an existing e-commerce system** for a project called **Lunex**.

This is NOT a simple task.

You must:
- Identify system problems
- Redesign database schema
- Improve product logic
- Fix broken features
- Improve UX structure
- Align everything into a scalable architecture

Be extremely detailed and practical.


---

# CONTEXT

Lunex is an Apple-style e-commerce store selling:

- iPhones
- MacBooks
- iPads
- Apple Watch
- AirPods

Devices include multiple conditions:

New  
Open Box  
Refurbished  
Assembled  
Used


---

# TASK 1 — USER SYSTEM FIX

Problem:

Users exist in authentication system only, but NOT in database.

This breaks:
- Admin dashboard access
- Role management

Requirement:

Design a proper **Users table** synced with authentication.

Include:

id  
email  
name  
role  
is_admin (boolean)  
created_at  

Explain:

- How auth users sync into DB
- How admin access is handled
- How dashboard checks permissions


---

# TASK 2 — PRODUCT CLASSIFICATION SYSTEM

Problem:

Products are not well organized by type.

Requirement:

Create a clean product categorization system:

Categories:

- iPhone
- Mac
- iPad
- Watch
- AirPods
- Accessories

Each category must support **different variant structures**.

Example:

iPhone:
- storage
- color
- battery
- condition

Mac:
- RAM
- storage
- chip
- color

Explain how system handles different product schemas.


---

# TASK 3 — PRODUCT VARIANT LOGIC (CRITICAL)

Problem:

Variants are not flexible.

Requirement:

Redesign variant system so that:

Each variant represents:

Combination of:

- Color
- Storage / RAM
- Device Type (condition)
- Battery health

Example:

iPhone 13:

Black + 512GB + Refurbished  
Black + 512GB + Used  
Black + 512GB + Assembled  

User must select:

1. Color  
2. Storage  
3. Then see available conditions dynamically  

Show dropdown:

Available options + stock count

Example:

Refurbished — 3 available  
Used — 5 available  

Explain full logic clearly.


---

# TASK 4 — CONDITION & BATTERY SYSTEM

Problem:

Condition system is too basic.

Requirement:

Expand condition system:

Condition Score (1–10)

Battery Health %

Add:

Cosmetic condition description  
Battery status label:

- Excellent (90%+)
- Good (80–89%)
- Fair (<80%)

Explain how this improves trust.


---

# TASK 5 — STOCK MANAGEMENT

Requirement:

Each variant must have:

stock_quantity

Explain:

- stock updates
- availability logic
- out of stock handling


---

# TASK 6 — PRODUCT IMAGES PER VARIANT

Problem:

Images not linked properly.

Requirement:

Each variant must have its own images.

Example:

Black iPhone → black images  
Blue iPhone → blue images  

Explain:

- image linking per variant
- validation logic
- fallback system


---

# TASK 7 — REVIEWS SYSTEM IMPROVEMENT

Requirement:

Reviews must:

- Be in Egyptian Arabic
- Include male and female names
- Include Arabic and English names

Examples:

"الموبايل ممتاز بجد"  
"Battery كويسة جدا"  

Explain structure:

user_name  
rating  
review_text  
image (optional)  

Include realistic diversity.


---

# TASK 8 — WISHLIST FIX

Problem:

Wishlist not working.

Requirement:

Fix wishlist system.

Explain:

- DB structure
- Add/remove logic
- User vs guest behavior


---

# TASK 9 — HOME PAGE IMPROVEMENT

Requirement:

Improve home page design.

Add:

- Premium icons (Apple-style minimal)
- Product condition icons
- Better visual hierarchy

Add section:

"Why Lunex"

Explain layout.


---

# TASK 10 — NAVBAR RESTRUCTURE

Requirement:

Remove separate product links.

Create:

Shop dropdown menu

Includes:

iPhone  
Mac  
iPad  
Watch  
AirPods  

Explain UX behavior.


---

# TASK 11 — LIVE SEARCH

Problem:

Search not working.

Requirement:

Add live search system.

Explain:

- instant results
- search suggestions
- indexing logic


---

# TASK 12 — BUILD YOUR CUSTOM DEVICE PAGE

Add new page:

Build Your Device

Flow:

1. Select product type  
2. Select model  
3. Select color  
4. Select storage  
5. Select condition  
6. Select battery  

System updates price dynamically.

Explain full logic.


---

# TASK 13 — ABOUT US PAGE

Add page explaining:

- Lunex concept
- pricing model
- device types

Explain structure.


---

# TASK 14 — DASHBOARD UPDATE

Update admin dashboard based on all changes.

Include:

- product management
- variant management
- stock tracking
- order tracking
- user management

Explain UI structure.


---

# FINAL TASK

Provide:

1. Improved database schema (tables + relations)
2. System logic explanation
3. UX flow explanation
4. Fixes for all mentioned issues

Be structured, detailed, and practical.