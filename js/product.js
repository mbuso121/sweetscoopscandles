/* =================================================================
   PRODUCT.JS — single product detail page.
   Reads ?id= from the URL and renders against PRODUCTS from products.js.
   ================================================================= */

document.addEventListener("DOMContentLoaded", function(){
  const root = document.getElementById("productDetailRoot");
  const notFoundRoot = document.getElementById("productNotFound");
  if(!root) return; // Not on the product page.

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const product = id ? getProductById(id) : null;

  if(!product){
    root.style.display = "none";
    if(notFoundRoot) notFoundRoot.style.display = "block";
    document.title = "Product Not Found — Shade's Sweet Scoops Candles";
    return;
  }

  renderProduct(product);
  renderRelated(product);

  function renderProduct(p){
    document.title = p.name + " — Shade's Sweet Scoops Candles";

    const metaDesc = document.querySelector('meta[name="description"]');
    if(metaDesc) metaDesc.setAttribute("content", p.description);

    updateSeoTags(p);

    document.getElementById("pdBreadcrumbName").textContent = p.name;
    document.getElementById("pdFlavor").textContent = p.flavor;
    document.getElementById("pdTitle").textContent = p.name;
    document.getElementById("pdPrice").textContent = formatPrice(p.price);
    document.getElementById("pdAvailability").textContent = p.availability;
    document.getElementById("pdDesc").textContent = p.longDescription || p.description;

    document.getElementById("specSize").textContent = p.size;
    document.getElementById("specScent").textContent = p.scent;
    document.getElementById("specBurn").textContent = p.burnTime;
    document.getElementById("specMaterials").textContent = p.materials;

    // Gallery
    const mainImg = document.getElementById("pdMainImage");
    const thumbsEl = document.getElementById("pdThumbs");
    const gallery = p.gallery && p.gallery.length ? p.gallery : [p.image];
    mainImg.src = gallery[0];
    mainImg.alt = p.name;
    thumbsEl.innerHTML = gallery.map(function(src, i){
      return '<button type="button" class="pd-thumb' + (i === 0 ? " active" : "") + '" data-src="' + src + '"><img src="' + src + '" alt="' + p.name + ' view ' + (i + 1) + '" width="150" height="150"></button>';
    }).join("");
    thumbsEl.querySelectorAll(".pd-thumb").forEach(function(thumb){
      thumb.addEventListener("click", function(){
        mainImg.src = thumb.getAttribute("data-src");
        thumbsEl.querySelectorAll(".pd-thumb").forEach(function(t){ t.classList.remove("active"); });
        thumb.classList.add("active");
      });
    });
    if(gallery.length < 2) thumbsEl.style.display = "none";

    // Quantity selector
    const qtyInput = document.getElementById("pdQtyInput");
    const qtyMinus = document.getElementById("pdQtyMinus");
    const qtyPlus = document.getElementById("pdQtyPlus");
    qtyMinus.addEventListener("click", function(){
      const next = Math.max(1, parseInt(qtyInput.value || "1", 10) - 1);
      qtyInput.value = next;
    });
    qtyPlus.addEventListener("click", function(){
      const next = Math.min(20, parseInt(qtyInput.value || "1", 10) + 1);
      qtyInput.value = next;
    });
    qtyInput.addEventListener("change", function(){
      let val = parseInt(qtyInput.value, 10);
      if(isNaN(val) || val < 1) val = 1;
      if(val > 20) val = 20;
      qtyInput.value = val;
    });

    // Add to Enquiry
    document.getElementById("pdAddToBag").addEventListener("click", function(){
      const qty = parseInt(qtyInput.value, 10) || 1;
      Cart.add(p.id, qty);
      showToast(qty + " x " + p.name + " added to your enquiry bag");
    });

    // Ask About This Product
    const askBtn = document.getElementById("pdAskAbout");
    askBtn.setAttribute("data-whatsapp-message", "Hi! I have a question about the " + p.name + " (" + p.flavor + ", " + formatPrice(p.price) + ").");
    wireContactLinks();
  }

  function renderRelated(p){
    const relatedGrid = document.getElementById("relatedGrid");
    if(!relatedGrid) return;
    const related = PRODUCTS.filter(function(item){ return item.id !== p.id && item.category === p.category; }).slice(0, 3);
    const fallback = related.length ? related : PRODUCTS.filter(function(item){ return item.id !== p.id; }).slice(0, 3);
    relatedGrid.innerHTML = fallback.map(buildProductCardHTML).join("");
  }

  /* -----------------------------------------------------------------
     SEO: canonical / Open Graph / Twitter tags + JSON-LD Product schema
     for the specific product currently loaded. The static defaults in
     product.html's <head> cover the case where a crawler doesn't run
     JS; this brings the tags in line with the exact product shown.
     ----------------------------------------------------------------- */
  function updateSeoTags(p){
    const siteUrl = (typeof SITE_CONFIG !== "undefined" && SITE_CONFIG.SITE_URL) ? SITE_CONFIG.SITE_URL : "";
    const pageUrl = siteUrl + "/product.html?id=" + p.id;
    const imageUrl = siteUrl + "/" + p.image;
    const fullTitle = p.name + " — Shade's Sweet Scoops Candles";

    const canonical = document.getElementById("canonicalLink");
    if(canonical) canonical.setAttribute("href", pageUrl);

    const setContent = function(id, value){
      const el = document.getElementById(id);
      if(el) el.setAttribute("content", value);
    };
    setContent("ogTitle", fullTitle);
    setContent("ogDescription", p.description);
    setContent("ogImage", imageUrl);
    setContent("ogUrl", pageUrl);
    setContent("twitterTitle", fullTitle);
    setContent("twitterDescription", p.description);
    setContent("twitterImage", imageUrl);

    // Inject (or replace) a Product JSON-LD block for this specific candle.
    let ld = document.getElementById("productJsonLd");
    if(!ld){
      ld = document.createElement("script");
      ld.type = "application/ld+json";
      ld.id = "productJsonLd";
      document.head.appendChild(ld);
    }
    ld.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Product",
      "name": p.name,
      "description": p.description,
      "image": imageUrl,
      "url": pageUrl,
      "brand": { "@type": "Brand", "name": "Shade's Sweet Scoops Candles" },
      "offers": {
        "@type": "Offer",
        "url": pageUrl,
        "priceCurrency": "ZAR",
        "price": p.price,
        "availability": "https://schema.org/InStock",
        "itemCondition": "https://schema.org/NewCondition"
      }
    });
  }
});
