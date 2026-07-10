/* ==========================================================================
   THE HOUSE OF AZMANI'S - STOREFRONT PRODUCTS LOGIC
   ========================================================================== */

/* 1. Dynamic Grid Renderer */
async function renderProductGrid(containerId, products, options = {}) {
  const grid = document.getElementById(containerId);
  if (!grid) return;

  grid.innerHTML = '';
  
  if (products.length === 0) {
    grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 4rem 0; color: var(--color-text-muted);">No products found in this category.</div>';
    return;
  }

  const limit = options.limit || products.length;
  const productsToRender = products.slice(0, limit);

  for (const p of productsToRender) {
    const card = document.createElement('div');
    card.className = 'product-card animate-on-scroll';
    
    // Check if new/featured badge needed
    let badgeHtml = '';
    if (options.showBadge) {
      if (p.newArrival) {
        badgeHtml = `<span class="product-card__badge">New</span>`;
      } else if (p.featured) {
        badgeHtml = `<span class="product-card__badge">Featured</span>`;
      }
    }

    // Resolve Image Source
    let mainImgSrc = '';
    if (p.images && p.images.length > 0) {
      const dbImg = await ImageDB.getImage(p.images[0]);
      mainImgSrc = dbImg || `assets/images/categories/${p.category}.jpg`;
    } else {
      mainImgSrc = `assets/images/categories/${p.category}.jpg`;
    }

    card.innerHTML = `
      <div class="product-card__image-wrap" onclick="window.location.href='product.html?id=${p.id}'">
        ${badgeHtml}
        <img class="product-card__image" src="${mainImgSrc}" onerror="this.onerror=null; this.src='data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22400%22 style=%22background:linear-gradient(135deg, %23F5F0E8, %23E8E0D4)%22></svg>';" alt="${p.name}">
        <button class="product-card__quick-view" onclick="event.stopPropagation(); window.location.href='product.html?id=${p.id}'">View Detail</button>
      </div>
      <div class="product-card__info">
        <span class="product-card__category">${p.category.replace('-', ' ')}</span>
        <h3 class="product-card__name" onclick="window.location.href='product.html?id=${p.id}'">${p.name}</h3>
        <span class="product-card__price">${formatPrice(p.price)}</span>
        <button class="btn btn-whatsapp btn-sm btn-block" onclick="openWhatsApp('${p.name.replace(/'/g, "\\'")}', ${p.price})">
          <svg width="16" height="16" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          Enquire on WhatsApp
        </button>
      </div>
    `;

    grid.appendChild(card);
  }

  // Trigger Observer animation reload
  initScrollAnimations();
}

/* 2. Shop Catalog Filtering and Sorting */
function initShopPage() {
  const shopGrid = 'shopGrid';
  const categoryFilters = document.querySelectorAll('input[name="categoryFilter"]');
  const priceMinInput = document.getElementById('priceMin');
  const priceMaxInput = document.getElementById('priceMax');
  const sortSelect = document.getElementById('sortSelect');
  const countDisplay = document.getElementById('productCount');
  const clearBtn = document.getElementById('clearFilters');

  // Load Categories list
  const categoryContainer = document.getElementById('categoryFiltersList');
  if (categoryContainer) {
    categoryContainer.innerHTML = '';
    const cats = DataStore.getCategories();
    cats.forEach(c => {
      const label = document.createElement('label');
      label.className = 'filter-option';
      label.innerHTML = `
        <input type="checkbox" name="categoryFilter" value="${c.slug}">
        <span>${c.name}</span>
      `;
      categoryContainer.appendChild(label);
    });
  }

  // Check URL category params on load
  const initialCategory = getUrlParam('cat');
  const initialFilter = getUrlParam('filter'); // e.g. ?filter=new

  const updatedFilters = document.querySelectorAll('input[name="categoryFilter"]');
  if (initialCategory) {
    updatedFilters.forEach(cb => {
      if (cb.value.toLowerCase() === initialCategory.toLowerCase()) {
        cb.checked = true;
      }
    });
  }

  async function updateShop() {
    // 1. Gather Selected categories
    const selectedCats = [];
    document.querySelectorAll('input[name="categoryFilter"]:checked').forEach(cb => {
      selectedCats.push(cb.value);
    });

    const priceMin = priceMinInput && priceMinInput.value ? parseFloat(priceMinInput.value) : undefined;
    const priceMax = priceMaxInput && priceMaxInput.value ? parseFloat(priceMaxInput.value) : undefined;
    const sortBy = sortSelect ? sortSelect.value : 'newest';

    // 2. Fetch from store
    let products = [];
    if (selectedCats.length > 0) {
      // Fetch for each category and combine
      selectedCats.forEach(c => {
        products = products.concat(DataStore.getProducts({ category: c, active: true }));
      });
    } else {
      products = DataStore.getProducts({ active: true });
    }

    // Apply URL filter "new" or "featured"
    if (initialFilter === 'new') {
      products = products.filter(p => p.newArrival);
    } else if (initialFilter === 'featured') {
      products = products.filter(p => p.featured);
    }

    // Filter by price
    if (priceMin !== undefined) {
      products = products.filter(p => p.price >= priceMin);
    }
    if (priceMax !== undefined) {
      products = products.filter(p => p.price <= priceMax);
    }

    // Sort combined array
    switch (sortBy) {
      case 'price-asc':
        products.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        products.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        products.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'newest':
      default:
        products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
    }

    if (countDisplay) {
      countDisplay.textContent = `${products.length} Products`;
    }

    await renderProductGrid(shopGrid, products, { showBadge: true });
  }

  // Event listeners
  document.addEventListener('change', (e) => {
    if (e.target.name === 'categoryFilter' || e.target === sortSelect) {
      updateShop();
    }
  });

  if (priceMinInput) priceMinInput.addEventListener('input', updateShop);
  if (priceMaxInput) priceMaxInput.addEventListener('input', updateShop);

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      document.querySelectorAll('input[name="categoryFilter"]').forEach(cb => cb.checked = false);
      if (priceMinInput) priceMinInput.value = '';
      if (priceMaxInput) priceMaxInput.value = '';
      if (sortSelect) sortSelect.value = 'newest';
      updateShop();
    });
  }

  // Initial load
  updateShop();
}

