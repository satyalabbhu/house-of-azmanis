import React, { useState, useRef } from 'react';
import { Product, ColorOption } from '../types';
import { PRESET_CATEGORIES, PRESET_COLORS } from '../data';
import { X, Plus, Trash2, Upload, AlertCircle, RefreshCw } from 'lucide-react';

interface AdminPortalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSaveProducts: (newProducts: Product[]) => void;
  onResetToDefaults: () => void;
}

export default function AdminPortal({
  isOpen,
  onClose,
  products,
  onSaveProducts,
  onResetToDefaults
}: AdminPortalProps) {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [category, setCategory] = useState(PRESET_CATEGORIES[0]);
  const [customCategory, setCustomCategory] = useState('');
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [price, setPrice] = useState<number>(1500);
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const [fabric, setFabric] = useState('');
  const [care, setCare] = useState('');
  const [sku, setSku] = useState('');
  const [sizes, setSizes] = useState<string[]>(['S', 'M', 'L', 'XL']);
  const [colors, setColors] = useState<ColorOption[]>([]);
  const [isFeatured, setIsFeatured] = useState(false);

  // Helper form states
  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#bfa15c');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const resetForm = () => {
    setName('');
    setCategory(PRESET_CATEGORIES[0]);
    setCustomCategory('');
    setIsCustomCategory(false);
    setPrice(1500);
    setImage('');
    setDescription('');
    setFabric('');
    setCare('');
    setSku('');
    setSizes(['S', 'M', 'L', 'XL']);
    setColors([]);
    setIsFeatured(false);
    setNewColorName('');
    setNewColorHex('#bfa15c');
  };

  const handleStartAdd = () => {
    resetForm();
    setIsAdding(true);
    setEditingProduct(null);
    // Generate simple SKU
    setSku(`HOA-${Date.now().toString().slice(-6)}`);
  };

  const handleStartEdit = (product: Product) => {
    setEditingProduct(product);
    setIsAdding(false);
    setName(product.name);
    
    if (PRESET_CATEGORIES.includes(product.category)) {
      setCategory(product.category);
      setIsCustomCategory(false);
    } else {
      setCategory('Custom');
      setCustomCategory(product.category);
      setIsCustomCategory(true);
    }
    
    setPrice(product.price);
    setImage(product.image);
    setDescription(product.description);
    setFabric(product.fabric || '');
    setCare(product.care || '');
    setSku(product.sku || '');
    setSizes(product.sizes);
    setColors(product.colors || []);
    setIsFeatured(!!product.isFeatured);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !image || !description) {
      alert('Please fill out the name, description, and provide an image.');
      return;
    }

    const finalCategory = isCustomCategory ? customCategory.trim() : category;
    if (!finalCategory) {
      alert('Please specify a category.');
      return;
    }

    const productData: Product = {
      id: editingProduct ? editingProduct.id : `prod_${Date.now()}`,
      name,
      category: finalCategory,
      price: Number(price),
      image,
      description,
      fabric,
      care,
      sku: sku || `HOA-${Date.now().toString().slice(-6)}`,
      sizes,
      colors,
      isFeatured
    };

    if (editingProduct) {
      // Update existing
      const updated = products.map((p) => (p.id === editingProduct.id ? productData : p));
      onSaveProducts(updated);
      setEditingProduct(null);
    } else {
      // Create new
      onSaveProducts([productData, ...products]);
      setIsAdding(false);
    }
    resetForm();
  };

  const handleDelete = (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      const filtered = products.filter((p) => p.id !== productId);
      onSaveProducts(filtered);
      if (editingProduct?.id === productId) {
        setEditingProduct(null);
        resetForm();
      }
    }
  };

  const handleSizeToggle = (size: string) => {
    if (sizes.includes(size)) {
      setSizes(sizes.filter((s) => s !== size));
    } else {
      setSizes([...sizes, size]);
    }
  };

  const handleAddColor = () => {
    if (!newColorName.trim()) return;
    // Check duplicate
    if (colors.some((c) => c.name.toLowerCase() === newColorName.toLowerCase())) return;

    setColors([...colors, { name: newColorName.trim(), hex: newColorHex }]);
    setNewColorName('');
  };

  const handleRemoveColor = (colorName: string) => {
    setColors(colors.filter((c) => c.name !== colorName));
  };

  const handlePresetColorSelect = (preset: { name: string; hex: string }) => {
    if (colors.some((c) => c.name === preset.name)) return;
    setColors([...colors, preset]);
  };

  // Image Upload base64 Conversion
  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setImage(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div id="admin-portal-overlay" className="fixed inset-0 z-50 flex items-center justify-end bg-black/50 backdrop-blur-xs">
      <div id="admin-sidebar" className="w-full max-w-4xl h-full bg-[#FCFBF9] shadow-2xl flex flex-col overflow-hidden animate-slide-in font-sans">
        
        {/* Portal Header */}
        <div className="px-8 py-5 bg-[#F8F5F2] border-b border-gold-200 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-display font-medium tracking-wider text-gold-900">Merchant Showroom Admin</h2>
            <p className="text-xs text-gold-600 font-serif italic mt-0.5">Maintain catalog, sizes, color swatches, and photography</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onResetToDefaults}
              className="px-3 py-1.5 border border-red-200 text-red-700 bg-red-50 hover:bg-red-100 transition-colors rounded text-xs flex items-center gap-1 cursor-pointer"
              title="Reset current catalog to pristine luxury defaults"
            >
              <RefreshCw size={12} />
              Reset Catalog
            </button>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-gold-100 rounded-full text-gold-800 transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Portal Content area split: Left Product List, Right Creator Form */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* LEFT: CURRENT PRODUCTS LIST */}
          <div className="w-2/5 border-r border-gold-100 flex flex-col bg-white">
            <div className="p-4 border-b border-gold-100 bg-[#FCFBF9] flex justify-between items-center">
              <span className="text-xs font-bold uppercase tracking-wider text-gold-700">{products.length} Products</span>
              <button
                onClick={handleStartAdd}
                className="px-3 py-1.5 bg-gold-500 text-white text-xs font-medium uppercase tracking-wider hover:bg-gold-600 transition-colors flex items-center gap-1 rounded cursor-pointer shadow-sm"
              >
                <Plus size={14} /> Add New
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto divide-y divide-gold-50">
              {products.map((prod) => (
                <div
                  key={prod.id}
                  onClick={() => handleStartEdit(prod)}
                  className={`p-4 flex gap-3 hover:bg-gold-50/50 transition-all cursor-pointer group relative ${
                    (editingProduct?.id === prod.id || (isAdding && !editingProduct)) ? 'bg-gold-50 border-l-4 border-gold-500' : ''
                  }`}
                >
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-16 h-20 object-cover border border-gold-100 rounded bg-gold-50 shrink-0"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=200';
                    }}
                  />
                  <div className="flex-1 min-w-0 pr-4">
                    <span className="text-[9px] uppercase tracking-widest font-bold text-gold-600 block">{prod.category}</span>
                    <h4 className="text-sm font-medium text-gold-950 truncate group-hover:text-gold-700 transition-colors">{prod.name}</h4>
                    <p className="text-xs font-serif font-medium text-gold-900 mt-1">₹{prod.price.toLocaleString('en-IN')}</p>
                    <div className="flex gap-1 mt-1.5 flex-wrap">
                      {prod.sizes.slice(0, 3).map((s) => (
                        <span key={s} className="text-[9px] font-sans border border-gold-200 px-1 text-gold-700 bg-gold-50/40 rounded">{s}</span>
                      ))}
                      {prod.sizes.length > 3 && <span className="text-[9px] text-gold-500 font-sans">+{prod.sizes.length - 3}</span>}
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(prod.id);
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 text-red-300 hover:text-red-600 bg-red-50/0 hover:bg-red-50 rounded transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                    title="Delete Product"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: EDITOR FORM */}
          <div className="w-3/5 bg-[#FCFBF9] overflow-y-auto p-8">
            {(!isAdding && !editingProduct) ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 text-gold-600">
                <svg viewBox="0 0 100 100" className="w-16 h-16 text-gold-300 stroke-current fill-none mb-4">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M30 20 h40 M30 35 h40 M30 50 h40 M30 65 h25" />
                  <rect x="20" y="10" width="60" height="80" rx="4" strokeWidth="2" />
                </svg>
                <h3 className="font-display font-medium text-base text-gold-900">No Product Selected</h3>
                <p className="text-xs font-serif italic max-w-xs mt-1.5">
                  Select an existing boutique item from the left pane to edit its specifications, or click <strong className="text-gold-700 font-sans">Add New</strong> to launch a design.
                </p>
                <button
                  onClick={handleStartAdd}
                  className="mt-6 px-4 py-2 bg-gold-500 hover:bg-gold-600 text-white text-xs font-sans font-medium uppercase tracking-widest transition-all rounded shadow"
                >
                  Create Product Now
                </button>
              </div>
            ) : (
              <form onSubmit={handleSave} className="space-y-6">
                <div className="border-b border-gold-100 pb-3">
                  <h3 className="text-base font-display font-medium text-gold-950 uppercase tracking-wide">
                    {editingProduct ? `Modify: ${editingProduct.name}` : 'Introduce New Creation'}
                  </h3>
                  <p className="text-xs text-gold-600 font-serif italic">Update photography and customize characteristics</p>
                </div>

                {/* SKU & Category Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-bold text-gold-700 mb-1">Product SKU</label>
                    <input
                      type="text"
                      value={sku}
                      onChange={(e) => setSku(e.target.value)}
                      placeholder="e.g. HOA-K-013"
                      className="w-full border border-gold-200 focus:border-gold-500 bg-white rounded px-3 py-2 text-sm outline-none transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-bold text-gold-700 mb-1">Featured Highlight</label>
                    <div className="flex items-center h-10">
                      <input
                        type="checkbox"
                        id="isFeatured"
                        checked={isFeatured}
                        onChange={(e) => setIsFeatured(e.target.checked)}
                        className="w-4 h-4 text-gold-500 border-gold-300 rounded focus:ring-gold-500 cursor-pointer"
                      />
                      <label htmlFor="isFeatured" className="ml-2 text-xs font-medium text-gold-800 cursor-pointer">
                        Pin in New Arrivals Gallery
                      </label>
                    </div>
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-bold text-gold-700 mb-1">Creation Title</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Lavender Georgette Anarkali Suit"
                    className="w-full border border-gold-200 focus:border-gold-500 bg-white rounded px-3 py-2 text-sm outline-none transition-colors font-medium text-gold-950"
                    required
                  />
                </div>

                {/* Category Selection */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-bold text-gold-700 mb-1">Select Base Collection</label>
                    <select
                      value={isCustomCategory ? 'Custom' : category}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === 'Custom') {
                          setIsCustomCategory(true);
                        } else {
                          setIsCustomCategory(false);
                          setCategory(val);
                        }
                      }}
                      className="w-full border border-gold-200 focus:border-gold-500 bg-white rounded px-3 py-2 text-sm outline-none transition-colors"
                    >
                      {PRESET_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                      <option value="Custom">New Custom Category...</option>
                    </select>
                  </div>
                  
                  {isCustomCategory && (
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider font-bold text-gold-700 mb-1">Custom Collection Name</label>
                      <input
                        type="text"
                        value={customCategory}
                        onChange={(e) => setCustomCategory(e.target.value)}
                        placeholder="e.g. Velvet Shawls"
                        className="w-full border border-gold-200 focus:border-gold-500 bg-white rounded px-3 py-2 text-sm outline-none transition-colors"
                        required
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-bold text-gold-700 mb-1">Pricing (₹ INR)</label>
                    <input
                      type="number"
                      value={price || ''}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      placeholder="e.g. 1899"
                      min="0"
                      className="w-full border border-gold-200 focus:border-gold-500 bg-white rounded px-3 py-2 text-sm outline-none transition-colors font-medium"
                      required
                    />
                  </div>
                </div>

                {/* Photo Upload System */}
                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-bold text-gold-700 mb-1">Boutique Photo</label>
                  
                  {/* Photo input selector */}
                  <div className="grid grid-cols-12 gap-3 mb-2">
                    <div className="col-span-8">
                      <input
                        type="text"
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                        placeholder="Paste image URL here, or upload below"
                        className="w-full border border-gold-200 focus:border-gold-500 bg-white rounded px-3 py-2 text-xs outline-none transition-colors"
                      />
                    </div>
                    <div className="col-span-4 flex items-center justify-end">
                      <span className="text-[10px] text-gold-500 italic">or upload/drag below</span>
                    </div>
                  </div>

                  {/* Drag and Drop Zone */}
                  <div
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-lg p-5 text-center cursor-pointer transition-all ${
                      dragActive ? 'border-gold-500 bg-gold-50/50' : 'border-gold-200 bg-white hover:bg-gold-50/20'
                    }`}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                    
                    {image ? (
                      <div className="flex items-center justify-center gap-4">
                        <img
                          src={image}
                          alt="Boutique Preview"
                          className="w-16 h-20 object-cover border border-gold-200 rounded"
                          referrerPolicy="no-referrer"
                        />
                        <div className="text-left">
                          <p className="text-xs font-bold text-gold-800 flex items-center gap-1">
                            <Upload size={12} /> Image Configured
                          </p>
                          <p className="text-[10px] text-gold-500">Click or drag to change files</p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        <Upload className="mx-auto text-gold-400" size={24} />
                        <p className="text-xs font-semibold text-gold-800">Drag boutique photo here or click to browse</p>
                        <p className="text-[10px] text-gold-500">Supports JPEG, PNG, WEBP files</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Sizes Selector */}
                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-bold text-gold-700 mb-2">Available Size Options</label>
                  <div className="flex gap-2 flex-wrap">
                    {['S', 'M', 'L', 'XL', 'XXL', '3XL', 'One Size'].map((size) => {
                      const active = sizes.includes(size);
                      return (
                        <button
                          key={size}
                          type="button"
                          onClick={() => handleSizeToggle(size)}
                          className={`px-3 py-1.5 border text-xs font-medium rounded-md transition-all cursor-pointer ${
                            active
                              ? 'bg-gold-500 text-white border-gold-500 shadow-sm'
                              : 'bg-white text-gold-800 border-gold-200 hover:border-gold-400'
                          }`}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Colors Builder (Hex Picker) */}
                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-bold text-gold-700 mb-1.5">Color Swatches ({colors.length})</label>
                  
                  {/* Current Active Swatches */}
                  {colors.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3 bg-white p-3 border border-gold-100 rounded">
                      {colors.map((col) => (
                        <div
                          key={col.name}
                          className="flex items-center gap-1.5 pl-1.5 pr-2 py-1 bg-gold-50 border border-gold-200 rounded-full text-xs text-gold-950 font-medium"
                        >
                          <span className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0" style={{ backgroundColor: col.hex }}></span>
                          <span>{col.name}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveColor(col.name)}
                            className="p-0.5 hover:bg-gold-200 rounded-full text-gold-600 transition-colors ml-1 cursor-pointer"
                          >
                            <X size={10} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add Color Form */}
                  <div className="flex gap-2 items-center bg-white p-3 border border-gold-200 rounded-md">
                    <input
                      type="color"
                      value={newColorHex}
                      onChange={(e) => setNewColorHex(e.target.value)}
                      className="w-8 h-8 rounded border border-gold-200 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={newColorName}
                      onChange={(e) => setNewColorName(e.target.value)}
                      placeholder="e.g. Royal Maroon"
                      className="flex-1 border border-gold-200 rounded px-2.5 py-1.5 text-xs outline-none focus:border-gold-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddColor}
                      className="px-3 py-1.5 bg-gold-100 hover:bg-gold-200 text-gold-800 font-sans text-xs uppercase tracking-wider font-medium rounded transition-all cursor-pointer"
                    >
                      Add Swatch
                    </button>
                  </div>

                  {/* Quick Preset Colors suggestion bar */}
                  <div className="mt-2.5">
                    <p className="text-[10px] text-gold-600 italic font-serif mb-1.5">Quick Brand Presets:</p>
                    <div className="flex gap-2 overflow-x-auto pb-1.5 max-w-full scrollbar-thin">
                      {PRESET_COLORS.map((col) => (
                        <button
                          key={col.name}
                          type="button"
                          onClick={() => handlePresetColorSelect(col)}
                          className="flex items-center gap-1 px-2 py-1 bg-white border border-gold-100 rounded hover:border-gold-300 text-[10px] text-gold-800 transition-all shrink-0 cursor-pointer"
                        >
                          <span className="w-2.5 h-2.5 rounded-full border border-black/10 shrink-0" style={{ backgroundColor: col.hex }}></span>
                          <span>{col.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-bold text-gold-700 mb-1">Product Story & Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide a luxurious and detailed description that captures her attention..."
                    rows={3}
                    className="w-full border border-gold-200 focus:border-gold-500 bg-white rounded px-3 py-2 text-sm outline-none transition-colors font-serif italic text-gold-900"
                    required
                  />
                </div>

                {/* Fabric & Care */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-bold text-gold-700 mb-1">Fabric details</label>
                    <input
                      type="text"
                      value={fabric}
                      onChange={(e) => setFabric(e.target.value)}
                      placeholder="e.g. 100% Organza Silk"
                      className="w-full border border-gold-200 focus:border-gold-500 bg-white rounded px-3 py-2 text-sm outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-bold text-gold-700 mb-1">Wash Care Instructions</label>
                    <input
                      type="text"
                      value={care}
                      onChange={(e) => setCare(e.target.value)}
                      placeholder="e.g. Dry clean recommended"
                      className="w-full border border-gold-200 focus:border-gold-500 bg-white rounded px-3 py-2 text-sm outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Form Buttons */}
                <div className="flex gap-3 justify-end pt-4 border-t border-gold-100">
                  <button
                    type="button"
                    onClick={() => {
                      resetForm();
                      setIsAdding(false);
                      setEditingProduct(null);
                    }}
                    className="px-5 py-2.5 border border-gold-200 text-gold-800 hover:bg-gold-50 text-xs font-sans font-medium uppercase tracking-widest transition-all rounded cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-gold-600 hover:bg-gold-700 text-white text-xs font-sans font-medium uppercase tracking-widest transition-all rounded shadow"
                  >
                    {editingProduct ? 'Save Changes' : 'Publish Product'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
