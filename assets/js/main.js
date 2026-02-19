(function () {
  const body = document.body;
  const currentPage = body.dataset.page || '';
  const siteHeader = document.querySelector('.site-header');

  document.querySelectorAll('[data-route]').forEach((link) => {
    if (link.dataset.route === currentPage) {
      link.classList.add('is-active');
    }
  });

  const mobileMenuButton = document.getElementById('mobileMenuButton');
  const mobileMenu = document.getElementById('mobileMenu');

  if (mobileMenuButton && mobileMenu) {
    const mobileMenuOverlay = document.createElement('button');
    mobileMenuOverlay.type = 'button';
    mobileMenuOverlay.className = 'mobile-menu-overlay';
    mobileMenuOverlay.setAttribute('aria-label', 'Close menu');
    document.body.appendChild(mobileMenuOverlay);

    const setMobileMenuOpen = (isOpen) => {
      mobileMenu.classList.toggle('hidden', !isOpen);
      mobileMenuButton.setAttribute('aria-expanded', String(isOpen));
      mobileMenuOverlay.classList.toggle('is-open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    mobileMenuButton.addEventListener('click', () => {
      setMobileMenuOpen(mobileMenu.classList.contains('hidden'));
    });

    mobileMenuOverlay.addEventListener('click', () => {
      setMobileMenuOpen(false);
    });

    mobileMenu.addEventListener('click', (event) => {
      const menuLink = event.target.closest('a[href]');
      if (menuLink) {
        setMobileMenuOpen(false);
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    });
  }

  if (siteHeader && currentPage === 'home') {
    const homeHeroSection = document.querySelector('.home-hero-section');
    const servicesOverviewSection = document.getElementById('services-overview');

    const syncHeaderOnScroll = () => {
      if (!homeHeroSection) {
        siteHeader.classList.add('is-scrolled');
        return;
      }
      const heroRect = homeHeroSection.getBoundingClientRect();
      const heroHeight = homeHeroSection.offsetHeight || heroRect.height || 0;
      const headerHeight = siteHeader.offsetHeight || 0;
      const halfHeroScrollThreshold = Math.max(30, Math.round(heroHeight * 0.5 - headerHeight));
      const currentScrollY =
        window.scrollY ||
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        0;
      const servicesReached =
        !!servicesOverviewSection &&
        servicesOverviewSection.getBoundingClientRect().top <= (siteHeader.offsetHeight || 0) + 24;
      siteHeader.classList.toggle('is-scrolled', currentScrollY >= halfHeroScrollThreshold || servicesReached);
    };

    syncHeaderOnScroll();
    window.addEventListener('load', () => {
      syncHeaderOnScroll();
    });
    window.addEventListener('scroll', syncHeaderOnScroll, { passive: true });
    window.addEventListener('resize', syncHeaderOnScroll);
  }

  const mobileServicesToggle = document.getElementById('mobileServicesToggle');
  const mobileServicesPanel = document.getElementById('mobileServicesPanel');

  if (mobileServicesToggle && mobileServicesPanel) {
    mobileServicesToggle.addEventListener('click', () => {
      mobileServicesPanel.classList.toggle('hidden');
      mobileServicesToggle.setAttribute('aria-expanded', String(!mobileServicesPanel.classList.contains('hidden')));
    });
  }

  const desktopServicesToggle = document.getElementById('desktopServicesToggle');
  const megaPanel = document.getElementById('megaPanel');

  if (desktopServicesToggle && megaPanel) {
    desktopServicesToggle.addEventListener('click', (event) => {
      if (window.innerWidth < 1024) {
        return;
      }
      event.preventDefault();
      megaPanel.classList.toggle('is-open');
    });

    document.addEventListener('click', (event) => {
      if (!megaPanel.classList.contains('is-open')) {
        return;
      }
      const insidePanel = megaPanel.contains(event.target);
      const onToggle = desktopServicesToggle.contains(event.target);
      if (!insidePanel && !onToggle) {
        megaPanel.classList.remove('is-open');
      }
    });
  }

  const heroRotator = document.getElementById('heroRotator');
  if (heroRotator) {
    const slides = Array.from(heroRotator.querySelectorAll('[data-hero-slide]'));
    const dots = Array.from(heroRotator.querySelectorAll('[data-hero-dot]'));
    const intervalLtrMs = Number(heroRotator.dataset.heroIntervalLtr || heroRotator.dataset.heroInterval || 2000);
    const intervalRtlMs = Number(heroRotator.dataset.heroIntervalRtl || 4000);
    const transitionMs = Number(heroRotator.dataset.heroTransition || 1050);
    const directionSequence = [1, 1, -1, -1];
    let activeIndex = slides.findIndex((slide) => slide.classList.contains('is-active'));
    let timerId = null;
    let isAnimating = false;
    let sequenceIndex = 0;

    if (activeIndex < 0) {
      activeIndex = 0;
    }

    const syncState = () => {
      slides.forEach((slide, index) => {
        slide.classList.toggle('is-active', index === activeIndex);
      });

      dots.forEach((dot, index) => {
        dot.classList.toggle('is-active', index === activeIndex);
      });
    };

    const moveToSlide = (nextIndex, forcedDirection, onComplete) => {
      if (slides.length < 2 || isAnimating || nextIndex === activeIndex) {
        return false;
      }

      const currentSlide = slides[activeIndex];
      const nextSlide = slides[nextIndex];
      const slideDirection = forcedDirection || 1;
      const transitionMode =
        nextIndex === 0
          ? 'right-to-left'
          : nextIndex === 1
            ? 'top-down'
            : nextIndex === 2
              ? 'left-to-right'
              : nextIndex === 3
                ? 'bottom-up'
                : '';

      isAnimating = true;

      slides.forEach((slide, index) => {
        if (index !== activeIndex && index !== nextIndex) {
          slide.classList.remove(
            'is-active',
            'enter-from-left',
            'enter-from-right',
            'enter-from-top',
            'enter-from-bottom',
            'exit-to-left',
            'exit-to-right',
            'exit-to-bottom',
            'exit-to-top'
          );
        }
      });

      currentSlide.classList.remove(
        'enter-from-left',
        'enter-from-right',
        'enter-from-top',
        'enter-from-bottom',
        'exit-to-left',
        'exit-to-right',
        'exit-to-bottom',
        'exit-to-top'
      );
      nextSlide.classList.remove(
        'enter-from-left',
        'enter-from-right',
        'enter-from-top',
        'enter-from-bottom',
        'exit-to-left',
        'exit-to-right',
        'exit-to-bottom',
        'exit-to-top'
      );
      nextSlide.classList.add('is-active');

      if (transitionMode === 'right-to-left') {
        nextSlide.classList.add('enter-from-right');
        currentSlide.classList.add('exit-to-left');
      } else if (transitionMode === 'top-down') {
        nextSlide.classList.add('enter-from-top');
        currentSlide.classList.add('exit-to-bottom');
      } else if (transitionMode === 'left-to-right') {
        nextSlide.classList.add('enter-from-left');
        currentSlide.classList.add('exit-to-right');
      } else if (transitionMode === 'bottom-up') {
        nextSlide.classList.add('enter-from-bottom');
        currentSlide.classList.add('exit-to-top');
      } else if (slideDirection === 1) {
        nextSlide.classList.add('enter-from-left');
        currentSlide.classList.add('exit-to-right');
      } else {
        nextSlide.classList.add('enter-from-right');
        currentSlide.classList.add('exit-to-left');
      }

      window.setTimeout(() => {
        currentSlide.classList.remove('is-active', 'exit-to-left', 'exit-to-right', 'exit-to-bottom', 'exit-to-top');
        nextSlide.classList.remove('enter-from-left', 'enter-from-right', 'enter-from-top', 'enter-from-bottom');
        activeIndex = nextIndex;
        syncState();
        isAnimating = false;
        if (typeof onComplete === 'function') {
          onComplete();
        }
      }, transitionMs);

      return true;
    };

    const getDirectionForCurrentStep = () => {
      return directionSequence[sequenceIndex % directionSequence.length];
    };

    const getDelayForDirection = (slideDirection) => {
      return slideDirection === -1 ? intervalRtlMs : intervalLtrMs;
    };

    const scheduleNextAutoplay = () => {
      if (slides.length < 2) {
        return;
      }

      const stepDirection = getDirectionForCurrentStep();
      const delayMs = getDelayForDirection(stepDirection);

      stopAutoplay();
      timerId = window.setTimeout(() => {
        const nextIndex = (activeIndex + 1) % slides.length;
        const moved = moveToSlide(nextIndex, stepDirection, () => {
          sequenceIndex = (sequenceIndex + 1) % directionSequence.length;
          scheduleNextAutoplay();
        });

        if (!moved) {
          scheduleNextAutoplay();
        }
      }, delayMs);
    };

    const stopAutoplay = () => {
      if (!timerId) {
        return;
      }
      window.clearTimeout(timerId);
      timerId = null;
    };

    const startAutoplay = () => {
      if (slides.length < 2) {
        return;
      }
      scheduleNextAutoplay();
    };

    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        const forcedDirection = index > activeIndex ? 1 : -1;
        const moved = moveToSlide(index, forcedDirection, () => {
          sequenceIndex = 0;
          scheduleNextAutoplay();
        });

        if (!moved) {
          sequenceIndex = 0;
          scheduleNextAutoplay();
        }
      });
    });

    heroRotator.addEventListener('mouseenter', stopAutoplay);
    heroRotator.addEventListener('mouseleave', startAutoplay);
    heroRotator.addEventListener('focusin', stopAutoplay);
    heroRotator.addEventListener('focusout', (event) => {
      if (!heroRotator.contains(event.relatedTarget)) {
        startAutoplay();
      }
    });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        stopAutoplay();
      } else {
        startAutoplay();
      }
    });

    syncState();
    startAutoplay();
  }

  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const formData = new FormData(contactForm);
      const fullName = (formData.get('fullName') || '').toString().trim();
      const email = (formData.get('email') || '').toString().trim();
      const phone = (formData.get('phone') || '').toString().trim();
      const service = (formData.get('service') || '').toString().trim();
      const message = (formData.get('message') || '').toString().trim();

      const lines = [
        `Name: ${fullName}`,
        `Email: ${email}`,
        `Phone: ${phone}`,
        `Service Needed: ${service}`,
        '',
        'Project Details:',
        message,
      ];

      const subject = encodeURIComponent(`New Inquiry from ${fullName || 'Website Visitor'}`);
      const body = encodeURIComponent(lines.join('\n'));
      const recipient = 'hello@totaltech.com';

      window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
      contactForm.reset();
    });
  }
})();
