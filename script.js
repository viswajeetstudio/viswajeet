    tailwind.config = {
      theme: {
        extend: {
          colors: {
            brand: {
              yellow: '#F3B429',
              gold: '#D97706',
              amber: '#F59E0B',
              warm: '#F7BC36',
              lightYellow: '#FEF9EE',
              dark: '#0B0F19',
              charcoal: '#151C28',
              muted: '#64748B',
              cream: '#FAFAF7',
              border: '#E8E8E2'
            }
          },
          fontFamily: {
            serif: ['"Cormorant Garamond"', 'serif'],
            sans: ['"Plus Jakarta Sans"', 'sans-serif'],
          },
          boxShadow: {
            'luxury': '0 25px 50px -12px rgba(243, 180, 41, 0.35)',
            'card-elevated': '0 25px 60px -15px rgba(11, 15, 25, 0.08)',
            'glow-amber': '0 0 35px rgba(243, 180, 41, 0.45)',
            'nav-floating': '0 20px 40px -15px rgba(11, 15, 25, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.8) inset',
            'pill-active': '0 10px 25px -5px rgba(11, 15, 25, 0.3), 0 0 20px rgba(243, 180, 41, 0.25)'
          }
        }
      }
    }



    document.addEventListener("DOMContentLoaded", () => {
      lucide.createIcons();
      document.getElementById('current-year').textContent = new Date().getFullYear();
      initNavInteractions();
      initFilterGlider();
      initShowcaseSlider();
      initScrollInteractions();
    });

    // Custom Cursor Dot and Outline Tracking
    const cursorDot = document.getElementById('cursor-dot');
    const cursorOutline = document.getElementById('cursor-outline');

    window.addEventListener('mousemove', (e) => {
      const posX = e.clientX;
      const posY = e.clientY;
      
      if (cursorDot && cursorOutline) {
        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;
        
        cursorOutline.animate({
          left: `${posX}px`,
          top: `${posY}px`
        }, { duration: 350, fill: "forwards" });
      }
    });

    // Mobile Menu Drawer
    const mobileToggle = document.getElementById('mobile-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    mobileToggle.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
      });
    });

    // Top Navigation Kinetic Scroll Spy and Click State
    function initNavInteractions() {
      const navLinks = document.querySelectorAll('#desktop-nav .nav-link');
      const sections = ['hero', 'philosophy', 'portfolio', 'showcase', 'contact'].map(id => document.getElementById(id));

      window.addEventListener('scroll', () => {
        let currentSectionId = '';
        const scrollPosition = window.scrollY + 200;

        sections.forEach(section => {
          if (section) {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            if (scrollPosition >= top && scrollPosition < top + height) {
              currentSectionId = section.getAttribute('id');
            }
          }
        });

        navLinks.forEach(link => {
          const href = link.getAttribute('href').replace('#', '');
          if (href === currentSectionId) {
            link.classList.add('active', 'text-brand-dark');
          } else {
            link.classList.remove('active');
          }
        });
      }, { passive: true });
    }

    // Animated Sliding Glider Filter Tabs
    function initFilterGlider() {
      const glider = document.getElementById('filter-glider');
      const buttons = document.querySelectorAll('.filter-tab-btn');
      const container = document.getElementById('portfolio-tabs-container');
      const portfolioCards = document.querySelectorAll('.portfolio-card');

      if (!glider || !buttons.length || !container) return;

      function updateGliderPosition(activeBtn) {
        const btnRect = activeBtn.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        const left = btnRect.left - containerRect.left + container.scrollLeft;

        glider.style.width = `${btnRect.width}px`;
        glider.style.transform = `translateX(${left - 6}px)`;
      }

      // Initial alignment on active tab
      const initialActive = document.querySelector('.filter-tab-btn.is-active') || buttons[0];
      updateGliderPosition(initialActive);

      buttons.forEach(button => {
        button.addEventListener('click', () => {
          // Tab button states
          buttons.forEach(btn => {
            btn.classList.remove('is-active', 'text-white');
            btn.classList.add('text-brand-muted');
            const countBadge = btn.querySelector('.badge-count');
            if (countBadge) {
              countBadge.classList.remove('bg-brand-yellow', 'text-brand-dark');
              countBadge.classList.add('bg-black/5', 'text-brand-muted');
            }
          });

          button.classList.add('is-active', 'text-white');
          button.classList.remove('text-brand-muted');
          const countBadge = button.querySelector('.badge-count');
          if (countBadge) {
            countBadge.classList.add('bg-brand-yellow', 'text-brand-dark');
            countBadge.classList.remove('bg-black/5', 'text-brand-muted');
          }

          updateGliderPosition(button);

          // Filtering Cards
          const category = button.getAttribute('data-category');

          portfolioCards.forEach(card => {
            const cardCat = card.getAttribute('data-category');
            if (category === 'all' || cardCat === category) {
              card.classList.remove('hidden');
              card.style.opacity = '0';
              card.style.transform = 'scale(0.96)';
              setTimeout(() => {
                card.style.transition = 'all 0.4s ease';
                card.style.opacity = '1';
                card.style.transform = 'scale(1)';
              }, 30);
            } else {
              card.classList.add('hidden');
            }
          });
        });
      });

      window.addEventListener('resize', () => {
        const activeBtn = document.querySelector('.filter-tab-btn.is-active');
        if (activeBtn) updateGliderPosition(activeBtn);
      });
    }

    // 3D Card Hover Tilt
    const portfolioCards = document.querySelectorAll('.portfolio-card');
    portfolioCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * -5;
        const rotateY = ((x - centerX) / centerX) * 5;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
      });

      card.addEventListener('click', () => {
        openModal({
          title: card.getAttribute('data-title'),
          tag: card.getAttribute('data-tag'),
          desc: card.getAttribute('data-desc'),
          img: card.getAttribute('data-img')
        });
      });
    });

    // Lightbox Modal System
    const modal = document.getElementById('project-modal');
    const modalContainer = document.getElementById('modal-container');
    const modalImg = document.getElementById('modal-img');
    const modalTitle = document.getElementById('modal-title');
    const modalTag = document.getElementById('modal-tag');
    const modalDesc = document.getElementById('modal-desc');

    function openModal(data) {
      modalImg.src = data.img;
      modalTitle.textContent = data.title;
      modalTag.textContent = data.tag;
      modalDesc.textContent = data.desc;

      modal.classList.remove('hidden');
      modal.classList.add('flex');
      
      setTimeout(() => {
        modal.classList.remove('opacity-0');
        modalContainer.classList.remove('scale-100');
        modalContainer.classList.add('scale-100');
      }, 10);
    }

    function closeModal() {
      modal.classList.add('opacity-0');
      modalContainer.classList.remove('scale-100');
      modalContainer.classList.add('scale-95');
      setTimeout(() => {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
      }, 300);
    }

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });

    // Copy Email to Clipboard
    function copyEmailToClipboard() {
      const email = 'viswajeet.studio@gmail.com';
      const tempInput = document.createElement('input');
      tempInput.value = email;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand('copy');
      document.body.removeChild(tempInput);

      showToast('Copied viswajeet.studio@gmail.com to clipboard');
    }

    function showToast(message) {
      const toast = document.getElementById('toast');
      const toastMsg = document.getElementById('toast-message');
      toastMsg.textContent = message;

      toast.classList.remove('translate-y-24', 'opacity-0');
      toast.classList.add('translate-y-0', 'opacity-100');

      setTimeout(() => {
        toast.classList.add('translate-y-24', 'opacity-0');
        toast.classList.remove('translate-y-0', 'opacity-100');
      }, 3200);
    }

    // Scroll to Top & Header Background Control
    function initScrollInteractions() {
      const btt = document.getElementById('back-to-top');
      window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
          btt.classList.remove('opacity-0', 'translate-y-4', 'pointer-events-none');
          btt.classList.add('opacity-100', 'translate-y-0');
        } else {
          btt.classList.add('opacity-0', 'translate-y-4', 'pointer-events-none');
          btt.classList.remove('opacity-100', 'translate-y-0');
        }
      });

      btt.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    // 4:5 ASPECT RATIO SHOWCASE SLIDER
    function initShowcaseSlider() {
      const track = document.getElementById('showcase-track');
      const slides = document.querySelectorAll('.showcase-slide');
      const prevBtn = document.getElementById('showcase-prev');
      const nextBtn = document.getElementById('showcase-next');
      const dots = document.querySelectorAll('.showcase-dot');
      const viewport = document.getElementById('showcase-viewport');
      const progressBar = document.getElementById('showcase-progress');
      const card = document.getElementById('showcase-card');

      if (!track || !slides.length || !prevBtn || !nextBtn) return;

      const totalSlides = slides.length;
      let currentIndex = 0;
      let startX = 0;
      let isDragging = false;
      let progress = 0;
      const slideDuration = 5500;
      const stepInterval = 50;
      let intervalTimer = null;
      let isHovered = false;

      function getSlideWidth() {
        const slide = slides[0];
        const computedStyle = window.getComputedStyle(track);
        const gap = parseFloat(computedStyle.columnGap || computedStyle.gap || 16);
        return slide.getBoundingClientRect().width + gap;
      }

      function updateSlider(index) {
        currentIndex = (index + totalSlides) % totalSlides;
        const slideWidth = getSlideWidth();
        track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;

        dots.forEach((dot, idx) => {
          if (idx === currentIndex) {
            dot.classList.remove('w-2', 'bg-white/25');
            dot.classList.add('w-9', 'bg-brand-yellow');
          } else {
            dot.classList.remove('w-9', 'bg-brand-yellow');
            dot.classList.add('w-2', 'bg-white/25');
          }
        });

        progress = 0;
        if (progressBar) progressBar.style.width = '0%';
      }

      function nextSlide() {
        updateSlider(currentIndex + 1);
      }

      function prevSlide() {
        updateSlider(currentIndex - 1);
      }

      prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        prevSlide();
      });
      nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        nextSlide();
      });

      dots.forEach(dot => {
        dot.addEventListener('click', () => {
          const slideIdx = parseInt(dot.getAttribute('data-slide'), 10);
          updateSlider(slideIdx);
        });
      });

      window.addEventListener('resize', () => {
        updateSlider(currentIndex);
      });

      // Touch & Drag Handling
      viewport.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
      }, { passive: true });

      viewport.addEventListener('touchend', (e) => {
        if (!isDragging) return;
        const diffX = e.changedTouches[0].clientX - startX;
        if (Math.abs(diffX) > 40) {
          if (diffX < 0) nextSlide();
          else prevSlide();
        }
        isDragging = false;
      });

      viewport.addEventListener('mousedown', (e) => {
        startX = e.clientX;
        isDragging = true;
      });

      window.addEventListener('mouseup', (e) => {
        if (!isDragging) return;
        const diffX = e.clientX - startX;
        if (Math.abs(diffX) > 40) {
          if (diffX < 0) nextSlide();
          else prevSlide();
        }
        isDragging = false;
      });

      card.addEventListener('mouseenter', () => { isHovered = true; });
      card.addEventListener('mouseleave', () => { isHovered = false; });

      intervalTimer = setInterval(() => {
        if (!isHovered) {
          progress += (stepInterval / slideDuration) * 100;
          if (progressBar) progressBar.style.width = `${Math.min(progress, 100)}%`;

          if (progress >= 100) {
            nextSlide();
          }
        }
      }, stepInterval);

      updateSlider(0);
    }









