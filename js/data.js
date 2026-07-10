/* ==========================================================================
   THE HOUSE OF AZMANI'S - DATA LAYER (LOCALSTORAGE & INDEXEDDB)
   ========================================================================== */

// Default Category Definitions
const DEFAULT_CATEGORIES = [
  { id: 'cat_1', name: 'Kurtis', slug: 'kurtis', description: 'Elegant ethnic and daily-wear kurtis.', order: 1 },
  { id: 'cat_2', name: 'Suits', slug: 'suits', description: 'Curated suits and designer sets.', order: 2 },
  { id: 'cat_3', name: 'Sarees', slug: 'sarees', description: 'Traditional handcrafted sarees.', order: 3 },
  { id: 'cat_4', name: 'Western Wear', slug: 'western-wear', description: 'Contemporary fusion dresses and tops.', order: 4 },
  { id: 'cat_5', name: 'Handbags', slug: 'handbags', description: 'Stylish clutches, totes, and handbags.', order: 5 },
  { id: 'cat_6', name: 'Accessories', slug: 'accessories', description: 'Premium jewelry and accessory styles.', order: 6 }
];

// Default Product Definitions
const DEFAULT_PRODUCTS = [
  {
    id: 'prod_1',
    name: 'Peach Chikankari Embroidered Kurti',
    category: 'kurtis',
    price: 3499,
    description: 'A beautifully hand-embroidered Lucknowi Chikankari kurti in pure georgette. Adorned with delicate floral patterns and matching slip. Ideal for semi-formal gatherings.',
    images: [], // Will fallback to CSS placeholder or Base64 uploaded image
    sizes: ['S', 'M', 'L', 'XL'],
    featured: true,
    newArrival: true,
    active: true,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'prod_2',
    name: 'Chanderi Silk Golden Zari Kurti',
    category: 'kurtis',
    price: 4299,
    description: 'An elegant Chanderi silk kurti featuring premium zari borders and gold detailing. Includes a lightweight matching cotton inner for absolute comfort.',
    images: [],
    sizes: ['M', 'L', 'XL', 'XXL'],
    featured: false,
    newArrival: true,
    active: true,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'prod_3',
    name: 'Crimson Silk Anarkali Suit Set',
    category: 'suits',
    price: 7999,
    description: 'A grand crimson red silk Anarkali suit set with heavy gota patti embroidery on the neckline and border. Paired with churidar and a beautiful organza dupatta.',
    images: [],
    sizes: ['S', 'M', 'L'],
    featured: true,
    newArrival: false,
    active: true,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'prod_4',
    name: 'Dusty Lavender Palazzo Suit',
    category: 'suits',
    price: 5499,
    description: 'A trendy lavender straight fit kurti set with matching flared palazzo pants. Features beautiful white thread mirror-work detailing and chiffon dupatta.',
    images: [],
    sizes: ['M', 'L', 'XL'],
    featured: false,
    newArrival: true,
    active: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod_5',
    name: 'Royal Blue Banarasi Georgette Saree',
    category: 'sarees',
    price: 8999,
    description: 'A luxury Banarasi khaddi georgette saree featuring intricate silver and gold zari checks. Crafted by seasoned artisans. Unstitched running blouse piece included.',
    images: [],
    sizes: ['Free Size'],
    featured: true,
    newArrival: false,
    active: true,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'prod_6',
    name: 'Sage Green Organza Floral Saree',
    category: 'sarees',
    price: 6499,
    description: 'A lightweight sage green organza saree adorned with hand-painted floral motifs and premium scalloped borders with cutwork. Includes designer raw silk blouse piece.',
    images: [],
    sizes: ['Free Size'],
    featured: false,
    newArrival: true,
    active: true,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'prod_7',
    name: 'Ivory Gold Fusion Maxi Dress',
    category: 'western-wear',
    price: 4999,
    description: 'A beautiful ivory-white cotton fusion maxi dress featuring delicate gold block printing. Features a flared silhouette and tassel highlights.',
    images: [],
    sizes: ['XS', 'S', 'M', 'L'],
    featured: true,
    newArrival: true,
    active: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod_8',
    name: 'Terracotta Hand-block Print Co-ord Set',
    category: 'western-wear',
    price: 3899,
    description: 'A modern two-piece fusion co-ord set with a button-down shirt-collar tunic and matching straight pants. Made in high-quality breathable cotton linen fabric.',
    images: [],
    sizes: ['S', 'M', 'L', 'XL'],
    featured: false,
    newArrival: false,
    active: true,
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'prod_9',
    name: 'Gold Embellished Wedding Potli Bag',
    category: 'handbags',
    price: 1999,
    description: 'A luxury velvet potli clutch bag heavily embroidered with golden beads, zardozi work, and double pearl string handles. Perfect accessory for wedding parties.',
    images: [],
    sizes: ['Free Size'],
    featured: true,
    newArrival: false,
    active: true,
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'prod_10',
    name: 'Silk Brocade Envelope Clutch',
    category: 'handbags',
    price: 1499,
    description: 'A gorgeous envelope-styled ethnic clutch crafted from silk brocade fabric. Comes with an optional detachable metal sling chain.',
    images: [],
    sizes: ['Free Size'],
    featured: false,
    newArrival: true,
    active: true,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'prod_11',
    name: 'Kundan Statement Jhumka Earrings',
    category: 'accessories',
    price: 2499,
    description: 'Handcrafted statement jhumka earrings featuring beautiful Kundan stone-setting, gold polish, and elegant pearl drops. Perfect pairing with sarees and suits.',
    images: [],
    sizes: ['Free Size'],
    featured: true,
    newArrival: true,
    active: true,
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'prod_12',
    name: 'Semi-Precious Gemstone Necklace Set',
    category: 'accessories',
    price: 3999,
    description: 'A designer choker necklace set featuring semi-precious emerald green beads and kundan medallions. Complete with matching stud earrings.',
    images: [],
    sizes: ['Free Size'],
    featured: false,
    newArrival: false,
    active: true,
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString()
  }
];

