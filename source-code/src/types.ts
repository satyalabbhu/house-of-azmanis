export interface ColorOption {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  name: string;
  category: 'Kurtis' | 'Suits' | 'Sarees' | 'Western Wear' | 'Handbags' | 'Accessories' | string;
  price: number;
  image: string; // URL or Base64 encoded string
  description: string;
  sizes: string[]; // S, M, L, XL, XXL etc.
  colors: ColorOption[];
  isFeatured?: boolean;
  fabric?: string;
  care?: string;
  sku?: string;
}

export interface SizeChart {
  size: string;
  bust: string;
  waist: string;
  hip: string;
  length: string;
}

export const DEFAULT_SIZE_CHART: SizeChart[] = [
  { size: 'S', bust: '36"', waist: '32"', hip: '38"', length: '44"' },
  { size: 'M', bust: '38"', waist: '34"', hip: '40"', length: '44"' },
  { size: 'L', bust: '40"', waist: '36"', hip: '42"', length: '45"' },
  { size: 'XL', bust: '42"', waist: '38"', hip: '44"', length: '45"' },
  { size: 'XXL', bust: '44"', waist: '40"', hip: '46"', length: '46"' },
];
