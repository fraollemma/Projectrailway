document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const likeButtons = document.querySelectorAll('[data-action="like"]');
  const shareButtons = document.querySelectorAll('[data-action="share"]');
  const mainImage = document.getElementById("mainImage");
  const thumbnails = document.querySelectorAll(".thumbnail");
  const zoomBtn = document.getElementById("zoomBtn");
  const modal = document.getElementById("imageModal");
  const modalImg = document.getElementById("modalImage");
  const closeModal = document.querySelector(".close-modal");

  // Initialize
  likeButtons.forEach(btn => btn.addEventListener('click', handleLike));
  shareButtons.forEach(btn => btn.addEventListener('click', handleShare));

  // Thumbnail click handler
  thumbnails.forEach(thumb => {
    thumb.addEventListener("click", function () {
      // Update main image
      mainImage.src = this.dataset.src;

      // Update active thumbnail
      thumbnails.forEach(t => t.classList.remove("active"));
      this.classList.add("active");
    });
  });

  // Zoom functionality
  if (zoomBtn) {
    zoomBtn.addEventListener('click', () => {
      modal.style.display = "block";
      modalImg.src = mainImage.src;
    });
  }

  // Modal close
  if (closeModal) {
    closeModal.addEventListener('click', () => {
      modal.style.display = "none";
    });
  }

  // Close modal when clicking outside
  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });

  // Like handler
  async function handleLike(e) {
    const btn = e.currentTarget;
    const itemId = btn.dataset.itemId;
    const count = btn.querySelector('.count');

    try {
      const res = await fetch(`/en/items/${itemId}/like/`, {
        method: 'POST',
        headers: { 'X-CSRFToken': getCookie('csrftoken') }
      });

      if (res.ok) {
        const data = await res.json();
        count.textContent = data.like_count;
        btn.classList.toggle('liked');

        // Add animation
        btn.style.transform = 'scale(1.2)';
        setTimeout(() => {
          btn.style.transform = 'scale(1)';
        }, 200);
      }
    } catch (err) {
      console.error('Like error:', err);
    }
  }

  // Share handler
  async function handleShare(e) {
    const btn = e.currentTarget;
    const itemId = btn.dataset.itemId;
    const count = btn.querySelector('.count');
    const itemTitle = document.querySelector('.product-title')?.textContent || 'Item';
    const url = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({ title: itemTitle, url });
      } else {
        await navigator.clipboard.writeText(url);
        showNotification('Link copied to clipboard!');
      }

      const res = await fetch(`/en/items/${itemId}/share/`, {
        method: 'POST',
        headers: { 'X-CSRFToken': getCookie('csrftoken') }
      });

      if (res.ok) {
        const data = await res.json();
        count.textContent = data.share_count;

        // Add animation
        btn.style.transform = 'scale(1.2)';
        setTimeout(() => {
          btn.style.transform = 'scale(1)';
        }, 200);
      }
    } catch (err) {
      console.error('Share error:', err);
    }
  }

  // Notification function
  function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #10b981;
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 1000;
      animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  }

  // Utility function to get cookie
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }

  @keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
  }

  .notification {
    font-family: inherit;
  }
`;
document.head.appendChild(style);
