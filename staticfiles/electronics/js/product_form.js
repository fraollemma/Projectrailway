document.addEventListener('DOMContentLoaded', function() {
  // ===== Form Validation =====
  const form = document.querySelector('form');
  const inputs = form.querySelectorAll('input, select, textarea');
  
  // Add real-time validation
  inputs.forEach(input => {
    input.addEventListener('input', function() {
      validateField(this);
    });
    
    input.addEventListener('blur', function() {
      validateField(this);
    });
  });
  
  function validateField(field) {
    const formGroup = field.closest('.form-group');
    const errorElement = formGroup.querySelector('.form-error');
    
    if (field.required && field.value.trim() === '') {
      formGroup.classList.add('error');
      if (errorElement) errorElement.textContent = 'This field is required';
    } else {
      formGroup.classList.remove('error');
      if (errorElement) errorElement.textContent = '';
    }
  }
  
  // ===== Image Upload Preview =====
  const imageInput = document.getElementById('id_image');
  if (imageInput) {
    imageInput.addEventListener('change', function(e) {
      const file = e.target.files[0];
      if (!file) return;
      
      const previewContainer = document.createElement('div');
      previewContainer.className = 'current-image';
      
      const previewLabel = document.createElement('small');
      previewLabel.textContent = 'New image:';
      
      const previewImage = document.createElement('img');
      previewImage.alt = 'Preview';
      
      const reader = new FileReader();
      reader.onload = function(event) {
        // Remove existing preview if any
        const existingPreview = document.querySelector('.current-image');
        if (existingPreview && !existingPreview.querySelector('small')?.textContent.includes('Current')) {
          existingPreview.remove();
        }
        
        // Create new preview
        previewImage.src = event.target.result;
        previewContainer.appendChild(previewLabel);
        previewContainer.appendChild(previewImage);
        imageInput.parentNode.appendChild(previewContainer);
      };
      reader.readAsDataURL(file);
    });
  }
  
  // ===== Price Formatting =====
  const priceInput = document.getElementById('id_price');
  if (priceInput) {
    priceInput.addEventListener('blur', function() {
      if (this.value) {
        this.value = parseFloat(this.value).toFixed(2);
      }
    });
  }
  
  // ===== Character Counter =====
  const descriptionInput = document.getElementById('id_description');
  if (descriptionInput) {
    const charCounter = document.createElement('div');
    charCounter.className = 'char-counter';
    charCounter.style.textAlign = 'right';
    charCounter.style.fontSize = '0.875rem';
    charCounter.style.color = var(--gray);
    charCounter.style.marginTop = '0.25rem';
    
    descriptionInput.parentNode.appendChild(charCounter);
    
    descriptionInput.addEventListener('input', function() {
      const currentLength = this.value.length;
      const maxLength = this.maxLength || Infinity;
      
      charCounter.textContent = `${currentLength}/${maxLength !== Infinity ? maxLength : '∞'}`;
      
      if (currentLength > maxLength * 0.9) {
        charCounter.style.color = var(--danger);
      } else {
        charCounter.style.color = var(--gray);
      }
    });
  }
  
  // ===== Ripple Effect for Buttons =====
  const buttons = document.querySelectorAll('.btn-primary, .btn-secondary');
  buttons.forEach(button => {
    button.addEventListener('click', function(e) {
      // Create ripple
      const ripple = document.createElement('span');
      ripple.className = 'ripple-effect';
      
      // Position ripple
      const rect = button.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      // Style ripple
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      
      // Add ripple to button
      button.appendChild(ripple);
      
      // Remove ripple after animation
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });
  
  // ===== Form Submission =====
  form.addEventListener('submit', function(e) {
    let isValid = true;
    
    // Validate all required fields
    inputs.forEach(input => {
      if (input.required && input.value.trim() === '') {
        input.closest('.form-group').classList.add('error');
        isValid = false;
      }
    });
    
    if (!isValid) {
      e.preventDefault();
      
      // Scroll to first error
      const firstError = form.querySelector('.error');
      if (firstError) {
        firstError.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }
    }
  });
});
