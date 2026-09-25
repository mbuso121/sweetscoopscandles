/* =================================================================
   SHOP.JS — product grid, category filtering, search and sorting.
   Depends on PRODUCTS / SHOP_CATEGORIES / PRICE_TIERS from products.js
   and buildProductCardHTML() from main.js.
   ================================================================= */

document.addEventListener("DOMContentLoaded", function(){
  const tabsEl = document.getElementById("categoryTabs");
  const gridEl = document.getElementById("shopProductGrid");
  const emptyEl = document.getElementById("shopEmptyState");
  const customEl = document.getElementById("shopCustomPanel");
  const searchInput = document.getElementById("shopSearchInput");
  const sortSelect = document.getElementById("shopSortSelect");
  const resultsMeta = document.getElementById("shopResultsMeta");
  const tierStripEl = document.getElementById("tierStrip");

  if(!gridEl) return; // Not on the shop page.

  const state = {
    category: "all",
    search: "",
    sort: "featured"
  };

  renderTierStrip();
  renderTabs();
  readInitialParams();
  wireControls();
  render();

  function renderTierStrip(){
    if(!tierStripEl) return;
    tierStripEl.innerHTML = PRICE_TIERS.map(function(tier){
      return (
        '<div class="tier-chip">' +
          '<div class="tier-price">' + formatPrice(tier.price) + '</div>' +
          '<div class="tier-name">' + tier.name + '</div>' +
        '</div>'
      );
    }).join("");
  }

  function renderTabs(){
    if(!tabsEl) return;
    tabsEl.innerHTML = SHOP_CATEGORIES.map(function(cat){
      return '<button type="button" class="category-tab" data-category="' + cat.id + '">' + cat.label + '</button>';
    }).join("");
    tabsEl.querySelectorAll(".category-tab").forEach(function(btn){
      btn.addEventListener("click", function(){
        state.category = btn.getAttribute("data-category");
        syncTabUI();
        render();
      });
    });
  }

  function syncTabUI(){
    if(!tabsEl) return;
    tabsEl.querySelectorAll(".category-tab").forEach(function(btn){
      btn.classList.toggle("active", btn.getAttribute("data-category") === state.category);
    });
  }

  function readInitialParams(){
    const params = new URLSearchParams(window.location.search);
    const searchParam = params.get("search");
    if(searchParam && searchInput){
      state.search = searchParam;
      searchInput.value = searchParam;
    }
    const hash = window.location.hash.replace("#", "");
    if(hash.indexOf("category=") === 0){
      const catValue = hash.split("=")[1];
      if(SHOP_CATEGORIES.some(function(c){ return c.id === catValue; })){
        state.category = catValue;
      }
    }
    syncTabUI();
  }

  function wireControls(){
    if(searchInput){
      searchInput.addEventListener("input", function(){
        state.search = searchInput.value.trim();
        render();
      });
    }
    if(sortSelect){
      sortSelect.addEventListener("change", function(){
        state.sort = sortSelect.value;
        render();
      });
    }
  }

  function getFiltered(){
    let list = PRODUCTS.slice();
    if(state.category !== "all" && state.category !== "custom"){
      list = list.filter(function(p){ return p.category === state.category; });
    }
    if(state.search){
      const q = state.search.toLowerCase();
      list = list.filter(function(p){
        return (
          p.name.toLowerCase().indexOf(q) !== -1 ||
          p.flavor.toLowerCase().indexOf(q) !== -1 ||
          p.categoryLabel.toLowerCase().indexOf(q) !== -1 ||
          p.description.toLowerCase().indexOf(q) !== -1
        );
      });
    }
    switch(state.sort){
      case "price-asc":
        list.sort(function(a, b){ return a.price - b.price; });
        break;
      case "price-desc":
        list.sort(function(a, b){ return b.price - a.price; });
        break;
      case "name-asc":
        list.sort(function(a, b){ return a.name.localeCompare(b.name); });
        break;
      default:
        list.sort(function(a, b){ return (b.featured === true) - (a.featured === true); });
    }
    return list;
  }

  function render(){
    const isCustom = state.category === "custom";

    if(customEl) customEl.style.display = isCustom ? "grid" : "none";
    gridEl.style.display = isCustom ? "none" : "grid";

    if(isCustom){
      if(resultsMeta) resultsMeta.textContent = "Every custom order is quoted individually.";
      if(emptyEl) emptyEl.style.display = "none";
      return;
    }

    const list = getFiltered();

    if(resultsMeta){
      resultsMeta.textContent = "Showing " + list.length + " of " + PRODUCTS.length + " products";
    }

    if(list.length === 0){
      gridEl.style.display = "none";
      if(emptyEl) emptyEl.style.display = "block";
      return;
    }

    if(emptyEl) emptyEl.style.display = "none";
    gridEl.style.display = "grid";
    gridEl.innerHTML = list.map(buildProductCardHTML).join("");
  }

  // Expose a reset for the empty-state "clear filters" button.
  window.resetShopFilters = function(){
    state.category = "all";
    state.search = "";
    state.sort = "featured";
    if(searchInput) searchInput.value = "";
    if(sortSelect) sortSelect.value = "featured";
    syncTabUI();
    render();
  };
});
