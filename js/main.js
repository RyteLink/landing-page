/**
 * RyteLink Landing Page Interactive Controller
 * Handles Calculator, FAQ Accordions, Mobile Navigation, and Forms
 */

document.addEventListener('DOMContentLoaded', () => {
  initCalculator();
  initFaqAccordion();
  initMobileNav();
  initHeaderScroll();
  initFooterYear();
  initLazySections();
  initLegalToc();
  suppressNetlifyBadge();
});

/* ==========================================================================
   1. Interactive Savings & Investment Calculator
   - Minimum: ₦5,000
   - Maximum: ₦10,000,000
   - Upfront Interest: Paid and withdrawable immediately to Nigerian banks
   - Capital Return: Available in 3 months at maturity
   ========================================================================== */
function initCalculator() {
  const slider = document.getElementById('investmentAmount');
  const amountDisplay = document.getElementById('amountDisplay');
  const upfrontInterestDisplay = document.getElementById('upfrontInterestDisplay');
  const principalDisplay = document.getElementById('principalDisplay');
  const maturityPeriodDisplay = document.getElementById('maturityPeriodDisplay');
  const capitalReturnDisplay = document.getElementById('capitalReturnDisplay');
  const totalReturnDisplay = document.getElementById('totalReturnDisplay');

  const presetButtons = document.querySelectorAll('.preset-btn');
  const tenureButtons = document.querySelectorAll('.tenure-btn');

  let currentAmount = 500000;
  let currentMonths = 3;
  let currentRate = 0.10; // 10% upfront for 3 months only

  function formatNaira(num) {
    const isWhole = Number(num) % 1 === 0;
    return '₦' + Number(num).toLocaleString('en-NG', {
      minimumFractionDigits: isWhole ? 0 : 2,
      maximumFractionDigits: 2
    });
  }

  function updateCalculations() {
    // Upfront interest payout (10% upfront for 3 months)
    const upfrontInterest = currentAmount * currentRate;
    const capitalReturn = currentAmount;
    const totalReturn = capitalReturn + upfrontInterest;

    // Update UI elements
    amountDisplay.textContent = '₦' + Number(currentAmount).toLocaleString('en-NG');
    upfrontInterestDisplay.textContent = formatNaira(upfrontInterest);
    principalDisplay.textContent = formatNaira(currentAmount);
    capitalReturnDisplay.textContent = formatNaira(capitalReturn);
    totalReturnDisplay.textContent = formatNaira(totalReturn);
    maturityPeriodDisplay.textContent = '3 Months (90 Days)';
  }

  // Slider change
  if (slider) {
    slider.addEventListener('input', (e) => {
      currentAmount = parseInt(e.target.value, 10);
      
      // Update active preset button highlight
      presetButtons.forEach(btn => {
        if (parseInt(btn.getAttribute('data-val'), 10) === currentAmount) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });

      updateCalculations();
    });
  }

  // Preset buttons
  presetButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      presetButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      currentAmount = parseInt(btn.getAttribute('data-val'), 10);
      if (slider) slider.value = currentAmount;
      updateCalculations();
    });
  });

  // Tenure buttons (3 Months @ 10%)
  tenureButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tenureButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      currentMonths = parseInt(btn.getAttribute('data-months'), 10) || 3;
      currentRate = parseFloat(btn.getAttribute('data-rate')) || 0.10;
      updateCalculations();
    });
  });

  // Initial run
  updateCalculations();
}

/* ==========================================================================
   2. FAQ Accordion
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    if (!questionBtn || !answer) return;

    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all other accordions
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const otherBtn = otherItem.querySelector('.faq-question');
          const otherAns = otherItem.querySelector('.faq-answer');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
          if (otherAns) otherAns.style.maxHeight = null;
        }
      });

      // Toggle current
      if (isActive) {
        item.classList.remove('active');
        questionBtn.setAttribute('aria-expanded', 'false');
        answer.style.maxHeight = null;
      } else {
        item.classList.add('active');
        questionBtn.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = answer.scrollHeight + 30 + 'px';
      }
    });
  });
}

/* ==========================================================================
   3. Mobile Navigation Menu
   ========================================================================== */
