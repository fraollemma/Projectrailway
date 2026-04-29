document.addEventListener('DOMContentLoaded', function() {
  // ===== Confirm Button Shake Effect =====
  const confirmButton = document.querySelector('.confirm-delete-button');
  
  confirmButton.addEventListener('mouseenter', function() {
    this.style.animation = 'shake 0.5s';
  });
  
  confirmButton.addEventListener('mouseleave', function() {
    this.style.animation = '';
  });

  // ===== Button Ripple Effect =====
  const buttons = document.querySelectorAll('.cancel-button, .confirm-delete-button');
  
  buttons.forEach(button => {
    button.addEventListener('click', function(e) {
      // Create ripple element
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
      
      // For delete button, add confirmation effect
      if (button.classList.contains('confirm-delete-button')) {
        button.innerHTML = '🗑 Deleting...';
        button.style.background = 'linear-gradient(135deg, #ff4d4d, #cc0000)';
      }
    });
  });

  // ===== Escape Key to Cancel =====
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      window.location.href = document.querySelector('.cancel-button').href;
    }
  });

  // ===== Prevent Accidental Clicks =====
  let clickCount = 0;
  confirmButton.addEventListener('click', function(e) {
    clickCount++;
    
    if (clickCount === 1) {
      e.preventDefault();
      this.innerHTML = '🗑 Click again to confirm';
      this.style.background = 'linear-gradient(135deg, #ff1a1a, #b30000)';
      
      // Reset after 3 seconds if not clicked again
      setTimeout(() => {
        if (clickCount === 1) {
          this.innerHTML = '🗑 Confirm Delete';
          this.style.background = 'linear-gradient(135deg, var(--danger), var(--danger-dark))';
          clickCount = 0;
        }
      }, 3000);
    }
  });
});
