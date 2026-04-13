document.addEventListener("DOMContentLoaded", function () {
    const fileInput = document.querySelector('input[type="file"]');
    const preview = document.getElementById("imagePreview");

    if (fileInput && preview) {
        fileInput.addEventListener("change", function (e) {
            const file = e.target.files[0];
            if (file && file.type.startsWith("image/")) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    preview.src = e.target.result;
                    preview.style.display = "block";
                };
                reader.readAsDataURL(file);
            } else {
                preview.src = "";
                preview.style.display = "none";
            }
        });
    }

    const form = document.getElementById("vehicleForm");
    form.addEventListener("submit", function (e) {
        const requiredFields = form.querySelectorAll("[required]");
        let valid = true;

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.classList.add("field-error");
                valid = false;
            } else {
                field.classList.remove("field-error");
            }
        });

        if (!valid) {
            e.preventDefault();
            alert("Please fill all required fields.");
        }
    });
});
