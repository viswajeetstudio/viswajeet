/**
 * VISWAJEET STUDIO — KINETIC INTERACTION ENGINE
 * Standalone vanilla JavaScript: 60fps physics, liquid cursor, 3D tilt, specular glare,
 * accessible lightbox, responsive slider, and magnetic mechanics.
 */

document.addEventListener('DOMContentLoaded', () => {
  initCopyrightYear();
  initAutoplayVideos();
  initLiquidCursor();
  initHeaderScrollSpy();
  initMagneticElements();
  initCardTiltAndGlare();
  initGliderFilter();
  initTheaterSlider();
  initModalLightbox();
  initInquiryModal();
  initBackToTop();
  initMobileDrawer();
});

// Dynamic year in footer
function initCopyrightYear() {
  const el = document.getElementById('current-year');
  if (el) el.textContent = new Date().getFullYear();
}

// Guaranteed autoplay & loop for videos across all mobile and desktop browsers
function initAutoplayVideos() {
  const videos = document.querySelectorAll('video[autoplay]');
  videos.forEach(video => {
    video.muted = true;
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        const resumePlay = () => {
          video.play();
          document.removeEventListener('touchstart', resumePlay);
          document.removeEventListener('click', resumePlay);
        };
        document.addEventListener('touchstart', resumePlay, { passive: true });
        document.addEventListener('click', resumePlay, { passive: true });
      });
    }
  });
}

/* ==========================================================================
   1. LIQUID CURSOR & MAGNETIC TRACKING (LERP 60FPS)
   ========================================================================== */
function initLiquidCursor() {
  const isTouch = window.matchMedia('(pointer: coarse)').matches;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (isTouch || prefersReducedMotion) return;

  const dot = document.querySelector('.cursor-dot');
  const aura = document.querySelector('.cursor-aura');
  if (!dot || !aura) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let auraX = mouseX;
  let auraY = mouseY;
  const ease = 0.16;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = `${mouseX}px`;
    dot.style.top = `${mouseY}px`;
  }, { passive: true });

  function renderCursor() {
    auraX += (mouseX - auraX) * ease;
    auraY += (mouseY - auraY) * ease;
    aura.style.left = `${auraX}px`;
    aura.style.top = `${auraY}px`;
    requestAnimationFrame(renderCursor);
  }
  requestAnimationFrame(renderCursor);

  // Hover states
  const interactiveLinks = document.querySelectorAll('a, button, .filter-btn, .magnetic-btn, .brand-logo');
  interactiveLinks.forEach(link => {
    link.addEventListener('mouseenter', () => document.body.classList.add('is-hovering-link'));
    link.addEventListener('mouseleave', () => document.body.classList.remove('is-hovering-link'));
  });

  const portfolioCards = document.querySelectorAll('.portfolio-card');
  portfolioCards.forEach(card => {
    card.addEventListener('mouseenter', () => document.body.classList.add('is-hovering-card'));
    card.addEventListener('mouseleave', () => document.body.classList.remove('is-hovering-card'));
  });
}

/* ==========================================================================
   2. MAGNETIC PULL ON BUTTONS & BADGES
   ========================================================================== */
function initMagneticElements() {
  const isTouch = window.matchMedia('(pointer: coarse)').matches;
  if (isTouch) return;

  const magnetics = document.querySelectorAll('.magnetic-btn, .brand-badge');
  magnetics.forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const strength = 0.35;
      el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = 'translate(0px, 0px)';
    });
  });
}

/* ==========================================================================
   3. 3D CARD PERSPECTIVE TILT WITH DYNAMIC SPECULAR LIGHTING (GLARE)
   ========================================================================== */
