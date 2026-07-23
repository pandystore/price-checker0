import type {
  Discount,
  GitHubConfig,
  Offer,
  Product,
  Settings,
  StoreData,
  Theme,
} from "../types";

export const DEFAULT_THEME: Theme = {
  shopName: "سوبر ماركت النور",
  shopLogo: "",
  primaryColor: "#15803d",
  accentColor: "#f59e0b",
  bgColor: "#fffdf5",
};

export const DEFAULT_SETTINGS: Settings = {
  displayDuration: 8,
  soundEnabled: true,
  errorSoundEnabled: true,
  adminPassword: "1234",
  roundTo5: true,
};

export const DEFAULT_GITHUB: GitHubConfig = {
  token: "",
  owner: "",
  repo: "",
  branch: "main",
  path: "data.json",
};

export const DEFAULT_OFFERS: Offer[] = [
  {
    id: "o1",
    title: "خصم 30% على كل الأحذية",
    subtitle: "أحذية رياضية وكلاسيك — لفترة محدودة",
    emoji: "👟",
    color: "#dc2626",
  },
  {
    id: "o2",
    title: "العروض الأسبوعية",
    subtitle: "وفّر أكثر على البقالة والمشروبات",
    emoji: "🔥",
    color: "#f59e0b",
  },
  {
    id: "o3",
    title: "اشترِ 2 واحصل على 1",
    subtitle: "على العصائر والمشروبات الغازية",
    emoji: "🎁",
    color: "#2563eb",
  },
];

export const DEFAULT_DISCOUNTS: Discount[] = [
  { id: "d1", group: "أحذية", percentage: 30, active: true },
];

export const DEFAULT_PRODUCTS: Product[] = [
  {
    itemCode: "62210008",
    merchantCode: "M-108",
    name: "حذاء رياضي خفيف",
    unit: "زوج",
    price: 480,
    originalPrice: 550,
    group: "أحذية",
  },
  {
    itemCode: "62210333",
    merchantCode: "M-109",
    name: "حذاء كلاسيك جلد",
    unit: "زوج",
    price: 720,
    originalPrice: 850,
    group: "أحذية",
  },
  {
    itemCode: "6001234500017",
    merchantCode: "M-201",
    name: "عصير برتقال طبيعي ١لتر",
    unit: "كرتونة",
    price: 38,
    originalPrice: 0,
    group: "مشروبات",
  },
  {
    itemCode: "6001234500024",
    merchantCode: "M-202",
    name: "مياه معدنية ٦٠٠ مل",
    unit: "حبة",
    price: 7,
    originalPrice: 0,
    group: "مشروبات",
  },
  {
    itemCode: "62210501",
    merchantCode: "M-301",
    name: "أرز مصري فاخر ٥ كجم",
    unit: "شيكارة",
    price: 135,
    originalPrice: 160,
    group: "بقالة",
  },
  {
    itemCode: "62210502",
    merchantCode: "M-302",
    name: "سكر أبيض ناعم ١ كجم",
    unit: "كيس",
    price: 32,
    originalPrice: 0,
    group: "بقالة",
  },
  {
    itemCode: "62210601",
    merchantCode: "M-401",
    name: "شامبو للأطفال ٤٠٠ مل",
    unit: "حبة",
    price: 65,
    originalPrice: 80,
    group: "منظفات",
  },
  {
    itemCode: "62210701",
    merchantCode: "M-501",
    name: "قميص قطن رجالي",
    unit: "قطعة",
    price: 220,
    originalPrice: 290,
    group: "ملابس",
  },
];

export const DEFAULT_DATA: StoreData = {
  products: DEFAULT_PRODUCTS,
  offers: DEFAULT_OFFERS,
  discounts: DEFAULT_DISCOUNTS,
  settings: DEFAULT_SETTINGS,
  theme: DEFAULT_THEME,
  github: DEFAULT_GITHUB,
};
