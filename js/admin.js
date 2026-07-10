/* ==========================================================================
   THE HOUSE OF AZMANI'S - ADMIN MANAGEMENT LOGIC
   ========================================================================== */

// Global Temp Image storage for form upload workflow
let tempFormImages = [];

/* 1. Admin Authentication Manager */
class AdminAuth {
  static passwordKey = 'Azmani's_admin_auth';
  static defaultPass = 'admin123';

  static login(password) {
    if (password === this.defaultPass) {
      localStorage.setItem(this.passwordKey, 'true');
      return true;
    }
    return false;
  }

  static logout() {
    localStorage.removeItem(this.passwordKey);
    window.location.href = 'index.html';
  }

  static isLoggedIn() {
    return localStorage.getItem(this.passwordKey) === 'true';
  }

  static checkAuth() {
    if (!this.isLoggedIn()) {
      // Redirect to login if path matches
      const currentLoc = window.location.pathname;
      if (!currentLoc.includes('admin/index.html')) {
        window.location.href = 'index.html';
      }
    }
  }
}

// Global Header & Sidebar rendering helper
function renderAdminSidebar() {
  const sidebar = document.getElementById('adminSidebar');
  if (!sidebar) return;

  const currentPath = window.location.pathname;
  let activePage = 'dashboard';
  if (currentPath.includes('products.html') || currentPath.includes('product-form.html')) {
    activePage = 'products';
  } else if (currentPath.includes('categories.html')) {
    activePage = 'categories';
  }

  sidebar.innerHTML = `
    <div class="admin-sidebar__logo">
      <h2 style="font-family: 'Playfair Display', serif; color: #D4A843; font-size: 1.15rem; letter-spacing: 2px;">THE HOUSE OF AZMANI'S</h2>
      <p style="font-family: 'Great Vibes', cursive; color: #D4A843; font-size: 0.85rem; margin-top: 2px;">Admin Panel</p>
    </div>
    <nav class="admin-sidebar__nav">
      <a href="dashboard.html" class="admin-sidebar__link ${activePage === 'dashboard' ? 'active' : ''}">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
        Dashboard
      </a>
      <a href="products.html" class="admin-sidebar__link ${activePage === 'products' ? 'active' : ''}">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
        Products
      </a>
      <a href="categories.html" class="admin-sidebar__link ${activePage === 'categories' ? 'active' : ''}">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
        Categories
      </a>
      <div style="border-top: 1px solid rgba(255,255,255,0.06); margin: 1.5rem 0;"></div>
      <a href="../index.html" class="admin-sidebar__link">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
        View Store
      </a>
      <a href="#" class="admin-sidebar__link" id="logoutLink">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
        Logout
      </a>
    </nav>
  `;

  // Attach logout handler
  document.getElementById('logoutLink').addEventListener('click', (e) => {
    e.preventDefault();
    AdminAuth.logout();
  });
}

