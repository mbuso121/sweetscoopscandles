/* =================================================================
   ENQUIRY.JS — the Enquiry Bag page.
   Reads/writes via the shared Cart module in main.js.
   ================================================================= */

document.addEventListener("DOMContentLoaded", function(){
  const itemsEl = document.getElementById("bagItems");
  const layoutEl = document.getElementById("bagLayout");
  const emptyEl = document.getElementById("bagEmpty");
  const subtotalEl = document.getElementById("bagSubtotal");
  const totalEl = document.getElementById("bagTotal");
  const nameInput = document.getElementById("bagCustomerName");
  const contactInput = document.getElementById("bagCustomerContact");
  const notesInput = document.getElementById("bagNotes");
  const sendWhatsAppBtn = document.getElementById("bagSendWhatsApp");
  const sendEmailBtn = document.getElementById("bagSendEmail");
  const clearBtn = document.getElementById("bagClearBtn");

  if(!itemsEl) return; // Not on the enquiry page.

  render();

  itemsEl.addEventListener("click", function(e){
    const minusBtn = e.target.closest("[data-qty-minus]");
    const plusBtn = e.target.closest("[data-qty-plus]");
    const removeBtn = e.target.closest("[data-remove-item]");

    if(minusBtn){
      const id = minusBtn.getAttribute("data-qty-minus");
      const current = Cart.getItems().find(function(i){ return i.product.id === id; });
      if(current) Cart.setQty(id, current.qty - 1);
      render();
    }
    if(plusBtn){
      const id = plusBtn.getAttribute("data-qty-plus");
      const current = Cart.getItems().find(function(i){ return i.product.id === id; });
      if(current) Cart.setQty(id, Math.min(20, current.qty + 1));
      render();
    }
    if(removeBtn){
      Cart.remove(removeBtn.getAttribute("data-remove-item"));
      render();
      showToast("Removed from your enquiry bag");
    }
  });

  itemsEl.addEventListener("change", function(e){
    const input = e.target.closest("[data-qty-input]");
    if(!input) return;
    const id = input.getAttribute("data-qty-input");
    let val = parseInt(input.value, 10);
    if(isNaN(val) || val < 1) val = 1;
    if(val > 20) val = 20;
    Cart.setQty(id, val);
    render();
  });

  if(clearBtn){
    clearBtn.addEventListener("click", function(){
      if(Cart.count() === 0) return;
      const confirmed = window.confirm("Clear everything from your enquiry bag?");
      if(confirmed){
        Cart.clear();
        render();
        showToast("Your enquiry bag has been cleared");
      }
    });
  }

  if(sendWhatsAppBtn){
    sendWhatsAppBtn.addEventListener("click", function(){
      if(!validate()) return;
      const message = buildOrderMessage();
      window.open(buildWhatsAppLink(message), "_blank", "noopener");
    });
  }

  if(sendEmailBtn){
    sendEmailBtn.addEventListener("click", function(){
      if(!validate()) return;
      const message = buildOrderMessage();
      window.location.href = buildMailtoLink("New Product Enquiry - Shade's Sweet Scoops Candles", message);
    });
  }

  function validate(){
    clearFieldErrors();
    let ok = true;
    if(Cart.count() === 0){
      showToast("Your enquiry bag is empty");
      return false;
    }
    if(!nameInput.value.trim()){
      setFieldError(nameInput, "Please enter your name.");
      ok = false;
    }
    if(!contactInput.value.trim()){
      setFieldError(contactInput, "Please enter a phone number or email address.");
      ok = false;
    }
    return ok;
  }

  function setFieldError(input, message){
    const row = input.closest(".form-row");
    if(!row) return;
    row.classList.add("has-error");
    const errEl = row.querySelector(".field-error");
    if(errEl) errEl.textContent = message;
  }

  function clearFieldErrors(){
    document.querySelectorAll("#bagSummary .form-row").forEach(function(row){
      row.classList.remove("has-error");
    });
  }

  function buildOrderMessage(){
    const name = nameInput.value.trim();
    const contact = contactInput.value.trim();
    const notes = notesInput.value.trim();
    const items = Cart.getItems();

    const lines = [];
    lines.push("New Product Enquiry - Shade's Sweet Scoops Candles");
    lines.push("");
    lines.push("Customer Name: " + (name || "-"));
    lines.push("Customer Contact: " + (contact || "-"));
    lines.push("");
    lines.push("Products:");
    items.forEach(function(item){
      lines.push("- " + item.product.name + " (" + item.product.flavor + ")");
      lines.push("  Quantity: " + item.qty + " | Price: " + formatPrice(item.product.price) + " each | Subtotal: " + formatPrice(item.product.price * item.qty));
    });
    lines.push("");
    lines.push("Estimated Total: " + formatPrice(Cart.getTotal()));
    lines.push("");
    lines.push("Additional Notes: " + (notes || "-"));
    return lines.join("\n");
  }

  function render(){
    const items = Cart.getItems();

    if(items.length === 0){
      if(layoutEl) layoutEl.style.display = "none";
      if(emptyEl) emptyEl.style.display = "block";
      return;
    }

    if(layoutEl) layoutEl.style.display = "grid";
    if(emptyEl) emptyEl.style.display = "none";

    itemsEl.innerHTML = items.map(function(item){
      const p = item.product;
      return (
        '<div class="bag-item">' +
          '<div class="bag-item-media"><img src="' + p.image + '" alt="' + p.name + '" width="84" height="84"></div>' +
          '<div class="bag-item-info">' +
            '<h4>' + p.name + '</h4>' +
            '<p class="product-flavor">' + p.flavor + '</p>' +
            '<p class="bag-item-price">' + formatPrice(p.price) + ' each</p>' +
          '</div>' +
          '<div class="bag-item-right">' +
            '<div class="qty-selector sm">' +
              '<button type="button" data-qty-minus="' + p.id + '" aria-label="Decrease quantity">&minus;</button>' +
              '<input type="number" min="1" max="20" value="' + item.qty + '" data-qty-input="' + p.id + '" aria-label="Quantity">' +
              '<button type="button" data-qty-plus="' + p.id + '" aria-label="Increase quantity">+</button>' +
            '</div>' +
            '<button type="button" class="bag-item-remove" data-remove-item="' + p.id + '">Remove</button>' +
          '</div>' +
        '</div>'
      );
    }).join("");

    const total = Cart.getTotal();
    if(subtotalEl) subtotalEl.textContent = formatPrice(total);
    if(totalEl) totalEl.textContent = formatPrice(total);
  }
});