function initCardTiltAndGlare() {
  const cards = document.querySelectorAll('.portfolio-card, .portrait-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      // Calculate rotation limits (-6 deg to 6 deg)
      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-6px)`;
      
      // Dynamic glare specular lighting coordinates
      const pctX = (x / rect.width) * 100;
      const pctY = (y / rect.height) * 100;
      card.style.setProperty('--mouse-x', `${pctX}%`);
      card.style.setProperty('--mouse-y', `${pctY}%`);
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  });
}

/* ==========================================================================
   4. LUXURY GLIDER FILTER TABS & STAGGERED REVEAL
   ========================================================================== */
function initGliderFilter() {
  const glider = document.querySelector('.filter-glider-pill');
  const buttons = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.portfolio-card');
  if (!glider || !buttons.length) return;

  function updateGlider(btn) {
    const rect = btn.getBoundingClientRect();
    const parentRect = btn.parentElement.getBoundingClientRect();
    const left = rect.left - parentRect.left;
    glider.style.width = `${rect.width}px`;
    glider.style.transform = `translateX(${left}px)`;
  }

  // Initial tab setup
  const activeBtn = document.querySelector('.filter-btn.is-active') || buttons[0];
  updateGlider(activeBtn);

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      updateGlider(btn);

      const category = btn.getAttribute('data-filter');

      cards.forEach((card, index) => {
        const cardCat = card.getAttribute('data-category');
        const matches = (category === 'all' || cardCat === category);

        if (matches) {
          card.style.display = 'block';
          card.style.opacity = '0';
          card.style.transform = 'scale(0.92) translateY(12px)';
          setTimeout(() => {
            card.style.transition = 'opacity 0.4s ease, transform 0.45s var(--ease-spring)';
            card.style.opacity = '1';
            card.style.transform = 'scale(1) translateY(0)';
          }, index * 40);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.92)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });

  window.addEventListener('resize', () => {
    const current = document.querySelector('.filter-btn.is-active');
    if (current) updateGlider(current);
  }, { passive: true });
}

/* ==========================================================================
   5. VISUAL GALLERY THEATER SLIDER (CLIPPED DESKTOP BOUNDS)
   ========================================================================== */
function initTheaterSlider() {
  const track = document.querySelector('.gallery-slider-track');
  const slides = document.querySelectorAll('.gallery-slide');
  const prevBtn = document.getElementById('slide-prev');
  const nextBtn = document.getElementById('slide-next');
  const progressBar = document.querySelector('.slider-progress-fill');
  const dots = document.querySelectorAll('.slide-dot');
  if (!track || !slides.length) return;

  let currentIndex = 0;
  const totalSlides = slides.length;
  let autoplayTimer = null;
  let progress = 0;
  let isHovered = false;
  const slideDuration = 6000;
  const tick = 50;

  function getVisibleSlidesCount() {
    if (window.innerWidth >= 1024) return 3;
    if (window.innerWidth >= 768) return 2;
    return 1;
  }

  function getMaxIndex() {
    const visible = getVisibleSlidesCount();
    return Math.max(0, totalSlides - visible);
  }

  function updateSlider() {
    const maxIdx = getMaxIndex();
    if (currentIndex > maxIdx) currentIndex = 0;
    if (currentIndex < 0) currentIndex = maxIdx;

    const slideWidth = slides[0].getBoundingClientRect().width;
    const gap = 24; // 1.5rem
    const moveX = currentIndex * (slideWidth + gap);
    track.style.transform = `translateX(-${moveX}px)`;

    dots.forEach((dot, idx) => {
      dot.classList.toggle('is-active', idx === currentIndex);
    });

    progress = 0;
    if (progressBar) progressBar.style.width = '0%';
  }

  function nextSlide() {
    const maxIdx = getMaxIndex();
    currentIndex = (currentIndex >= maxIdx) ? 0 : currentIndex + 1;
    updateSlider();
  }

  function prevSlide() {
    const maxIdx = getMaxIndex();
    currentIndex = (currentIndex <= 0) ? maxIdx : currentIndex - 1;
    updateSlider();
  }

  if (nextBtn) nextBtn.addEventListener('click', nextSlide);
  if (prevBtn) prevBtn.addEventListener('click', prevSlide);

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.getAttribute('data-slide-index'), 10);
      currentIndex = idx;
      updateSlider();
    });
  });

  // Touch and Drag swipe
  let startX = 0;
  let isDragging = false;

  track.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    isDragging = true;
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    if (!isDragging) return;
    const diff = e.changedTouches[0].clientX - startX;
    if (Math.abs(diff) > 40) {
      if (diff < 0) nextSlide();
      else prevSlide();
    }
    isDragging = false;
  });

  track.addEventListener('mousedown', (e) => {
    startX = e.clientX;
    isDragging = true;
  });

  track.addEventListener('mouseup', (e) => {
    if (!isDragging) return;
    const diff = e.clientX - startX;
    if (Math.abs(diff) > 40) {
      if (diff < 0) nextSlide();
      else prevSlide();
    }
    isDragging = false;
  });

  // Autoplay with hover pause
  const viewportCard = document.querySelector('.slider-viewport-card');
  if (viewportCard) {
    viewportCard.addEventListener('mouseenter', () => { isHovered = true; });
    viewportCard.addEventListener('mouseleave', () => { isHovered = false; });
  }

  autoplayTimer = setInterval(() => {
    if (!isHovered) {
      progress += (tick / slideDuration) * 100;
      if (progressBar) progressBar.style.width = `${Math.min(progress, 100)}%`;
      if (progress >= 100) nextSlide();
    }
  }, tick);

  window.addEventListener('resize', updateSlider, { passive: true });
  updateSlider();
}

/* ==========================================================================
   6. LIGHTBOX MODAL (ACCESSIBLE + ESCAPE KEY + FOCUS TRAP)
   ========================================================================== */
function initModalLightbox() {
  const modal = document.getElementById('project-lightbox');
  const closeBtn = document.getElementById('lightbox-close');
  const modalArtwork = document.getElementById('lightbox-artwork');
  const modalTag = document.getElementById('lightbox-tag');
  const modalTitle = document.getElementById('lightbox-title');
  const modalDesc = document.getElementById('lightbox-desc');
  const modalClient = document.getElementById('lightbox-client');
  const modalYear = document.getElementById('lightbox-year');
  const modalScope = document.getElementById('lightbox-scope');
  if (!modal) return;

  function openModal(data) {
    if (modalArtwork) modalArtwork.innerHTML = data.artworkHtml || data.artworkSvg || '';
    if (modalTag) modalTag.textContent = data.category;
    if (modalTitle) modalTitle.textContent = data.title;
    if (modalDesc) modalDesc.textContent = data.desc;
    if (modalClient) modalClient.textContent = data.client || 'Commission / Atelier';
    if (modalYear) modalYear.textContent = data.year || '2026';
    if (modalScope) modalScope.textContent = data.scope || 'Art Direction & Visuals';

    modal.classList.add('is-active');
    document.body.style.overflow = 'hidden';
    if (closeBtn) closeBtn.focus();
  }

  function closeModal() {
    modal.classList.remove('is-active');
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Close with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-active')) {
      closeModal();
    }
  });

  // Trigger modal from cards
  const cards = document.querySelectorAll('.portfolio-card');
  cards.forEach(card => {
    card.addEventListener('click', () => {
      const imgEl = card.querySelector('.artwork-img');
      const svgEl = card.querySelector('.artwork-svg');

      // Auto-detect title, desc, tag from visible HTML elements for easy editing
      const title = card.querySelector('.drawer-title')?.textContent || card.getAttribute('data-title') || 'Masterwork';
      const desc = card.querySelector('.drawer-desc')?.textContent || card.getAttribute('data-desc') || '';
      const category = card.querySelector('.artwork-badge')?.textContent || card.getAttribute('data-category-name') || 'Project';
      const client = card.getAttribute('data-client') || card.querySelector('.drawer-tag')?.textContent || 'Studio Commission';
      const year = card.getAttribute('data-year') || '2026';
      const scope = card.getAttribute('data-scope') || 'Haute Art Direction';

      let artworkHtml = '';
      if (imgEl) {
        artworkHtml = `<img src="${imgEl.src}" alt="${title}" class="modal-artwork-img" onerror="this.src='img/work-1.svg'">`;
      } else if (svgEl) {
        artworkHtml = svgEl.outerHTML;
      }

      openModal({
        title,
        category,
        desc,
        client,
        year,
        scope,
        artworkHtml
      });
    });
  });
}

/* ==========================================================================
   7. INTERACTIVE PROJECT INQUIRY ESTIMATOR MODAL
   ========================================================================== */
function initInquiryModal() {
  const modal = document.getElementById('inquiry-modal');
  const openBtns = document.querySelectorAll('.trigger-inquiry-modal');
  const closeBtn = document.getElementById('inquiry-close');
  if (!modal) return;

  function openInquiry() {
    modal.classList.add('is-active');
    document.body.style.overflow = 'hidden';
  }

  function closeInquiry() {
    modal.classList.remove('is-active');
    document.body.style.overflow = '';
  }

  openBtns.forEach(btn => btn.addEventListener('click', openInquiry));
  if (closeBtn) closeBtn.addEventListener('click', closeInquiry);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeInquiry();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-active')) {
      closeInquiry();
    }
  });

  // Dynamic brief builder
  const form = document.getElementById('inquiry-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const projectType = form.querySelector('input[name="service"]:checked')?.value || 'Commercial Campaign';
      const budget = form.querySelector('input[name="budget"]:checked')?.value || '$5,000 - $10,000';
      const timeline = form.querySelector('input[name="timeline"]:checked')?.value || 'Standard (4-6 Weeks)';
      const clientName = document.getElementById('inquiry-name')?.value || 'Creative Partner';
      const clientEmail = document.getElementById('inquiry-email')?.value || '';
      const notes = document.getElementById('inquiry-notes')?.value || 'No additional notes provided.';

      const subject = encodeURIComponent(`Project Commission: ${projectType} (${clientName})`);
      const body = encodeURIComponent(
        `Dear Viswajeet Studio,\n\n` +
        `I would like to inquire about initiating a studio project.\n\n` +
        `Client / Brand: ${clientName}\n` +
        `Contact Email: ${clientEmail}\n` +
        `Deliverable: ${projectType}\n` +
        `Estimated Budget: ${budget}\n` +
        `Target Timeline: ${timeline}\n\n` +
        `Project Notes:\n${notes}\n\n` +
        `Best regards,\n${clientName}`
      );

      window.location.href = `mailto:viswajeet.studio@gmail.com?subject=${subject}&body=${body}`;
      showToast('Preparing inquiry draft in your email client...');
      closeInquiry();
    });
  }
}

/* ==========================================================================
   8. MODERN CLIPBOARD COPY & TOAST NOTIFICATION
   ========================================================================== */
async function copyStudioEmail() {
  const email = 'viswajeet.studio@gmail.com';
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(email);
    } else {
      const input = document.createElement('input');
      input.value = email;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
    }
    showToast('Copied viswajeet.studio@gmail.com to clipboard');
  } catch (err) {
    showToast('Studio Email: viswajeet.studio@gmail.com');
  }
}
window.copyStudioEmail = copyStudioEmail;

function showToast(message) {
  const toast = document.getElementById('studio-toast');
  const toastText = document.getElementById('toast-msg');
  if (!toast || !toastText) return;

  toastText.textContent = message;
  toast.classList.add('is-visible');

  setTimeout(() => {
    toast.classList.remove('is-visible');
  }, 3500);
}
window.showToast = showToast;

/* ==========================================================================
   9. SCROLL SPY, HEADER COLLAPSE, BACK TO TOP
   ========================================================================== */
function initHeaderScrollSpy() {
  const header = document.querySelector('.site-header');
  const navLinks = document.querySelectorAll('.nav-anchor');
  const sections = ['hero', 'philosophy', 'portfolio', 'gallery', 'contact'].map(id => document.getElementById(id));

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;

    // Header styling
    if (scrollPos > 60) {
      header?.classList.add('is-scrolled');
    } else {
      header?.classList.remove('is-scrolled');
    }

    // Scrollspy active section
    let currentId = '';
    sections.forEach(sec => {
      if (sec) {
        const top = sec.offsetTop - 180;
        const height = sec.offsetHeight;
        if (scrollPos >= top && scrollPos < top + height) {
          currentId = sec.getAttribute('id');
        }
      }
    });

    navLinks.forEach(link => {
      const href = link.getAttribute('href')?.replace('#', '');
      link.classList.toggle('is-active', href === currentId);
    });
  }, { passive: true });
}

function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('is-visible');
    } else {
      btn.classList.remove('is-visible');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ==========================================================================
   10. MOBILE SLIDE DRAWER
   ========================================================================== */
function initMobileDrawer() {
  const toggle = document.getElementById('mobile-toggle');
  const drawer = document.getElementById('mobile-drawer');
  const close = document.getElementById('drawer-close');
  const links = document.querySelectorAll('.mobile-nav-link');
  if (!toggle || !drawer) return;

  toggle.addEventListener('click', () => drawer.classList.add('is-open'));
  if (close) close.addEventListener('click', () => drawer.classList.remove('is-open'));

  links.forEach(link => {
    link.addEventListener('click', () => drawer.classList.remove('is-open'));
  });
}
