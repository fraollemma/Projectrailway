document.addEventListener('DOMContentLoaded', () => {
    const mainInput = document.getElementById('id_main_image');
    const mainPreview = document.getElementById('mainImagePreview');
    const subInput = document.getElementById('id_sub_images');
    const previewContainer = document.getElementById('imagePreview');
    const textarea = document.querySelector('textarea');
    const counter = document.querySelector('.char-counter');

    /* MAIN IMAGE PREVIEW */
    if (mainInput) {
        mainInput.addEventListener('change', () => {
            const file = mainInput.files[0];

            if (!file) return;

            if (!file.type.startsWith('image/')) {
                alert('Please upload an image file.');
                return;
            }

            const reader = new FileReader();
            reader.onload = e => {
                mainPreview.src = e.target.result;
                mainPreview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        });
    }

    /* MULTIPLE IMAGE PREVIEW */
    if (subInput) {
        subInput.addEventListener('change', () => {
            previewContainer.innerHTML = '';

            Array.from(subInput.files).forEach(file => {
                if (!file.type.startsWith('image/')) return;

                const reader = new FileReader();
                reader.onload = e => {
                    const wrapper = document.createElement('div');
                    wrapper.className = 'preview-wrapper';

                    const img = document.createElement('img');
                    img.src = e.target.result;
                    img.className = 'preview-image';

                    const remove = document.createElement('button');
                    remove.innerHTML = '×';
                    remove.className = 'preview-remove';

                    remove.onclick = () => wrapper.remove();

                    wrapper.appendChild(img);
                    wrapper.appendChild(remove);
                    previewContainer.appendChild(wrapper);
                };
                reader.readAsDataURL(file);
            });
        });
    }

    /* CHARACTER COUNTER */
    if (textarea && counter) {
        textarea.addEventListener('input', () => {
            counter.textContent = `${textarea.value.length} characters`;
        });
    }

    /* FORM VALIDATION */
    const form = document.getElementById('itemForm');

    form.addEventListener('submit', (e) => {
        let valid = true;

        form.querySelectorAll('[required]').forEach(field => {
            if (!field.value.trim()) {
                field.style.borderColor = 'red';
                valid = false;
            } else {
                field.style.borderColor = '';
            }
        });

        if (!valid) {
            e.preventDefault();
            alert('Please fill all required fields.');
        }
    });
});