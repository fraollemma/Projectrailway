document.addEventListener('DOMContentLoaded', function() {
  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      document.querySelector(this.getAttribute('href')).scrollIntoView({
        behavior: 'smooth'
      });
    });
  });

  // Card hover effect enhancement
  const cards = document.querySelectorAll('.nvi-card, .link-card');
  cards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transition = 'all 0.3s ease';
    });
  });

  // Contact information copy functionality
  const contactItems = document.querySelectorAll('.contact-info p');
  contactItems.forEach(item => {
    item.addEventListener('click', function() {
      const textToCopy = this.textContent.replace(/^\s+|\s+$/g, '');
      navigator.clipboard.writeText(textToCopy).then(() => {
        const originalText = this.textContent;
        this.textContent = 'Copied to clipboard!';
        setTimeout(() => {
          this.textContent = originalText;
        }, 2000);
      });
    });
    item.style.cursor = 'pointer';
    item.title = 'Click to copy';
  });

  // Animate elements when they come into view
  const animateOnScroll = () => {
    const elements = document.querySelectorAll('.nvi-section, .nvi-hero');
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
  const sections = document.querySelectorAll('.nvi-section');
  sections.forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  });

  // Hero animation
  const hero = document.querySelector('.nvi-hero');
  if (hero) {
    hero.style.opacity = '0';
    hero.style.transform = 'translateY(20px)';
    hero.style.transition = 'opacity 0.6s ease 0.2s, transform 0.6s ease 0.2s';
    setTimeout(() => {
      hero.style.opacity = '1';
      hero.style.transform = 'translateY(0)';
    }, 300);
  }

  // Add scroll event listener
  window.addEventListener('scroll', animateOnScroll);
  // Initial check in case elements are already visible
  animateOnScroll();

  // Add hover effect to buttons
  const buttons = document.querySelectorAll('.btn');
  buttons.forEach(button => {
    button.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-2px)';
    });
    button.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
    });
  });
});