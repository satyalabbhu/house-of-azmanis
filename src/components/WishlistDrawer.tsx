import React from 'react';
import { Product } from '../types';
import { X, Heart, Trash2, ShoppingBag, ExternalLink, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistIds: string[];
  products: Product[];
  onToggleWishlist: (id: string) => void;
  onSelectProduct: (product: Product) => void;
  onFastEnquiry: (product: Product) => void;
}

export default function WishlistDrawer({
  isOpen,
  onClose,
  wishlistIds,
  products,
  onToggleWishlist,
  onSelectProduct,
  onFastEnquiry,
}: WishlistDrawerProps) {
  // Filter products that are in the wishlist
  const wishlistProducts = products.filter((p) => wishlistIds.includes(p.id));

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end overflow-hidden font-sans">
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-xs"
          />

          {/* Drawer container panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="relative w-full max-w-md bg-[#FCFBF9] h-full shadow-2xl flex flex-col justify-between z-10 border-l border-gold-200/50"
          >
            {/* Header portion */}
            <div className="p-6 border-b border-[#EFECE8] bg-[#F8F5F2] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart size={18} className="text-rose-500 fill-rose-500" />
                <div>
                  <h2 className="text-sm uppercase tracking-[0.2em] font-bold text-gold-950">
                    My Wishlist
                  </h2>
                  <p className="text-[10px] text-gold-600 font-serif italic">
                    {wishlistProducts.length === 1
                      ? '1 elegant masterpiece saved'
                      : `${wishlistProducts.length} masterpieces saved`}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-gold-100 rounded-full text-gold-900 transition-colors cursor-pointer border border-transparent hover:border-gold-200"
                aria-label="Close drawer"
              >
                <X size={18} />
              </button>
            </div>

            {/* List scrollable section */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {wishlistProducts.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-4 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center border border-rose-100">
                    <ShoppingBag size={24} className="text-rose-400" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-display font-medium text-gold-950 text-sm tracking-wide uppercase">
                      Wishlist is Empty
                    </h3>
                    <p className="text-xs text-gold-600 font-serif italic max-w-[240px] mx-auto leading-relaxed">
                      "Save garments you love by tapping the heart icon, and we will keep them right here for easy enquiry."
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="px-6 py-2 bg-gold-600 hover:bg-gold-700 text-white text-[10px] font-bold uppercase tracking-widest rounded transition-all cursor-pointer shadow-xs"
                  >
                    Continue Browsing
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-gold-100/50">
                  {wishlistProducts.map((prod) => (
                    <div
                      key={prod.id}
                      className="py-4 first:pt-0 last:pb-0 flex gap-4 group items-start"
                    >
                      {/* Product small display image */}
                      <div
                        onClick={() => {
                          onSelectProduct(prod);
                          onClose();
                        }}
                        className="w-20 h-24 bg-gold-50 rounded-lg overflow-hidden border border-gold-100 shrink-0 cursor-pointer relative"
                      >
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=200';
                          }}
                        />
                      </div>

                      {/* Info & action triggers */}
                      <div className="flex-1 flex flex-col justify-between h-24">
                        <div className="space-y-0.5">
                          <span className="text-[9px] uppercase tracking-wider text-gold-600 font-bold">
                            {prod.category}
                          </span>
                          <h4
                            onClick={() => {
                              onSelectProduct(prod);
                              onClose();
                            }}
                            className="text-xs font-serif text-gold-950 font-semibold group-hover:text-gold-700 cursor-pointer transition-colors line-clamp-1"
                          >
                            {prod.name}
                          </h4>
                          <span className="text-xs font-sans font-bold text-gold-900 block pt-0.5">
                            ₹{prod.price.toLocaleString('en-IN')}
                          </span>
                        </div>

                        {/* Actions line */}
                        <div className="flex gap-2 items-center pt-2">
                          {/* Fast Whatsapp contact */}
                          <button
                            onClick={() => onFastEnquiry(prod)}
                            className="flex-1 py-1.5 bg-[#25D366] hover:bg-[#1DA851] text-white text-[9px] font-bold uppercase tracking-wider rounded flex items-center justify-center gap-1 transition-colors cursor-pointer"
                          >
                            <MessageCircle size={10} className="fill-white" />
                            <span>Enquire</span>
                          </button>

                          {/* Quick spec display link */}
                          <button
                            onClick={() => {
                              onSelectProduct(prod);
                              onClose();
                            }}
                            className="p-1.5 border border-gold-200 hover:border-gold-400 bg-white hover:bg-gold-50 text-gold-800 rounded transition-colors cursor-pointer"
                            title="View specs"
                          >
                            <ExternalLink size={10} />
                          </button>

                          {/* Remove favorited item */}
                          <button
                            onClick={() => onToggleWishlist(prod.id)}
                            className="p-1.5 border border-rose-100 hover:border-rose-300 bg-rose-50/50 hover:bg-rose-50 text-rose-600 rounded transition-colors cursor-pointer"
                            title="Remove from wishlist"
                          >
                            <Trash2 size={10} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer with checkout guidance */}
            {wishlistProducts.length > 0 && (
              <div className="p-6 border-t border-[#EFECE8] bg-[#F8F5F2] space-y-3">
                <div className="bg-white p-3 rounded-lg border border-gold-200/50 text-[11px] text-gold-700 font-serif leading-relaxed italic">
                  * All designs are customizable. Tap "Enquire" to send a fast booking query to Shreya Bhattacharya over WhatsApp directly.
                </div>
                <button
                  onClick={() => {
                    const productNames = wishlistProducts.map((p) => p.name).join(', ');
                    const message = `Hello! I have saved these beautiful designs in my wishlist on The House of Azmanis and want to enquire about them:
🌸 *Items:* ${productNames}

Are these currently available for ordering? Thank you!`;
                    const encoded = encodeURIComponent(message);
                    window.open(`https://wa.me/919889844494?text=${encoded}`, '_blank');
                  }}
                  className="w-full py-3.5 bg-gold-950 hover:bg-gold-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer shadow"
                >
                  <MessageCircle size={12} className="fill-white" />
                  Enquire All on WhatsApp
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
