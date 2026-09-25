# Shade's Sweet Scoops Candles — Website

A multi-page website for Shade's Sweet Scoops Candles, a handmade, ice-cream-inspired
candle brand. Built with plain HTML, CSS and JavaScript — no build step, no
frameworks, no backend. It can be opened directly in a browser or uploaded to any
static web host.

There is **no online payment processing**. Customers browse products, add them to
an **Enquiry Bag**, and send their order through **WhatsApp** or **email**. The
business confirms final pricing, payment and delivery directly with the customer.

## Before you launch

Open `js/main.js` and edit the `SITE_CONFIG` object near the top of the file —
this is the only place these values live:

```js
const SITE_CONFIG = {
  WHATSAPP_NUMBER: "27XXXXXXXXX", // international format, digits only, no "+" or leading 0
  BUSINESS_EMAIL: "sweetsscoopcandles@gmail.com",
  BRAND_NAME: "Shade's Sweet Scoops Candles",
  INSTAGRAM_HANDLE: "@shadessweetscoopscandles"
};
```

Every WhatsApp button and email link on the site reads from this object, so you
only ever need to update it in one place.

## Project structure

```
/
├── index.html          Home page
├── shop.html            Shop / product catalogue
├── product.html          Product detail (reads ?id= from the URL)
├── about.html            Brand story
├── contact.html          Contact form
├── faq.html               FAQ accordion
├── enquiry.html         Enquiry Bag (cart)
├── privacy.html         Privacy Policy
├── terms.html            Terms & Conditions
│
├── css/
│   └── style.css         All styling for every page
│
├── js/
│   ├── products.js       Product catalogue data (edit this to add/change products)
│   ├── main.js            Site config, header/menu, Enquiry Bag logic, shared helpers
│   ├── shop.js             Shop page: filtering, search, sorting
│   ├── product.js         Product detail page rendering
│   ├── enquiry.js          Enquiry Bag page logic
│   └── contact.js          Contact form validation
│
├── images/
│   ├── logo.jpg
│   ├── products/          Individual product photos
│   └── lifestyle/         Hero and lifestyle photography
│
└── README.md
```

## Editing products

All product data lives in `js/products.js`, in the `PRODUCTS` array. To add a new
candle, copy an existing product object and update the fields — the shop grid,
search, filtering and product page all read from this one file automatically.

The `PRICE_TIERS` array feeds the pricing strip at the top of the Shop page, and
`SHOP_CATEGORIES` controls the category filter tabs.

## How the Enquiry Bag works

- Items are stored in the visitor's own browser using `localStorage`, so the bag
  survives a page refresh but is specific to that device/browser.
- Nothing is sent anywhere until the customer taps **Send via WhatsApp** or
  **Send via Email** on the Enquiry Bag page — this opens their own WhatsApp or
  email app with a pre-filled, itemised message.
- The shared cart logic (add, remove, update quantity, totals) lives in the
  `Cart` object inside `js/main.js`.

## Notes for whoever maintains this site

- The newsletter sign-up forms currently validate the email address and show a
  confirmation message, but are not yet wired up to an email marketing service
  (e.g. Mailchimp). Connect a real newsletter provider before relying on it to
  collect subscribers.
- Replace the placeholder `WHATSAPP_NUMBER` and confirm `BUSINESS_EMAIL` in
  `js/main.js` before launch.
- Photography in `images/products/` and `images/lifestyle/` is the brand's own —
  replace or add to it as the product range grows.

## Deploying to Hostinger

This is a static site (no build step, no database), so deployment is just a
file upload.

1. Log in to **hPanel** and go to **Files → File Manager** for the domain you
   want the site on (or **Websites → Manage → File Manager**).
2. Open the `public_html` folder. If it already has a `default.php` or similar
   placeholder file, delete it.
3. Click **Upload**, and upload every file and folder from inside this `shades`
   folder (not the folder itself) — so `index.html`, `shop.html`, `css/`, `js/`,
   `images/`, `robots.txt`, `sitemap.xml`, and so on all end up directly inside
   `public_html`.
   - If Hostinger only accepts a single archive, you can instead upload the
     zip and use File Manager's **Extract** option once it's inside
     `public_html`, then delete the zip.
4. Visit **https://sweetscoopcandles.co.za/** — the site should load immediately,
   no further setup needed. The domain and contact email are already
   configured correctly throughout the site (see below).
5. This site's email is `sweetsscoopcandles@gmail.com`, a Gmail inbox, so no
   email hosting setup is needed on Hostinger for it to work — every email
   link on the site already opens that address. If that ever changes, update
   `BUSINESS_EMAIL` in `js/main.js` — it is the single source of truth for
   every WhatsApp/email link on the site.

### Domain and email — already configured

The live domain (`https://sweetscoopcandles.co.za`) and the business email
(`sweetsscoopcandles@gmail.com`) are set throughout the site: in every page's
canonical link, Open Graph tags, the homepage's structured data, `sitemap.xml`,
`robots.txt`, the footer, and every "Ask About This Product" / contact link.
If either one ever changes again, there are exactly two places to edit:

- `js/main.js` → `SITE_CONFIG.BUSINESS_EMAIL` and `SITE_CONFIG.SITE_URL`
  (drives every dynamic link and the Product structured data on
  `product.html`)
- A project-wide find-and-replace for the domain string
  `https://sweetscoopcandles.co.za`, which appears statically in each page's
  `<head>` (canonical/Open Graph tags), `sitemap.xml`, `robots.txt`, and the
  homepage's `LocalBusiness` JSON-LD — these are static HTML/XML so a config
  variable can't reach them, the way it can for `js/main.js`.

## Basic Google SEO checklist

The site already ships with the technical basics in place:

- A unique `<title>` and meta description on every page
- `sitemap.xml` and `robots.txt` at the root
- Canonical links, Open Graph and Twitter Card tags on every page (so links
  shared on WhatsApp, Facebook, etc. show a proper preview)
- `LocalBusiness` structured data on the homepage, and `Product` structured
  data on every product page (both in JSON-LD, the format Google prefers)
- Descriptive `alt` text on every image
- The Enquiry Bag (`enquiry.html`) is marked `noindex` since it has no unique
  content worth ranking

What only you can do, once the domain is live:

1. **Update the placeholder domain** everywhere (see above) — this has to
   happen before any of the SEO tags are accurate.
2. **Google Search Console** ([search.google.com/search-console](https://search.google.com/search-console)):
   add your domain, verify ownership (Hostinger's hPanel has a one-click DNS
   verification option for this), then submit `https://yourdomain.co.za/sitemap.xml`
   under Sitemaps so Google knows to crawl it.
3. **Google Business Profile** ([google.com/business](https://www.google.com/business)):
   create a free profile for Shade's Sweet Scoops Candles — this is what makes
   the business show up on Google Maps and in local search results, separate
   from the website itself.
4. **`sameAs` in the homepage's structured data**: once you have confirmed,
   live social media URLs (Instagram, Facebook, etc.), add them to the empty
   `"sameAs": []` array in the `<script type="application/ld+json">` block near
   the top of `index.html`, e.g. `"sameAs": ["https://instagram.com/yourhandle"]`.
5. Keep publishing real content occasionally (new flavours, market
   appearances) — fresh, regularly-updated pages are one of the simplest
   things that helps small local business sites rank over time.

