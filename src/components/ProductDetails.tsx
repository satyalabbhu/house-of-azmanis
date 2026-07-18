import React, { useState } from 'react';
import { Product, DEFAULT_SIZE_CHART } from '../types';
import { X, Ruler, Heart, Star, Check, Phone } from 'lucide-react';

interface ProductDetailsProps {
  product: Product | null;
  onClose: () => void;
  isWishlisted: boolean;
  onToggleWishlist: () => void;
}

export default function ProductDetails({
  product,
  onClose,
  isWishlisted,
  onToggleWishlist,
}: ProductDetailsProps) {
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<{ name: string; hex: string } | null>(null);
  const [showSizeChart, setShowSizeChart] = useState(false);

  if (!product) return null;

  // Set default selection values on render
  const activeColor = selectedColor || (product.colors && product.colors.length > 0 ? product.colors[0] : null);
  const activeSize = selectedSize || (product.sizes && product.sizes.length > 0 ? product.sizes[0] : '');

  // Dynamic WhatsApp formulation with Indian-centric numbering from the brand details (+91 98898 44494)
  const handleWhatsAppEnquiry = () => {
    const formattedPrice = `₹${product.price.toLocaleString('en-IN')}`;
    const colorPart = activeColor ? `Color: ${activeColor.name}` : 'Default color';
    const sizePart = activeSize ? `Size: ${activeSize}` : 'Standard';
    
    const message = `Hello! I would like to enquire about this premium garment at The House of Azmanis:

🌸 *Product Name:* ${product.name}
🔢 *SKU:* ${product.sku || 'N/A'}
💰 *Price:* ${formattedPrice}
📏 *${sizePart}*
🎨 *${colorPart}*

Could you please confirm its availability and provide further booking details? Thank you!`;

    const encodedMessage = encodeURIComponent(message);
    const phoneNumber = '919889844494'; // Shreya Bhattacharya mobile without spaces or prefix
    const url = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(url, '_blank');
  };

  return (
    <div id="product-details-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div id="product-details-container" className="relative bg-[#FCFBF9] rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col md:flex-row animate-fade-in border border-[#F0EBE0] font-sans">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-white/85 hover:bg-white rounded-full text-gold-950 border border-gold-200 transition-colors shadow cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* LEFT: Premium Image showcase */}
        <div className="md:w-1/2 relative bg-[#F5F2EF] min-h-[350px] md:min-h-[500px] flex items-center justify-center group overflow-hidden">
          {product.isFeatured && (
            <span className="absolute top-4 left-4 z-10 bg-gold-600 text-white text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded shadow-sm">
              New Arrival
            </span>
          )}
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover select-none transition-transform duration-700 hover:scale-105"
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=600';
            }}
          />
          {/* Subtle branding layer */}
          <div className="absolute bottom-4 right-4 bg-white/70 px-2 py-1 backdrop-blur-xs text-[8px] tracking-[0.2em] font-medium text-gold-900 uppercase pointer-events-none rounded border border-gold-200">
            The House of Azmanis
          </div>
        </div>

        {/* RIGHT: High-End Editorial Specifications */}
        <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-y-auto max-h-[90vh] md:max-h-[600px]">
          
          <div className="space-y-5">
            {/* Breadcrumb / Category */}
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-gold-600 block">
                {product.category}
              </span>
              <span className="text-xs text-gold-500 font-mono">
                {product.sku || 'HOA-GEN-001'}
              </span>
            </div>

            {/* Title & Price */}
            <div>
              <h2 className="text-xl md:text-2xl font-serif text-gold-950 leading-tight tracking-tight">
                {product.name}
              </h2>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-xl font-sans font-semibold text-gold-900">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-gold-500 line-through">
                  ₹{(product.price * 1.25).toFixed(0).toLocaleString()}
                </span>
                <span className="text-xs text-green-700 font-semibold bg-green-50 px-2 py-0.5 rounded">
                  20% Off
                </span>
              </div>
            </div>

            <div className="h-[1px] w-full bg-gold-200/50" />

            {/* Luxurious Description */}
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-wider font-bold text-gold-700 font-sans">The Story</p>
              <p className="text-sm font-serif italic text-gold-800 leading-relaxed">
                "{product.description}"
              </p>
            </div>

            {/* Size Options & Size Chart Selector */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs uppercase tracking-wider font-bold text-gold-700 font-sans">
                  Available Sizes
                </label>
                <button
                  onClick={() => setShowSizeChart(true)}
                  className="text-xs text-gold-500 hover:text-gold-900 font-medium flex items-center gap-1.5 transition-colors cursor-pointer border-b border-dashed border-gold-300 pb-0.5"
                >
                  <Ruler size={12} /> Size Chart
                </button>
              </div>
              <div className="flex gap-2 flex-wrap">
                {product.sizes.map((s) => {
                  const isActive = activeSize === s;
                  return (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`min-w-[40px] px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                        isActive
                          ? 'bg-gold-950 text-white shadow-sm ring-1 ring-gold-500'
                          : 'bg-white border border-gold-200 text-gold-800 hover:border-gold-400'
                      }`}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Color Swatch Options (Dynamic) */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider font-bold text-gold-700 font-sans block">
                  Select Shade: <span className="text-gold-950 font-sans font-medium">{activeColor?.name}</span>
                </label>
                <div className="flex gap-3 items-center">
                  {product.colors.map((col) => {
                    const isActive = activeColor?.name === col.name;
                    return (
                      <button
                        key={col.name}
                        onClick={() => setSelectedColor(col)}
                        className={`w-8 h-8 rounded-full border border-black/10 flex items-center justify-center p-0.5 transition-all shadow-sm cursor-pointer ${
                          isActive ? 'ring-2 ring-gold-500 ring-offset-2 scale-110' : 'hover:scale-105'
                        }`}
                        title={col.name}
                      >
                        <span className="w-full h-full rounded-full" style={{ backgroundColor: col.hex }}>
                          {isActive && <Check size={10} className="text-white mx-auto mt-1 stroke-2 mix-blend-difference" />}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Additional Garment Attributes */}
            <div className="bg-gold-50/60 p-3.5 rounded-lg border border-gold-100 grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-gold-500 font-medium uppercase tracking-wider text-[9px] block">Fabric Structure</span>
                <span className="font-semibold text-gold-900 mt-0.5 block">{product.fabric || 'Pure Premium Silk Cotton'}</span>
              </div>
              <div>
                <span className="text-gold-500 font-medium uppercase tracking-wider text-[9px] block">Care Guide</span>
                <span className="font-semibold text-gold-900 mt-0.5 block">{product.care || 'Gentle Handwash / Dry Clean'}</span>
              </div>
            </div>

          </div>

          {/* Core Boutique Call to Action */}
          <div className="mt-8 space-y-3">
            <button
              onClick={handleWhatsAppEnquiry}
              className="w-full py-4 bg-[#25D366] hover:bg-[#1DA851] text-white rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2.5 transition-colors cursor-pointer shadow-md shadow-emerald-100"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white" className="shrink-0">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.025 3.128l-.904 3.313 3.393-.89c.803.438 1.488.663 2.254.664H12.033c3.181 0 5.767-2.586 5.768-5.766 0-3.18-2.586-5.766-5.77-5.766zm3.332 7.747c-.146.411-.851.758-1.168.805-.317.047-.633.078-1.554-.282-1.071-.419-1.76-1.508-1.813-1.579-.053-.07-.442-.587-.442-1.129 0-.541.282-.807.382-.914.1-.107.218-.134.292-.134.073 0 .146 0 .21.004.068.003.159-.026.248.191.09.218.307.748.334.803.027.054.045.118.009.191-.036.072-.054.118-.11.182-.054.064-.114.143-.163.191-.054.054-.11.114-.047.223.063.11.28.461.602.748.415.371.763.486.868.541.105.054.167.045.23-.027.063-.072.27-.315.342-.423.073-.108.146-.09.245-.054s.633.298.742.353c.11.054.182.082.208.127.028.046.028.265-.118.676z" />
              </svg>
              Enquire on WhatsApp
            </button>
            <div className="flex gap-2.5">
              <button
                onClick={onToggleWishlist}
                className={`flex-1 py-2.5 border text-[10px] font-bold uppercase tracking-widest rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  isWishlisted
                    ? 'bg-rose-50 text-rose-600 border-rose-200'
                    : 'bg-white text-gold-800 border-gold-200 hover:bg-gold-50'
                }`}
              >
                <Heart size={14} className={isWishlisted ? 'fill-rose-500 text-rose-500' : ''} />
                {isWishlisted ? 'In Wishlist' : 'Add to Wishlist'}
              </button>
              <button
                onClick={() => alert(`Call us directly at +91 98898 44494 to arrange a custom boutique appointment at Fort Road, Varanasi`)}
                className="px-4 py-2.5 border border-gold-300 hover:bg-gold-50 text-[10px] font-bold uppercase tracking-widest text-gold-900 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Phone size={12} /> Call Direct
              </button>
            </div>
            <p className="text-[10px] text-center text-gold-500 font-serif italic mt-1">
              *All products are handmade/locally sourced in India with ultimate care.
            </p>
          </div>

        </div>

      </div>

      {/* INNER: SIZE CHART MODAL OVERLAY */}
      {showSizeChart && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 relative border border-gold-200 animate-slide-up">
            <button
              onClick={() => setShowSizeChart(false)}
              className="absolute top-4 right-4 text-gold-800 hover:text-gold-950 cursor-pointer"
            >
              <X size={18} />
            </button>
            
            <div className="mb-4">
              <h3 className="text-base font-display font-medium text-gold-950 uppercase tracking-wide">Azmanis Standard Size Chart</h3>
              <p className="text-xs text-gold-600 font-serif italic">Body measurements in inches (standard Indian sizing)</p>
            </div>

            <div className="overflow-x-auto border border-gold-100 rounded-lg">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-gold-100/50 text-gold-900 border-b border-gold-200 font-semibold">
                    <th className="p-3">Size</th>
                    <th className="p-3">Bust</th>
                    <th className="p-3">Waist</th>
                    <th className="p-3">Hips</th>
                    <th className="p-3">Length</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gold-50">
                  {DEFAULT_SIZE_CHART.map((row) => (
                    <tr key={row.size} className="hover:bg-gold-50/30">
                      <td className="p-3 font-semibold text-gold-950">{row.size}</td>
                      <td className="p-3 text-gold-800">{row.bust}</td>
                      <td className="p-3 text-gold-800">{row.waist}</td>
                      <td className="p-3 text-gold-800">{row.hip}</td>
                      <td className="p-3 text-gold-800">{row.length}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 bg-gold-50 p-3 rounded text-[11px] text-gold-700 space-y-1">
              <p>📐 *How to measure:*</p>
              <ul className="list-disc pl-4 space-y-0.5">
                <li><strong>Bust:</strong> Measure around the fullest part of your chest.</li>
                <li><strong>Waist:</strong> Measure around your natural waistline (narrowest part).</li>
                <li><strong>Hips:</strong> Measure around the fullest part of your seat.</li>
              </ul>
            </div>

            <button
              onClick={() => setShowSizeChart(false)}
              className="w-full mt-5 py-2.5 bg-gold-600 hover:bg-gold-700 text-white rounded text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
            >
              Close Size Chart
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
