/**
 * Qualité Consultoria - Scripts Principais
 * Arquitetura Vanilla JS modular, garantindo performance e acessibilidade (0 dependências).
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================================================
    // 1. Navbar Inteligente & Scroll Effect
    // ==========================================================================
    const header = document.getElementById('header');
    const backToTopBtn = document.querySelector('.back-to-top');

    const handleScroll = () => {
        const scrollY = window.scrollY;
        
        // Efeito do Header
        if (scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Botão voltar ao topo
        if (scrollY > 500) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // ==========================================================================
    // 2. Menu Mobile (Toggle e Fechamento Automático)
    // ==========================================================================
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');

    const toggleMenu = () => {
        const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
        mobileToggle.setAttribute('aria-expanded', !isExpanded);
        mobileToggle.classList.toggle('active');
        navbar.classList.toggle('active');
    };

    mobileToggle.addEventListener('click', toggleMenu);

    // Fecha o menu ao clicar em qualquer link (Mobile)
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navbar.classList.contains('active')) {
                toggleMenu();
            }
        });
    });

    // ==========================================================================
    // 3. Scroll Suave para Âncoras
    // ==========================================================================
    const smoothScroll = (targetId) => {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    };

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if(href !== "#") {
                e.preventDefault();
                smoothScroll(href);
            }
        });
    });

    // Evento específico para o Back to Top (href="#")
    backToTopBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ==========================================================================
    // 4. Scroll Reveal Animations (Intersection Observer)
    // ==========================================================================
    const revealElements = document.querySelectorAll(
        '.reveal-fade-up, .reveal-fade-left, .reveal-fade-right, .reveal-scale'
    );

    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active-reveal');
                // Opcional: parar de observar após a primeira animação para melhor performance
                observer.unobserve(entry.target);
            }
        });
    };

    const revealObserver = new IntersectionObserver(revealCallback, revealOptions);

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // ==========================================================================
    // 5. ScrollSpy - Destaque automático do menu durante o scroll
    // ==========================================================================
    const sections = document.querySelectorAll('section[id]');
    
    const scrollSpy = () => {
        const scrollY = window.scrollY;
        
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            // Pega o top descontando o tamanho do header fixo
            const sectionTop = current.offsetTop - 100; 
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
    // 6. FAQ Accordion (Lógica e Acessibilidade)
    // ==========================================================================
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            // Acessibilidade e Estado
            const isExpanded = header.getAttribute('aria-expanded') === 'true';
            
            // Controle visual do conteúdo
            const content = header.nextElementSibling;

            // Fechar os outros (Comportamento clássico de accordion)
            accordionHeaders.forEach(otherHeader => {
                if(otherHeader !== header) {
                    otherHeader.setAttribute('aria-expanded', 'false');
                    otherHeader.nextElementSibling.style.maxHeight = null;
                }
            });

            // Toggle do clicado
            header.setAttribute('aria-expanded', !isExpanded);
            
            if (!isExpanded) {
                content.style.maxHeight = content.scrollHeight + "px";
            } else {
                content.style.maxHeight = null;
            }
        });
    });
});