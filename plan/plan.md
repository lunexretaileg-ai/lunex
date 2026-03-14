LUNEX
Premium Apple Ecosystem E-Commerce
Full Product & Technical Planning Document
Version 1.0  |  March 2026
Confidential — Internal Use Only

 
Executive Summary
Lunex is a premium e-commerce platform targeting Egyptian consumers who want authentic Apple ecosystem devices at significantly lower prices. By focusing on professionally tested refurbished and assembled devices, Lunex delivers the same Apple quality experience at approximately 40% below the standard Egypt market price.
This document is the complete technical and product planning reference for the Lunex platform. It covers site architecture, feature design, database structure, UI/UX direction, the admin panel, technology stack, and a phased development roadmap.

Project Name	Lunex
Target Market	Egypt
Product Focus	Apple iPhone, MacBook, iPad, Watch, AirPods, Accessories
Device Types	Refurbished & Assembled
Pricing Strategy	~40% below Egypt Apple market price
Design Inspiration	Apple.com — Minimal, Premium, Product-focused
Document Version	1.0 — March 2026
 
1. Project Overview
1.1 What Is Lunex?
Lunex is not an official Apple reseller. It is a curated marketplace for refurbished and assembled Apple devices, targeted at Egyptian consumers who want Apple-quality hardware without paying the inflated Egyptian market price. Devices are individually tested, graded, and listed with full transparency — including condition scores, battery health, and warranty information.
1.2 Business Model
•	Source refurbished Apple devices internationally and domestically
•	Source assembled Apple-compatible devices built with original or high-quality compatible components
•	Test, grade, and photograph every device
•	List on Lunex with transparent condition data and lower-than-market pricing
•	Offer warranty and return policy to build customer trust
1.3 Target Audience
•	Egyptian consumers seeking Apple devices at affordable prices
•	Tech-savvy buyers aged 18–40 who understand refurbished quality
•	Budget-conscious students, professionals, and creatives
•	Buyers upgrading from Android or older Apple devices
1.4 Value Proposition
Lunex Core Value Proposition
Up to 40% cheaper than Egypt Apple market price
Professionally inspected and tested devices
Transparent condition score (1–10) on every listing
Battery health percentage always displayed
Warranty and return policy for peace of mind
Apple-quality experience — without the Apple markup
 
