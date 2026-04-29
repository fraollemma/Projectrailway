document.addEventListener("DOMContentLoaded", () => {

    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", function(e) {
            e.preventDefault();

            const target = document.querySelector(this.getAttribute("href"));

            if(target){
                target.scrollIntoView({
                    behavior: "smooth"
                });
            }
        });
    });


    // Scroll reveal animation
    const revealElements = document.querySelectorAll(
        ".service-card, .training-card, .product-card"
    );

    const revealObserver = new IntersectionObserver(entries => {

        entries.forEach(entry => {

            if(entry.isIntersecting){
                entry.target.classList.add("reveal");
            }

        });

    },{
        threshold:0.15
    });

    revealElements.forEach(el => revealObserver.observe(el));

});