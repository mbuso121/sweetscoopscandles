/* =================================================================
   CONTACT.JS — contact form validation and message building.
   ================================================================= */

document.addEventListener("DOMContentLoaded", function(){
  const form = document.getElementById("contactForm");
  if(!form) return; // Not on the contact page.

  const nameInput = document.getElementById("contactName");
  const emailInput = document.getElementById("contactEmail");
  const phoneInput = document.getElementById("contactPhone");
  const reasonSelect = document.getElementById("contactReason");
  const messageInput = document.getElementById("contactMessage");
  const whatsappBtn = document.getElementById("contactWhatsAppBtn");
  const formMsg = document.getElementById("contactFormMsg");

  // Pre-select "Custom Order" when arriving via a #custom link.
  if(window.location.hash === "#custom" && reasonSelect){
    reasonSelect.value = "Custom Order";
  }

  form.addEventListener("submit", function(e){
    e.preventDefault();
    if(!validate()) return;

    const subject = "New Enquiry (" + reasonSelect.value + ") - Shade's Sweet Scoops Candles";
    const body = buildMessageBody();
    window.location.href = buildMailtoLink(subject, body);

    if(formMsg){
      formMsg.textContent = "Your email is ready to send — check your email app to confirm it.";
      formMsg.className = "form-msg success";
    }
    showToast("Opening your email app…");
  });

  if(whatsappBtn){
    whatsappBtn.addEventListener("click", function(){
      const message = nameInput.value.trim() || messageInput.value.trim()
        ? buildMessageBody()
        : "Hi! I'd like to find out more about Shade's Sweet Scoops Candles.";
      window.open(buildWhatsAppLink(message), "_blank", "noopener");
    });
  }

  function buildMessageBody(){
    const lines = [];
    lines.push("Reason for Enquiry: " + (reasonSelect.value || "-"));
    lines.push("");
    lines.push("Customer Name: " + (nameInput.value.trim() || "-"));
    lines.push("Email: " + (emailInput.value.trim() || "-"));
    lines.push("Phone: " + (phoneInput.value.trim() || "-"));
    lines.push("");
    lines.push("Message:");
    lines.push(messageInput.value.trim() || "-");
    return lines.join("\n");
  }

  function validate(){
    clearErrors();
    let ok = true;

    if(!nameInput.value.trim()){
      setError(nameInput, "Please enter your name.");
      ok = false;
    }
    if(!emailInput.value.trim() || !isValidEmail(emailInput.value.trim())){
      setError(emailInput, "Please enter a valid email address.");
      ok = false;
    }
    if(phoneInput.value.trim() && !/^[0-9+()\s-]{6,}$/.test(phoneInput.value.trim())){
      setError(phoneInput, "Please enter a valid phone number.");
      ok = false;
    }
    if(!reasonSelect.value){
      setError(reasonSelect, "Please choose a reason for your enquiry.");
      ok = false;
    }
    if(!messageInput.value.trim()){
      setError(messageInput, "Please add a short message.");
      ok = false;
    }
    return ok;
  }

  function setError(input, message){
    const row = input.closest(".form-row");
    if(!row) return;
    row.classList.add("has-error");
    const errEl = row.querySelector(".field-error");
    if(errEl) errEl.textContent = message;
  }

  function clearErrors(){
    form.querySelectorAll(".form-row").forEach(function(row){
      row.classList.remove("has-error");
    });
    if(formMsg){
      formMsg.textContent = "";
      formMsg.className = "form-msg";
    }
  }
});
