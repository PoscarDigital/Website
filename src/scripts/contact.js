// Contact form handler — validates client-side, then POSTs to Web3Forms.
// The access_key + endpoint live as hidden inputs in the form HTML
// (set in contact.astro from src/lib/forms.ts).

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");
  if (!form) return;

  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const messageInput = document.getElementById("message");
  const submitBtn = document.getElementById("contact-submit");
  const successEl = document.getElementById("contact-success");
  const errorEl = document.getElementById("contact-error");

  const currentLang = (document.documentElement.lang || "en").toLowerCase().startsWith("km") ? "km" : "en";

  const translations = {
    en: {
      nameRequired: "Please enter your name!",
      emailRequired: "Please enter your email!",
      emailInvalid: "Please enter a valid email!",
      messageRequired: "Please enter your message!",
      sending: "Sending…",
      success: "Your message has been sent. We'll be in touch shortly.",
      error: "Something went wrong. Please try again, or email info@poscardigital.com directly.",
    },
    km: {
      nameRequired: "សូមបញ្ចូលឈ្មោះរបស់អ្នក!",
      emailRequired: "សូមបញ្ចូលអ៊ីមែល!",
      emailInvalid: "សូមបញ្ចូលអ៊ីមែលត្រឹមត្រូវ!",
      messageRequired: "សូមសរសេរសាររបស់អ្នក!",
      sending: "កំពុងផ្ញើ…",
      success: "សាររបស់អ្នកត្រូវបានផ្ញើដោយជោគជ័យ! យើងនឹងទាក់ទងអ្នកឆាប់ៗនេះ។",
      error: "មានបញ្ហាបន្តិច។ សូមសាកម្ដងទៀត ឬផ្ញើអ៊ីមែលដោយផ្ទាល់មក info@poscardigital.com។",
    },
  };
  const t = (key) => translations[currentLang][key];

  const showError = (input, message) => {
    if (!input.nextElementSibling) {
      const errorElement = document.createElement("p");
      errorElement.className = "text-red-500 text-sm mt-1 field-error";
      errorElement.textContent = message;
      input.classList.add("border-red-500");
      input.parentNode.appendChild(errorElement);
    }
  };

  const clearError = (input) => {
    input.classList.remove("border-red-500");
    const next = input.nextElementSibling;
    if (next && next.classList.contains("field-error")) next.remove();
  };

  const validateField = (input, message) => {
    if (!input.value.trim()) {
      showError(input, message);
      return false;
    }
    clearError(input);
    return true;
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value.trim())) {
      showError(email, t("emailInvalid"));
      return false;
    }
    clearError(email);
    return true;
  };

  const hideStatus = () => {
    successEl?.classList.add("hidden");
    errorEl?.classList.add("hidden");
  };

  const showStatus = (el, message) => {
    if (!el) return;
    el.textContent = message;
    el.classList.remove("hidden");
  };

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    hideStatus();

    const ok =
      validateField(nameInput, t("nameRequired")) &
      (validateField(emailInput, t("emailRequired")) && validateEmail(emailInput)) &
      validateField(messageInput, t("messageRequired"));
    if (!ok) return;

    const originalLabel = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = t("sending");

    try {
      const fd = new FormData(form);
      const res = await fetch(form.action, {
        method: "POST",
        body: fd,
        headers: { Accept: "application/json" },
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success !== false) {
        showStatus(successEl, t("success"));
        form.reset();
      } else {
        showStatus(errorEl, data.message || t("error"));
      }
    } catch (_e) {
      showStatus(errorEl, t("error"));
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalLabel;
    }
  });

  // Inline validation on blur
  [nameInput, emailInput, messageInput].forEach((input) => {
    input.addEventListener("blur", () => {
      if (input.id === "email") {
        validateField(input, t("emailRequired")) && validateEmail(input);
      } else if (input.id === "name") {
        validateField(input, t("nameRequired"));
      } else if (input.id === "message") {
        validateField(input, t("messageRequired"));
      }
    });
  });
});
