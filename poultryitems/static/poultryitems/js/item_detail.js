document.addEventListener('DOMContentLoaded', () => {
  const likeButtons = document.querySelectorAll('[data-action="like"]');
  const shareButtons = document.querySelectorAll('[data-action="share"]');
  const mainImage = document.getElementById("mainImage");
  const thumbnails = document.querySelectorAll(".thumbnail");
  likeButtons.forEach(btn => btn.addEventListener('click', handleLike));
  shareButtons.forEach(btn => btn.addEventListener('click', handleShare));
  thumbnails.forEach(thumb => {
        thumb.addEventListener("click", function () {
            // Swap image
            mainImage.src = this.src;

            // Optional: active border effect
            thumbnails.forEach(t => t.classList.remove("active"));
            this.classList.add("active");
        })
  });
  async function handleLike(e) {
    const btn = e.currentTarget;
    const itemId = btn.dataset.itemId;
    const count = btn.querySelector('.interaction-count');

    try {
      const res = await fetch(`/en/items/${itemId}/like/`, {
        method: 'POST',
        headers: { 'X-CSRFToken': getCookie('csrftoken') }
      });

      if (res.ok) {
        const data = await res.json();
        count.textContent = data.like_count;
        btn.classList.toggle('liked');
      }
    } catch (err) {
      console.error('Like error:', err);
    }
  }

  async function handleShare(e) {
    const btn = e.currentTarget;
    const itemId = btn.dataset.itemId;
    const count = btn.querySelector('.interaction-count');
    const itemTitle = document.querySelector('.product-title')?.textContent || 'Item';
    const url = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({ title: itemTitle, url });
      } else {
        await navigator.clipboard.writeText(url);
        alert('Link copied!');
      }

      const res = await fetch(`/en/items/${itemId}/share/`, {
        method: 'POST',
        headers: { 'X-CSRFToken': getCookie('csrftoken') }
      });

      if (res.ok) {
        const data = await res.json();
        count.textContent = data.share_count;
      }
    } catch (err) {
      console.error('Share error:', err);
    }
  }

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }
});
