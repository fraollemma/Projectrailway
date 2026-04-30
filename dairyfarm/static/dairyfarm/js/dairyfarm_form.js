document.addEventListener("DOMContentLoaded", function () {

    const input = document.getElementById("images");
    const preview = document.getElementById("preview");

    if (input) {
        input.addEventListener("change", function () {
            preview.innerHTML = "";

            Array.from(this.files).forEach(file => {
                const reader = new FileReader();

                reader.onload = function (e) {
                    const img = document.createElement("img");
                    img.src = e.target.result;
                    preview.appendChild(img);
                };

                reader.readAsDataURL(file);
            });
        });
    }

});