/* IndexedDB Class to handle base64 image storage (bypassing localStorage limits) */
class ImageDB {
  static dbName = 'azmanis_images';
  static storeName = 'images';
  static db = null;

  static init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);

      request.onerror = (event) => {
        console.error('IndexedDB open error:', event.target.error);
        reject(event.target.error);
      };

      request.onsuccess = (event) => {
        this.db = event.target.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName);
        }
      };
    });
  }

  static saveImage(id, base64Data) {
    return new Promise((resolve, reject) => {
      if (!this.db) return reject('ImageDB not initialized');
      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.put(base64Data, id);

      request.onsuccess = () => resolve(id);
      request.onerror = (event) => reject(event.target.error);
    });
  }

  static getImage(id) {
    return new Promise((resolve, reject) => {
      if (!this.db) return resolve(null); // Silent fail during load
      const transaction = this.db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = (event) => reject(event.target.error);
    });
  }

  static deleteImage(id) {
    return new Promise((resolve, reject) => {
      if (!this.db) return reject('ImageDB not initialized');
      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = (event) => reject(event.target.error);
    });
  }

  static clearAll() {
    return new Promise((resolve, reject) => {
      if (!this.db) return reject('ImageDB not initialized');
      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = (event) => reject(event.target.error);
    });
  }
}

/* DataStore Class managing products, categories & stats in localStorage */
class DataStore {
  static localKey = 'azmanis_data';
  static data = {
    products: [],
    categories: []
  };

  static async init() {
    // 1. Initialise Image Database
    try {
      await ImageDB.init();
    } catch (e) {
      console.warn("Failed to initialize IndexedDB, fallback image display will apply", e);
    }

    // 2. Load from localStorage or seed default data
    this._load();
    if (!this.data.categories || this.data.categories.length === 0) {
      this.data.categories = [...DEFAULT_CATEGORIES];
      this._save();
    }
    if (!this.data.products || this.data.products.length === 0) {
      this.data.products = [...DEFAULT_PRODUCTS];
      this._save();
    }
  }

  // Retrieve products array with optional filters/sorting
  static getProducts(filters = {}) {
    let result = [...this.data.products];

    // Filter by Active status
    if (filters.active !== undefined) {
      result = result.filter(p => p.active === filters.active);
    }

    // Filter by Category slug
    if (filters.category) {
      result = result.filter(p => p.category.toLowerCase() === filters.category.toLowerCase());
    }

    // Filter by Featured
    if (filters.featured !== undefined) {
      result = result.filter(p => p.featured === filters.featured);
    }

    // Filter by New Arrival
    if (filters.newArrival !== undefined) {
      result = result.filter(p => p.newArrival === filters.newArrival);
    }

    // Filter by Search Query (case-insensitive across name, desc, and category)
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }

