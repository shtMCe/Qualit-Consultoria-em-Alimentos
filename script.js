/**
 * Qualité - Front-end Architecture
 * Awwwards Style Micro-interactions & Performance
 * Sem dependências externas.
 */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================================================
    // 1. Navbar Glassmorphism & Scroll Progress
    // ==========================================================================
    const header = document.getElementById('header');
    
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    
    // Usando passive listener para performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Init

    // ==========================================================================
    // 2. Menu Mobile Elegante
    // ==========================================================================
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');

    const toggleMenu = () => {
        const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
        mobileToggle.setAttribute('aria-expanded', !isExpanded);
        navbar.classList.toggle('active');
        document.body.style.overflow = isExpanded ? '' : 'hidden'; // Evita scroll ao abrir menu
    };

    mobileToggle.addEventListener('click', toggleMenu);

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navbar.classList.contains('active')) toggleMenu();
        });
    });

    // ==========================================================================
    // 3. Efeito Botões Magnéticos (Premium Hover Micro-interaction)
    // ==========================================================================
    const magneticElements = document.querySelectorAll('.magnetic-btn');

    magneticElements.forEach(elem => {
        elem.addEventListener('mousemove', (e) => {
            const rect = elem.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            // Suaviza a força magnética
            elem.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });

        elem.addEventListener('mouseleave', () => {
            // Retorna ao normal usando a transição do CSS
            elem.style.transform = 'translate(0px, 0px)';
        });
    });

    // ==========================================================================
    // 4. Parallax Sutil em Imagens Baseado no Mouse (Hero & About)
    // ==========================================================================
    const parallaxWraps = document.querySelectorAll('.parallax-wrap');
    
    parallaxWraps.forEach(wrap => {
        const img = wrap.querySelector('img');
        if(!img) return;
        
        wrap.addEventListener('mousemove', (e) => {
            const rect = wrap.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            
            window.requestAnimationFrame(() => {
                img.style.transform = `scale(1.05) translate(${x * 10}px, ${y * 10}px)`;
            });
        });
        
        wrap.addEventListener('mouseleave', () => {
            window.requestAnimationFrame(() => {
                img.style.transform = 'scale(1) translate(0px, 0px)';
                img.style.transition = 'transform 0.8s cubic-bezier(0.2, 1, 0.2, 1)';
            });
        });
        
        wrap.addEventListener('mouseenter', () => {
            img.style.transition = 'none'; // Remove transição no mousemove para ser instantâneo
        });
    });

    // ==========================================================================
    // 5. Scroll Reveal Awwwards-style (Intersection Observer)
    // ==========================================================================
    const revealElements = document.querySelectorAll('.fade-up, .reveal-left, .reveal-right');

    const revealOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-revealed');
                observer.unobserve(entry.target); // Anima só uma vez
            }
        });
    }, revealOptions);

    revealElements.forEach(el => revealObserver.observe(el));

    // ==========================================================================
    // 6. ScrollSpy Acessível (Destaque do Menu)
    // ==========================================================================
    const sections = document.querySelectorAll('section[id]');
    
    const scrollSpy = () => {
        const scrollY = window.scrollY;
        
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 150; // Offset do header
            const sectionId = current.getAttribute('id');
            
            const navItem = document.querySelector(`.nav-list a[href="#${sectionId}"]`);
            
            if(navItem) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navItem.classList.add('active');
                } else {
                    navItem.classList.remove('active');
                }
            }
        });
    };

    window.addEventListener('scroll', scrollSpy, { passive: true });

    // ==========================================================================
    // 7. Accordion (FAQ) - Suave via Max-Height
    // ==========================================================================
    const accordions = document.querySelectorAll('.accordion-header');

    accordions.forEach(acc => {
        acc.addEventListener('click', () => {
            const isExpanded = acc.getAttribute('aria-expanded') === 'true';
            const content = acc.nextElementSibling;
            const parent = acc.parentElement;

            // Fechar outros
            accordions.forEach(otherAcc => {
                if (otherAcc !== acc) {
                    otherAcc.setAttribute('aria-expanded', 'false');
                    otherAcc.parentElement.classList.remove('border-accent');
                    otherAcc.nextElementSibling.style.maxHeight = null;
                }
            });

            // Alternar estado atual
            acc.setAttribute('aria-expanded', !isExpanded);
            
            if (!isExpanded) {
                parent.classList.add('border-accent');
                content.style.maxHeight = content.scrollHeight + "px";
            } else {
                parent.classList.remove('border-accent');
                content.style.maxHeight = null;
            }
        });
    });

    // ==========================================================================
    // 8. Efeito Parallax em Scroll nas imagens "Sobre"
    // ==========================================================================
    const parallaxItems = document.querySelectorAll('.parallax-item');
    window.addEventListener('scroll', () => {
        window.requestAnimationFrame(() => {
            const scrolled = window.scrollY;
            parallaxItems.forEach((item, index) => {
                // Efeito sutil onde a segunda imagem desce em velocidade diferente
                const speed = index === 0 ? 0.05 : -0.05; 
                item.style.transform = `translateY(${scrolled * speed}px)`;
            });
        });
    }, { passive: true });

});