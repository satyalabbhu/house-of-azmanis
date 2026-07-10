/* ==========================================================================
   THE HOUSE OF AZMANI'S - STOREFRONT MAIN JS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function() {
  // Common UI setups
  initHeader();
  initHeroSlider();
  initScrollAnimations();
  initSearch();
  initAccordions();
  lazyLoadImages();
});

/* Helper: Currency Formatting */
function formatPrice(number) {
  return '₹' + parseInt(number).toLocaleString('en-IN');
}

/* Helper: Read URL Query Parameter */
function getUrlParam(name) {
  const results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
  return results ? decodeURIComponent(results[1]) : null;
}

/* 1. Header Sticky & Mobile Menu Setup */
function initHeader() {
  const header = document.getElementById('siteHeader');
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileMenuClose = document.getElementById('mobileMenuClose');

  if (header) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  if (hamburgerBtn && mobileMenu) {
    hamburgerBtn.addEventListener('click', () => {
      mobileMenu.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  }

  if (mobileMenuClose && mobileMenu) {
    mobileMenuClose.addEventListener('click', () => {
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
  }
}

/* 2. Hero Image Crossfade Carousel */
function initHeroSlider() {
  const slider = document.querySelector('.hero-slider');
  if (!slider) return;

  const slides = slider.querySelectorAll('.hero-slide');
  const dotsContainer = slider.querySelector('.hero-dots');
  if (slides.length <= 1) return;

  let currentSlideIdx = 0;
  let slideInterval = null;

  // Render Dot Navs
  dotsContainer.innerHTML = '';
  slides.forEach((_, idx) => {
    const dot = document.createElement('div');
    dot.className = `hero-dot ${idx === 0 ? 'active' : ''}`;
    dot.addEventListener('click', () => {
      goToSlide(idx);
      resetSlideInterval();
    });
    dotsContainer.appendChild(dot);
  });

  const dots = dotsContainer.querySelectorAll('.hero-dot');

  function goToSlide(idx) {
    slides[currentSlideIdx].classList.remove('active');
    dots[currentSlideIdx].classList.remove('active');
    
    currentSlideIdx = (idx + slides.length) % slides.length;
    
    slides[currentSlideIdx].classList.add('active');
    dots[currentSlideIdx].classList.add('active');
  }

  function nextSlide() {
    goToSlide(currentSlideIdx + 1);
  }

  function startSlideInterval() {
    slideInterval = setInterval(nextSlide, 5000);
  }

  function resetSlideInterval() {
    clearInterval(slideInterval);
    startSlideInterval();
  }

  startSlideInterval();
}

/* 3. Product Search Box Setup */
function initSearch() {
  const searchToggle = document.getElementById('searchToggle');
  const searchModal = document.getElementById('searchModal');
  const searchClose = document.getElementById('searchClose');
  const searchInput = document.getElementById('searchInput');
  const searchResults = document.getElementById('searchResults');

  if (!searchToggle || !searchModal) return;

  searchToggle.addEventListener('click', () => {
    searchModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    setTimeout(() => searchInput.focus(), 300);
  });

  const closeModal = () => {
    searchModal.classList.remove('active');
    document.body.style.overflow = '';
    searchInput.value = '';
    searchResults.innerHTML = '';
  };

  if (searchClose) searchClose.addEventListener('click', closeModal);
  searchModal.addEventListener('click', (e) => {
    if (e.target === searchModal) closeModal();
  });

  // ESC Close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && searchModal.classList.contains('active')) {
      closeModal();
    }
  });

  // Debounced input search
  let timer = null;
  searchInput.addEventListener('input', () => {
    clearTimeout(timer);
    timer = setTimeout(async () => {
      const q = searchInput.value.trim();
      if (q.length < 2) {
        searchResults.innerHTML = '';
        return;
      }

      const products = DataStore.getProducts({ search: q, active: true });
      searchResults.innerHTML = '';

      if (products.length === 0) {
        searchResults.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 2rem; color: var(--color-text-muted);">No products found matching your query.</div>';
        return;
      }

      for (const p of products) {
        const item = document.createElement('a');
        item.href = `product.html?id=${p.id}`;
        item.className = 'search-result-item';

        // Load image
        let imgSrc = 'css/style.css'; // fallback placeholder CSS
        if (p.images && p.images.length > 0) {
          const storedImg = await ImageDB.getImage(p.images[0]);
          if (storedImg) {
            imgSrc = storedImg;
          }
        } else {
          // Default fallbacks from assets
          imgSrc = `assets/images/categories/${p.category}.jpg`;
        }

        item.innerHTML = `
          <img src="${imgSrc}" onerror="this.onerror=null; this.src='data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2260%22 height=%2280%22 style=%22background:%23F5F0E8%22></svg>';" alt="${p.name}">
          <div class="search-result-info">
            <span class="search-result-name">${p.name}</span>
            <span class="search-result-price">${formatPrice(p.price)}</span>
          </div>
        `;
        searchResults.appendChild(item);
      }
    }, 300);
  });
}

/* 4. IntersectionObserver Scroll Animations */
function initScrollAnimations() {
  const animatedEls = document.querySelectorAll('.animate-on-scroll');
  if (animatedEls.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15
  });

  animatedEls.forEach(el => observer.observe(el));
}

/* 5. Product Accordions (Description, Sizes, Shipping) */
function initAccordions() {
  const accordions = document.querySelectorAll('.accordion-header');
  accordions.forEach(header => {
    header.addEventListener('click', () => {
      const parent = header.parentElement;
      parent.classList.toggle('active');
    });
  });
}

/* 6. Client-side Toast System */
function showToast(message, type = 'success') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  const icon = type === 'success' ? 
    `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>` : 
    `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;

  toast.innerHTML = `
    ${icon}
    <span>${message}</span>
  `;

  container.appendChild(toast);
  
  // Animate in
  setTimeout(() => toast.classList.add('show'), 50);

  // Animate out
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

/* 7. WhatsApp Contact Form Link Pre-filler */
function openWhatsApp(productName, price) {
  const encodedName = encodeURIComponent(productName);
  const formattedPrice = formatPrice(price);
  const text = encodeURIComponent(`Hello! I'm interested in buying your product: ${productName} (${formattedPrice}). Can you please share more details?`);
  const whatsappUrl = `https://api.whatsapp.com/send?phone=919889844494&text=${text}`;
  window.open(whatsappUrl, '_blank');
}

/* 8. Lazy Load Images via intersection observer */
function lazyLoadImages() {
  const lazyImages = document.querySelectorAll('img[data-src]');
  if ('IntersectionObserver' in window) {
    const imgObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          imgObserver.unobserve(img);
        }
      });
    });
    lazyImages.forEach(img => imgObserver.observe(img));
  } else {
    // Fallback
    lazyImages.forEach(img => {
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
    });
  }
}