    // Filter by Price range
    if (filters.priceMin !== undefined) {
      result = result.filter(p => p.price >= filters.priceMin);
    }
    if (filters.priceMax !== undefined) {
      result = result.filter(p => p.price <= filters.priceMax);
    }

    // Sorting
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'price-asc':
          result.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          result.sort((a, b) => b.price - a.price);
          break;
        case 'name-asc':
          result.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'newest':
        default:
          result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          break;
      }
    }

    return result;
  }

  // Get single product
  static getProduct(id) {
    return this.data.products.find(p => p.id === id) || null;
  }

  // Save/Update product
  static async saveProduct(product) {
    const isNew = !product.id;
    if (isNew) {
      product.id = 'prod_' + Date.now();
      product.createdAt = new Date().toISOString();
    }

    // Process new uploaded images
    if (product.newImagesData && product.newImagesData.length > 0) {
      product.images = product.images || [];
      for (let i = 0; i < product.newImagesData.length; i++) {
        const imageId = `img_${product.id}_${i}_${Date.now()}`;
        await ImageDB.saveImage(imageId, product.newImagesData[i]);
        product.images.push(imageId);
      }
      delete product.newImagesData; // clean temp property
    }

    if (isNew) {
      this.data.products.push(product);
    } else {
      const idx = this.data.products.findIndex(p => p.id === product.id);
      if (idx !== -1) {
        this.data.products[idx] = product;
      }
    }

    this._save();
    return product;
  }

  // Delete product
  static async deleteProduct(id) {
    const product = this.getProduct(id);
    if (product && product.images && product.images.length > 0) {
      for (const imgId of product.images) {
        try {
          await ImageDB.deleteImage(imgId);
        } catch (e) {
          console.warn("Failed to delete image: ", imgId);
        }
      }
    }

    this.data.products = this.data.products.filter(p => p.id !== id);
    this._save();
  }

  // Categories CRUD
  static getCategories() {
    return [...this.data.categories].sort((a, b) => a.order - b.order);
  }

  static getCategoryBySlug(slug) {
    return this.data.categories.find(c => c.slug.toLowerCase() === slug.toLowerCase()) || null;
  }

  static async saveCategory(category) {
    const isNew = !category.id;
    if (isNew) {
      category.id = 'cat_' + Date.now();
      category.order = this.data.categories.length + 1;
    }

    if (category.newImageData) {
      const imgId = `img_cat_${category.id}_${Date.now()}`;
      await ImageDB.saveImage(imgId, category.newImageData);
      category.image = imgId;
      delete category.newImageData;
    }

    if (isNew) {
      this.data.categories.push(category);
    } else {
      const idx = this.data.categories.findIndex(c => c.id === category.id);
      if (idx !== -1) {
        this.data.categories[idx] = category;
      }
    }
    this._save();
    return category;
  }

  static async deleteCategory(id) {
    const category = this.data.categories.find(c => c.id === id);
    if (category && category.image && category.image.startsWith('img_')) {
      try {
        await ImageDB.deleteImage(category.image);
      } catch (e) {
        console.warn(e);
      }
    }
    this.data.categories = this.data.categories.filter(c => c.id !== id);
    this._save();
  }

  // Get store statistics
  static getStats() {
    const active = this.data.products.filter(p => p.active).length;
    return {
      totalProducts: this.data.products.length,
      totalCategories: this.data.categories.length,
      activeProducts: active,
      draftProducts: this.data.products.length - active,
      featuredProducts: this.data.products.filter(p => p.featured).length
    };
  }

  // Import / Export database functions
  static exportData() {
    return JSON.stringify(this.data, null, 2);
  }

  static importData(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.products && parsed.categories) {
        this.data = parsed;
        this._save();
        return true;
      }
    } catch (e) {
      console.error("Invalid data import payload: ", e);
    }
    return false;
  }

  // Internal storage helpers
  static _save() {
    localStorage.setItem(this.localKey, JSON.stringify(this.data));
  }

  static _load() {
    const loaded = localStorage.getItem(this.localKey);
    if (loaded) {
      try {
        this.data = JSON.parse(loaded);
      } catch (e) {
        console.error("Error reading stored data:", e);
      }
    }
  }
}