function initMobileNav() {
  const toggleBtn = document.getElementById('mobileToggle');
  const navLinks = document.querySelector('.nav-links');

  if (toggleBtn && navLinks) {
    toggleBtn.addEventListener('click', () => {
      const isOpen = navLinks.classList.contains('active');
      navLinks.classList.toggle('active');
      toggleBtn.setAttribute('aria-expanded', !isOpen);
    });

    // Close when clicking any nav link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        toggleBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }
}

/* ==========================================================================
   4. Sticky Header Blur & Shadow on Scroll
   ========================================================================== */
function initHeaderScroll() {
  const header = document.getElementById('header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

/* ==========================================================================
   5. Direct App Link Sender
   ========================================================================== */
function handleSendApplink() {
  const input = document.getElementById('phoneOrEmailInput');
  const feedback = document.getElementById('linkFeedback');

  if (!input || !feedback) return;
  const value = input.value.trim();

  if (value) {
    feedback.textContent = `✓ App download link dispatched to ${value}! Check your notifications.`;
    feedback.style.color = '#FFFFFF';
    input.value = '';

    setTimeout(() => {
      feedback.textContent = '';
    }, 6000);
  }
}

/* ==========================================================================
   6. Contact Concierge Form
   ========================================================================== */
function handleContactSubmit() {
  const feedback = document.getElementById('contactFeedback');
  const form = document.getElementById('inquiryForm');

  if (!feedback) return;
  feedback.textContent = '✓ Thank you! A RyteLink Trade Specialist has received your inquiry and will reach out shortly.';
  
  if (form) {
    form.reset();
  }

  setTimeout(() => {
    feedback.textContent = '';
  }, 7000);
}

/* ==========================================================================
   7. Auto-update Current Year
   ========================================================================== */
function initFooterYear() {
  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

/* ==========================================================================
   8. Section Lazy Loading (IntersectionObserver)
   ========================================================================== */
function initLazySections() {
  const sections = document.querySelectorAll('.lazy-section');
  if (!sections.length) return;

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-loaded');
          obs.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.08
    });

    sections.forEach(sec => observer.observe(sec));
  } else {
    // Fallback if IntersectionObserver is not supported
    sections.forEach(sec => sec.classList.add('is-loaded'));
  }
}

/* ==========================================================================
   9. Legal Document Table of Contents ScrollSpy
   ========================================================================== */
function initLegalToc() {
  const tocLinks = document.querySelectorAll('.legal-toc-link');
  const sections = document.querySelectorAll('.legal-section');
  if (!tocLinks.length || !sections.length) return;

  function onScroll() {
    let currentId = '';
    const scrollPos = window.scrollY + 130;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = sec.getAttribute('id');
      }
    });

    if (currentId) {
      tocLinks.forEach(link => {
        if (link.getAttribute('href') === '#' + currentId) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ==========================================================================
   10. Suppress / Remove Injected Netlify Badge & Drawer Overlays
   ========================================================================== */
function suppressNetlifyBadge() {
  const selector = [
    '#netlify-drawer',
    '#netlify-drawer-iframe',
    '[data-netlify-drawer]',
    '.netlify-badge',
    '.netlify-drawer',
    'iframe[src*="netlify.com"]',
    'iframe[src*="netlify-drawer"]',
    'iframe[id*="netlify"]',
    'div[class*="netlify-drawer"]',
    'div[id*="netlify-drawer"]',
    'div[id*="netlify-badge"]',
    'a[href*="netlify.com"][class*="badge"]',
    '[class*="netlify-feedback"]'
  ].join(', ');

  function purge() {
    try {
      const items = document.querySelectorAll(selector);
      items.forEach(el => {
        el.style.display = 'none';
        el.remove();
      });
    } catch (_) {}
  }

  purge();

  if (typeof MutationObserver !== 'undefined' && document.body) {
    const observer = new MutationObserver(() => purge());
    observer.observe(document.body, { childList: true, subtree: true });
  }
}

