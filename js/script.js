/**
 * Krishpi Goyal - Personal Portfolio Website Script
 * Interactive features: Theme toggle, mobile drawer, scroll spy, contact form, modal
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Set current copyright year
  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // --------------------------------------------------------------------------
  // 2. Theme Switcher (Dark / Light Mode)
  // --------------------------------------------------------------------------
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const rootHtml = document.documentElement;

  // Retrieve saved preference or default to dark
  const savedTheme = localStorage.getItem('krishpi_portfolio_theme') || 'dark';
  rootHtml.setAttribute('data-theme', savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = rootHtml.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      rootHtml.setAttribute('data-theme', newTheme);
      localStorage.setItem('krishpi_portfolio_theme', newTheme);
      showToast(`Switched to ${newTheme} mode`);
    });
  }

  // --------------------------------------------------------------------------
  // 3. Mobile Navigation Drawer
  // --------------------------------------------------------------------------
  const mobileToggleBtn = document.getElementById('mobileToggleBtn');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (mobileToggleBtn && navMenu) {
    mobileToggleBtn.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      mobileToggleBtn.classList.toggle('open', isOpen);
      mobileToggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close mobile menu when a nav link is clicked
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (navMenu.classList.contains('open')) {
          navMenu.classList.remove('open');
          mobileToggleBtn.classList.remove('open');
          mobileToggleBtn.setAttribute('aria-expanded', 'false');
        }
      });
    });

    // Close mobile menu if clicked outside
    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('open') &&
          !navMenu.contains(e.target) &&
          !mobileToggleBtn.contains(e.target)) {
        navMenu.classList.remove('open');
        mobileToggleBtn.classList.remove('open');
        mobileToggleBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // --------------------------------------------------------------------------
  // 4. Navbar Scroll Effect & Scroll Progress Bar
  // --------------------------------------------------------------------------
  const navbar = document.getElementById('navbar');
  const progressBar = document.getElementById('scrollProgressBar');
  const backToTopBtn = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;

    // Navbar compact effect
    if (navbar) {
      if (scrollPos > 40) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    // Progress bar width
    if (progressBar && docHeight > 0) {
      const progressPercent = (scrollPos / docHeight) * 100;
      progressBar.style.width = `${progressPercent}%`;
    }

    // Back to top button visibility
    if (backToTopBtn) {
      if (scrollPos > 350) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  }, { passive: true });

  // Smooth scroll back to top
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // --------------------------------------------------------------------------
  // 5. ScrollSpy - Active Navigation Link Highlighting
  // --------------------------------------------------------------------------
  const sections = document.querySelectorAll('section[id]');

  const updateActiveNavLink = () => {
    const scrollY = window.pageYOffset;
    const windowHeight = window.innerHeight;
    const docHeight = document.documentElement.scrollHeight;

    // If reached bottom of document, activate the last nav link (#contact)
    if (scrollY + windowHeight >= docHeight - 60) {
      navLinks.forEach(link => {
        if (link.getAttribute('href') === '#contact') {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
      return;
    }

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 140;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', updateActiveNavLink, { passive: true });
  updateActiveNavLink(); // Initial call

  // --------------------------------------------------------------------------
  // 6. Interactive Contact Form Submission Preview
  // --------------------------------------------------------------------------
  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('name');
      const emailInput = document.getElementById('email');
      const subjectInput = document.getElementById('subject');
      const messageInput = document.getElementById('message');

      // Validation
      if (!nameInput.value.trim()) {
        showToast('Please enter your name.', true);
        nameInput.focus();
        return;
      }

      if (!emailInput.value.trim() || !isValidEmail(emailInput.value)) {
        showToast('Please enter a valid email address.', true);
        emailInput.focus();
        return;
      }

      if (!subjectInput.value.trim()) {
        showToast('Please enter a subject.', true);
        subjectInput.focus();
        return;
      }

      if (!messageInput.value.trim()) {
        showToast('Please enter your message.', true);
        messageInput.focus();
        return;
      }

      // Success feedback (Client-side simulation)
      const senderName = nameInput.value.trim();
      showToast(`Thank you, ${senderName}! Message preview received successfully.`);
      contactForm.reset();
    });
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // --------------------------------------------------------------------------
  // 7. Toast Notification Handler
  // --------------------------------------------------------------------------
  const toastEl = document.getElementById('toastNotification');
  const toastMsgEl = document.getElementById('toastMessage');
  let toastTimer = null;

  function showToast(message, isError = false) {
    if (!toastEl || !toastMsgEl) return;

    toastMsgEl.textContent = message;
    if (isError) {
      toastEl.style.borderColor = '#ef4444';
    } else {
      toastEl.style.borderColor = 'var(--border-highlight)';
    }

    toastEl.classList.add('active');

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastEl.classList.remove('active');
    }, 3500);
  }

  // --------------------------------------------------------------------------
  // 8. "How to Edit" Guidance Modal
  // --------------------------------------------------------------------------
  const guideModal = document.getElementById('guideModal');
  const openGuideBtn = document.getElementById('openGuideBtn');
  const closeGuideBtn = document.getElementById('closeGuideBtn');
  const modalDismissBtn = document.getElementById('modalDismissBtn');

  const openModal = () => {
    if (guideModal) {
      guideModal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  };

  const closeModal = () => {
    if (guideModal) {
      guideModal.classList.remove('open');
      document.body.style.overflow = '';
    }
  };

  if (openGuideBtn) openGuideBtn.addEventListener('click', openModal);
  if (closeGuideBtn) closeGuideBtn.addEventListener('click', closeModal);
  if (modalDismissBtn) modalDismissBtn.addEventListener('click', closeModal);

  if (guideModal) {
    guideModal.addEventListener('click', (e) => {
      if (e.target === guideModal) {
        closeModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && guideModal && guideModal.classList.contains('open')) {
      closeModal();
    }
  });
});
