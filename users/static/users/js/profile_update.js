document.addEventListener("DOMContentLoaded", function () {

    const input = document.querySelector('input[name="profile_picture"]');
    const preview = document.getElementById("profile-picture-preview");

    if (input && preview) {

        input.addEventListener("change", function () {

            const file = this.files[0];

            if (!file) return;

            const reader = new FileReader();

            reader.onload = function (e) {
                preview.src = e.target.result;
            };

            reader.readAsDataURL(file);

        });

    }

});