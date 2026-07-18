import React, { useState, useEffect } from 'react';
import Splash from './components/Splash';
import AdminPortal from './components/AdminPortal';
import ProductDetails from './components/ProductDetails';
import WishlistDrawer from './components/WishlistDrawer';
import ZoomableImage from './components/ZoomableImage';
import { Product } from './types';
import { getStoredProducts, saveStoredProducts, PRESET_CATEGORIES, DEFAULT_PRODUCTS } from './data';
import {
  Search,
  SlidersHorizontal,
  Sparkles,
  Phone,
  MapPin,
  Instagram,
  Facebook,
  Linkedin,
  ExternalLink,
  Menu,
  X,
  ChevronRight,
  ChevronLeft,
  Plus,
  Heart,
  ShoppingBag,
  RotateCcw,
  Check,
  ChevronDown,
  Share2,
  Trash2,
  Clock,
  Calendar,
  User
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Filter and search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedSizeFilter, setSelectedSizeFilter] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('default');
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [showInstagramQR, setShowInstagramQR] = useState(false);

  // Toast / notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Wishlist states and handlers
  const [showWishlistDrawer, setShowWishlistDrawer] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('hoa_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('hoa_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleWishlist = (id: string) => {
    const isCurrentlyWishlisted = wishlist.includes(id);
    if (isCurrentlyWishlisted) {
      setWishlist((prev) => prev.filter((item) => item !== id));
      triggerToast('Removed from wishlist');
    } else {
      setWishlist((prev) => [...prev, id]);
      triggerToast('Added to wishlist!');
    }
  };

  const isWishlisted = (id: string) => wishlist.includes(id);

  // Recently viewed states and handlers
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>(() => {
    const saved = localStorage.getItem('hoa_recently_viewed');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    if (selectedProduct) {
      setRecentlyViewed((prev) => {
        const filtered = prev.filter((id) => id !== selectedProduct.id);
        const updated = [selectedProduct.id, ...filtered].slice(0, 5);
        localStorage.setItem('hoa_recently_viewed', JSON.stringify(updated));
        return updated;
      });
    }
  }, [selectedProduct]);

  const clearRecentlyViewed = () => {
    setRecentlyViewed([]);
    localStorage.removeItem('hoa_recently_viewed');
    triggerToast('Recently viewed history cleared');
  };

  const removeRecentlyViewedItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRecentlyViewed((prev) => {
      const updated = prev.filter((itemId) => itemId !== id);
      localStorage.setItem('hoa_recently_viewed', JSON.stringify(updated));
      return updated;
    });
  };

  // Appointment Scheduler states & helpers
  const [showScheduler, setShowScheduler] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  });
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("03:30 PM - 05:00 PM (Afternoon Tea Slot)");
  const [guestName, setGuestName] = useState<string>("");

  const getNextDays = () => {
    const days = [];
    for (let i = 1; i <= 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      days.push(d);
    }
    return days;
  };

  const handleConfirmShowroomAppointment = () => {
    const formattedDate = selectedDate.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
    
    const guestLine = guestName.trim() ? `👤 Guest Name: *${guestName.trim()}*\n` : '';
    const message = `Hello! I would love to book a luxury showroom appointment at the Varanasi Showroom.

${guestLine}📅 Proposed Date: *${formattedDate}*
⏰ Selected Time Slot: *${selectedTimeSlot}*
📍 Venue: Fort Road, Varanasi, Uttar Pradesh

Please let me know if this slot works. Looking forward to experiencing the collection!`;

    const encoded = encodeURIComponent(message);
    window.open(`https://api.whatsapp.com/send?phone=919889844494&text=${encoded}`, '_blank');
    triggerToast('Showroom visit request prepared! Opening WhatsApp...');
  };

  useEffect(() => {
    // Load products on mount
    const loaded = getStoredProducts();
    setProducts(loaded);
    
    // Check for deep link
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('product');
    if (productId) {
      const prod = loaded.find(p => p.id === productId);
      if (prod) {
        setSelectedProduct(prod);
      }
    }
  }, []);

  const handleShareProduct = (prod: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    const productUrl = `${window.location.origin}${window.location.pathname}?product=${prod.id}`;
    
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(productUrl)
        .then(() => {
          triggerToast('Link copied!');
        })
        .catch(() => {
          copyFallback(productUrl);
        });
    } else {
      copyFallback(productUrl);
    }
  };

  const copyFallback = (text: string) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      triggerToast('Link copied!');
    } catch (err) {
      triggerToast('Could not copy link');
    }
    document.body.removeChild(textArea);
  };

  const handleSaveProducts = (newProducts: Product[]) => {
    setProducts(newProducts);
    saveStoredProducts(newProducts);
    triggerToast('Catalog updated successfully!');
  };

  const handleResetToDefaults = () => {
    if (window.confirm('Reset catalog back to luxury preset arrivals? Your custom products will be replaced.')) {
      setProducts(DEFAULT_PRODUCTS);
      saveStoredProducts(DEFAULT_PRODUCTS);
      triggerToast('Catalog reset to luxury presets.');
    }
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleShareCatalogWhatsApp = () => {
    const catalogUrl = `${window.location.origin}${window.location.pathname}`;
    const message = `Hello! I would love to share with you the exquisite luxury collection of *The House of Azmanis*.

You can browse their masterfully designed apparel, accessories, and lifestyle collections online here:
✨ ${catalogUrl} ✨

Enjoy browsing the fine workmanship and elegant designs!`;
    const encoded = encodeURIComponent(message);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
    triggerToast('Opening WhatsApp to share catalog...');
  };

  // Compute filtered products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesCategory = true;
    if (selectedCategory === 'Wishlist') {
      matchesCategory = wishlist.includes(p.id);
    } else if (selectedCategory) {
      matchesCategory = p.category === selectedCategory;
    }
    
    const matchesSize = selectedSizeFilter ? p.sizes.includes(selectedSizeFilter) : true;

    return matchesSearch && matchesCategory && matchesSize;
  });

  // Compute sorted products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-asc') {
      return a.price - b.price;
    }
    if (sortBy === 'price-desc') {
      return b.price - a.price;
    }
    if (sortBy === 'name-asc') {
      return a.name.localeCompare(b.name);
    }
    return 0;
  });

  // Compute recently viewed products
  const recentlyViewedProducts = recentlyViewed
    .map(id => products.find(p => p.id === id))
    .filter((p): p is Product => !!p);

  const featuredProduct = products.find(p => p.isFeatured) || products[0];

  const handleWhatsAppFastEnquiry = (product: Product) => {
    const message = `Hello! I am viewing your premium catalog online at The House of Azmanis and want to enquire about:
🌸 *${product.name}*
🔢 *SKU:* ${product.sku || 'N/A'}
💰 *Price:* ₹${product.price.toLocaleString('en-IN')}

Could you please confirm if this beautiful piece is currently available for ordering? Thank you!`;
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/919889844494?text=${encoded}`, '_blank');
  };

  return (
    <div className="relative min-h-screen bg-[#FDFCFB] text-[#1A1510] font-sans selection:bg-gold-100 selection:text-gold-900 overflow-x-hidden">
      
      {/* 1. Splendid Custom Splash Screen */}
      {showSplash && <Splash onComplete={() => setShowSplash(false)} />}

      {/* Dynamic Toast Message */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 bg-[#1A1510] text-[#FCFBF9] border border-gold-400 px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs font-semibold tracking-wider uppercase font-sans"
          >
            <Check className="text-gold-400" size={16} />
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Responsive Container - Optimized for spacious full screen layout */}
      <div className="flex flex-col min-h-screen">
        
        {/* DESKTOP SIDEBAR - Hidden in favor of responsive sliding drawer menu to maximize space and prevent blank left areas on laptops */}
        <aside className="hidden">
          
          <div className="space-y-12">
            {/* Store Branding Header */}
            <div className="space-y-3 cursor-pointer" onClick={() => { setSelectedCategory(''); setSearchQuery(''); setSelectedSizeFilter(''); }}>
              <div className="relative group">
                <h1 className="font-display text-2xl tracking-[0.15em] text-[#2C2115] uppercase leading-tight font-medium hover:text-gold-700 transition-colors">
                  The House <br/>of Azmanis
                </h1>
                <div className="h-[2px] w-12 bg-gold-400 mt-2 transition-all group-hover:w-20" />
              </div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-gold-600 font-serif italic">
                Curated for Her.
              </p>
            </div>

            {/* Sidebar Interactive Navigation Collections */}
            <div className="space-y-4">
              <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold-500 mb-2">
                Collections
              </h2>
              <ul className="space-y-3.5 text-sm font-medium">
                <li>
                  <button
                    onClick={() => { setSelectedCategory(''); setSelectedSizeFilter(''); }}
                    className={`block hover:translate-x-1.5 transition-all cursor-pointer ${
                      selectedCategory === '' ? 'text-gold-600 font-bold border-l-2 border-gold-500 pl-2' : 'text-gold-950/80 hover:text-gold-700'
                    }`}
                  >
                    All Masterpieces
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => { setSelectedCategory('Wishlist'); setSelectedSizeFilter(''); }}
                    className={`flex items-center gap-2 hover:translate-x-1.5 transition-all cursor-pointer ${
                      selectedCategory === 'Wishlist' ? 'text-rose-600 font-bold border-l-2 border-rose-500 pl-2' : 'text-gold-950/80 hover:text-rose-600'
                    }`}
                  >
                    <Heart size={14} className={wishlist.length > 0 ? 'fill-rose-500 text-rose-500' : ''} />
                    <span>My Wishlist ({wishlist.length})</span>
                  </button>
                </li>
                {PRESET_CATEGORIES.map((cat) => {
                  const isActive = selectedCategory === cat;
                  return (
                    <li key={cat}>
                      <button
                        onClick={() => { setSelectedCategory(cat); setSelectedSizeFilter(''); }}
                        className={`block hover:translate-x-1.5 transition-all text-left cursor-pointer ${
                          isActive ? 'text-gold-600 font-bold border-l-2 border-gold-500 pl-2' : 'text-gold-950/80 hover:text-gold-700'
                        }`}
                      >
                        {cat}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Sizes filter widget */}
            <div className="space-y-3 bg-[#FCFBF9] p-4 rounded-xl border border-gold-200/50">
              <span className="text-[9px] font-bold uppercase tracking-widest text-gold-600 block">Filter By Size</span>
              <div className="flex flex-wrap gap-1.5">
                {['S', 'M', 'L', 'XL', 'XXL'].map((sz) => {
                  const isSzActive = selectedSizeFilter === sz;
                  return (
                    <button
                      key={sz}
                      onClick={() => setSelectedSizeFilter(selectedSizeFilter === sz ? '' : sz)}
                      className={`text-[10px] font-semibold px-2 py-1 rounded transition-all cursor-pointer border ${
                        isSzActive
                          ? 'bg-gold-600 text-white border-gold-600'
                          : 'bg-white text-gold-800 border-gold-200 hover:border-gold-400'
                      }`}
                    >
                      {sz}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Premium Business Card snippet */}
            <div className="p-4 bg-white border border-[#EFECE8] rounded-xl space-y-3 shadow-xs">
              <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-gold-600 block">Owner</span>
              <div>
                <h4 className="text-sm font-display font-medium text-gold-950 tracking-wider">Shreya Bhattacharya</h4>
                <p className="text-[10px] text-gold-600 font-serif italic mt-0.5">Fort Road, Ramnagar</p>
              </div>
              <div className="flex flex-col gap-1.5 text-xs text-gold-800">
                <a href="tel:9889844494" className="flex items-center gap-1.5 hover:text-gold-600 transition-colors">
                  <Phone size={12} className="text-gold-500" />
                  <span>+91 98898 44494</span>
                </a>
              </div>
            </div>
          </div>

          {/* Sidebar Footer & Social details */}
          <div className="pt-6 border-t border-gold-200/40 space-y-4">
            <p className="text-[11px] leading-relaxed text-gold-900/70 font-serif">
              The House of Azmanis is a premium destination for women seeking elegant apparel, stylish accessories, and timeless fashion curated with care.
            </p>
            
            <div className="flex items-center justify-center w-6 h-6 rounded bg-gold-100 text-gold-800 border border-gold-200 font-serif italic text-[10px] shadow-sm">
              A
            </div>
            
            <div className="flex gap-3 justify-start">
              <button
                onClick={() => setShowInstagramQR(true)}
                className="w-8 h-8 rounded-full border border-gold-200 hover:border-gold-500 flex items-center justify-center text-gold-800 hover:text-gold-600 transition-colors bg-white cursor-pointer shadow-xs"
                title="View Instagram details"
              >
                <Instagram size={14} />
              </button>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full border border-gold-200 hover:border-gold-500 flex items-center justify-center text-gold-800 hover:text-gold-600 transition-colors bg-white shadow-xs"
                title="Find us on Facebook"
              >
                <Facebook size={14} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full border border-gold-200 hover:border-gold-500 flex items-center justify-center text-gold-800 hover:text-gold-600 transition-colors bg-white shadow-xs"
                title="Connect on LinkedIn"
              >
                <Linkedin size={14} />
              </a>
            </div>
          </div>
        </aside>

        {/* RESPONSIVE SLIDING MENU PANEL - Beautifully accessible on all screen widths */}
        <AnimatePresence>
          {showMobileSidebar && (
            <div className="fixed inset-0 z-50 flex">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowMobileSidebar(false)}
                className="absolute inset-0 bg-black/40 backdrop-blur-xs"
              />
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="relative w-80 bg-[#FCFBF9] h-full shadow-2xl p-6 flex flex-col justify-between overflow-y-auto z-10"
              >
                <button
                  onClick={() => setShowMobileSidebar(false)}
                  className="absolute top-5 right-5 p-1.5 hover:bg-gold-100 rounded-full text-gold-900 transition-colors cursor-pointer"
                >
                  <X size={20} />
                </button>

                <div className="space-y-10 mt-6">
                  {/* Branding */}
                  <div className="space-y-1">
                    <h1 className="font-display text-xl tracking-[0.1em] text-[#2C2115] uppercase leading-tight font-medium">
                      The House <br/>of Azmanis
                    </h1>
                    <p className="text-[9px] uppercase tracking-[0.25em] text-gold-600 font-serif italic">
                      Curated for Her.
                    </p>
                  </div>

                  {/* Collections list */}
                  <div className="space-y-3">
                    <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold-500 mb-1">
                      Collections
                    </h2>
                    <ul className="space-y-2.5 text-sm font-medium">
                      <li>
                        <button
                          onClick={() => { setSelectedCategory(''); setSelectedSizeFilter(''); setShowMobileSidebar(false); }}
                          className={`block py-1 text-left w-full cursor-pointer ${
                            selectedCategory === '' ? 'text-gold-600 font-bold' : 'text-gold-900/80'
                          }`}
                        >
                          All Masterpieces
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => { setSelectedCategory('Wishlist'); setSelectedSizeFilter(''); setShowMobileSidebar(false); }}
                          className={`flex items-center gap-2 py-1 text-left w-full cursor-pointer ${
                            selectedCategory === 'Wishlist' ? 'text-rose-600 font-bold' : 'text-gold-900/80 hover:text-rose-600'
                          }`}
                        >
                          <Heart size={14} className={wishlist.length > 0 ? 'fill-rose-500 text-rose-500' : ''} />
                          <span>My Wishlist ({wishlist.length})</span>
                        </button>
                      </li>
                      {PRESET_CATEGORIES.map((cat) => (
                        <li key={cat}>
                          <button
                            onClick={() => { setSelectedCategory(cat); setSelectedSizeFilter(''); setShowMobileSidebar(false); }}
                            className={`block py-1 text-left w-full cursor-pointer ${
                              selectedCategory === cat ? 'text-gold-600 font-bold' : 'text-gold-900/80'
                            }`}
                          >
                            {cat}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Sizes filter */}
                  <div className="space-y-2.5 bg-gold-50/60 p-4 rounded-xl border border-gold-200/50">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-gold-600 block">Filter By Size</span>
                    <div className="flex flex-wrap gap-1.5">
                      {['S', 'M', 'L', 'XL', 'XXL'].map((sz) => {
                        const isSzActive = selectedSizeFilter === sz;
                        return (
                          <button
                            key={sz}
                            onClick={() => { setSelectedSizeFilter(selectedSizeFilter === sz ? '' : sz); setShowMobileSidebar(false); }}
                            className={`text-[10px] font-semibold px-2 py-1 rounded transition-all cursor-pointer border ${
                              isSzActive
                                ? 'bg-gold-600 text-white border-gold-600'
                                : 'bg-white text-gold-800 border-gold-200'
                            }`}
                          >
                            {sz}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Merchant card */}
                  <div className="p-4 bg-white border border-[#EFECE8] rounded-xl space-y-2">
                    <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-gold-600 block">Owner</span>
                    <h4 className="text-xs font-display font-medium text-gold-950">Shreya Bhattacharya</h4>
                    <p className="text-[10px] text-gold-600 font-serif italic">Fort Road, Ramnagar</p>
                    <a href="tel:9889844494" className="text-xs text-gold-800 font-semibold block mt-1">
                      📞 +91 98898 44494
                    </a>
                  </div>
                </div>

                <div className="pt-6 border-t border-gold-200/40 space-y-4">
                  <div className="flex items-center justify-center w-6 h-6 rounded bg-gold-100 text-gold-800 border border-gold-200 font-serif italic text-[10px] shadow-sm">
                    A
                  </div>
                  <div className="flex gap-4 justify-start">
                    <button onClick={() => { setShowInstagramQR(true); setShowMobileSidebar(false); }} className="text-gold-800"><Instagram size={16} /></button>
                    <a href="https://facebook.com" className="text-gold-800"><Facebook size={16} /></a>
                    <a href="https://linkedin.com" className="text-gold-800"><Linkedin size={16} /></a>
                  </div>
                  <p className="text-[9px] text-gold-500">© 2026 THE HOUSE OF AZMANIS</p>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* MAIN BODY AREA */}
        <main className="flex-1 flex flex-col min-w-0">
          
          {/* HEADER BAR - Fully optimized for elegant full screen laptop/desktop and mobile displays */}
          <header className="h-20 border-b border-[#EFECE8] flex items-center justify-between px-4 md:px-10 bg-white sticky top-0 z-30 shadow-xs">
            
            {/* Luxury Sliding Menu Trigger & Brand Identity (Visible on all screen sizes) */}
            <div className="flex items-center gap-3 md:gap-4">
              <button
                onClick={() => setShowMobileSidebar(true)}
                className="p-2.5 hover:bg-gold-50 border border-gold-200/50 rounded-xl text-gold-900 transition-all cursor-pointer flex items-center gap-2 group"
                title="Open Navigation Menu"
              >
                <Menu size={20} className="transition-transform duration-300 group-hover:scale-110 text-gold-900" />
                <span className="text-[10px] uppercase tracking-wider font-bold text-gold-800 hidden sm:inline-block">
                  Menu & Info
                </span>
              </button>
              <span 
                className="font-display text-base tracking-[0.15em] text-[#2C2115] uppercase font-medium cursor-pointer hover:text-gold-700 transition-colors hidden md:inline-block" 
                onClick={() => { setSelectedCategory(''); setSearchQuery(''); setSelectedSizeFilter(''); }}
              >
                The House of Azmanis
              </span>
              <span 
                className="font-display text-sm tracking-[0.15em] text-[#2C2115] uppercase font-bold cursor-pointer md:hidden" 
                onClick={() => { setSelectedCategory(''); setSearchQuery(''); setSelectedSizeFilter(''); }}
              >
                The House of Azmanis
              </span>
            </div>

            {/* Search Input bar on Center-left */}
            <div className="hidden sm:flex items-center gap-3 max-w-sm w-full relative">
              <Search className="absolute left-3 text-gold-500 pointer-events-none" size={16} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search elegant kurtis, sarees, suits..."
                className="w-full bg-gold-50/50 border border-gold-200/80 focus:border-gold-500 rounded-full pl-9 pr-4 py-2 text-xs font-sans outline-none transition-colors placeholder:text-gold-500/60"
              />
              {(searchQuery || selectedCategory || selectedSizeFilter) && (
                <button
                  onClick={() => { setSearchQuery(''); setSelectedCategory(''); setSelectedSizeFilter(''); }}
                  className="absolute right-3 p-1 hover:bg-gold-200 rounded-full text-gold-700 transition-all cursor-pointer"
                  title="Clear filters"
                >
                  <RotateCcw size={10} />
                </button>
              )}
            </div>

            {/* Right Header Navigation Accessories & Admin Gate */}
            <div className="flex items-center gap-4">
              <span className="hidden md:inline-flex text-[10px] font-bold uppercase tracking-[0.2em] text-gold-600 items-center gap-1.5 bg-gold-50 px-3 py-1.5 rounded-full border border-gold-200/50">
                <Sparkles size={11} className="text-gold-500" />
                Spring Summer '26
              </span>
              
              {/* Wishlist Header Trigger Button */}
              <button
                onClick={() => setShowWishlistDrawer(true)}
                className="relative p-2.5 bg-rose-50 hover:bg-rose-100/80 text-rose-700 border border-rose-200/60 rounded-full transition-all cursor-pointer shadow-xs flex items-center justify-center group"
                title="Open Wishlist"
              >
                <Heart size={16} className={`transition-transform duration-300 group-hover:scale-110 ${wishlist.length > 0 ? 'fill-rose-500 text-rose-500' : ''}`} />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-rose-600 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center animate-bounce shadow">
                    {wishlist.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setIsAdminOpen(true)}
                className="px-4 py-2 border border-[#2C2115]/20 hover:border-[#2C2115] hover:bg-[#2C2115] hover:text-white text-[#2C2115] rounded-full text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer shadow-xs"
              >
                Admin Portal →
              </button>
            </div>
          </header>

          {/* Mobile Search block (shows only on mobile) */}
          <div className="sm:hidden px-4 py-3 bg-white border-b border-gold-50 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 text-gold-500" size={14} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search luxury kurtis, sarees..."
                className="w-full bg-gold-50/50 border border-gold-200/80 rounded-full pl-9 pr-4 py-2 text-xs outline-none focus:border-gold-500"
              />
            </div>
            {(searchQuery || selectedCategory || selectedSizeFilter) && (
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory(''); setSelectedSizeFilter(''); }}
                className="px-3 bg-gold-100 text-gold-800 rounded-full text-xs font-semibold flex items-center justify-center cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {/* ACTIVE FILTER STATUS BAR */}
          {(selectedCategory || selectedSizeFilter || searchQuery) && (
            <div className="px-6 md:px-10 py-3 bg-gold-50/30 border-b border-gold-100 flex flex-wrap items-center gap-2">
              <span className="text-[10px] uppercase tracking-wider text-gold-600 font-bold">Filters:</span>
              {selectedCategory && (
                <span className="text-xs bg-white text-gold-800 border border-gold-200 rounded-full px-3 py-0.5 flex items-center gap-1">
                  Collection: {selectedCategory}
                  <button onClick={() => setSelectedCategory('')} className="hover:text-red-500 font-bold ml-1">×</button>
                </span>
              )}
              {selectedSizeFilter && (
                <span className="text-xs bg-white text-gold-800 border border-gold-200 rounded-full px-3 py-0.5 flex items-center gap-1">
                  Size: {selectedSizeFilter}
                  <button onClick={() => setSelectedSizeFilter('')} className="hover:text-red-500 font-bold ml-1">×</button>
                </span>
              )}
              {searchQuery && (
                <span className="text-xs bg-white text-gold-800 border border-gold-200 rounded-full px-3 py-0.5 flex items-center gap-1">
                  Query: "{searchQuery}"
                  <button onClick={() => setSearchQuery('')} className="hover:text-red-500 font-bold ml-1">×</button>
                </span>
              )}
              <button
                onClick={() => { setSelectedCategory(''); setSelectedSizeFilter(''); setSearchQuery(''); }}
                className="text-xs text-red-700 hover:underline font-semibold ml-auto cursor-pointer"
              >
                Reset All
              </button>
            </div>
          )}

          {/* SECTION: FEATURED ARCH BANNER HERO */}
          <div className="px-6 md:px-10 py-8">
            <div className="relative rounded-3xl overflow-hidden bg-[#EAE8E4] border border-[#E0DBD3] p-8 md:p-14 min-h-[360px] md:min-h-[440px] flex flex-col justify-end group">
              {/* Artistic arch SVG Overlay in background to reinforce Mughal/Indian identity */}
              <div className="absolute inset-0 pointer-events-none opacity-10 flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-full h-full text-gold-800 scale-110">
                  <path d="M50 0 C25 15, 10 30, 10 60 L10 100 L90 100 L90 60 C90 30, 75 15, 50 0 Z" fill="currentColor" />
                </svg>
              </div>

              {/* Real Background image of a gorgeous floral scene */}
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1590156221122-c413d968f941?auto=format&fit=crop&q=80&w=1600')] bg-cover bg-center mix-blend-overlay opacity-80" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

              {/* Large branding watermark */}
              <div className="absolute top-12 right-12 text-white/5 text-[80px] md:text-[140px] font-display select-none pointer-events-none tracking-[0.1em] font-bold">
                AZMANI
              </div>

              {/* Banner content */}
              <div className="relative text-white space-y-4 max-w-xl z-10">
                <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-gold-300 block">
                  Boutique Exclusive New Arrival
                </span>
                <h2 className="text-4xl md:text-6xl font-serif leading-tight tracking-tight">
                  The Elegant <br className="hidden md:inline" />Loom Collection
                </h2>
                <p className="text-sm md:text-base font-serif italic text-white/80 max-w-md">
                  Discover intricately woven threads, handpicked Chanderi silk blends, and block printed Mughal motifs curated for your pristine elegance.
                </p>
                <div className="pt-4 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => { setSelectedCategory('Suits'); setSelectedSizeFilter(''); }}
                    className="px-8 py-3 bg-gold-500 hover:bg-gold-600 text-white text-[10px] font-bold uppercase tracking-widest transition-all rounded shadow-md cursor-pointer"
                  >
                    View Premium Suits
                  </button>
                  <button
                    onClick={() => {
                      if (featuredProduct) setSelectedProduct(featuredProduct);
                    }}
                    className="px-8 py-3 border border-white hover:bg-white hover:text-black text-white text-[10px] font-bold uppercase tracking-widest transition-all rounded cursor-pointer"
                  >
                    Showcase Spotlight
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* MAIN PRODUCT SHOWCASE / GALLERY */}
          <div className="px-6 md:px-10 pb-16 flex-1 flex flex-col">
            
            {/* Gallery title & Sort / Filter controls */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8 pb-4 border-b border-gold-100/40">
              <div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <h3 className="text-xl md:text-2xl font-serif tracking-tight text-gold-950">
                    {selectedCategory === 'Wishlist' ? 'My Wishlisted Masterpieces' : selectedCategory ? `${selectedCategory} Collection` : 'The House Arrivals'}
                  </h3>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#2C2115]/5 border border-gold-200/40 rounded-full text-[10px] font-sans font-bold uppercase tracking-widest text-gold-900 shadow-2xs">
                    <span className="flex h-1.5 w-1.5 rounded-full bg-gold-600"></span>
                    Showing {filteredProducts.length} of {products.length} Items
                  </div>
                </div>
                <p className="text-xs text-gold-600 font-serif italic mt-1.5">
                  {selectedCategory === 'Wishlist'
                    ? `Browsing your personal boutique wishlist`
                    : `Exploring curated luxury items of elegant workmanship`
                  }
                </p>
              </div>

              {/* Action and controls block */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full lg:w-auto">
                {/* Fast presets / Category pill bar */}
                <div className="flex gap-2 overflow-x-auto max-w-full pb-1 sm:pb-0 scrollbar-thin">
                  <button
                    onClick={() => setSelectedCategory('')}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      selectedCategory === ''
                        ? 'bg-[#2C2115] text-[#FCFBF9]'
                        : 'bg-gold-100/50 text-gold-800 hover:bg-gold-100'
                    }`}
                  >
                    All Showcase
                  </button>
                  {PRESET_CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                        selectedCategory === cat
                          ? 'bg-[#2C2115] text-[#FCFBF9]'
                          : 'bg-gold-100/50 text-gold-800 hover:bg-gold-100'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Sorting dropdown */}
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] uppercase tracking-widest text-gold-600 font-semibold whitespace-nowrap">Sort:</span>
                  <div className="relative">
                    <select
                      id="hoa-product-sort"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="bg-white border border-gold-200 hover:border-gold-400 text-gold-900 text-xs rounded-lg py-1.5 pl-3 pr-8 focus:outline-none focus:ring-1 focus:ring-gold-500 appearance-none cursor-pointer font-sans transition-all shadow-xs"
                    >
                      <option value="default">Featured</option>
                      <option value="price-asc">Price: Low to High</option>
                      <option value="price-desc">Price: High to Low</option>
                      <option value="name-asc">Name: A-Z</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gold-600">
                      <ChevronDown size={14} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Empty State */}
            {filteredProducts.length === 0 ? (
              selectedCategory === 'Wishlist' ? (
                <div className="flex-1 bg-rose-50/10 border border-dashed border-rose-200 rounded-3xl p-16 text-center max-w-lg mx-auto w-full flex flex-col items-center justify-center my-8">
                  <Heart className="text-rose-300 mb-4 animate-pulse" size={48} />
                  <h4 className="font-display font-medium text-rose-950 text-lg">Your Wishlist is Empty</h4>
                  <p className="text-sm font-serif italic text-gold-600 mt-2 max-w-xs">
                    "Click the heart icon on any product card or in its detail specification view to save items to your personal wishlist."
                  </p>
                  <button
                    onClick={() => { setSelectedCategory(''); }}
                    className="mt-6 px-6 py-2.5 bg-gold-600 hover:bg-gold-700 text-white text-xs uppercase tracking-wider font-semibold rounded shadow-sm cursor-pointer"
                  >
                    Browse Collections
                  </button>
                </div>
              ) : (
                <div className="flex-1 bg-gold-50/20 border border-dashed border-gold-200 rounded-3xl p-16 text-center max-w-lg mx-auto w-full flex flex-col items-center justify-center my-8">
                  <ShoppingBag className="text-gold-300 mb-4" size={48} />
                  <h4 className="font-display font-medium text-gold-900 text-lg">No Matching Garments Found</h4>
                  <p className="text-sm font-serif italic text-gold-600 mt-2 max-w-xs">
                    We currently do not have stock fitting your active filters. Try resetting search queries or sizes.
                  </p>
                  <button
                    onClick={() => { setSelectedCategory(''); setSelectedSizeFilter(''); setSearchQuery(''); }}
                    className="mt-6 px-6 py-2.5 bg-gold-600 hover:bg-gold-700 text-white text-xs uppercase tracking-wider font-semibold rounded shadow-sm cursor-pointer"
                  >
                    Clear All Filters
                  </button>
                </div>
              )
            ) : (
              /* PRODUCTS GRID - Responsive multi-column layout for desktop optimization */
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-6 md:gap-8">
                {sortedProducts.map((prod) => (
                  <div
                    key={prod.id}
                    className="group bg-white border border-[#EFECE8] rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-gold-300 flex flex-col justify-between"
                  >
                    {/* Image Area */}
                    <div
                      onClick={() => setSelectedProduct(prod)}
                      className="relative aspect-[4/5] bg-[#F5F2EF] overflow-hidden cursor-pointer animate-fade-in"
                    >
                      {prod.isFeatured && (
                        <span className="absolute top-3 left-3 z-10 bg-gold-600 text-white text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded shadow-xs">
                          Arrival
                        </span>
                      )}

                      {/* Wishlist Heart Toggle Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(prod.id);
                        }}
                        className="absolute top-3 right-3 z-20 p-2 bg-white/90 backdrop-blur-xs hover:bg-white rounded-full text-gold-950 border border-gold-200/50 transition-all shadow-md group/heart active:scale-90"
                        title={isWishlisted(prod.id) ? "Remove from Wishlist" : "Add to Wishlist"}
                      >
                        <Heart
                          size={14}
                          className={`transition-all duration-300 ${
                            isWishlisted(prod.id)
                              ? 'fill-rose-500 text-rose-500 scale-110'
                              : 'text-gold-950 group-hover/heart:text-rose-500'
                          }`}
                        />
                      </button>

                      {/* Share Product Button */}
                      <button
                        onClick={(e) => handleShareProduct(prod, e)}
                        className="absolute top-[48px] right-3 z-20 p-2 bg-white/90 backdrop-blur-xs hover:bg-white rounded-full text-gold-950 border border-gold-200/50 transition-all shadow-md group/share active:scale-90"
                        title="Share Product"
                      >
                        <Share2
                          size={14}
                          className="transition-all duration-300 text-gold-950 group-hover/share:text-gold-600"
                        />
                      </button>
                      
                      <ZoomableImage
                        src={prod.image}
                        alt={prod.name}
                        fallbackSrc="https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=400"
                      />

                      {/* Hover Overlay detail button */}
                      <div className="absolute inset-0 bg-black/15 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-6">
                        <span className="px-4 py-2 bg-white/95 backdrop-blur-md text-gold-950 text-[10px] font-bold uppercase tracking-widest rounded-lg shadow-lg hover:bg-gold-50 transform translate-y-2 group-hover:translate-y-0 transition-all">
                          View Details
                        </span>
                      </div>
                    </div>

                    {/* Descriptive Detail Panel */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-1.5" onClick={() => setSelectedProduct(prod)}>
                        <div className="flex justify-between items-center text-[10px] text-gold-600 uppercase tracking-widest font-bold">
                          <span>{prod.category}</span>
                          <span className="font-mono">{prod.sku || 'HOA-001'}</span>
                        </div>
                        <h4 className="font-serif text-base text-gold-950 font-semibold group-hover:text-gold-700 transition-colors line-clamp-1 cursor-pointer">
                          {prod.name}
                        </h4>
                        <p className="text-xs text-gold-600/90 font-serif italic line-clamp-2 leading-relaxed">
                          "{prod.description}"
                        </p>
                      </div>

                      {/* Sizes & Colors options display */}
                      <div className="flex items-center justify-between text-xs border-t border-gold-50 pt-3">
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] text-gold-500 uppercase tracking-widest font-semibold mr-1">Sizes:</span>
                          <div className="flex gap-1">
                            {prod.sizes.slice(0, 4).map((s) => (
                              <span key={s} className="text-[10px] px-1.5 py-0.5 bg-gold-50/80 text-gold-800 border border-gold-100 rounded font-bold">{s}</span>
                            ))}
                            {prod.sizes.length > 4 && <span className="text-[9px] text-gold-500 font-bold font-sans">+{prod.sizes.length - 4}</span>}
                          </div>
                        </div>

                        {prod.colors && prod.colors.length > 0 && (
                          <div className="flex items-center gap-1">
                            <div className="flex -space-x-1">
                              {prod.colors.slice(0, 3).map((col) => (
                                <span
                                  key={col.name}
                                  className="w-3.5 h-3.5 rounded-full border border-white shadow-xs inline-block"
                                  style={{ backgroundColor: col.hex }}
                                  title={col.name}
                                />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Price and Instant Action Button */}
                      <div className="flex items-center justify-between pt-1">
                        <div>
                          <span className="text-[9px] text-gold-500 uppercase tracking-wider block">Price Value</span>
                          <span className="font-sans font-bold text-base text-gold-950">
                            ₹{prod.price.toLocaleString('en-IN')}
                          </span>
                        </div>

                        <button
                          onClick={() => handleWhatsAppFastEnquiry(prod)}
                          className="px-4 py-2 bg-[#25D366] hover:bg-[#1DA851] text-white text-[10px] font-bold uppercase tracking-wider rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm shadow-emerald-50"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
                            <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.025 3.128l-.904 3.313 3.393-.89c.803.438 1.488.663 2.254.664H12.033c3.181 0 5.767-2.586 5.768-5.766 0-3.18-2.586-5.766-5.77-5.766zm3.332 7.747c-.146.411-.851.758-1.168.805-.317.047-.633.078-1.554-.282-1.071-.419-1.76-1.508-1.813-1.579-.053-.07-.442-.587-.442-1.129 0-.541.282-.807.382-.914.1-.107.218-.134.292-.134.073 0 .146 0 .21.004.068.003.159-.026.248.191.09.218.307.748.334.803.027.054.045.118.009.191-.036.072-.054.118-.11.182-.054.064-.114.143-.163.191-.054.054-.11.114-.047.223.063.11.28.461.602.748.415.371.763.486.868.541.105.054.167.045.23-.027.063-.072.27-.315.342-.423.073-.108.146-.09.245-.054s.633.298.742.353c.11.054.182.082.208.127.028.046.028.265-.118.676z" />
                          </svg>
                          WhatsApp Enquiry
                        </button>
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* DIRECT CONTACT SHOWROOM BOARD */}
            <div className="mt-16 bg-[#F8F5F2] border border-[#EFECE8] rounded-3xl p-6 md:p-8 relative overflow-hidden transition-all duration-300">
              {/* Subtle background decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold-200/10 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-gold-300/10 rounded-full blur-2xl pointer-events-none" />

              <AnimatePresence mode="wait">
                {!showScheduler ? (
                  <motion.div
                    key="showroom-info"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="flex flex-col md:flex-row justify-between items-center gap-8 relative z-10"
                  >
                    <div className="space-y-2 text-center md:text-left flex-1">
                      <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-gold-600 block">Personalized Appointments</span>
                      <h3 className="text-xl md:text-2xl font-serif text-gold-950">Visit Our Varanasi Showroom</h3>
                      <p className="text-sm text-gold-800 font-serif italic max-w-lg leading-relaxed">
                        Arrange a private luxury consultation session at Fort Road, Varanasi, Uttar Pradesh. Enjoy bespoke alterations, custom fabrics, and perfect styling fittings tailored explicitly for you.
                      </p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto shrink-0 justify-center">
                      <a
                        href="tel:9889844494"
                        className="px-6 py-3 bg-white border border-gold-200 text-gold-950 rounded-xl text-xs font-bold uppercase tracking-widest text-center hover:bg-gold-50/50 transition-all shadow-xs cursor-pointer"
                      >
                        Call +91 98898 44494
                      </a>
                      <button
                        onClick={() => setShowScheduler(true)}
                        className="px-6 py-3 bg-gold-950 hover:bg-gold-900 text-[#FCFBF9] rounded-xl text-xs font-bold uppercase tracking-widest text-center transition-all shadow cursor-pointer flex items-center justify-center gap-2"
                      >
                        <Calendar size={14} />
                        Schedule Visit
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="showroom-scheduler"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="w-full space-y-6 relative z-10"
                  >
                    {/* Header with back button */}
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 pb-4 border-b border-gold-200/30">
                      <div>
                        <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-gold-600 block">House of Azmanis</span>
                        <h3 className="text-xl font-serif text-gold-950">Book Showroom Appointment</h3>
                      </div>
                      <button
                        onClick={() => setShowScheduler(false)}
                        className="self-start sm:self-auto px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-gold-700 hover:text-gold-950 hover:bg-gold-100/40 rounded-lg transition-all cursor-pointer flex items-center gap-1 border border-gold-200/20"
                      >
                        ← Back Info
                      </button>
                    </div>

                    {/* Booking Form Fields Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                      
                      {/* Left: Input & Date picker */}
                      <div className="lg:col-span-7 space-y-5">
                        {/* Guest Name input */}
                        <div className="space-y-1.5">
                          <label className="text-[9px] font-bold text-gold-700 uppercase tracking-wider block flex items-center gap-1.5">
                            <User size={11} className="text-gold-600" /> Guest Name (Optional)
                          </label>
                          <input
                            type="text"
                            placeholder="Your full name for a personalized welcome..."
                            value={guestName}
                            onChange={(e) => setGuestName(e.target.value)}
                            className="w-full px-4 py-2.5 bg-white border border-gold-200/60 rounded-xl text-xs text-gold-950 placeholder-gold-450 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all font-sans"
                          />
                        </div>

                        {/* Custom Date Strip Selector */}
                        <div className="space-y-2">
                          <label className="text-[9px] font-bold text-gold-700 uppercase tracking-wider block flex items-center gap-1.5">
                            <Calendar size={11} className="text-gold-600" /> Select Preferred Date
                          </label>
                          <div className="flex gap-2.5 pb-1.5 overflow-x-auto scrollbar-none select-none">
                            {getNextDays().map((date, idx) => {
                              const isSelected = selectedDate.toDateString() === date.toDateString();
                              const weekday = date.toLocaleDateString('en-US', { weekday: 'short' });
                              const dayNum = date.getDate();
                              const month = date.toLocaleDateString('en-US', { month: 'short' });
                              return (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={() => setSelectedDate(date)}
                                  className={`flex flex-col items-center justify-center min-w-[62px] h-[72px] rounded-xl border transition-all duration-300 cursor-pointer ${
                                    isSelected
                                      ? 'bg-gold-950 border-gold-950 text-[#FCFBF9] shadow-md scale-105'
                                      : 'bg-white border-gold-200/40 hover:border-gold-300 text-gold-950 hover:bg-gold-50/20'
                                  }`}
                                >
                                  <span className="text-[8px] font-bold uppercase tracking-wider opacity-85">{weekday}</span>
                                  <span className="text-lg font-serif font-bold my-0.5">{dayNum}</span>
                                  <span className="text-[8px] font-medium tracking-widest uppercase opacity-75">{month}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      {/* Right: Time Blocks & Booking trigger */}
                      <div className="lg:col-span-5 space-y-4">
                        <div className="space-y-2">
                          <label className="text-[9px] font-bold text-gold-700 uppercase tracking-wider block flex items-center gap-1.5">
                            <Clock size={11} className="text-gold-600" /> Select Time Slot
                          </label>
                          <div className="flex flex-col gap-1.5 max-h-[170px] overflow-y-auto pr-1.5 scrollbar-thin">
                            {[
                              "11:00 AM - 12:30 PM (Morning Salon)",
                              "01:30 PM - 03:00 PM (Midday Consultation)",
                              "03:30 PM - 05:00 PM (Afternoon Tea)",
                              "05:30 PM - 07:00 PM (Sunset Viewing)",
                              "07:30 PM - 09:00 PM (Candlelight Soiree)"
                            ].map((slot) => {
                              const isSelected = selectedTimeSlot === slot;
                              return (
                                <button
                                  key={slot}
                                  type="button"
                                  onClick={() => setSelectedTimeSlot(slot)}
                                  className={`px-3 py-2.5 rounded-xl text-left text-[10px] font-medium transition-all duration-200 border cursor-pointer flex items-center justify-between ${
                                    isSelected
                                      ? 'bg-gold-950/5 border-gold-600 text-gold-950 font-bold'
                                      : 'bg-white border-gold-200/40 hover:border-gold-200 text-gold-800'
                                  }`}
                                >
                                  <span>{slot}</span>
                                  {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-gold-600 animate-pulse"></span>}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Pre-fill CTA */}
                        <div className="pt-2">
                          <button
                            onClick={handleConfirmShowroomAppointment}
                            className="w-full py-3 bg-[#25D366] hover:bg-[#1DA851] text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                          >
                            <svg className="w-4 h-4 fill-current text-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.864-9.858.002-2.635-1.023-5.11-2.885-6.974C16.576 1.908 14.1 .881 11.47 .881c-5.439 0-9.863 4.421-9.867 9.86 0 1.705.469 3.376 1.358 4.841l-.99 3.613 3.7.971c1.4-.764 2.802-1.112 4.336-1.112zm8.791-6.195c-.244-.122-1.446-.713-1.671-.795-.224-.082-.388-.122-.55.122-.164.244-.633.796-.776.959-.143.162-.285.183-.53.06-.244-.12-1.03-.379-1.96-1.21-.724-.646-1.213-1.444-1.355-1.687-.143-.244-.015-.375.106-.496.11-.11.244-.285.367-.428.122-.143.163-.244.244-.407.082-.163.041-.306-.02-.428-.062-.122-.55-1.326-.754-1.815-.198-.48-.4-.413-.55-.42-.143-.008-.306-.01-.469-.01-.163 0-.428.061-.653.306-.224.244-.856.837-.856 2.04 0 1.202.876 2.365.998 2.528.122.163 1.722 2.63 4.17 3.687.583.251 1.037.4 1.392.513.585.186 1.117.16 1.538.097.469-.071 1.446-.59 1.651-1.159.204-.57.204-1.059.143-1.159-.06-.1-.223-.162-.468-.284z" />
                            </svg>
                            Confirm via WhatsApp
                          </button>
                        </div>
                      </div>

                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* RECENTLY VIEWED SECTION */}
            {recentlyViewedProducts.length > 0 && (
              <div className="mt-16 pt-12 border-t border-[#EFECE8] max-w-7xl mx-auto w-full px-6 md:px-10 pb-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <div>
                    <div className="flex items-center gap-2">
                      <Clock size={15} className="text-gold-600" />
                      <h4 className="font-sans font-bold text-[#2C2115] text-[10px] uppercase tracking-widest">
                        Recently Viewed
                      </h4>
                    </div>
                    <p className="text-xs text-gold-600 font-serif italic mt-0.5">
                      Your recently inspected luxury pieces of elegant workmanship
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <button
                      onClick={clearRecentlyViewed}
                      className="px-3 py-1.5 border border-gold-200 hover:border-rose-300 hover:bg-rose-50 text-gold-700 hover:text-rose-700 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
                    >
                      <Trash2 size={11} />
                      Clear History
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          const container = document.getElementById('recently-viewed-carousel');
                          if (container) container.scrollBy({ left: -220, behavior: 'smooth' });
                        }}
                        className="p-1.5 border border-gold-200 hover:bg-gold-50 text-gold-800 rounded-lg transition-all cursor-pointer shadow-xs"
                        aria-label="Scroll left"
                      >
                        <ChevronLeft size={14} />
                      </button>
                      <button
                        onClick={() => {
                          const container = document.getElementById('recently-viewed-carousel');
                          if (container) container.scrollBy({ left: 220, behavior: 'smooth' });
                        }}
                        className="p-1.5 border border-gold-200 hover:bg-gold-50 text-gold-800 rounded-lg transition-all cursor-pointer shadow-xs"
                        aria-label="Scroll right"
                      >
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Horizontal Scroll container / Carousel */}
                <div
                  id="recently-viewed-carousel"
                  className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scroll-smooth snap-x snap-mandatory"
                >
                  {recentlyViewedProducts.map((prod) => (
                    <div
                      key={`recent-${prod.id}`}
                      onClick={() => setSelectedProduct(prod)}
                      className="min-w-[170px] w-[170px] sm:min-w-[200px] sm:w-[200px] bg-white border border-[#EFECE8] rounded-xl overflow-hidden cursor-pointer shadow-xs hover:shadow-md hover:border-gold-300 transition-all duration-300 group flex flex-col snap-start relative"
                    >
                      {/* Close button to remove from history */}
                      <button
                        onClick={(e) => removeRecentlyViewedItem(prod.id, e)}
                        className="absolute top-2 right-2 z-10 p-1.5 bg-white/80 hover:bg-white rounded-full border border-gold-200/40 text-gold-800 hover:text-rose-600 transition-all shadow-xs"
                        title="Remove from history"
                      >
                        <X size={10} />
                      </button>

                      {/* Image Thumbnail */}
                      <div className="aspect-[4/5] bg-gold-50/30 overflow-hidden relative">
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=400';
                          }}
                        />
                      </div>

                      {/* Details */}
                      <div className="p-3 flex-1 flex flex-col justify-between space-y-1 bg-white">
                        <div>
                          <span className="text-[8px] uppercase tracking-wider text-gold-500 font-sans block">{prod.category}</span>
                          <h5 className="font-display font-medium text-gold-950 text-xs truncate group-hover:text-gold-600 transition-colors">
                            {prod.name}
                          </h5>
                        </div>
                        <div className="pt-1 flex items-center justify-between border-t border-gold-100/30">
                          <span className="text-xs font-bold text-gold-950">
                            ₹{prod.price.toLocaleString('en-IN')}
                          </span>
                          <span className="text-[8px] font-semibold text-gold-500 uppercase tracking-widest group-hover:text-gold-700 transition-colors">
                            Inspect →
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* FOOTER */}
          <footer className="mt-auto bg-[#F8F5F2] border-t border-[#EFECE8] py-8 px-6 md:px-10 text-xs text-gold-700/80">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
              
              <div className="text-center md:text-left space-y-1">
                <h4 className="font-display font-medium text-gold-950 text-sm tracking-wider">THE HOUSE OF AZMANIS</h4>
                <p className="text-[10px] tracking-wider uppercase">Apparel | Accessories | Lifestyle — Fort Road, Varanasi, India</p>
              </div>

              {/* Social icons */}
              <div className="flex gap-4">
                <button onClick={() => setShowInstagramQR(true)} className="hover:text-gold-950 transition-colors cursor-pointer">Instagram</button>
                <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-gold-950 transition-colors">Facebook</a>
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-gold-950 transition-colors">LinkedIn</a>
              </div>

              <span className="text-[10px] tracking-wider uppercase text-gold-500">
                © 2026 THE HOUSE OF AZMANIS. ALL RIGHTS RESERVED.
              </span>
            </div>
          </footer>

        </main>

      </div>

      {/* 2. Admin Portal Panel */}
      <AdminPortal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        products={products}
        onSaveProducts={handleSaveProducts}
        onResetToDefaults={handleResetToDefaults}
      />

      {/* 3. Product Details Modal */}
      <ProductDetails
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        isWishlisted={selectedProduct ? isWishlisted(selectedProduct.id) : false}
        onToggleWishlist={() => selectedProduct && toggleWishlist(selectedProduct.id)}
      />

      {/* 3.5. Wishlist Slide-over Drawer */}
      <WishlistDrawer
        isOpen={showWishlistDrawer}
        onClose={() => setShowWishlistDrawer(false)}
        wishlistIds={wishlist}
        products={products}
        onToggleWishlist={toggleWishlist}
        onSelectProduct={setSelectedProduct}
        onFastEnquiry={handleWhatsAppFastEnquiry}
      />

      {/* Floating Share Catalog Button */}
      <div className="fixed bottom-24 right-6 z-40 hidden sm:block">
        <motion.button
          onClick={handleShareCatalogWhatsApp}
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2.5 px-5 py-3.5 bg-[#128C7E] hover:bg-[#075E54] text-[#FCFBF9] rounded-full shadow-2xl border border-[#25D366]/30 transition-all cursor-pointer group"
          title="Share Entire Collection on WhatsApp"
        >
          {/* WhatsApp Custom Beautiful Minimal Icon SVG */}
          <svg
            className="w-5 h-5 fill-current text-white transition-transform group-hover:rotate-12 duration-300"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.864-9.858.002-2.635-1.023-5.11-2.885-6.974C16.576 1.908 14.1 .881 11.47 .881c-5.439 0-9.863 4.421-9.867 9.86 0 1.705.469 3.376 1.358 4.841l-.99 3.613 3.7.971c1.4-.764 2.802-1.112 4.336-1.112zm8.791-6.195c-.244-.122-1.446-.713-1.671-.795-.224-.082-.388-.122-.55.122-.164.244-.633.796-.776.959-.143.162-.285.183-.53.06-.244-.12-1.03-.379-1.96-1.21-.724-.646-1.213-1.444-1.355-1.687-.143-.244-.015-.375.106-.496.11-.11.244-.285.367-.428.122-.143.163-.244.244-.407.082-.163.041-.306-.02-.428-.062-.122-.55-1.326-.754-1.815-.198-.48-.4-.413-.55-.42-.143-.008-.306-.01-.469-.01-.163 0-.428.061-.653.306-.224.244-.856.837-.856 2.04 0 1.202.876 2.365.998 2.528.122.163 1.722 2.63 4.17 3.687.583.251 1.037.4 1.392.513.585.186 1.117.16 1.538.097.469-.071 1.446-.59 1.651-1.159.204-.57.204-1.059.143-1.159-.06-.1-.223-.162-.468-.284z" />
          </svg>
          <span className="text-xs font-bold uppercase tracking-wider font-sans select-none text-white">
            Share Catalog
          </span>
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-300"></span>
          </span>
        </motion.button>
      </div>

      {/* Mobile Floating Button - smaller, bottom-left or bottom-right */}
      <div className="fixed bottom-24 right-4 z-40 sm:hidden">
        <motion.button
          onClick={handleShareCatalogWhatsApp}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileTap={{ scale: 0.9 }}
          className="p-3.5 bg-[#128C7E] active:bg-[#075E54] text-[#FCFBF9] rounded-full shadow-2xl border border-[#25D366]/30 cursor-pointer flex items-center justify-center"
          title="Share Entire Collection on WhatsApp"
        >
          <svg
            className="w-5.5 h-5.5 fill-current text-white"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.864-9.858.002-2.635-1.023-5.11-2.885-6.974C16.576 1.908 14.1 .881 11.47 .881c-5.439 0-9.863 4.421-9.867 9.86 0 1.705.469 3.376 1.358 4.841l-.99 3.613 3.7.971c1.4-.764 2.802-1.112 4.336-1.112zm8.791-6.195c-.244-.122-1.446-.713-1.671-.795-.224-.082-.388-.122-.55.122-.164.244-.633.796-.776.959-.143.162-.285.183-.53.06-.244-.12-1.03-.379-1.96-1.21-.724-.646-1.213-1.444-1.355-1.687-.143-.244-.015-.375.106-.496.11-.11.244-.285.367-.428.122-.143.163-.244.244-.407.082-.163.041-.306-.02-.428-.062-.122-.55-1.326-.754-1.815-.198-.48-.4-.413-.55-.42-.143-.008-.306-.01-.469-.01-.163 0-.428.061-.653.306-.224.244-.856.837-.856 2.04 0 1.202.876 2.365.998 2.528.122.163 1.722 2.63 4.17 3.687.583.251 1.037.4 1.392.513.585.186 1.117.16 1.538.097.469-.071 1.446-.59 1.651-1.159.204-.57.204-1.059.143-1.159-.06-.1-.223-.162-.468-.284z" />
          </svg>
        </motion.button>
      </div>

      {/* 4. Instagram Details Modal / QR */}
      <AnimatePresence>
        {showInstagramQR && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl max-w-sm w-full p-6 relative border border-gold-200 text-center space-y-5 shadow-2xl font-sans"
            >
              <button
                onClick={() => setShowInstagramQR(false)}
                className="absolute top-4 right-4 text-gold-800 hover:text-gold-950 cursor-pointer"
              >
                <X size={18} />
              </button>

              <div className="space-y-1">
                <span className="text-[9px] uppercase tracking-widest text-gold-600 font-bold block">Social Media Presence</span>
                <h3 className="font-display text-lg font-medium text-gold-950 tracking-wide uppercase">Connect On Instagram</h3>
              </div>

              {/* Premium Simulated Beautiful QR Code for Instagram */}
              <div className="bg-gold-50 p-6 rounded-xl border border-gold-100 flex flex-col items-center justify-center space-y-4">
                <div className="w-44 h-44 bg-white border-2 border-gold-400 p-2.5 rounded-lg relative flex items-center justify-center shadow-inner">
                  {/* Luxury vector design layout representing QR code pattern */}
                  <svg viewBox="0 0 100 100" className="w-full h-full text-gold-900 fill-current opacity-90">
                    {/* Corner anchors */}
                    <rect x="0" y="0" width="25" height="25" />
                    <rect x="3" y="3" width="19" height="19" fill="white" />
                    <rect x="7" y="7" width="11" height="11" />

                    <rect x="75" y="0" width="25" height="25" />
                    <rect x="78" y="3" width="19" height="19" fill="white" />
                    <rect x="82" y="7" width="11" height="11" />

                    <rect x="0" y="75" width="25" height="25" />
                    <rect x="3" y="78" width="19" height="19" fill="white" />
                    <rect x="7" y="82" width="11" height="11" />

                    {/* Dynamic abstract QR blocks resembling brand */}
                    <rect x="35" y="5" width="5" height="15" />
                    <rect x="45" y="0" width="15" height="5" />
                    <rect x="30" y="25" width="15" height="5" />
                    <rect x="50" y="20" width="10" height="10" />
                    <rect x="65" y="10" width="5" height="25" />
                    <rect x="5" y="35" width="15" height="5" />
                    <rect x="15" y="45" width="10" height="15" />
                    <rect x="0" y="65" width="10" height="5" />
                    
                    <rect x="35" y="45" width="30" height="30" fill="white" />
                    {/* Small golden emblem in center */}
                    <path d="M50,48 C48,51 45,53 45,56 C45,59 48,61 50,64 C52,61 55,59 55,56 C55,53 52,51 50,48 Z" fill="#bfa15c" />

                    <rect x="75" y="35" width="20" height="5" />
                    <rect x="80" y="45" width="15" height="15" />
                    <rect x="70" y="65" width="10" height="10" />
                    <rect x="35" y="85" width="15" height="5" />
                    <rect x="55" y="80" width="30" height="5" />
                    <rect x="45" y="90" width="10" height="10" />
                    <rect x="65" y="90" width="20" height="5" />
                  </svg>
                </div>
                <span className="text-xs font-semibold text-gold-950 font-sans tracking-wider">@TheHouseOfAzmanis</span>
              </div>

              <div className="space-y-3">
                <p className="text-xs text-gold-700 font-serif italic">
                  "Scan the code or click the elegant link below to browse our aesthetic lifestyle reels, client diaries, and luxury designer highlights."
                </p>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white text-xs font-bold uppercase tracking-widest rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer shadow"
                >
                  <Instagram size={14} /> Open Instagram Profile
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