/* 2. Login Page UI Logic */
function initAdminLogin() {
  const form = document.getElementById('loginForm');
  const passField = document.getElementById('adminPassword');
  const togglePass = document.getElementById('togglePassword');
  const errorMsg = document.getElementById('loginError');

  if (!form) return;

  if (togglePass && passField) {
    togglePass.addEventListener('click', () => {
      const isPass = passField.type === 'password';
      passField.type = isPass ? 'text' : 'password';
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const isSuccess = AdminAuth.login(passField.value);
    if (isSuccess) {
      window.location.href = 'dashboard.html';
    } else {
      errorMsg.style.display = 'block';
      passField.classList.add('error-shake');
      setTimeout(() => passField.classList.remove('error-shake'), 500);
    }
  });
}

/* 3. Dashboard UI Logic */
async function initAdminDashboard() {
  // Update Stats Cards
  const stats = DataStore.getStats();
  const els = {
    totalProducts: document.getElementById('statTotalProducts'),
    activeProducts: document.getElementById('statActiveProducts'),
    totalCategories: document.getElementById('statTotalCategories'),
    featuredProducts: document.getElementById('statFeaturedProducts')
  };

  if (els.totalProducts) els.totalProducts.textContent = stats.totalProducts;
  if (els.activeProducts) els.activeProducts.textContent = stats.activeProducts;
  if (els.totalCategories) els.totalCategories.textContent = stats.totalCategories;
  if (els.featuredProducts) els.featuredProducts.textContent = stats.featuredProducts;

  // Render recent products list
  const recentProducts = DataStore.getProducts().slice(0, 5);
  const tbody = document.getElementById('recentProductsTableBody');
  if (tbody) {
    tbody.innerHTML = '';
    
    for (const p of recentProducts) {
      const tr = document.createElement('tr');
      
      let imgSrc = '';
      if (p.images && p.images.length > 0) {
        const stored = await ImageDB.getImage(p.images[0]);
        imgSrc = stored || `../assets/images/categories/${p.category}.jpg`;
      } else {
        imgSrc = `../assets/images/categories/${p.category}.jpg`;
      }

      tr.innerHTML = `
        <td><img class="product-thumb" src="${imgSrc}" alt="${p.name}"></td>
        <td><strong>${p.name}</strong></td>
        <td>${p.category}</td>
        <td>₹${p.price.toLocaleString('en-IN')}</td>
        <td>
          <span class="admin-badge ${p.active ? 'admin-badge-success' : 'admin-badge-draft'}">
            ${p.active ? 'Active' : 'Draft'}
          </span>
        </td>
      `;
      tbody.appendChild(tr);
    }
  }
}

/* 4. Products Table (List Grid) Setup */
async function initProductsTable() {
  const tbody = document.getElementById('productsTableBody');
  const searchInput = document.getElementById('adminSearchInput');
  const filterCat = document.getElementById('filterCategory');
  const filterStatus = document.getElementById('filterStatus');
  const deleteModal = document.getElementById('deleteModal');
  const cancelDelete = document.getElementById('cancelDelete');
  const confirmDelete = document.getElementById('confirmDelete');
  
  let selectedProductIdToDelete = null;

  // Populate category filter options
  if (filterCat) {
    const cats = DataStore.getCategories();
    cats.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c.slug;
      opt.textContent = c.name;
      filterCat.appendChild(opt);
    });
  }

  async function renderTable() {
    if (!tbody) return;
    tbody.innerHTML = '';

    const query = searchInput ? searchInput.value.trim() : '';
    const cat = filterCat ? filterCat.value : '';
    const statusVal = filterStatus ? filterStatus.value : '';

    let products = DataStore.getProducts();

    // Filters
    if (query) {
      const q = query.toLowerCase();
      products = products.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
    }
    if (cat) {
      products = products.filter(p => p.category === cat);
    }
    if (statusVal) {
      const active = statusVal === 'active';
      products = products.filter(p => p.active === active);
    }

    if (products.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--color-admin-text-muted);">No products found matching filters.</td></tr>`;
      return;
    }

    for (const p of products) {
      const tr = document.createElement('tr');
      
      let imgSrc = '';
      if (p.images && p.images.length > 0) {
        const stored = await ImageDB.getImage(p.images[0]);
        imgSrc = stored || `../assets/images/categories/${p.category}.jpg`;
      } else {
        imgSrc = `../assets/images/categories/${p.category}.jpg`;
      }

      tr.innerHTML = `
        <td><input type="checkbox" class="product-select" data-id="${p.id}"></td>
        <td><img class="product-thumb" src="${imgSrc}" alt="${p.name}"></td>
        <td><strong>${p.name}</strong></td>
        <td>${p.category.toUpperCase()}</td>
        <td>₹${p.price.toLocaleString('en-IN')}</td>
        <td>
          <span class="admin-badge ${p.active ? 'admin-badge-success' : 'admin-badge-draft'}">
            ${p.active ? 'Active' : 'Draft'}
          </span>
        </td>
        <td>
          <div class="action-buttons">
            <button class="action-btn btn-edit" title="Edit Product" onclick="window.location.href='product-form.html?id=${p.id}'">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </button>
            <button class="action-btn btn-delete" title="Delete Product" data-id="${p.id}">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </button>
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    }

    // Attach row delete triggers
    tbody.querySelectorAll('.btn-delete').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        selectedProductIdToDelete = btn.dataset.id;
        deleteModal.classList.add('active');
      });
    });
  }

  // Event Listeners for Filters
  if (searchInput) searchInput.addEventListener('input', renderTable);
  if (filterCat) filterCat.addEventListener('change', renderTable);
  if (filterStatus) filterStatus.addEventListener('change', renderTable);

  if (cancelDelete) {
    cancelDelete.addEventListener('click', () => {
      deleteModal.classList.remove('active');
      selectedProductIdToDelete = null;
    });
  }

  if (confirmDelete) {
    confirmDelete.addEventListener('click', async () => {
      if (selectedProductIdToDelete) {
        await DataStore.deleteProduct(selectedProductIdToDelete);
        deleteModal.classList.remove('active');
        selectedProductIdToDelete = null;
        renderTable();
      }
    });
  }

  // Initial table render
  await renderTable();
}

/* 5. Product Form (Add / Edit Form with Live Previews) Setup */
async function initProductForm() {
  const form = document.getElementById('productForm');
  const titleEl = document.getElementById('formTitle');
  const zone = document.getElementById('imageUploadZone');
  const input = document.getElementById('imageInput');
  const grid = document.getElementById('imagePreviewGrid');
  const categorySelect = document.getElementById('productCategory');

  // Populate category options in select
  if (categorySelect) {
    categorySelect.innerHTML = '<option value="">Select Category</option>';
    const cats = DataStore.getCategories();
    cats.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c.slug;
      opt.textContent = c.name;
      categorySelect.appendChild(opt);
    });
  }

  // Toggle Switches Handler
  document.querySelectorAll('.toggle-switch').forEach(sw => {
    sw.addEventListener('click', () => {
      sw.classList.toggle('active');
    });
  });

  const pid = getUrlParam('id');
  let currentProduct = null;
  tempFormImages = [];

  // If edit mode
  if (pid) {
    currentProduct = DataStore.getProduct(pid);
    if (currentProduct) {
      if (titleEl) titleEl.textContent = 'Edit Product';
      
      // Populate fields
      document.getElementById('productName').value = currentProduct.name;
      document.getElementById('productCategory').value = currentProduct.category;
      document.getElementById('productPrice').value = currentProduct.price;
      document.getElementById('productDescription').value = currentProduct.description;

      // Toggle Switches
      setToggleState('toggleFeatured', currentProduct.featured);
      setToggleState('toggleNewArrival', currentProduct.newArrival);
      setToggleState('toggleActive', currentProduct.active);

      // Sizes Checklist checkboxes
      if (currentProduct.sizes) {
        document.querySelectorAll('input[name="sizes"]').forEach(cb => {
          cb.checked = currentProduct.sizes.includes(cb.value);
        });
      }

      // Load existing images from db
      if (currentProduct.images && currentProduct.images.length > 0) {
        for (const imgId of currentProduct.images) {
          const base64 = await ImageDB.getImage(imgId);
          if (base64) {
            tempFormImages.push({ id: imgId, data: base64 });
          }
        }
        renderImagesPreview();
      }
    }
  }

  function setToggleState(id, isActive) {
    const el = document.getElementById(id);
    if (el) {
      if (isActive) el.classList.add('active');
      else el.classList.remove('active');
    }
  }

  // Drag and drop setup
  if (zone && input) {
    zone.addEventListener('click', () => input.click());

    zone.addEventListener('dragover', (e) => {
      e.preventDefault();
      zone.classList.add('dragover');
    });

    zone.addEventListener('dragleave', () => {
      zone.classList.remove('dragover');
    });

    zone.addEventListener('drop', (e) => {
      e.preventDefault();
      zone.classList.remove('dragover');
      handleFiles(e.dataTransfer.files);
    });

    input.addEventListener('change', () => {
      handleFiles(input.files);
    });
  }

  function handleFiles(files) {
    for (const f of files) {
      if (!f.type.startsWith('image/')) continue;
      
      const reader = new FileReader();
      reader.onload = (event) => {
        tempFormImages.push({ data: event.target.result, isNew: true });
        renderImagesPreview();
      };
      reader.readAsDataURL(f);
    }
  }

  function renderImagesPreview() {
    if (!grid) return;
    grid.innerHTML = '';
    
    tempFormImages.forEach((img, index) => {
      const preview = document.createElement('div');
      preview.className = 'image-preview';
      preview.innerHTML = `
        <img src="${img.data}" alt="Preview ${index + 1}">
        <button type="button" class="image-preview__remove" data-index="${index}">&times;</button>
      `;

      preview.querySelector('.image-preview__remove').addEventListener('click', () => {
        tempFormImages.splice(index, 1);
        renderImagesPreview();
      });

      grid.appendChild(preview);
    });
  }

  // Form Submit Action
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const name = document.getElementById('productName').value.trim();
      const category = document.getElementById('productCategory').value;
      const price = parseFloat(document.getElementById('productPrice').value);
      const description = document.getElementById('productDescription').value.trim();

      const featured = document.getElementById('toggleFeatured').classList.contains('active');
      const newArrival = document.getElementById('toggleNewArrival').classList.contains('active');
      const active = document.getElementById('toggleActive').classList.contains('active');

      const sizes = [];
      document.querySelectorAll('input[name="sizes"]:checked').forEach(cb => {
        sizes.push(cb.value);
      });

      if (!name || !category || isNaN(price)) {
        alert("Please fill in all required fields.");
        return;
      }

      // Gather Images
      const finalImages = [];
      const newImagesData = [];

      for (const img of tempFormImages) {
        if (img.isNew) {
          newImagesData.push(img.data);
        } else {
          finalImages.push(img.id);
        }
      }

      const productPayload = {
        name,
        category,
        price,
        description,
        sizes,
        featured,
        newArrival,
        active,
        images: finalImages,
        newImagesData // temporary attribute processed by DataStore.saveProduct
      };

      if (currentProduct) {
        productPayload.id = currentProduct.id;
        productPayload.createdAt = currentProduct.createdAt;
      }

      await DataStore.saveProduct(productPayload);
      window.location.href = 'products.html';
    });
  }
}

/* 6. Categories Management Modal & Action Triggers */
function initCategoryManagement() {
  const grid = document.getElementById('categoriesGrid');
  const catModal = document.getElementById('categoryModal');
  const catForm = document.getElementById('categoryForm');
  const cancelBtn = document.getElementById('cancelCategory');
  const titleModal = document.getElementById('categoryModalTitle');
  const addBtn = document.getElementById('addCategoryBtn');

  const nameInput = document.getElementById('categoryName');
  const descInput = document.getElementById('categoryDescription');
  const zone = document.getElementById('categoryImageZone');
  const input = document.getElementById('categoryImageInput');
  const preview = document.getElementById('categoryImagePreview');
  const catIdHidden = document.getElementById('categoryId');

  let tempCatImageBase64 = null;

  async function renderCategories() {
    if (!grid) return;
    grid.innerHTML = '';
    const cats = DataStore.getCategories();

    for (const c of cats) {
      const card = document.createElement('div');
      card.className = 'stat-card';
      card.style.borderLeft = '4px solid var(--color-admin-accent)';
      
      const prods = DataStore.getProducts({ category: c.slug });
      
      let imgSrc = '';
      if (c.image) {
        imgSrc = c.image.startsWith('img_') ? await ImageDB.getImage(c.image) : c.image;
      } else {
        imgSrc = `../assets/images/categories/${c.slug}.jpg`;
      }

      card.innerHTML = `
        <div style="display: flex; gap: 1rem; align-items: center;">
          <img src="${imgSrc}" onerror="this.onerror=null; this.src='data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2250%22 height=%2250%22 style=%22background:%231E1E2D%22></svg>';" style="width: 50px; height: 50px; border-radius: 50%; object-fit: cover;">
          <div style="flex-grow: 1;">
            <h3 style="font-size: 1.25rem; font-family: 'Playfair Display'; color: #E0E0E0;">${c.name}</h3>
            <span style="font-size: 0.9rem; color: var(--color-admin-text-muted);">${prods.length} Products</span>
          </div>
          <div class="action-buttons">
            <button class="action-btn btn-edit" title="Edit Category" data-id="${c.id}">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </button>
            <button class="action-btn btn-delete" title="Delete Category" data-id="${c.id}">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </button>
          </div>
        </div>
      `;

      card.querySelector('.btn-edit').addEventListener('click', async () => {
        titleModal.textContent = 'Edit Category';
        nameInput.value = c.name;
        descInput.value = c.description || '';
        catIdHidden.value = c.id;
        tempCatImageBase64 = null;
        
        if (c.image) {
          const base64 = c.image.startsWith('img_') ? await ImageDB.getImage(c.image) : c.image;
          preview.innerHTML = `<img src="${base64}" style="width: 100px; height: 100px; border-radius: 8px; object-fit: cover;">`;
        } else {
          preview.innerHTML = '';
        }
        
        catModal.classList.add('active');
      });

      card.querySelector('.btn-delete').addEventListener('click', async () => {
        if (prods.length > 0) {
          alert(`Cannot delete category "${c.name}" because it contains products. Remove or reassign the products first.`);
          return;
        }
        if (confirm(`Are you sure you want to delete category "${c.name}"?`)) {
          await DataStore.deleteCategory(c.id);
          renderCategories();
        }
      });

      grid.appendChild(card);
    }
  }

  if (addBtn) {
    addBtn.addEventListener('click', () => {
      titleModal.textContent = 'Add Category';
      catForm.reset();
      catIdHidden.value = '';
      preview.innerHTML = '';
      tempCatImageBase64 = null;
      catModal.classList.add('active');
    });
  }

  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      catModal.classList.remove('active');
    });
  }

  if (zone && input) {
    zone.addEventListener('click', () => input.click());
    input.addEventListener('change', () => {
      const file = input.files[0];
      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          tempCatImageBase64 = event.target.result;
          preview.innerHTML = `<img src="${tempCatImageBase64}" style="width: 100px; height: 100px; border-radius: 8px; object-fit: cover;">`;
        };
        reader.readAsDataURL(file);
      }
    });
  }

  if (catForm) {
    catForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = nameInput.value.trim();
      const desc = descInput.value.trim();
      const id = catIdHidden.value;

      if (!name) return;

      const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

      const payload = {
        name,
        slug,
        description: desc,
        newImageData: tempCatImageBase64
      };

      if (id) {
        payload.id = id;
        // Keep old image reference if no new image selected
        const oldCat = DataStore.getCategories().find(c => c.id === id);
        if (oldCat && !tempCatImageBase64) {
          payload.image = oldCat.image;
        }
      }

      await DataStore.saveCategory(payload);
      catModal.classList.remove('active');
      renderCategories();
    });
  }

  // Backup Export/Import logic
  const exportBtn = document.getElementById('exportDataBtn');
  const importInput = document.getElementById('importDataInput');

  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      const dataStr = DataStore.exportData();
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Azmani's_store_backup_${Date.now()}.json`;
      a.click();
    });
  }

  if (importInput) {
    importInput.addEventListener('change', () => {
      const file = importInput.files[0];
      if (file && file.type === 'application/json') {
        const reader = new FileReader();
        reader.onload = (e) => {
          const success = DataStore.importData(e.target.result);
          if (success) {
            alert('Database imported successfully. Page will reload.');
            window.location.reload();
          } else {
            alert('Invalid database backup file.');
          }
        };
        reader.readAsText(file);
      }
    });
  }

  // Initial load
  renderCategories();
}
