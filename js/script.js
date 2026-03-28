document.addEventListener('DOMContentLoaded', () => {

    /* --- Theme Toggle --- */
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = themeToggleBtn.querySelector('i');

    // Check for saved user preference, if any, on load of the website
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme) {
        document.body.setAttribute('data-theme', currentTheme);
        if (currentTheme === 'dark') {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        } else {
            // Default assumes sun now, so no need to force unless we want to be safe
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        }
    } else {
        // No preference? Default is light. 
        // Ensure icon is sun (which is default in HTML now)
    }

    themeToggleBtn.addEventListener('click', function () {
        let theme = document.body.getAttribute('data-theme');
        if (theme === 'light') {
            document.body.setAttribute('data-theme', 'dark');
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.setAttribute('data-theme', 'light');
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
            localStorage.setItem('theme', 'light');
        }

        // Redraw canvas particles with new color
        init();
    });


    /* --- Typewriter Effect --- */
    const textElement = document.getElementById('typing-text');
    const texts = ["Natural Language Processing", "Computer Vision", "Deep Learning", "Predictive Analytics"];
    let count = 0;
    let index = 0;
    let currentText = "";
    let letter = "";
    let isDeleting = false;

    (function type() {
        if (count === texts.length) {
            count = 0;
        }
        currentText = texts[count];

        if (isDeleting) {
            letter = currentText.slice(0, --index);
        } else {
            letter = currentText.slice(0, ++index);
        }

        textElement.textContent = letter;

        let typeSpeed = 100;
        if (isDeleting) {
            typeSpeed = 50;
        }

        if (!isDeleting && letter.length === currentText.length) {
            typeSpeed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && letter.length === 0) {
            isDeleting = false;
            count++;
            typeSpeed = 500; // Pause before new word
        }

        setTimeout(type, typeSpeed);
    })();


    /* --- Custom Cursor --- */
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;

        // Smooth trailing for outline
        cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 500, fill: "forwards" });
    });


    /* --- Neural Network Canvas Background --- */
    const canvas = document.getElementById('neural-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particlesArray;

    // Handle resize
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        init();
    });

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.directionX = (Math.random() * 2) - 1; // Speed -1 to 1
            this.directionY = (Math.random() * 2) - 1;
            this.size = (Math.random() * 2) + 1; // Size 1 to 3

            // Check theme for color
            const isLight = document.body.getAttribute('data-theme') === 'light';
            this.color = isLight ? '#0ea5e9' : '#38bdf8';
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = this.color;
            ctx.fill();
        }

        update() {
            if (this.x > canvas.width || this.x < 0) {
                this.directionX = -this.directionX;
            }
            if (this.y > canvas.height || this.y < 0) {
                this.directionY = -this.directionY;
            }

            this.x += this.directionX;
            this.y += this.directionY;
            this.draw();
        }
    }

    function init() {
        particlesArray = [];
        let numberOfParticles = (canvas.height * canvas.width) / 9000;
        for (let i = 0; i < numberOfParticles; i++) {
            particlesArray.push(new Particle());
        }
    }

    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
        }
        connect();
    }

    function connect() {
        let opacityValue = 1;
        const isLight = document.body.getAttribute('data-theme') === 'light';

        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
                let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) +
                    ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
                if (distance < (canvas.width / 7) * (canvas.height / 7)) {
                    opacityValue = 1 - (distance / 20000);
                    // Adjust color based on theme
                    if (isLight) {
                        ctx.strokeStyle = 'rgba(14, 165, 233,' + opacityValue + ')';
                    } else {
                        ctx.strokeStyle = 'rgba(56, 189, 248,' + opacityValue + ')';
                    }

                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    init();
    animate();

    /* --- Scroll Animation (IntersectionObserver) --- */
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    const hiddenElements = document.querySelectorAll('.section, .hero-content');
    hiddenElements.forEach((el) => {
        el.style.opacity = 0;
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 1s';
        observer.observe(el);
    });

    /* --- Mobile Menu --- */
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('toggle');
    });

    /* --- Project Filtering --- */


    // Close menu when link is clicked
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.classList.remove('toggle');
        });
    });

    /* --- Project Category Collapsing --- */
    const categoryTitles = document.querySelectorAll('.category-title');

    categoryTitles.forEach(title => {
        title.addEventListener('click', () => {
            // Toggle active class on title for arrow rotation
            title.classList.toggle('active');

            // Find the next sibling element (the projects grid)
            const grid = title.nextElementSibling;
            if (grid && grid.classList.contains('projects-grid')) {
                grid.classList.toggle('active');
            }

            // Also toggle the view-more wrapper if it exists after the grid
            if (grid) {
                const viewMore = grid.nextElementSibling;
                if (viewMore && viewMore.classList.contains('view-more-wrapper')) {
                    // We can choose to toggle this or leave it. 
                    // Usually better to hide it too if grid is hidden.
                    if (grid.classList.contains('active')) {
                        viewMore.style.display = 'flex';
                    } else {
                        viewMore.style.display = 'none';
                    }
                }
            }
        });
    });

});
