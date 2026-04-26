document.addEventListener("DOMContentLoaded", function () {

    // Profile picture preview functionality
    const profilePictureInput = document.querySelector('input[name="profile_picture"]');
    const profilePicturePreview = document.getElementById("profile-picture-preview");

    if (profilePictureInput && profilePicturePreview) {

        profilePictureInput.addEventListener("change", function () {

            const file = this.files[0];

            if (!file) return;

            // Validate file type
            const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
            if (!validTypes.includes(file.type)) {
                alert("Please select a valid image file (JPEG, PNG, GIF, or WebP).");
                return;
            }

            // Validate file size (max 5MB)
            const maxSize = 5 * 1024 * 1024;
            if (file.size > maxSize) {
                alert("File size must be less than 5MB.");
                return;
            }

            const reader = new FileReader();

            reader.onload = function (e) {
                profilePicturePreview.src = e.target.result;
            };

            reader.onerror = function () {
                alert("Error reading file. Please try again.");
            };

            reader.readAsDataURL(file);

        });

    }

    // Password strength indicator (if password fields exist)
    const newPasswordInput = document.querySelector('input[name="new_password"]');
    const confirmPasswordInput = document.querySelector('input[name="confirm_password"]');

    if (newPasswordInput) {

        newPasswordInput.addEventListener("input", function () {
            const password = this.value;
            const strengthIndicator = document.getElementById("password-strength");

            if (!strengthIndicator) return;

            let strength = 0;

            if (password.length >= 8) strength++;
            if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
            if (password.match(/\d/)) strength++;
            if (password.match(/[^a-zA-Z\d]/)) strength++;

            switch (strength) {
                case 0:
                case 1:
                    strengthIndicator.textContent = "Weak";
                    strengthIndicator.className = "password-strength weak";
                    break;
                case 2:
                case 3:
                    strengthIndicator.textContent = "Medium";
                    strengthIndicator.className = "password-strength medium";
                    break;
                case 4:
                    strengthIndicator.textContent = "Strong";
                    strengthIndicator.className = "password-strength strong";
                    break;
            }

        });

    }

    // Password match validation
    if (newPasswordInput && confirmPasswordInput) {

        confirmPasswordInput.addEventListener("input", function () {
            const password = newPasswordInput.value;
            const confirmPassword = this.value;
            const matchMessage = document.getElementById("password-match-message");

            if (!matchMessage) return;

            if (confirmPassword.length === 0) {
                matchMessage.textContent = "";
                matchMessage.className = "";
                return;
            }

            if (password === confirmPassword) {
                matchMessage.textContent = "Passwords match";
                matchMessage.className = "password-match success";
            } else {
                matchMessage.textContent = "Passwords do not match";
                matchMessage.className = "password-match error";
            }

        });

    }

    // Profile form validation
    const profileForm = document.querySelector("form[name='profile_form']");

    if (profileForm) {

        profileForm.addEventListener("submit", function (e) {

            const requiredFields = profileForm.querySelectorAll("[required]");
            let isValid = true;

            requiredFields.forEach(function (field) {

                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add("error");
                } else {
                    field.classList.remove("error");
                }

            });

            if (!isValid) {
                e.preventDefault();
                alert("Please fill in all required fields.");
            }

        });

    }

});