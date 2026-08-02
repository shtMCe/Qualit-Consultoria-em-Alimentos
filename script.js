/**
 * Qualité — Front-end Architecture
 * Micro-interações premium, sem dependências externas.
 * Performance: um único listener de scroll com rAF (evita múltiplos
 * callbacks concorrentes). Acessibilidade: respeita prefers-reduced-motion,
 * navegação por teclado (Esc fecha o menu, focus trap no menu mobile).
 *
 * Mantém 100% dos IDs/classes usados pelo CSS e pelo HTML original:
 * #header #navbar .mobile-menu-toggle .nav-link .magnetic-btn .parallax-wrap
 * .fade-up .reveal-left .reveal-right .accordion-header .border-accent
 * .parallax-item — nada foi renomeado.
 */
(() => {
    'use strict';

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    document.addEventListener('DOMContentLoaded', () => {
        initScrollEffects();     // 1. Header (scrolled) + 6. ScrollSpy + 8. Parallax de scroll — unificados num só rAF
        initMobileMenu();        // 2. Menu mobile + acessibilidade (Esc, focus trap)
        initMagneticButtons();   // 3. Botões magnéticos
        initMouseParallax();     // 4. Parallax por mouse (Hero & Sobre)
        initScrollReveal();      // 5. Scroll reveal (Intersection Observer)
        initAccordion();         // 7. Accordion (FAQ)
        initCounters();          // Novo, opcional: contadores animados via [data-count-to]
    });

    // ==========================================================================
    // 1 + 6 + 8. Header ao rolar, ScrollSpy e Parallax de scroll
    // Unificados em um só listener + um só requestAnimationFrame por frame,
    // evitando três callbacks de scroll concorrentes (ganho real de performance).
    // ==========================================================================
    function initScrollEffects() {
        const header = document.getElementById('header');
        const sections = document.querySelectorAll('section[id]');
        const parallaxItems = document.querySelectorAll('.parallax-item');

        if (!header && sections.length === 0 && parallaxItems.length === 0) return;

        let ticking = false;

        const updateHeaderState = () => {
            if (!header) return;
            header.classList.toggle('scrolled', window.scrollY > 50);
        };

        const updateScrollSpy = () => {
            const scrollY = window.scrollY;
            sections.forEach((current) => {
                const sectionHeight = current.offsetHeight;
                const sectionTop = current.offsetTop - 150; // Offset do header
                const sectionId = current.getAttribute('id');
                const navItem = document.querySelector(`.nav-list a[href="#${sectionId}"]`);
                if (!navItem) return;
                const isActive = scrollY > sectionTop && scrollY <= sectionTop + sectionHeight;
                navItem.classList.toggle('active', isActive);
            });
        };

        const updateParallaxItems = () => {
            if (prefersReducedMotion || parallaxItems.length === 0) return;
            const scrolled = window.scrollY;
            parallaxItems.forEach((item, index) => {
                // Efeito sutil: a segunda imagem desce em velocidade diferente
                const speed = index === 0 ? 0.05 : -0.05;
                item.style.transform = `translateY(${scrolled * speed}px)`;
            });
        };

        const onScroll = () => {
            if (ticking) return;
            ticking = true;
            window.requestAnimationFrame(() => {
                updateHeaderState();
                updateScrollSpy();
                updateParallaxItems();
                ticking = false;
            });
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll(); // Estado inicial
    }

    // ==========================================================================
    // 2. Menu Mobile — abre/fecha, trava o scroll do body, Esc fecha,
    //    e mantém o foco preso no menu enquanto ele estiver aberto.
    // ==========================================================================
    function initMobileMenu() {
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        const navbar = document.getElementById('navbar');
        if (!mobileToggle || !navbar) return;

        const navLinks = navbar.querySelectorAll('.nav-link');
        const focusableSelector = 'a[href], button:not([disabled])';

        const openMenu = () => {
            mobileToggle.setAttribute('aria-expanded', 'true');
            navbar.classList.add('active');
            document.body.style.overflow = 'hidden';
            const firstFocusable = navbar.querySelector(focusableSelector);
            if (firstFocusable) firstFocusable.focus();
        };

        const closeMenu = () => {
            mobileToggle.setAttribute('aria-expanded', 'false');
            navbar.classList.remove('active');
            document.body.style.overflow = '';
        };

        const toggleMenu = () => {
            const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
            isExpanded ? closeMenu() : openMenu();
        };

        mobileToggle.addEventListener('click', toggleMenu);

        navLinks.forEach((link) => {
            link.addEventListener('click', () => {
                if (navbar.classList.contains('active')) closeMenu();
            });
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navbar.classList.contains('active')) {
                closeMenu();
                mobileToggle.focus();
            }
        });

        // Focus trap simples: mantém o Tab circulando dentro do menu aberto
        navbar.addEventListener('keydown', (e) => {
            if (e.key !== 'Tab' || !navbar.classList.contains('active')) return;
            const focusables = Array.from(navbar.querySelectorAll(focusableSelector));
            if (focusables.length === 0) return;

            const first = focusables[0];
            const last = focusables[focusables.length - 1];

            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        });
    }

    // ==========================================================================
    // 3. Efeito Botões Magnéticos (Premium Hover Micro-interaction)
    // Desativado quando o usuário prefere movimento reduzido.
    // ==========================================================================
    function initMagneticButtons() {
        if (prefersReducedMotion) return;
        const magneticElements = document.querySelectorAll('.magnetic-btn');

        magneticElements.forEach((elem) => {
            elem.addEventListener('mousemove', (e) => {
                const rect = elem.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                // Suaviza a força magnética
                elem.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
            });

            elem.addEventListener('mouseleave', () => {
                elem.style.transform = 'translate(0px, 0px)';
            });
        });
    }

    // ==========================================================================
    // 4. Parallax Sutil em Imagens Baseado no Mouse (Hero & Sobre)
    // Desativado quando o usuário prefere movimento reduzido.
    // ==========================================================================
    function initMouseParallax() {
        if (prefersReducedMotion) return;
        const parallaxWraps = document.querySelectorAll('.parallax-wrap');

        parallaxWraps.forEach((wrap) => {
            const img = wrap.querySelector('img');
            if (!img) return;

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
                img.style.transition = 'none'; // Instantâneo durante o mousemove
            });
        });
    }

    // ==========================================================================
    // 5. Scroll Reveal (Intersection Observer)
    // Se o usuário prefere movimento reduzido, revela tudo de imediato
    // em vez de configurar o observer (o CSS já garante isso visualmente;
    // isto apenas evita trabalho desnecessário em JS).
    // ==========================================================================
    function initScrollReveal() {
        const revealElements = document.querySelectorAll('.fade-up, .reveal-left, .reveal-right');
        if (revealElements.length === 0) return;

        if (prefersReducedMotion) {
            revealElements.forEach((el) => el.classList.add('is-revealed'));
            return;
        }

        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-revealed');
                    observer.unobserve(entry.target); // Anima só uma vez
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        revealElements.forEach((el) => revealObserver.observe(el));
    }

    // ==========================================================================
    // 7. Accordion (FAQ) — suave via max-height, um item aberto por vez.
    // Recalcula a altura ao redimensionar a janela para não cortar conteúdo.
    // ==========================================================================
    function initAccordion() {
        const accordions = document.querySelectorAll('.accordion-header');
        if (accordions.length === 0) return;

        // Se algum item já vier marcado aria-expanded="true" no HTML,
        // abre-o visualmente no carregamento (o CSS começa fechado por padrão).
        accordions.forEach((acc) => {
            if (acc.getAttribute('aria-expanded') === 'true' && acc.nextElementSibling) {
                acc.parentElement.classList.add('border-accent');
                acc.nextElementSibling.style.maxHeight = `${acc.nextElementSibling.scrollHeight}px`;
            }
        });

        accordions.forEach((acc) => {
            acc.addEventListener('click', () => {
                const isExpanded = acc.getAttribute('aria-expanded') === 'true';
                const content = acc.nextElementSibling;
                const parent = acc.parentElement;

                // Fecha os outros itens
                accordions.forEach((otherAcc) => {
                    if (otherAcc === acc) return;
                    otherAcc.setAttribute('aria-expanded', 'false');
                    if (otherAcc.parentElement) otherAcc.parentElement.classList.remove('border-accent');
                    if (otherAcc.nextElementSibling) otherAcc.nextElementSibling.style.maxHeight = null;
                });

                // Alterna o item atual
                acc.setAttribute('aria-expanded', String(!isExpanded));

                if (!isExpanded) {
                    if (parent) parent.classList.add('border-accent');
                    if (content) content.style.maxHeight = `${content.scrollHeight}px`;
                } else {
                    if (parent) parent.classList.remove('border-accent');
                    if (content) content.style.maxHeight = null;
                }
            });
        });

        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                const openHeader = document.querySelector('.accordion-header[aria-expanded="true"]');
                const openContent = openHeader && openHeader.nextElementSibling;
                if (openContent) openContent.style.maxHeight = `${openContent.scrollHeight}px`;
            }, 150);
        }, { passive: true });
    }

    // ==========================================================================
    // Novo (opcional): Contadores animados.
    // Ative adicionando data-count-to="17" a qualquer elemento de texto
    // (ex.: o número dentro do .experience-badge). Nada quebra se o
    // atributo não existir em nenhum elemento.
    // ==========================================================================
    function initCounters() {
        const counters = document.querySelectorAll('[data-count-to]');
        if (counters.length === 0) return;

        const animateCounter = (el) => {
            const raw = el.getAttribute('data-count-to');
            const target = parseFloat(raw);
            if (Number.isNaN(target)) return;

            if (prefersReducedMotion) {
                el.textContent = target.toLocaleString('pt-BR');
                return;
            }

            const decimals = (raw.split('.')[1] || '').length;
            const duration = 1600;
            const start = performance.now();

            const step = (now) => {
                const progress = Math.min((now - start) / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3); // ease-out cúbico
                el.textContent = (target * eased).toLocaleString('pt-BR', {
                    minimumFractionDigits: decimals,
                    maximumFractionDigits: decimals,
                });
                if (progress < 1) window.requestAnimationFrame(step);
            };
            window.requestAnimationFrame(step);
        };

        const counterObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach((el) => counterObserver.observe(el));
    }
})();