2. Product Catalog & Data Structure
2.1 Product Categories
iPhone	All major models — iPhone 12, 13, 14, 15, SE series
MacBook	MacBook Air (M1, M2, M3), MacBook Pro (13", 14", 16")
iPad	iPad, iPad mini, iPad Air, iPad Pro
Apple Watch	Series 6 through Series 9, SE, Ultra
AirPods	AirPods 2nd Gen, 3rd Gen, AirPods Pro, AirPods Max
Accessories	Cases, cables, chargers, bands, screen protectors, adapters
2.2 Universal Product Attributes
Every product in the Lunex catalog must carry the following standard attributes:
•	Device Model (e.g., iPhone 14 Pro Max)
•	Release Year
•	Display — size, resolution, type (OLED, Liquid Retina, etc.)
•	Chipset — e.g., Apple A15 Bionic
•	RAM
•	Storage options — 64GB, 128GB, 256GB, 512GB, 1TB
•	Camera specs — megapixels, aperture, video capability
•	Battery specs — capacity in mAh
•	Operating system — iOS, macOS, watchOS, etc.
•	Weight and Dimensions
•	Connectivity — 5G, Wi-Fi 6, Bluetooth 5.x, USB-C, Lightning
•	Available colors — Space Black, Silver, Gold, Deep Purple, etc.
2.3 Lunex-Specific Attributes
In addition to standard specs, every Lunex listing must include the following unique data fields:
Condition Score	Integer from 1 to 10. 10 = Like New, 7 = Good, etc.
Battery Health	Percentage value. E.g., 93%. Always visible on listing.
Device Type	Either Refurbished or Assembled
Available Storage	Which storage configurations are in stock
Available Colors	Which color variants are currently available
Lunex Price	The discounted price in EGP
Egypt Market Price	Standard Apple market price in Egypt for comparison
Discount %	Calculated percentage difference (typically ~40%)
Warranty Period	Duration and type of warranty offered
Warranty Type	Lunex warranty vs seller warranty
Product Images	Minimum 6 high-quality images per listing
SKU / Serial Reference	Internal tracking identifier
 
3. Core Product Features
3.1 Condition Score System
Every device receives a condition score between 1 and 10, assigned during the inspection process. This score reflects the overall physical and functional quality of the device.
Score Scale
10 / 10	Like New — No scratches. Pristine condition. May be open-box.
9 / 10	Excellent — Minimal wear. Barely noticeable micro-scratches.
8 / 10	Very Good — Light signs of use. No structural damage.
7 / 10	Good — Visible light scratches. Fully functional.
6 / 10	Fair — Moderate cosmetic wear. All functions intact.
5 and below	Acceptable — Heavier wear. Discounted accordingly. Rare.
Visual Display
•	On product cards: Show as a small badge in the top-right corner — e.g., a pill-shaped tag reading '9/10' in dark gray on white.
•	On product pages: Prominent display with a horizontal bar or dot-scale indicator. Below the score, show a text label like 'Excellent condition'.
•	Color coding: 9–10 = green indicator, 7–8 = amber, 5–6 = orange. This gives instant visual context.
•	Filtering: On the Shop page, users can filter by minimum condition score using a slider (e.g., 'Show only 8/10 and above').
3.2 Battery Health
Battery health is one of the most critical data points for a refurbished device buyer. Lunex displays it prominently and allows filtering.
Display Logic
•	On product cards: A small circular badge or icon showing the percentage — e.g., '93%' with a battery icon.
•	On product pages: Displayed as a filled progress bar. Color: green for 90%+, amber for 80–89%, orange for 70–79%.
•	Tooltip text on hover: 'Battery health of 93% means strong performance with long daily usage.'
Filtering
•	On the Shop page, users can use a slider to filter by minimum battery health — e.g., 'Show only 85% and above'.
•	This filter is specific to devices where battery health is measured (iPhones, iPads, MacBooks, Apple Watch).
3.3 Price Comparison UI
Every product page and card must show a side-by-side price comparison to reinforce Lunex's value proposition.
Product Card Display
•	Strike-through Egypt market price above the Lunex price
•	Show discount badge: e.g., '-40%' in red
•	Lunex price in bold, larger font
Product Page Display
On the full product page, the pricing section should be a distinct visual block:
•	'Egypt Apple Market Price: 55,000 EGP' — shown in gray with strikethrough
•	'Lunex Price: 33,000 EGP' — shown large and bold in the brand color
•	'You save: 22,000 EGP (40%)' — shown in green
•	Small note below: 'Price based on current Egypt Apple reseller market average'
•	This comparison is critical for trust. It must be honest and accurate, updated regularly.
3.4 Device Type Labeling
Every listing clearly states whether the device is Refurbished or Assembled.
Refurbished
Previously owned Apple device that has been professionally cleaned, repaired if needed, tested, and certified. It contains original Apple hardware and runs genuine iOS/macOS.
Assembled
A device built from original Apple components or high-quality compatible components. These are not factory-produced iPhones per se, but are assembled and tested to meet performance standards.
UI Presentation
•	Both types display as colored label badges: Refurbished in blue, Assembled in purple.
•	On the product page, a short explanation paragraph appears below the badge linking to the 'How Lunex Works' page for full transparency.
•	Filter on Shop page: Checkbox options for 'Refurbished' and 'Assembled'.
 
4. Website Architecture & Navigation
4.1 Navigation Structure
Primary Nav	iPhone / Mac / iPad / Watch / AirPods / Accessories
Secondary Nav	Deals / Compare / Build Your Device
Utility Nav	Search / Wishlist / Cart / Account
Footer Nav	How Lunex Works / Support / FAQ / Returns / About
4.2 URL Structure
•	/  — Home
•	/shop  — All Products
•	/iphone  — iPhone Category
•	/mac  — Mac Category
•	/ipad  — iPad Category
•	/watch  — Apple Watch Category
•	/airpods  — AirPods Category
•	/accessories  — Accessories Category
•	/product/[slug]  — Individual Product Page
•	/compare  — Compare Devices
•	/build  — Build Your Device
•	/wishlist  — User Wishlist
•	/cart  — Shopping Cart
•	/checkout  — Checkout Flow
•	/account  — Account Dashboard
•	/account/orders  — Order History
•	/how-lunex-works  — Concept & Trust Page
•	/support  — Support Center
 
5. Page-by-Page Design & UX Specifications
5.1 Home Page
The Home page is the most important marketing surface. It is inspired by Apple.com — full-width hero sections, minimal copy, massive product imagery, and smooth scroll-driven animations.
Section 1 — Hero
•	Full-screen section (100vh) with a large, cinematic product image
•	Device name in large bold type (e.g., 'iPhone 15 Pro') centered over the image
•	Subtitle: 'From 39,000 EGP' — Lunex price
•	Two CTA buttons: 'Shop Now' (primary) and 'Learn More' (text link)
•	Smooth fade-in animation on page load
•	Hero rotates between 2–3 featured product highlights using auto-advancing slides with dot indicators
Section 2 — Category Navigation
•	Horizontal grid of product category icons — iPhone, Mac, iPad, Watch, AirPods, Accessories
•	Each category shows the product icon, name, and a 'Shop' link
•	Minimal, icon-led layout similar to Apple.com's top category strip
Section 3 — Featured Products
•	'Featured Devices' heading with subtitle
•	Horizontally scrollable row of 6–8 product cards on desktop (2-column grid on mobile)
•	Each card shows: image, model name, condition score badge, battery health badge, Lunex price, market price strikethrough, 'Add to Cart' and 'Wishlist' icons
Section 4 — Why Lunex (The Lunex Difference)
•	Section heading: 'Why Lunex'
•	Short paragraph introducing the concept
•	5 key highlight icons with labels: Cheaper Prices / Professionally Tested / Transparent Condition / Battery Health Displayed / Warranty & Returns
•	CTA button: 'Learn More' linking to /how-lunex-works
Section 5 — Deals / Limited Offers
•	Featured deal cards with countdown timers if applicable
•	Strong visual emphasis on savings amount
Section 6 — Customer Reviews
•	3–4 review cards showing verified buyer feedback
•	Star rating, reviewer name, review text, device purchased
Section 7 — Footer
•	Logo and tagline
•	4-column link grid: Products / Information / Support / Legal
•	Social media icons
•	Copyright notice
5.2 Shop Page (/shop)
The Shop page is the primary product discovery surface. It combines powerful filters with a clean, spacious product grid.
Filter Panel (Left Sidebar or Top Bar)
Category	Checkboxes: iPhone, Mac, iPad, Watch, AirPods, Accessories
Price Range	Dual-handle slider. Min/Max in EGP.
Storage	Checkboxes: 64GB, 128GB, 256GB, 512GB, 1TB
Color	Color swatch buttons: Black, White, Silver, Gold, etc.
Condition Score	Slider: Minimum score 1–10
Battery Health	Slider: Minimum % (e.g., 80% and above)
Device Type	Checkboxes: Refurbished, Assembled
Model	Dropdown or checkbox list by category
Sort By	Dropdown: Price Low–High, Price High–Low, Best Condition, Newest
Product Grid
•	Default: 3-column grid on desktop, 2 on tablet, 1 on mobile
•	Each card: product image, model name, storage/color summary, condition badge, battery health badge, device type badge, Lunex price, market price strikethrough, Add to Cart button, Wishlist toggle
•	Infinite scroll or paginated (24 items per page)
•	Total results count displayed above grid: 'Showing 48 of 127 devices'
5.3 Product Page (/product/[slug])
The Product page is inspired by Apple product pages — long-scroll, section-by-section, deeply informative, and visually premium.
Section A — Hero Product Display
•	Product name in large heading
•	Device type badge (Refurbished / Assembled)
•	Short descriptor line: 'iPhone 14 Pro Max — 256GB — Deep Purple'
•	Main product image, large and centered
Section B — Image Gallery
•	5–8 high-quality images
•	Thumbnail strip below main image
•	Click to zoom lightbox
•	Images change when color or storage variant is selected
Section C — Configuration Panel
•	Storage selector: pill buttons — 128GB / 256GB / 512GB. Greyed out if unavailable.
•	Color selector: circular color swatches. Unavailable colors show X mark.
•	Condition score and battery health displayed as read-only indicators (not selectable — these are fixed per listing)
Section D — Pricing Block
•	Egypt Market Price: 55,000 EGP (strikethrough in gray)
•	Lunex Price: 33,000 EGP (bold, large, blue)
•	You Save: 22,000 EGP — 40% (green badge)
•	'Add to Cart' button — large, full-width on mobile
•	'Add to Wishlist' link below
Section E — Condition & Battery Block
•	Condition Score: Visual 10-dot scale, filled to score. Label text below.
•	Battery Health: Filled progress bar with percentage. Color coded.
•	Short explanation linking to 'How Lunex Works' for users unfamiliar
Section F — Detailed Specifications
•	Two-column spec table: Attribute | Value
•	Organized by sub-sections: Display / Performance / Camera / Battery / Connectivity / Design
Section G — What's In The Box
•	Icon + label list of included items: Device, Charging Cable, Adapter (if included), Documentation
Section H — Warranty Information
•	Warranty period and terms clearly stated
•	Return window and process
•	Customer service contact
Section I — Related Products
•	Horizontal scroll of 4–6 related products (same category or complementary)
5.4 Category Pages
Each category page (e.g., /iphone, /mac, /ipad) follows a consistent template.
•	Hero banner specific to the category — e.g., iPhone lineup image
•	Short category description and device count: 'Explore 47 available iPhone models'
•	Sub-category navigation (e.g., iPhone 15 series / iPhone 14 series / iPhone 13 series)
•	Product grid with same card format as Shop page
•	Category-specific filters — e.g., on /mac, filter by chip (M1/M2/Intel)
5.5 Compare Page (/compare)
The Compare page lets users select 2–4 devices and view their specs side by side in a table.
UX Flow
1.	User arrives at /compare (via 'Compare' button on product cards or nav)
2.	A search/select field at the top lets user type a device name and add it to comparison
3.	Up to 4 devices can be compared simultaneously
4.	A full-width table renders with rows for every spec attribute
5.	Differences are highlighted — better value cells shown with light green background
Data Structure
•	Comparison table rows: Model, Device Type, Condition Score, Battery Health, Display, Chip, RAM, Storage, Camera, Battery, OS, Price
•	Pinned first column = attribute name
•	Each subsequent column = one device
•	'Add to Cart' and 'View Product' buttons at the bottom of each device column
5.6 Build Your Device Page (/build)
An interactive configuration tool where users define their ideal device specs and find matching listings.
Step-by-Step Builder Flow
6.	Step 1: Select Category — iPhone / Mac / iPad / Watch / AirPods
7.	Step 2: Select Model — dropdown updates based on category
8.	Step 3: Select Storage — only shows storage options available in inventory
9.	Step 4: Select Color — only shows available colors
10.	Step 5: Select Minimum Condition Score — slider 7–10
11.	Step 6: Select Minimum Battery Health — slider 80–100%
12.	Step 7: Select Device Type — Refurbished / Assembled / No Preference
After configuration, the system queries the inventory and displays:
•	All matching listings sorted by price
•	Price updates dynamically as user adjusts each step
•	If no matches: 'No devices match your criteria. Try adjusting your filters.'
•	'Notify Me' option to get an email when a matching device becomes available
5.7 Wishlist (/wishlist)
Functionality
•	Users can toggle a heart icon on any product card or product page to save it to their wishlist
•	Logged-in users: wishlist saved to their account, persistent across sessions and devices
•	Guest users: wishlist stored in browser localStorage, prompting login/signup to save permanently
•	Wishlist page shows all saved products in a grid with current price, availability status, and option to add to cart directly
•	If a wishlisted item drops in price or goes out of stock, the user receives an email notification (if logged in)
5.8 Cart Page (/cart)
Cart Item Structure
Product Image	Thumbnail of the specific color variant
Product Name	Model + Storage + Color (e.g., iPhone 14 Pro 256GB Deep Purple)
Device Type Badge	Refurbished or Assembled
Condition Score	Small badge
Battery Health	Percentage display
Unit Price	Lunex price in EGP
Quantity	Stepper control (most devices = 1, accessories can be multiple)
Remove	Trash icon link
Subtotal	Auto-calculated below all items
Cart Summary Block
•	Subtotal
•	Estimated shipping (based on location, calculated at checkout)
•	Promo code input field
•	Total
•	'Proceed to Checkout' CTA button
•	'Continue Shopping' link
5.9 Checkout (/checkout)
A multi-step checkout flow, clean and minimal. Progress indicator at the top.
Step 1 — Customer Information
•	Full name, email, phone number
•	Option to create account or continue as guest
Step 2 — Shipping Address
•	Governorate dropdown (Cairo, Giza, Alexandria, etc.)
•	Full address, building, floor, apartment
•	Save address for future orders (logged-in users)
Step 3 — Delivery Options
•	Standard Delivery: 3–5 business days — Free above 1,000 EGP
•	Express Delivery: 1–2 business days — 100 EGP
•	Store Pickup: Available if physical presence exists
Step 4 — Payment Method
•	Cash on Delivery (most common in Egypt)
•	Credit/Debit Card (Visa, Mastercard via payment gateway like Paymob or Fawry)
•	Wallet payments — Vodafone Cash, Orange Cash
•	Installment options — integration with Valu, Sympl, or B.TECH finance
Step 5 — Order Review
•	Full summary of items, shipping, and payment method before final placement
•	Confirm order button
•	Order confirmation page with order number and expected delivery date
5.10 User Account (/account)
Orders	List of all past orders with status tracking (Processing, Shipped, Delivered)
Wishlist	Saved products with current price and availability
Saved Devices	Devices previously viewed or configured in Build Your Device
Profile Settings	Name, email, password change, phone number, saved addresses
Notifications	Manage email preferences — price drops, back-in-stock, order updates
5.11 Support Page (/support)
•	FAQ — accordion-style, organized by topic: Ordering, Shipping, Returns, Warranty, Device Quality
•	Contact Form — name, email, subject, message, file upload (for warranty claims)
•	Shipping Information — zones, timelines, pricing table
•	Returns Policy — 7-day return window, conditions, process instructions
•	Live Chat widget (optional integration — Intercom, Crisp, or Tidio)
 
6. How Lunex Works Page (/how-lunex-works)
This is the most important trust-building page on the site. It follows an Apple-style long-scroll storytelling format — clean sections, large headings, minimal copy, and visual diagrams or icons for each section. Every customer who is uncertain about buying a refurbished or assembled device should be able to read this page and feel completely confident.
6.1 Page Introduction
Section heading: 'The Lunex Difference'
Subtitle: 'Premium Apple devices. Professionally tested. Significantly cheaper.'
Opening paragraph (2–3 sentences): Explain that Lunex believes everyone deserves access to Apple's ecosystem, that most Egyptians pay a steep premium for new Apple products, and that Lunex solves this by offering a curated selection of professionally tested devices at up to 40% less.
6.2 Why Our Prices Are Lower
Visual layout: Two comparison columns — 'Typical Egypt Market' vs 'Lunex'.
Egypt Apple Market	Brand new, sealed box, retailer markup, import duties on full retail value
Lunex	Refurbished or assembled, direct sourcing, tested in-house, no flagship retail overhead
•	Use an example: iPhone 14 Pro Max — Market: 55,000 EGP / Lunex: 33,000 EGP
•	Explain the pricing is possible because Lunex operates leaner — no Apple franchise fees, direct sourcing, and value-based pricing
•	Stress that lower price does not mean lower quality — it means lower cost origin
6.3 Device Types Explained
Refurbished Devices
A refurbished device is a previously owned Apple product that has been returned, inspected, repaired where necessary, fully cleaned, and re-tested to meet our strict quality standards. The device uses original Apple internals and runs genuine Apple software.
•	Original Apple hardware and software
•	Any damaged components replaced before sale
•	Cosmetic grade applied based on visual inspection
•	Suitable for users who want a real Apple device at reduced cost
Assembled Devices
An assembled device is built using original Apple parts or premium compatible components, assembled and tested by our technicians. These devices are built to perform identically to factory-produced units.
•	Components are sourced from verified suppliers
•	Assembled in controlled, clean environments
•	Every unit undergoes the same testing protocol as refurbished devices
•	Suitable for users who prioritize performance and value over brand-new boxing
Note: Assembled devices are clearly labeled on every listing. Lunex is fully transparent about the origin of every device.
6.4 Testing Process
Every device — regardless of type — goes through a standardized multi-step inspection and testing protocol before it is listed on Lunex.
Testing Steps
13.	Hardware Inspection — Motherboard, display, buttons, speakers, microphone, ports
14.	Battery Health Testing — Measured using diagnostic tools. Exact percentage recorded.
15.	Display Test — Dead pixels, brightness uniformity, touch responsiveness
16.	Camera & Sensors — All cameras tested, Face ID / Touch ID verified, gyroscope, accelerometer
17.	Connectivity Testing — Wi-Fi, Bluetooth, 5G/LTE, NFC, GPS
18.	Software Validation — Fresh iOS/macOS install confirmed, no iCloud lock
19.	Cosmetic Grading — Physical inspection under bright light. Condition score assigned.
20.	Final QA Sign-off — Device approved and photographed
6.5 Condition Score Explained
10 / 10	Like New — Pristine. No signs of use. May be open-box or lightly handled.
9 / 10	Excellent — Near perfect. Only micro-scratches visible under bright light.
8 / 10	Very Good — Light surface wear. No structural damage. Full functionality.
7 / 10	Good — Noticeable light scratches. All features working perfectly.
6 / 10	Fair — More visible wear but fully functional. Great value for the price.
The condition score is assigned by our QA team after physical inspection. It reflects cosmetic state only — not performance. A device scoring 7/10 performs identically to a 10/10 unit.
6.6 Battery Health Explained
Battery health represents the current maximum capacity of the battery relative to when it was new. A battery at 100% is brand new. Over time and charge cycles, this percentage decreases.
90% – 100%	Excellent — Like new performance. Full day usage expected.
80% – 89%	Good — Strong battery life. Ideal for most users.
70% – 79%	Fair — Noticeable reduction. Suitable for moderate users.
Below 70%	Not listed — Lunex does not sell devices below 70% battery health.
Battery health is always measured using Apple's own diagnostics tools and displayed on every listing. We never hide battery health. If a device battery does not meet our minimum standard, it is replaced before listing.
6.7 Warranty & Returns
Warranty
Warranty Period	3 to 6 months depending on device type and condition score
Coverage	Hardware defects and functional failures arising from normal use
Not Covered	Physical damage, liquid damage, unauthorized modifications
Claim Process	Contact support with order number and description. Replacement or repair within 7 business days.
Return Policy
•	7-day return window from delivery date
•	Device must be returned in the same condition as received
•	Full refund issued within 3–5 business days after device inspection
•	Return shipping covered by Lunex for defective devices
•	For non-defective returns, customer covers return shipping
 
7. UI & Design System
7.1 Design Philosophy
The Lunex design system is modeled on Apple.com. The core principles are: extreme minimalism, product-first layout, generous white space, and smooth micro-animations that feel premium without being flashy.
7.2 Color System
Background	#FFFFFF — Pure white. Primary page background.
Surface	#F5F5F7 — Apple's standard off-white for section backgrounds.
Text Primary	#1D1D1F — Apple's near-black text.
Text Secondary	#6E6E73 — Gray for subtitles and metadata.
Brand Accent	#0071E3 — Apple blue for CTAs and highlights.
Success / Save	#34C759 — Green for savings, battery health, stock.
Warning	#FF9500 — Amber for medium condition / battery indicators.
Error / OOS	#FF3B30 — Red for out of stock, price alerts.
Dark Mode	Full dark mode support: #000000 base, #1C1C1E surfaces.
7.3 Typography
Primary Font	SF Pro Display (Apple) or Inter — clean, modern, geometric sans-serif
Heading Scale	72px Hero / 48px H1 / 36px H2 / 28px H3 / 22px H4
Body Text	17px for standard paragraphs
Caption / Label	13px for metadata, badges, secondary info
Line Height	1.5 for body, 1.2 for headings
Font Weight	300 for subtext, 400 for body, 600 for titles, 700 for CTAs
7.4 Spacing System
Based on an 8pt grid. All spacing values are multiples of 8px (8, 16, 24, 32, 48, 64, 96, 128).
7.5 Grid Layout
Max Width	1200px content width, centered
Desktop Columns	12-column grid
Tablet	8 columns, 16px gutters
Mobile	4 columns, 16px gutters, full-width cards
Product Grid	3 cols desktop / 2 cols tablet / 1 col mobile
7.6 Interaction Design
•	Hover states on product cards: subtle scale(1.02) transform, shadow deepens
•	Page load: Hero fades in over 400ms, staggered product card entrance at 100ms intervals
•	Scroll animations: Sections fade up on scroll (Intersection Observer)
•	Smooth scroll navigation between sections on product page
•	Button press: subtle scale-down (0.97) on active state
•	Skeleton loading states for all product grids — avoids layout shift
•	Image zoom on product page: smooth scale on hover, click opens lightbox
•	Cart slide-in panel from the right on 'Add to Cart' rather than full page redirect
 
8. Database Design
8.1 Core Tables
products
id	UUID, Primary Key
name	VARCHAR(255) — e.g., 'iPhone 14 Pro Max'
slug	VARCHAR(255) — URL-safe identifier
category_id	FK → categories
device_type	ENUM('refurbished', 'assembled')
release_year	INTEGER
description	TEXT
is_active	BOOLEAN
created_at / updated_at	TIMESTAMP
product_variants
id	UUID
product_id	FK → products
storage	VARCHAR(50) — e.g., '256GB'
color	VARCHAR(50) — e.g., 'Deep Purple'
condition_score	INTEGER 1–10
battery_health	INTEGER — percentage
sku	VARCHAR(100) — internal SKU
lunex_price	DECIMAL(10,2)
market_price	DECIMAL(10,2)
stock_quantity	INTEGER
is_available	BOOLEAN
warranty_months	INTEGER
specifications
id	UUID
product_id	FK → products
spec_group	VARCHAR(100) — e.g., 'Display', 'Performance'
spec_key	VARCHAR(100) — e.g., 'Chipset'
spec_value	VARCHAR(255) — e.g., 'Apple A16 Bionic'
display_order	INTEGER
categories
id	UUID
name	VARCHAR(100)
slug	VARCHAR(100)
parent_id	Self-referencing FK (for sub-categories)
icon_url	VARCHAR(255)
is_active	BOOLEAN
users
id	UUID
full_name	VARCHAR(255)
email	VARCHAR(255) — Unique
phone	VARCHAR(20)
password_hash	VARCHAR(255)
is_verified	BOOLEAN
created_at	TIMESTAMP
orders
id	UUID
user_id	FK → users (nullable for guests)
status	ENUM('pending','processing','shipped','delivered','cancelled')
total_amount	DECIMAL(10,2)
shipping_address	JSONB
payment_method	VARCHAR(50)
delivery_option	VARCHAR(50)
created_at	TIMESTAMP
order_items
id	UUID
order_id	FK → orders
product_variant_id	FK → product_variants
quantity	INTEGER
unit_price	DECIMAL(10,2)
subtotal	DECIMAL(10,2)
wishlist
id	UUID
user_id	FK → users
product_variant_id	FK → product_variants
created_at	TIMESTAMP
reviews
id	UUID
user_id	FK → users
product_id	FK → products
rating	INTEGER 1–5
title	VARCHAR(255)
body	TEXT
is_verified_purchase	BOOLEAN
is_approved	BOOLEAN
created_at	TIMESTAMP
product_images
id	UUID
product_variant_id	FK → product_variants (color-specific images)
product_id	FK → products (general product images)
url	VARCHAR(500)
alt_text	VARCHAR(255)
is_primary	BOOLEAN
display_order	INTEGER
 
9. Admin Panel
The Lunex admin dashboard is a dedicated internal interface for managing the entire store. It is accessible only to authorized staff.
9.1 Dashboard Overview
•	KPI cards: Total orders today, revenue this month, active listings, low-stock alerts
•	Recent orders table with quick-action buttons
•	Charts: Sales by category, daily revenue trend, top-selling models
9.2 Product Management
•	Add new product: Form with all fields — name, category, specs, images, device type
•	Add/edit variants: Storage, color, condition score, battery health, price, stock
•	Bulk price update: Apply % discount or EGP change to a category or selection
•	Image management: Upload, reorder, and tag product images per color variant
•	Product status toggle: Active / Draft / Out of Stock
9.3 Inventory Management
•	Real-time stock levels per variant (model + storage + color + condition)
•	Low stock alerts: Configurable threshold — e.g., notify at 3 units remaining
•	Stock adjustment log: Track manual stock changes with reason and timestamp
•	Bulk import: CSV upload for adding multiple product variants at once
9.4 Order Management
•	Order list with filters: status, date, payment method, governorate
•	Order detail view: Full customer info, items, address, payment, shipping label generation
•	Status update: Move orders through pipeline with customer notification trigger
•	Cancellation and refund management
9.5 Customer Management
•	Customer list with search and filter
•	Customer profile: account info, order history, wishlist, total spend
•	Manual account management — reset password, flag/suspend, notes
9.6 Reviews Management
•	Review moderation queue: Approve, reject, or flag reviews before publication
•	Filter by product, rating, date
9.7 Price Management
•	Egypt market price reference update — kept current for accurate comparisons
•	Bulk discount tool — apply sale pricing to selected items or categories
•	Promo code creation and management
 
10. Technology Stack
10.1 Recommended Stack
Frontend Framework	Next.js 14+ — App Router, SSR/SSG/ISR for performance and SEO
Styling	Tailwind CSS — rapid, consistent, utility-first styling
Animations	Framer Motion — smooth, physics-based animations
State Management	Zustand — lightweight store for cart, wishlist, UI state
Backend	Next.js API Routes + Node.js — same repo, full-stack capability
Database	PostgreSQL — relational, robust, supports JSONB for flexible fields
ORM	Prisma — type-safe database access with schema migrations
Authentication	NextAuth.js — supports credentials, social, JWT sessions
File Storage	Cloudinary or AWS S3 — product image hosting and transformation
Payment	Paymob — Egypt's leading payment gateway (cards, wallets, installments)
Email	Resend or SendGrid — transactional email (orders, password reset, notifications)
Search	Algolia or Meilisearch — fast, filterable product search
CMS / Admin	Custom Next.js admin panel or Payload CMS
Deployment	Vercel — seamless Next.js hosting with edge CDN
Database Host	Supabase (managed PostgreSQL) or Railway
10.2 Reasoning
•	Next.js is the ideal choice for an e-commerce site — server-side rendering ensures product pages are SEO-indexed and fast-loading, critical for search traffic in Egypt.
•	Tailwind CSS combined with Framer Motion delivers the Apple-inspired premium animations and clean layout without heavyweight component libraries.
•	PostgreSQL with Prisma gives type-safe access to a relational data model that handles product variants, orders, and users cleanly.
•	Paymob is the dominant Egyptian payment processor supporting all local payment methods including Fawry, Vodafone Cash, and bank cards.
•	Cloudinary handles product image hosting with on-the-fly resizing and WebP conversion — essential for performance on mobile devices.
 
11. Development Roadmap
Phase 1 — Product Planning (Weeks 1–2)
•	Finalize full feature list and scope
•	Define product catalog structure and all required attributes
•	Agree on design language, color system, typography
•	Select and confirm technology stack
•	Set up project repositories and development environments
•	Write full database schema
Phase 2 — UI/UX Design (Weeks 3–5)
•	Design all page wireframes in Figma: Home, Shop, Product, Compare, Build, Checkout
•	Design mobile-first layouts
•	Create design system: colors, components, typography, spacing
•	Design 'How Lunex Works' page storytelling layout
•	Prototype interactions and animations
•	Stakeholder review and design sign-off
Phase 3 — Backend & Database (Weeks 6–8)
•	Initialize PostgreSQL database and Prisma schema
•	Build product, variant, category, and specification models
•	Build user authentication (register, login, sessions, JWT)
•	Build order management data model and API routes
•	Implement image upload and storage pipeline
•	Build admin CRUD API endpoints
Phase 4 — Product Catalog Build (Weeks 9–10)
•	Populate full Apple product catalog with all models, specs, and variants
•	Upload and organize product images for all listings
•	Assign condition scores, battery health, and pricing to all variants
•	QA data integrity: verify all specs, prices, and images are accurate
Phase 5 — Frontend Development (Weeks 11–16)
•	Build component library: product cards, badges, buttons, filters, nav
•	Implement Home page with all sections and animations
•	Implement Shop page with full filtering and search
•	Implement Product page with configuration, pricing, and spec sections
•	Implement Category pages
•	Implement Compare page
•	Implement Build Your Device page
•	Implement Wishlist, Cart, and Checkout flow
•	Implement User Account dashboard
•	Implement How Lunex Works page
•	Implement Support page
Phase 6 — Admin Panel (Weeks 17–18)
•	Build admin dashboard with KPIs and charts
•	Build product and variant management UI
•	Build order management and customer management
•	Build inventory tracking and low-stock alerts
Phase 7 — Integration & Testing (Weeks 19–20)
•	Integrate Paymob payment gateway and test all payment methods
•	Integrate email notifications for orders, shipping, price drops
•	Integrate Algolia/Meilisearch for product search
•	Cross-browser and cross-device testing (iOS Safari, Chrome Android, Desktop)
•	Performance audit: Lighthouse scores target 90+ on all pages
•	Security audit: SQL injection, XSS, authentication flows
•	Bug fixing and QA cycle
Phase 8 — Launch Preparation (Week 21–22)
•	Domain setup, SSL configuration, DNS
•	Deploy to Vercel production environment
•	SEO: meta tags, Open Graph, sitemap.xml, robots.txt
•	Analytics integration: Google Analytics 4, Meta Pixel
•	Final content review and copy proofreading
•	Staff training on admin panel and order management
•	Soft launch to a limited audience for final validation
•	Public launch

Lunex — Product Planning Document v1.0
Confidential — Internal Use Only
ok
ok
ok