document.addEventListener("DOMContentLoaded", function () {
  const imageInput = document.getElementById("id_images");
  const previewContainer = document.getElementById("previewContainer");

  if (imageInput) {
    imageInput.addEventListener("change", function () {
      previewContainer.innerHTML = ""; // clear previous previews

      Array.from(this.files).forEach((file) => {
        if (!file.type.startsWith("image/")) return;

        const reader = new FileReader();

        reader.onload = function (e) {
          const imgWrapper = document.createElement("div");
          imgWrapper.className = "preview-item";

          const img = document.createElement("img");
          img.src = e.target.result;
          img.alt = "House Image";
          img.classList.add("preview-img");

          imgWrapper.appendChild(img);
          previewContainer.appendChild(imgWrapper);
        };

        reader.readAsDataURL(file);
      });
    });
  }
});
