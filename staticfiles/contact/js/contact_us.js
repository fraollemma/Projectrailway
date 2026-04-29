document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".contact-form");
  const nameInput = document.querySelector("#id_name");
  const emailInput = document.querySelector("#id_email");
  const messageInput = document.querySelector("#id_message");

  form.addEventListener("submit", (event) => {
    event.preventDefault(); // Prevent form submission for validation

    // Clear previous error messages
    clearErrors();

    let isValid = true;

    // Validate name
    if (nameInput.value.trim() === "") {
      showError(nameInput, "Name is required.");
      isValid = false;
    }

    // Validate email
    if (!validateEmail(emailInput.value.trim())) {
      showError(emailInput, "Please enter a valid email address.");
      isValid = false;
    }

    // Validate message
    if (messageInput.value.trim() === "") {
      showError(messageInput, "Message cannot be empty.");
      isValid = false;
    }

    if (isValid) {
      // Simulate form submission success
      showSuccessMessage("Thank you for contacting us! We will get back to you soon.");
      form.reset(); 
    }

    function showSuccessMessage(message) {
      const successElement = document.createElement("div");
      successElement.className = "alert alert-success mt-3";
      successElement.textContent = message;
      successElement.style.backgroundColor = "#1abd3db4"; // Set green background
      successElement.style.color = "white"; // Set text color to white for better contrast
      form.parentElement.insertBefore(successElement, form);

      // Remove success message after 10 seconds
      setTimeout(() => {
      successElement.remove();
      }, 10000);
    }
  });

  function showError(input, message) {
    const errorElement = document.createElement("div");
    errorElement.className = "error-message";
    errorElement.textContent = message;
    input.parentElement.appendChild(errorElement);
    input.classList.add("is-invalid");
  }

  function clearErrors() {
    document.querySelectorAll(".error-message").forEach((el) => el.remove());
    document.querySelectorAll(".is-invalid").forEach((el) => el.classList.remove("is-invalid"));
  }

  function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function showSuccessMessage(message) {
    const successElement = document.createElement("div");
    successElement.className = "alert alert-success mt-3";
    successElement.textContent = message;
    form.parentElement.insertBefore(successElement, form);

    // Remove success message after 10 seconds
    setTimeout(() => {
      successElement.remove();
    }, 10000);
  }
});