// document.querySelector('#contact-form')?.addEventListener('submit', function (event) {
//     event.preventDefault(); // Prevent default form submission
//     alert('Thank you for contacting us! We will get back to you shortly.');
//     event.target.reset(); // Clear the form fields
//   });
  
// document.addEventListener("DOMContentLoaded", () => {
//     const form = document.getElementById("contact-form");
//     const nameInput = document.getElementById("name");
//     const emailInput = document.getElementById("email");
//     const messageInput = document.getElementById("message");
  
//     // Helper function to display error
//     const showError = (input, message) => {
//       const errorElement = document.createElement("p");
//       errorElement.className = "text-red-500 text-sm mt-1";
//       errorElement.textContent = message;
//       if (!input.nextElementSibling) {
//         input.classList.add("border-red-500");
//         input.parentNode.appendChild(errorElement);
//       }
//     };
  
//     // Helper function to clear error
//     const clearError = (input) => {
//       input.classList.remove("border-red-500");
//       if (input.nextElementSibling) {
//         input.nextElementSibling.remove();
//       }
//     };
  
//     // Form field validation
//     const validateField = (input, message) => {
//       if (!input.value.trim()) {
//         showError(input, message);
//         return false;
//       } else {
//         clearError(input);
//         return true;
//       }
//     };
  
//     // Validate email format
//     const validateEmail = (email) => {
//       const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//       if (!emailRegex.test(email.value.trim())) {
//         showError(email, "សូមបញ្ចូលអ៊ីមែលត្រឹមត្រូវ!");
//         return false;
//       } else {
//         clearError(email);
//         return true;
//       }
//     };
  
//     // Form submission handler
//     form.addEventListener("submit", (event) => {
//       event.preventDefault();
  
//       const isNameValid = validateField(nameInput, "សូមបញ្ចូលឈ្មោះរបស់អ្នក!");
//       const isEmailValid = validateField(emailInput, "សូមបញ្ចូលអ៊ីមែល!") && validateEmail(emailInput);
//       const isMessageValid = validateField(messageInput, "សូមសរសេរសាររបស់អ្នក!");
  
//       if (isNameValid && isEmailValid && isMessageValid) {
//         alert("សាររបស់អ្នកត្រូវបានផ្ញើដោយជោគជ័យ!");
//         form.reset(); // Clear the form
//       }
//     });
  
//     // Add live validation on blur
//     [nameInput, emailInput, messageInput].forEach((input) => {
//       input.addEventListener("blur", () => {
//         if (input.id === "email") {
//           validateField(input, "សូមបញ្ចូលអ៊ីមែល!") && validateEmail(input);
//         } else {
//           validateField(input, `សូមបញ្ចូល${input.previousElementSibling.textContent}!`);
//         }
//       });
//     });
//   });
  
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("contact-form");
    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const messageInput = document.getElementById("message");
  
    // Detect current language
    const currentLang = document.documentElement.lang || "en";
  
    // Translations for validation messages
    const translations = {
      en: {
        nameRequired: "Please enter your name!",
        emailRequired: "Please enter your email!",
        emailInvalid: "Please enter a valid email!",
        messageRequired: "Please enter your message!",
        success: "Your message has been successfully sent!",
      },
      kh: {
        nameRequired: "សូមបញ្ចូលឈ្មោះរបស់អ្នក!",
        emailRequired: "សូមបញ្ចូលអ៊ីមែល!",
        emailInvalid: "សូមបញ្ចូលអ៊ីមែលត្រឹមត្រូវ!",
        messageRequired: "សូមសរសេរសាររបស់អ្នក!",
        success: "សាររបស់អ្នកត្រូវបានផ្ញើដោយជោគជ័យ!",
      },
    };
  
    // Get the appropriate message based on the current language
    const t = (key) => translations[currentLang][key];
  
    // Helper function to display error
    const showError = (input, message) => {
      const errorElement = document.createElement("p");
      errorElement.className = "text-red-500 text-sm mt-1";
      errorElement.textContent = message;
      if (!input.nextElementSibling) {
        input.classList.add("border-red-500");
        input.parentNode.appendChild(errorElement);
      }
    };
  
    // Helper function to clear error
    const clearError = (input) => {
      input.classList.remove("border-red-500");
      if (input.nextElementSibling) {
        input.nextElementSibling.remove();
      }
    };
  
    // Form field validation
    const validateField = (input, message) => {
      if (!input.value.trim()) {
        showError(input, message);
        return false;
      } else {
        clearError(input);
        return true;
      }
    };
  
    // Validate email format
    const validateEmail = (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.value.trim())) {
        showError(email, t("emailInvalid"));
        return false;
      } else {
        clearError(email);
        return true;
      }
    };
  
    // Form submission handler
    form.addEventListener("submit", (event) => {
      event.preventDefault();
  
      const isNameValid = validateField(nameInput, t("nameRequired"));
      const isEmailValid = validateField(emailInput, t("emailRequired")) && validateEmail(emailInput);
      const isMessageValid = validateField(messageInput, t("messageRequired"));
  
      if (isNameValid && isEmailValid && isMessageValid) {
        alert(t("success"));
        form.reset(); // Clear the form
      }
    });
  
    // Add live validation on blur
    [nameInput, emailInput, messageInput].forEach((input) => {
      input.addEventListener("blur", () => {
        if (input.id === "email") {
          validateField(input, t("emailRequired")) && validateEmail(input);
        } else {
          validateField(input, t(`${input.id}Required`));
        }
      });
    });
  });
  