/* =================================================================
   MAIN.JS
   Loaded on every page, before the page-specific script.
   Holds: site config, the shared Enquiry Bag (Cart) module, header/
   mobile-nav/search behaviour, newsletter validation and a toast helper.
   ================================================================= */

/* -----------------------------------------------------------------
   SITE CONFIG — the only two places these values live.
   Replace with the real WhatsApp number (international format, digits
   only, no "+" and no leading 0) and business email before launch.
   ----------------------------------------------------------------- */
const SITE_CONFIG = {
  WHATSAPP_NUMBER: "27607739974",
  BUSINESS_EMAIL: "shadesweetscoops@gmail.com",
  BRAND_NAME: "Shade's Sweet Scoops Candles",
  INSTAGRAM_HANDLE: "@shadessweetscoopscandles",
  SITE_URL: "https://sweetscoopcandles.co.za"
};

/* -----------------------------------------------------------------
   CART — the Enquiry Bag, persisted to localStorage.
   Shape stored: [{ id, qty }]
   ----------------------------------------------------------------- */
const Cart = (function(){
  const STORAGE_KEY = "shades_enquiry_bag";

  function readRaw(){
    try{
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if(!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    }catch(err){
      console.error("Enquiry bag could not be read:", err);
      return [];
    }
  }

  function writeRaw(items){
    try{
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }catch(err){
      console.error("Enquiry bag could not be saved:", err);
    }
    updateBadge();
  }

  function getItems(){
    // Returns hydrated items (with product data) for known products only.
    const raw = readRaw();
    const hydrated = [];
    raw.forEach(function(entry){
      const product = typeof getProductById === "function" ? getProductById(entry.id) : null;
      if(product){
        hydrated.push({ product: product, qty: entry.qty });
      }
    });
    return hydrated;
  }

  function add(id, qty){
    qty = qty && qty > 0 ? qty : 1;
    const items = readRaw();
    const existing = items.find(function(i){ return i.id === id; });
    if(existing){
      existing.qty += qty;
    }else{
      items.push({ id: id, qty: qty });
    }
    writeRaw(items);
  }

  function setQty(id, qty){
    let items = readRaw();
    if(qty <= 0){
      items = items.filter(function(i){ return i.id !== id; });
    }else{
      const existing = items.find(function(i){ return i.id === id; });
      if(existing) existing.qty = qty;
    }
    writeRaw(items);
  }

  function remove(id){
    const items = readRaw().filter(function(i){ return i.id !== id; });
    writeRaw(items);
  }

  function clear(){
    writeRaw([]);
  }

  function count(){
    return readRaw().reduce(function(sum, i){ return sum + i.qty; }, 0);
  }

  function getTotal(){
    return getItems().reduce(function(sum, i){ return sum + (i.product.price * i.qty); }, 0);
  }

  function updateBadge(){
    const n = count();
    document.querySelectorAll("[data-bag-count]").forEach(function(el){
      el.textContent = n;
      if(el.classList.contains("badge-count")){
        el.style.display = n > 0 ? "flex" : "none";
      }
    });
  }

  return { getItems: getItems, add: add, setQty: setQty, remove: remove, clear: clear, count: count, getTotal: getTotal, updateBadge: updateBadge };
})();

/* -----------------------------------------------------------------
   TOAST
   ----------------------------------------------------------------- */
function showToast(message){
  let toast = document.getElementById("siteToast");
  if(!toast){
    toast = document.createElement("div");
    toast.id = "siteToast";
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(toast._hideTimer);
  toast._hideTimer = window.setTimeout(function(){
    toast.classList.remove("is-visible");
  }, 2600);
}

/* -----------------------------------------------------------------
   WHATSAPP / EMAIL LINK BUILDERS
   ----------------------------------------------------------------- */
function buildWhatsAppLink(message){
  return "https://wa.me/" + SITE_CONFIG.WHATSAPP_NUMBER + "?text=" + encodeURIComponent(message);
}

function buildMailtoLink(subject, body){
  return "mailto:" + SITE_CONFIG.BUSINESS_EMAIL + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
}

/* -----------------------------------------------------------------
   HEADER / NAV BEHAVIOUR
   ----------------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", function(){
  Cart.updateBadge();
  initMobileNav();
  initSearch();
  initActiveNav();
  initFooterNewsletter();
  initSmoothScroll();
  wireContactLinks();
  renderBestSellers();
  initFaqAccordion();
  const yearEl = document.getElementById("footerYear");
  if(yearEl) yearEl.textContent = new Date().getFullYear();

  document.addEventListener("click", function(e){
    const btn = e.target.closest("[data-add-to-bag]");
    if(btn){
      Cart.add(btn.getAttribute("data-add-to-bag"), 1);
      showToast("Added to your enquiry bag");
    }
  });
});

/* -----------------------------------------------------------------
   SHARED PRODUCT CARD MARKUP
   Used by the homepage Best Sellers grid, the Shop grid and the
   Related Products strip on the product page.
   ----------------------------------------------------------------- */
function buildProductCardHTML(product){
  const tag = product.bestSeller ? '<span class="product-tag">Best Seller</span>' : "";
  return (
    '<article class="product-card">' +
      '<a href="product.html?id=' + product.id + '" class="product-card-media">' +
        '<img src="' + product.image + '" alt="' + product.name + '" loading="lazy" width="500" height="625">' +
        tag +
      '</a>' +
      '<div class="product-card-body">' +
        '<p class="product-flavor">' + product.flavor + '</p>' +
        '<h3><a href="product.html?id=' + product.id + '">' + product.name + '</a></h3>' +
        '<p class="product-desc">' + product.description + '</p>' +
        '<div class="product-meta-row">' +
          '<span class="product-price">' + formatPrice(product.price) + '</span>' +
          '<span class="product-availability">' + product.availability + '</span>' +
        '</div>' +
        '<div class="product-card-actions">' +
          '<a href="product.html?id=' + product.id + '" class="btn btn-secondary btn-sm">View Product</a>' +
          '<button class="btn btn-primary btn-sm" data-add-to-bag="' + product.id + '">Add to Enquiry</button>' +
        '</div>' +
      '</div>' +
    '</article>'
  );
}

function renderBestSellers(){
  const grid = document.getElementById("bestSellersGrid");
  if(!grid || typeof PRODUCTS === "undefined") return;
  const items = PRODUCTS.filter(function(p){ return p.bestSeller; }).slice(0, 4);
  grid.innerHTML = items.map(buildProductCardHTML).join("");
}

/* -----------------------------------------------------------------
   FAQ ACCORDION (faq.html)
   ----------------------------------------------------------------- */
function initFaqAccordion(){
  const items = document.querySelectorAll(".faq-item");
  if(!items.length) return;
  items.forEach(function(item){
    const question = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");
    if(!question || !answer) return;
    question.addEventListener("click", function(){
      const isOpen = item.classList.contains("is-open");
      // Close any other open item for a cleaner single-open accordion.
      items.forEach(function(other){
        other.classList.remove("is-open");
        const otherAnswer = other.querySelector(".faq-answer");
        if(otherAnswer) otherAnswer.style.maxHeight = null;
        const otherQ = other.querySelector(".faq-question");
        if(otherQ) otherQ.setAttribute("aria-expanded", "false");
      });
      if(!isOpen){
        item.classList.add("is-open");
        answer.style.maxHeight = answer.scrollHeight + "px";
        question.setAttribute("aria-expanded", "true");
      }
    });
  });
}

/* -----------------------------------------------------------------
   CONTACT LINK WIRING
   Every WhatsApp / email link on the site gets its href from here, so
   SITE_CONFIG is the only place the number and address are written.
   ----------------------------------------------------------------- */
function wireContactLinks(){
  document.querySelectorAll("[data-whatsapp-link]").forEach(function(el){
    const msg = el.getAttribute("data-whatsapp-message") || "Hi! I'd like to find out more about Shade's Sweet Scoops Candles.";
    el.href = buildWhatsAppLink(msg);
    el.target = "_blank";
    el.rel = "noopener";
  });
  document.querySelectorAll("[data-mailto-link]").forEach(function(el){
    const subject = el.getAttribute("data-mail-subject") || "Enquiry - Shade's Sweet Scoops Candles";
    const body = el.getAttribute("data-mail-body") || "";
    el.href = buildMailtoLink(subject, body);
  });
  document.querySelectorAll("[data-email-link]").forEach(function(el){
    el.href = "mailto:" + SITE_CONFIG.BUSINESS_EMAIL;
    el.textContent = SITE_CONFIG.BUSINESS_EMAIL;
  });
  document.querySelectorAll("[data-instagram-link]").forEach(function(el){
    el.href = "https://instagram.com/" + SITE_CONFIG.INSTAGRAM_HANDLE.replace("@", "");
    el.target = "_blank";
    el.rel = "noopener";
  });
  document.querySelectorAll("[data-instagram-handle]").forEach(function(el){
    el.textContent = SITE_CONFIG.INSTAGRAM_HANDLE;
  });
}

function initMobileNav(){
  const btn = document.getElementById("hamburgerBtn");
  const nav = document.getElementById("mobileNav");
  if(!btn || !nav) return;
  btn.addEventListener("click", function(){
    const isOpen = nav.classList.toggle("is-open");
    btn.classList.toggle("is-open", isOpen);
    btn.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });
  nav.querySelectorAll("a").forEach(function(link){
    link.addEventListener("click", function(){
      nav.classList.remove("is-open");
      btn.classList.remove("is-open");
      btn.setAttribute("aria-expanded", "false");
    });
  });
}

function initSearch(){
  const toggle = document.getElementById("searchToggle");
  const panel = document.getElementById("searchPanel");
  const closeBtn = document.getElementById("searchClose");
  const input = document.getElementById("headerSearchInput");
  const searchBtn = document.getElementById("headerSearchBtn");
  if(!toggle || !panel) return;

  function open(){
    panel.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
    window.setTimeout(function(){ if(input) input.focus(); }, 60);
  }
  function close(){
    panel.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  }

  toggle.addEventListener("click", function(){
    panel.classList.contains("is-open") ? close() : open();
  });
  if(closeBtn) closeBtn.addEventListener("click", close);

  function runSearch(){
    const q = input && input.value.trim();
    if(q){
      window.location.href = "shop.html?search=" + encodeURIComponent(q);
    }
  }
  if(searchBtn) searchBtn.addEventListener("click", runSearch);
  if(input){
    input.addEventListener("keydown", function(e){
      if(e.key === "Enter") runSearch();
      if(e.key === "Escape") close();
    });
  }
}

function initActiveNav(){
  const page = document.body.getAttribute("data-page");
  if(!page) return;
  document.querySelectorAll("[data-nav]").forEach(function(el){
    if(el.getAttribute("data-nav") === page){
      el.classList.add("active");
    }
  });
}

function initSmoothScroll(){
  document.querySelectorAll('a[href^="#"]').forEach(function(link){
    link.addEventListener("click", function(e){
      const id = link.getAttribute("href");
      if(id.length < 2) return;
      const target = document.querySelector(id);
      if(target){
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
}

/* -----------------------------------------------------------------
   NEWSLETTER VALIDATION (used by both the homepage section and footer)
   ----------------------------------------------------------------- */
function isValidEmail(value){
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function initFooterNewsletterHandled(){ /* placeholder kept for clarity */ }

function wireNewsletterForm(formEl, msgEl){
  if(!formEl) return;
  formEl.addEventListener("submit", function(e){
    e.preventDefault();
    const input = formEl.querySelector('input[type="email"]');
    const value = input ? input.value.trim() : "";
    if(!isValidEmail(value)){
      if(msgEl){
        msgEl.textContent = "Please enter a valid email address.";
        msgEl.className = "form-msg error";
      }
      return;
    }
    if(msgEl){
      msgEl.textContent = "Thanks for joining — keep an eye on your inbox.";
      msgEl.className = "form-msg success";
    }
    formEl.reset();
    showToast("You're on the list!");
  });
}

function initFooterNewsletter(){
  const form = document.getElementById("footerNewsletterForm");
  const msg = document.getElementById("footerNewsletterMsg");
  wireNewsletterForm(form, msg);
}
