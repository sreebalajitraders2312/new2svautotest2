export type Mode = "automobile" | "industrial";

export type StockStatus = "in-stock" | "ready-stock" | "available";

export interface Product {
  id: string;
  name: string;
  slug: string;
  slugOverride?: string;
  oemNumber: string;
  shortDescription: string;
  fullDescription?: string;
  brand: string;
  category: string;
  categorySlug: string;
  compatibleVehicles?: string[];
  compatibleApplications?: string[];
  technicalSpecs?: Record<string, string>;
  availableSizes?: string[];
  stockStatus: StockStatus;
  popularityRank: number;
  imageUrl?: string;
  imageFallbackInitials: string;
}

export interface Category {
  id: string;
  title: string;
  slug: string;
  slugOverride?: string;
  description: string;
  count: string;
  imageUrl?: string;
  catalogueCopy: string;
}

export interface Brand {
  id: string;
  name: string;
  mode: Mode;
}

export interface Vehicle {
  id: string;
  title: string;
  slug: string;
  description: string;
  imageUrl?: string;
  parts: string[];
}

export type VehicleType = Vehicle;

export interface Application {
  id: string;
  title: string;
  slug: string;
  description: string;
  imageUrl?: string;
  parts: string[];
  badge: string;
}

export type ApplicationType = Application;

export interface NavContent {
  explore: string;
  search: string;
  quote: string;
  mobileSearch: string;
}

export interface HomeAdvantage {
  title: string;
  copy: string;
}

export interface ContactItem {
  label: string;
  value: string;
}

export interface FeaturedProductReference {
  category: string;
  product: string;
  code: string;
}

export interface PageIntro {
  title: string;
  copy: string;
}

export interface ContactPageContent extends PageIntro {
  subtitle: string;
  address: string;
  hoursKicker: string;
  hoursTitle: string;
  hoursCopy: string;
  mapTitle: string;
  mapCopy: string;
}

export interface SearchResultPreview {
  category: string;
  product: string;
  code: string;
  meta: string;
  price: string;
  status: string;
}

export interface SearchPageContent extends PageIntro {
  breadcrumb: string;
  placeholder: string;
  suggestionLabel: string;
  resultsTitle: string;
  seeAll: string;
  filters: string[];
  suggestions: string[];
  results: SearchResultPreview[];
}

export interface FilterField {
  label: string;
  placeholder: string;
  options: string[];
}

export interface FilterPanelContent {
  title: string;
  copy: string;
  fields: FilterField[];
}

export interface TrustItem {
  title: string;
  subtitle: string;
  icon: string;
}

export interface DetailContent {
  compatTitle: string;
  specTitle: string;
  descriptionTitle: string;
  primaryLabel: string;
  secondaryLabel: string;
  noteLabel: string;
  metaPoints: string[];
  trust: TrustItem[];
}

export interface FooterContent {
  copy: string;
}

export interface ModeContent {
  brandSub: string;
  nav: NavContent;
  home: {
    title: string;
    copy: string;
    points: string[];
    categoryTitle: string;
    featuredTitle: string;
    brandsKicker: string;
    brandsTitle: string;
    advantageKicker: string;
    advantageTitle: string;
    contactTitle: string;
    contactCopy: string;
    advantages: HomeAdvantage[];
    contactList: ContactItem[];
    featured: FeaturedProductReference[];
  };
  categoriesOverview: PageIntro;
  brandsPage: PageIntro;
  contactPage: ContactPageContent;
  searchPage: SearchPageContent;
  filterPanel: FilterPanelContent;
  explore: PageIntro;
  detail: DetailContent;
  footer: FooterContent;
}

export interface Catalogue {
  modes: Record<Mode, ModeContent>;
  categories: Record<Mode, Category[]>;
  products: Record<Mode, Record<string, Product[]>>;
  brands: Record<Mode, Brand[]>;
  vehicles: VehicleType[];
  applications: ApplicationType[];
}
