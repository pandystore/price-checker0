export interface Product {
  itemCode: string;
  merchantCode: string;
  name: string;
  unit: string;
  price: number;
  originalPrice: number;
  group: string;
}

export interface Offer {
  id: string;
  title: string;
  subtitle: string;
  emoji: string;
  /** tailwind-friendly hex background */
  color: string;
}

export interface Discount {
  id: string;
  group: string;
  percentage: number;
  active: boolean;
}

export interface Settings {
  /** كم ثانية يظهر فيها السعر قبل الاختفاء التلقائي */
  displayDuration: number;
  soundEnabled: boolean;
  errorSoundEnabled: boolean;
  adminPassword: string;
  /** التقريب لأقرب 5 جنيهات */
  roundTo5: boolean;
}

export interface Theme {
  shopName: string;
  shopLogo: string; // data URL أو رابط
  primaryColor: string; // أخضر أساسي
  accentColor: string; // أصفر/ذهبي
  bgColor: string; // لون خلفية الواجهة
}

export interface GitHubConfig {
  token: string;
  owner: string;
  repo: string;
  branch: string;
  path: string;
}

export interface StoreData {
  products: Product[];
  offers: Offer[];
  discounts: Discount[];
  settings: Settings;
  theme: Theme;
  github: GitHubConfig;
}

export interface PriceBreakdown {
  finalPrice: number;
  originalPrice: number;
  unitPrice: number;
  saved: number;
  discountPercentage: number;
  hasDiscount: boolean;
  groupApplied: string | null;
}
