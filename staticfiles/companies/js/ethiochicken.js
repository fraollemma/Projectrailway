document.addEventListener('DOMContentLoaded', function() {
  // Copy email functionality
  const copyButtons = document.querySelectorAll('.copy-btn');
  copyButtons.forEach(button => {
    button.addEventListener('click', function() {
      const textToCopy = this.getAttribute('data-text');
      navigator.clipboard.writeText(textToCopy).then(() => {
        const originalText = this.innerHTML;
        this.innerHTML = '<i class="fas fa-check"></i> Copied!';
        setTimeout(() => {
          this.innerHTML = originalText;
        }, 2000);
      });
    });
  });

  // Call button functionality
  const callButtons = document.querySelectorAll('.call-btn');
  callButtons.forEach(button => {
    button.addEventListener('click', function() {
      const phoneNumber = this.parentElement.querySelector('p').textContent.trim();
      alert(`Calling ${phoneNumber}`);
      // In a real implementation, you would use:
      // window.location.href = `tel:${phoneNumber}`;
    });
  });

  // Map button functionality
  const mapButtons = document.querySelectorAll('.map-btn');
  mapButtons.forEach(button => {
    button.addEventListener('click', function() {
      const address = Array.from(this.parentElement.querySelectorAll('p'))
                         .map(p => p.textContent.trim())
                         .join(', ');
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`, '_blank');
    });
  });

  // Card hover animations
  const cards = document.querySelectorAll('.mission-card, .vision-card, .value-card, .contact-card');
  cards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transition = 'all 0.3s ease';
    });
  });

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      document.querySelector(this.getAttribute('href')).scrollIntoView({
        behavior: 'smooth'
      });
    });
  });

  // Animate elements on scroll
  const animateOnScroll = () => {
    const elements = document.querySelectorAll('.section-header, .mission-card, .vision-card, .value-card, .contact-card, .testimonial-card');
    elements.forEach(element => {
      const elementPosition = element.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      
      if (elementPosition < windowHeight - 100) {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
      }
    });
  };

  // Set initial state for animation
  const animatedElements = document.querySelectorAll('.section-header, .mission-card, .vision-card, .value-card, .contact-card, .testimonial-card');
  animatedElements.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  });

  window.addEventListener('scroll', animateOnScroll);
  animateOnScroll(); // Initial check
});