/* 3. Product Details Page Builder */
async function initProductDetail() {
  const pid = getUrlParam('id');
  if (!pid) {
    window.location.href = 'shop.html';
    return;
  }

  const p = DataStore.getProduct(pid);
  if (!p) {
    window.location.href = 'shop.html';
    return;
  }

  // 1. Dynamic Breadcrumbs
  const breadcrumb = document.getElementById('productBreadcrumb');
  if (breadcrumb) {
    breadcrumb.innerHTML = `
      <a href="index.html">Home</a> &gt; 
      <a href="category.html?cat=${p.category}">${p.category.toUpperCase()}</a> &gt; 
      <span>${p.name}</span>
    `;
  }

  // Update document title
  document.title = `${p.name} | THE HOUSE OF AZMANI'S`;

  // 2. Load Gallery Images
  const galleryMain = document.getElementById('galleryMainImage');
  const galleryThumbs = document.getElementById('galleryThumbsList');

  let imagesList = [...p.images];
  if (imagesList.length === 0) {
    // Use fallback based on category
    imagesList.push(`assets/images/categories/${p.category}.jpg`);
  }

  if (galleryMain && galleryThumbs) {
    galleryThumbs.innerHTML = '';
    
    for (let i = 0; i < imagesList.length; i++) {
      const src = imagesList[i].startsWith('img_') ? await ImageDB.getImage(imagesList[i]) : imagesList[i];
      
      const thumb = document.createElement('div');
      thumb.className = `gallery-thumb ${i === 0 ? 'active' : ''}`;
      thumb.innerHTML = `<img src="${src}" alt="${p.name} thumbnail ${i+1}">`;
      
      thumb.addEventListener('click', () => {
        document.querySelectorAll('.gallery-thumb').forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
        galleryMain.src = src;
      });
      galleryThumbs.appendChild(thumb);

      if (i === 0) {
        galleryMain.src = src;
      }
    }
  }

  // 3. Hover Zoom Effect
  const zoomWrap = document.querySelector('.gallery-main');
  if (zoomWrap && galleryMain) {
    zoomWrap.addEventListener('mousemove', (e) => {
      const rect = zoomWrap.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      galleryMain.style.transformOrigin = `${x}px ${y}px`;
      galleryMain.style.transform = 'scale(1.5)';
    });

    zoomWrap.addEventListener('mouseleave', () => {
      galleryMain.style.transform = 'scale(1)';
    });
  }

  // 4. Fill text parameters
  const nameEl = document.getElementById('productName');
  const priceEl = document.getElementById('productPrice');
  const descEl = document.getElementById('productDescription');
  const sizeSelector = document.getElementById('sizeSelector');
  const enquiryBtn = document.getElementById('enquiryBtn');

  if (nameEl) nameEl.textContent = p.name;
  if (priceEl) priceEl.textContent = formatPrice(p.price);
  if (descEl) descEl.textContent = p.description;

  // Sizes selector setup
  if (sizeSelector && p.sizes) {
    sizeSelector.innerHTML = '';
    p.sizes.forEach((sz, idx) => {
      const btn = document.createElement('button');
      btn.className = `size-btn ${idx === 0 ? 'active' : ''}`;
      btn.textContent = sz;
      btn.addEventListener('click', () => {
        document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
      sizeSelector.appendChild(btn);
    });
  }

  // Primary CTA click to WhatsApp
  if (enquiryBtn) {
    enquiryBtn.addEventListener('click', () => {
      const activeSizeBtn = document.querySelector('.size-btn.active');
      const sizeStr = activeSizeBtn ? ` (Size: ${activeSizeBtn.textContent})` : '';
      openWhatsApp(`${p.name}${sizeStr}`, p.price);
    });
  }

  // 5. Render Related Products
  const relatedProducts = DataStore.getProducts({ category: p.category, active: true })
                            .filter(prod => prod.id !== p.id);
  await renderProductGrid('relatedGrid', relatedProducts, { showBadge: true, limit: 4 });
}

/* 4. Category-Specific Catalog Listing Page */
async function initCategoryPage() {
  const catSlug = getUrlParam('cat');
  if (!catSlug) {
    window.location.href = 'shop.html';
    return;
  }

  const category = DataStore.getCategoryBySlug(catSlug);
  const catTitle = category ? category.name : catSlug.replace('-', ' ');
  const catDesc = category ? category.description : `Browse our exclusive collection of ${catTitle.toLowerCase()}.`;

  const bannerTitle = document.getElementById('categoryTitle');
  const bannerDesc = document.getElementById('categoryDescription');

  if (bannerTitle) bannerTitle.textContent = catTitle;
  if (bannerDesc) bannerDesc.textContent = catDesc;

  document.title = `${catTitle} | THE HOUSE OF AZMANI'S`;

  // Fetch products
  const products = DataStore.getProducts({ category: catSlug, active: true });
  
  // Render grid
  await renderProductGrid('categoryGrid', products, { showBadge: true });
}
