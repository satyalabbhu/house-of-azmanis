import { Product } from './types';

export const PRESET_CATEGORIES = [
  'Kurtis',
  'Suits',
  'Sarees',
  'Western Wear',
  'Handbags',
  'Accessories'
];

export const PRESET_COLORS = [
  { name: 'Ivory White', hex: '#FDFBF7' },
  { name: 'Cream Beige', hex: '#F3EFE0' },
  { name: 'Powder Blue', hex: '#B2CBE1' },
  { name: 'Sunshine Yellow', hex: '#FDF1A9' },
  { name: 'Blush Pink', hex: '#F5C1C9' },
  { name: 'Sage Green', hex: '#B2C4B2' },
  { name: 'Forest Green', hex: '#1C3B2B' },
  { name: 'Royal Plum', hex: '#4A1E3E' },
  { name: 'Lilac Floral', hex: '#D6C0D9' },
  { name: 'Crimson Red', hex: '#9E1A1A' },
  { name: 'Golden Zari', hex: '#D4AF37' },
  { name: 'Tan Brown', hex: '#A0522D' },
  { name: 'Midnight Black', hex: '#1C1C1C' }
];

export const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 'prod_1',
    name: 'White Mughal Floral Kurti Set',
    category: 'Kurtis',
    price: 1899,
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800',
    description: 'Exquisite white cotton kurti with delicate hand-block red and sage floral prints. Comes with comfortable straight cotton trousers and an elegant matching dupatta. Perfect for casual summer days and daytime gatherings.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Ivory White', hex: '#FDFBF7' }
    ],
    isFeatured: true,
    fabric: '100% Pure Organic Cotton',
    care: 'Dry clean recommended or hand wash cold separately with mild liquid detergent. Dry in shade.',
    sku: 'HOA-K-001'
  },
  {
    id: 'prod_2',
    name: 'Ivory Garden Sharara Suit',
    category: 'Suits',
    price: 2499,
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=800',
    description: 'A timeless ivory cream georgette sharara set. Features detailed colorful floral thread embroidery along the sweet V-neckline and sleeve borders. Designed with a tiered flared sharara pants and an ethereal organza dupatta.',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Cream Beige', hex: '#F3EFE0' }
    ],
    isFeatured: true,
    fabric: 'Georgette with Soft Butter Crepe Lining',
    care: 'Dry clean only. Gentle steam iron on reverse side.',
    sku: 'HOA-S-002'
  },
  {
    id: 'prod_3',
    name: 'Powder Blue Royal Anarkali Set',
    category: 'Suits',
    price: 1999,
    image: 'https://images.unsplash.com/photo-1608748010899-18f300247112?auto=format&fit=crop&q=80&w=800',
    description: 'A beautiful sky-blue long anarkali suit featuring a detailed lace panel neck, delicate floral motifs, and matched with comfortable straight pants. Completed with a lightweight powder blue sheer chiffon dupatta.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Powder Blue', hex: '#B2CBE1' }
    ],
    isFeatured: true,
    fabric: 'Premium Mulmul Cotton Blend',
    care: 'Hand wash cold separately. Iron with warm heat.',
    sku: 'HOA-S-003'
  },
  {
    id: 'prod_4',
    name: 'Sunshine Yellow Organza Suit',
    category: 'Suits',
    price: 2299,
    image: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&q=80&w=800',
    description: 'Elevate your festive look in this lemon-yellow silk-cotton straight suit. Highlighted with intricate floral lace inserts along the neckline and cuffs, paired with a gorgeous translucent organza dupatta painted with large rose prints.',
    sizes: ['M', 'L', 'XL'],
    colors: [
      { name: 'Sunshine Yellow', hex: '#FDF1A9' }
    ],
    isFeatured: true,
    fabric: 'Silk-Cotton & Organza Chiffon',
    care: 'Dry clean only. Do not bleach or tumble dry.',
    sku: 'HOA-S-004'
  },
  {
    id: 'prod_5',
    name: 'Sage Green Blossom Suit',
    category: 'Kurtis',
    price: 1799,
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=800',
    description: 'An elegant pastel green straight fit kurti set with comfortable trousers. Embellished with subtle pink and cream thread work embroidery along the neckline, and finished with comfortable, breathable pants.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Sage Green', hex: '#B2C4B2' }
    ],
    isFeatured: false,
    fabric: 'Pure Cotton Linen',
    care: 'Machine wash delicate cycle with cold water. Iron on low heat.',
    sku: 'HOA-K-005'
  },
  {
    id: 'prod_6',
    name: 'Blush Pink Floral Anarkali',
    category: 'Kurtis',
    price: 2699,
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=800',
    description: 'Exquisite blush pink long-line flared anarkali suit. Adorned with a dense pastel flower garland border along the lower hem and paired with matching cigarette pants and a hand-painted floral dupatta.',
    sizes: ['S', 'M', 'L'],
    colors: [
      { name: 'Blush Pink', hex: '#F5C1C9' }
    ],
    isFeatured: false,
    fabric: 'Chanderi Silk Blend',
    care: 'Dry clean only. Store in a cool, dry muslin cloth bag.',
    sku: 'HOA-K-006'
  },
  {
    id: 'prod_7',
    name: 'Deep Forest Emerald Suit',
    category: 'Suits',
    price: 2899,
    image: 'https://images.unsplash.com/photo-1610030470298-40b355e717ce?auto=format&fit=crop&q=80&w=800',
    description: 'A regal deep forest-olive green straight suit set. Highlighted with gold thread borders and a beautifully detailed traditional bandhani patterned green/maroon mixed dupatta. Perfect for evening formal functions.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Forest Green', hex: '#1C3B2B' }
    ],
    isFeatured: true,
    fabric: 'Pure Chanderi Silk with Cotton Lining',
    care: 'Dry clean recommended. Iron on low heat with press cloth.',
    sku: 'HOA-S-007'
  },
  {
    id: 'prod_8',
    name: 'Royal Plum Palazzo Set',
    category: 'Suits',
    price: 2199,
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800',
    description: 'Modern straight-cut kurta in royal plum purple paired with matching wide-leg palazzo trousers. Features high-quality embroidery down the sleeve cuffs, side slits, and neck opening. Highly comfortable for festive and office wear.',
    sizes: ['M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Royal Plum', hex: '#4A1E3E' }
    ],
    isFeatured: false,
    fabric: 'Liva Modal Rayon',
    care: 'Gentle hand wash with liquid soap. Do not wring. Cool iron.',
    sku: 'HOA-S-008'
  },
  {
    id: 'prod_9',
    name: 'Lilac Floral Meadow Kurti Set',
    category: 'Kurtis',
    price: 1899,
    image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&q=80&w=800',
    description: 'A stunning lavender-lilac floral georgette kurti set featuring comfortable solid-colored pants. Crafted with soft, lightweight fabric printed in beautiful watercolor-style floral patterns and detailed neck embroidery.',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Lilac Floral', hex: '#D6C0D9' }
    ],
    isFeatured: false,
    fabric: 'Premium Georgette with Crepe Lining',
    care: 'Gentle cold wash or dry clean. Do not expose to direct sunlight for long hours.',
    sku: 'HOA-K-009'
  },
  {
    id: 'prod_10',
    name: 'Royal Red Banarasi Brocade Saree',
    category: 'Sarees',
    price: 4999,
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800&q=50', // placeholder for saree
    description: 'A masterpiece of traditional Indian weaving. This royal red saree features intricate gold zari work brocade designs across the body, leading to an ornate gold borders and pallu. Includes an unstitched matching blouse piece.',
    sizes: ['One Size (5.5m Saree + 0.8m Blouse)'],
    colors: [
      { name: 'Crimson Red', hex: '#9E1A1A' },
      { name: 'Golden Zari', hex: '#D4AF37' }
    ],
    isFeatured: true,
    fabric: 'Katan Silk with Real Zari threads',
    care: 'Dry clean only. Store wrapped in soft muslin or tissue paper to protect zari luster.',
    sku: 'HOA-SR-010'
  },
  {
    id: 'prod_11',
    name: 'Tan Leather Elite Tote Handbag',
    category: 'Handbags',
    price: 1599,
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=800',
    description: 'A premium, classic top-handle tote handbag crafted in rich tan vegan leather with secure golden hardware accents. Features double top-handles, a detachable adjustable shoulder strap, three spacious zipped compartments, and a sleek modern aesthetic.',
    sizes: ['Medium Tote (12" x 9" x 5")'],
    colors: [
      { name: 'Tan Brown', hex: '#A0522D' }
    ],
    isFeatured: true,
    fabric: 'High-Grade Premium Vegan Leather',
    care: 'Wipe clean with a damp, soft cloth. Do not use alcohol-based cleansers.',
    sku: 'HOA-H-011'
  },
  {
    id: 'prod_12',
    name: 'Royal Pearl Kundan Chandbali Jhumkas',
    category: 'Accessories',
    price: 699,
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800',
    description: 'A breath-taking pair of traditional Indian chandbali-style jhumka earrings. Plated in high-luster 22k gold, adorned with shimmering Kundan glass stones, and finished with delicate off-white freshwater pearl drop details.',
    sizes: ['Standard Earring (3.2" Length)'],
    colors: [
      { name: 'Golden Zari', hex: '#D4AF37' }
    ],
    isFeatured: true,
    fabric: '22k Gold-Plated Brass Alloy & Pearls',
    care: 'Avoid direct contact with water, perfumes, hairspray, and lotion. Wipe gently with dry cotton and store in an airtight box.',
    sku: 'HOA-A-012'
  }
];

export const getStoredProducts = (): Product[] => {
  if (typeof window === 'undefined') return DEFAULT_PRODUCTS;
  const stored = localStorage.getItem('hoa_products');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Error parsing stored products, falling back to default', e);
    }
  }
  // Initialize storage
  localStorage.setItem('hoa_products', JSON.stringify(DEFAULT_PRODUCTS));
  return DEFAULT_PRODUCTS;
};

export const saveStoredProducts = (products: Product[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('hoa_products', JSON.stringify(products));
};
