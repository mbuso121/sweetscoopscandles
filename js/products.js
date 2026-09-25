/* =================================================================
   PRODUCTS.JS
   Product catalogue for Shade's Sweet Scoops Candles.
   Loaded before every other page script — do not use `import`.
   ================================================================= */

const PRODUCTS = [
  {
    id: "whipped-scoop-vanilla-strawberry",
    name: "Vanilla Strawberry Whipped & Scoop Candle",
    category: "whipped",
    categoryLabel: "Whipped Scoop Candles",
    type: "Whipped Scoop Decorated",
    flavor: "Vanilla Strawberry",
    price: 250,
    description: "Our most elaborate design: a whipped vanilla-strawberry swirl layered with a soft scoop and finished with a candy strawberry.",
    longDescription: "The signature of the collection. A creamy vanilla base is topped with a hand-piped strawberry whipped swirl, then finished with a second soft scoop layer and a tiny candy strawberry topper for an elegant, multi-layered look.",
    size: "Approx. 200ml glass tumbler",
    scent: "Vanilla bean base with a bright, fresh strawberry top note",
    burnTime: "Approx. 15–18 hours",
    materials: "Soy wax, cotton wick, decorative wax toppers, glass tumbler",
    availability: "Made to Order",
    image: "images/products/whipped-scoop-vanilla-strawberry.jpg",
    gallery: ["images/products/whipped-scoop-vanilla-strawberry.jpg", "images/lifestyle/variety-stand.jpg"],
    bestSeller: true,
    featured: true
  },
  {
    id: "scoop-decorated-chocolate",
    name: "Chocolate Scoop Decorated Candle",
    category: "scoop",
    categoryLabel: "Scoop Candles",
    type: "Scoop Candles with Decorations",
    flavor: "Chocolate",
    price: 230,
    description: "A textured chocolate scoop sits on a smooth vanilla base, topped with a tiny wax chocolate square.",
    longDescription: "A rich, textured chocolate scoop rests on a smooth two-tone base and is finished with a miniature wax chocolate square for a true melted-chocolate-scoop look. A warm, comforting scent pair that works beautifully as a gift.",
    size: "Approx. 200ml glass tumbler",
    scent: "Deep cocoa and warm vanilla",
    burnTime: "Approx. 15–18 hours",
    materials: "Soy wax, cotton wick, decorative wax topper, glass tumbler",
    availability: "Made to Order",
    image: "images/products/scoop-decorated-chocolate.jpg",
    gallery: ["images/products/scoop-decorated-chocolate.jpg", "images/lifestyle/variety-stand.jpg"],
    bestSeller: true,
    featured: true
  },
  {
    id: "whipped-decorated-chocolate",
    name: "Chocolate Whipped Decorated Candle",
    category: "whipped",
    categoryLabel: "Whipped Candles",
    type: "Whipped with Decorations",
    flavor: "Chocolate",
    price: 220,
    description: "Hand-piped chocolate whip over a creamy base, topped with a mini wax chocolate square.",
    longDescription: "Hand-piped whipped chocolate wax is layered generously over a smooth cream-coloured base and finished with a tiny wax chocolate square, styled after a whipped chocolate dessert. A rich, cocoa-forward scent throughout.",
    size: "Approx. 200ml glass tumbler",
    scent: "Rich cocoa with a hint of toasted vanilla",
    burnTime: "Approx. 16–19 hours",
    materials: "Soy wax, cotton wick, decorative wax topper, glass tumbler",
    availability: "Made to Order",
    image: "images/products/whipped-decorated-chocolate.jpg",
    gallery: ["images/products/whipped-decorated-chocolate.jpg", "images/lifestyle/variety-stand.jpg"],
    bestSeller: false,
    featured: false
  },
  {
    id: "scoop-decorated-bubblegum",
    name: "Bubblegum Scoop Decorated Candle",
    category: "scoop",
    categoryLabel: "Scoop Candles",
    type: "Scoop Candles with Decorations",
    flavor: "Bubblegum",
    price: 230,
    description: "A playful pastel-blue scoop finished with a mini wax wafer and candy button toppers.",
    longDescription: "A soft, pastel-blue textured scoop candle finished with a mini wax wafer biscuit and candy-button toppers for a fun, sweet-shop feel. One of our most-loved gift picks for younger recipients and anyone who loves a pop of colour.",
    size: "Approx. 200ml glass tumbler",
    scent: "Sweet bubblegum with a candy-floss finish",
    burnTime: "Approx. 15–18 hours",
    materials: "Soy wax, cotton wick, decorative wax toppers, glass tumbler",
    availability: "Made to Order",
    image: "images/products/scoop-decorated-bubblegum.jpg",
    gallery: ["images/products/scoop-decorated-bubblegum.jpg", "images/lifestyle/variety-stand.jpg"],
    bestSeller: false,
    featured: false
  },
  {
    id: "whipped-decorated-vanilla-strawberry",
    name: "Vanilla Strawberry Whipped Decorated Candle",
    category: "whipped",
    categoryLabel: "Whipped Candles",
    type: "Whipped with Decorations",
    flavor: "Vanilla Strawberry",
    price: 220,
    description: "A soft strawberry whip piped over a vanilla base and finished with a candy strawberry.",
    longDescription: "A generous strawberry whipped swirl is piped over a smooth vanilla base and finished with a small candy strawberry topper. Light, fresh and one of our best-selling scent pairings for everyday enjoyment.",
    size: "Approx. 200ml glass tumbler",
    scent: "Fresh strawberry over a soft vanilla base",
    burnTime: "Approx. 16–19 hours",
    materials: "Soy wax, cotton wick, decorative wax topper, glass tumbler",
    availability: "Made to Order",
    image: "images/products/whipped-decorated-vanilla-strawberry.jpg",
    gallery: ["images/products/whipped-decorated-vanilla-strawberry.jpg", "images/lifestyle/variety-stand.jpg"],
    bestSeller: false,
    featured: true
  },
  {
    id: "whipped-vanilla-strawberry",
    name: "Vanilla Strawberry Whipped Candle",
    category: "whipped",
    categoryLabel: "Whipped Candles",
    type: "Whipped Candle",
    flavor: "Vanilla Strawberry",
    price: 200,
    description: "A simple, elegant whipped strawberry top over a creamy vanilla base — no toppers, all texture.",
    longDescription: "Our most understated design: a soft whipped strawberry swirl piped over a creamy vanilla base, with no added toppers. A lovely everyday candle for anyone who wants the whipped aesthetic without the decorative details.",
    size: "Approx. 200ml glass tumbler",
    scent: "Fresh strawberry over a soft vanilla base",
    burnTime: "Approx. 16–19 hours",
    materials: "Soy wax, cotton wick, glass tumbler",
    availability: "Made to Order",
    image: "images/products/whipped-vanilla-strawberry.jpg",
    gallery: ["images/products/whipped-vanilla-strawberry.jpg"],
    bestSeller: false,
    featured: false
  },
  {
    id: "mini-scoop-gift-set",
    name: "Mixed Flavour Mini Scoop Gift Set",
    category: "giftset",
    categoryLabel: "Gift Sets",
    type: "Gift Set — 5 Mini Scoops",
    flavor: "Chocolate, Vanilla, Strawberry, Bubblegum & Marshmallow",
    price: 230,
    description: "Five mini scoop candles in five flavours, presented together for gifting or a taste of every scent.",
    longDescription: "Five of our signature mini scoop candles — chocolate, vanilla, strawberry, bubblegum and marshmallow — presented together as a set. Each mini scoop is hand-shaped and undecorated for a clean, classic look perfect for gifting.",
    size: "5 x mini scoop candles (no glass tumbler)",
    scent: "Chocolate, Vanilla, Strawberry, Bubblegum, Marshmallow",
    burnTime: "Approx. 4–6 hours per mini scoop",
    materials: "Soy wax, cotton wicks",
    availability: "Made to Order",
    image: "images/lifestyle/variety-stand.jpg",
    gallery: ["images/lifestyle/variety-stand.jpg"],
    bestSeller: true,
    featured: true
  }
];

/* Pricing tiers shown as a quick-reference strip on the Shop page.
   Matches the studio price list; not all tiers have a dedicated single-item
   product yet — the Mini Scoop tier is only sold as the Gift Set above. */
const PRICE_TIERS = [
  { name: "Scoop Candle (mini)", price: 50 },
  { name: "Whipped Candle", price: 200 },
  { name: "Whipped with Decorations", price: 220 },
  { name: "Scoop with Decorations", price: 230 },
  { name: "Whipped Scoop Decorated", price: 250 }
];

const SHOP_CATEGORIES = [
  { id: "all", label: "All" },
  { id: "whipped", label: "Whipped Candles" },
  { id: "scoop", label: "Scoop Candles" },
  { id: "giftset", label: "Gift Sets" },
  { id: "custom", label: "Custom Orders" }
];

function getProductById(id){
  return PRODUCTS.find(function(p){ return p.id === id; }) || null;
}

function formatPrice(amount){
  return "R" + amount.toFixed(0);
}
