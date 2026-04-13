document.addEventListener('DOMContentLoaded', function() {
    // Price and Discount Calculations
    const priceInput = document.getElementById('id_price');
    const discountInput = document.getElementById('id_discount_price');
    const priceDisplay = document.getElementById('priceDisplay');
    const discountPercentage = document.getElementById('discountPercentage');
    const discountAmount = document.getElementById('discountAmount');
    
    function updatePriceDisplays() {
        const price = parseFloat(priceInput.value) || 0;
        const discount = parseFloat(discountInput.value) || 0;
        
        // Update price display
        priceDisplay.textContent = price.toFixed(2);
        
        // Update discount info
        if (discount > 0 && price > 0) {
            const percentage = Math.round((discount / price) * 100);
            discountPercentage.textContent = `${percentage}%`;
            discountAmount.textContent = `(${discount.toFixed(2)} ETB)`;
        } else {
            discountPercentage.textContent = '0%';
            discountAmount.textContent = '(0.00 ETB)';
        }
    }
    
    [priceInput, discountInput].forEach(input => {
        input.addEventListener('input', updatePriceDisplays);
    });
    
    // Stock Quantity Indicator
    const stockInput = document.getElementById('id_stock_quantity');
    const stockBar = document.querySelector('.stock-bar');
    const stockStatus = document.getElementById('stockStatus');
    
    function updateStockIndicator() {
        const stock = parseInt(stockInput.value) || 0;
        let width = 0;
        let status = 'Out of Stock';
        let color = '#e74c3c';
        
        if (stock > 0) {
            width = Math.min(100, stock);
            status = stock > 50 ? 'In Stock' : 'Low Stock';
            color = stock > 50 ? '#27ae60' : '#f39c12';
        }
        
        stockBar.style.width = `${width}%`;
        stockBar.style.backgroundColor = color;
        stockStatus.textContent = status;
        stockStatus.style.color = color;
    }
    
    stockInput.addEventListener('input', updateStockIndicator);
    
    // Description Character Counter
    const descriptionInput = document.getElementById('id_description');
    const charCount = document.getElementById('charCount');
    
    descriptionInput.addEventListener('input', function() {
        charCount.textContent = this.value.length;
    });
    
    // Image Upload Handling
    const imageDropzone = document.getElementById('imageDropzone');
    const imageInput = document.getElementById('imageInput');
    const imagePreviewContainer = document.getElementById('imagePreviewContainer');
    
    imageDropzone.addEventListener('click', function() {
        imageInput.click();
    });
    
    imageInput.addEventListener('change', function() {
        handleFiles(this.files);
    });
    
    imageDropzone.addEventListener('dragover', function(e) {
        e.preventDefault();
        this.style.borderColor = '#3498db';
        this.style.backgroundColor = '#f8f9fa';
    });
    
    imageDropzone.addEventListener('dragleave', function() {
        this.style.borderColor = '#bdc3c7';
        this.style.backgroundColor = 'transparent';
    });
    
    imageDropzone.addEventListener('drop', function(e) {
        e.preventDefault();
        this.style.borderColor = '#bdc3c7';
        this.style.backgroundColor = 'transparent';
        
        if (e.dataTransfer.files.length) {
            handleFiles(e.dataTransfer.files);
        }
    });
    
    function handleFiles(files) {
        imagePreviewContainer.innerHTML = '';
        
        for (let i = 0; i < Math.min(files.length, 10); i++) {
            const file = files[i];
            
            if (!file.type.match('image.*')) continue;
            
            const reader = new FileReader();
            reader.onload = function(e) {
                const previewItem = document.createElement('div');
                previewItem.className = 'image-preview-item';
                
                const img = document.createElement('img');
                img.src = e.target.result;
                
                const removeBtn = document.createElement('button');
                removeBtn.className = 'remove-image';
                removeBtn.innerHTML = '&times;';
                removeBtn.addEventListener('click', function() {
                    previewItem.remove();
                });
                
                previewItem.appendChild(img);
                previewItem.appendChild(removeBtn);
                imagePreviewContainer.appendChild(previewItem);
            };
            reader.readAsDataURL(file);
        }
    }
    
    // Size Chart Modal
    const sizeChartBtn = document.getElementById('sizeChartBtn');
    const sizeChartModal = document.getElementById('sizeChartModal');
    const closeSizeChartModal = sizeChartModal.querySelector('.close-modal');
    
    sizeChartBtn.addEventListener('click', function() {
        sizeChartModal.style.display = 'block';
    });
    
    closeSizeChartModal.addEventListener('click', function() {
        sizeChartModal.style.display = 'none';
    });
    
    window.addEventListener('click', function(e) {
        if (e.target === sizeChartModal) {
            sizeChartModal.style.display = 'none';
        }
    });
    
    // Preview Button
    const previewBtn = document.getElementById('previewBtn');
    const previewModal = document.getElementById('previewModal');
    const closePreviewModal = previewModal.querySelector('.close-modal');
    
    previewBtn.addEventListener('click', function() {
        const previewContent = `
            <div class="modal-header">
                <h3>Item Preview</h3>
                <button class="close-modal">&times;</button>
            </div>
            <div class="modal-body">
                <p>Preview functionality would show how the item will appear to customers.</p>
                <p>This would include the main image, price, description, and other details.</p>
            </div>
        `;
        
        previewModal.querySelector('.modal-content').innerHTML = previewContent;
        previewModal.style.display = 'block';
        
        previewModal.querySelector('.close-modal').addEventListener('click', function() {
            previewModal.style.display = 'none';
        });
    });
    
    window.addEventListener('click', function(e) {
        if (e.target === previewModal) {
            previewModal.style.display = 'none';
        }
    });
    
    // Form Validation
    const form = document.getElementById('clothingForm');
    
    form.addEventListener('submit', function(e) {
        let isValid = true;
        
        const price = parseFloat(priceInput.value);
        const discount = parseFloat(discountInput.value);
        
        if (discount > 0 && discount >= price) {
            alert('Discount price must be lower than regular price');
            isValid = false;
        }
        
        if (!isValid) {
            e.preventDefault();
        }
    });
    
    // Initialize all displays
    updatePriceDisplays();
    updateStockIndicator();
});
