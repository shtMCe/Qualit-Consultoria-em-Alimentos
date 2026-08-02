/**
 * Qualité Consultoria - Core Engine
 * Arquitetura Vanilla JS orientada a performance e acessibilidade.
 * Utiliza requestAnimationFrame para scroll otimizado.
 */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // 1. Otimização de Scroll com requestAnimationFrame
    const header = document.querySelector('[data-header]');
    const sections = document.querySelectorAll('section[id]');
    let lastScrollY = window.scrollY;
    let ticking = false;

    const updateScrollState = () => {
        const currentScroll = window.scrollY;
<<<<<<< HEAD

=======
        
>>>>>>> main
        // Efeito Header
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // ScrollSpy Lógica Otimizada
        sections.forEach(sec => {
            const top = sec.offsetTop - 100;
            const height = sec.offsetHeight;
            const id = sec.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${id}"]`);

            if (navLink) {
                if (currentScroll >= top && currentScroll < top + height) {
                    navLink.classList.add('active');
<<<<<<< HEAD
                    navLink.setAttribute('aria-current', 'true');
                } else {
                    navLink.classList.remove('active');
                    navLink.removeAttribute('aria-current');
=======
                } else {
                    navLink.classList.remove('active');
>>>>>>> main
                }
            }
        });

        lastScrollY = currentScroll;
        ticking = false;
    };

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(updateScrollState);
            ticking = true;
        }
    }, { passive: true });

    // Iniciar estado
    updateScrollState();

    // 2. Navegação Mobile Acessível
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');

    const toggleMenu = () => {
        const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
        mobileToggle.setAttribute('aria-expanded', !isExpanded);
        navbar.classList.toggle('is-active');
    };

    if (mobileToggle) {
        mobileToggle.addEventListener('click', toggleMenu);
    }

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navbar.classList.contains('is-active')) toggleMenu();
        });
    });

    // 3. Intersection Observer (Revelação de Elementos) - Padrão Vercel
    const revealElements = document.querySelectorAll('.reveal');
<<<<<<< HEAD

=======
    
>>>>>>> main
    const revealOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Desconecta após animar para salvar memória
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(el => revealOnScroll.observe(el));

    // 4. Accordion / FAQ Acessível (WCAG Compliance)
    const accordions = document.querySelectorAll('.accordion-trigger');

    accordions.forEach(acc => {
        acc.addEventListener('click', function(e) {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            const content = document.getElementById(this.getAttribute('aria-controls'));

            // Fecha os outros (Opcional, mas mantém a tela limpa)
            accordions.forEach(otherAcc => {
                if (otherAcc !== this) {
                    otherAcc.setAttribute('aria-expanded', 'false');
                    document.getElementById(otherAcc.getAttribute('aria-controls')).style.maxHeight = null;
                }
            });

            // Alterna o atual
            this.setAttribute('aria-expanded', !isExpanded);
<<<<<<< HEAD

=======
            
>>>>>>> main
            if (!isExpanded) {
                content.style.maxHeight = content.scrollHeight + "px";
            } else {
                content.style.maxHeight = null;
            }
        });

        // Suporte a teclado (Enter e Space)
        acc.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });

    // 5. Ano Atual no Rodapé (evita a necessidade de atualização manual todo ano)
    const yearEl = document.getElementById('current-year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

    // 6. Fechar Menu Mobile com Esc ou Clique Fora (reforço de acessibilidade)
    if (mobileToggle && navbar) {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navbar.classList.contains('is-active')) {
                toggleMenu();
                mobileToggle.focus();
            }
        });

        document.addEventListener('click', (e) => {
            const isOpen = navbar.classList.contains('is-active');
            const clickedInside = navbar.contains(e.target) || mobileToggle.contains(e.target);
            if (isOpen && !clickedInside) {
                toggleMenu();
            }
        });
    }
});
