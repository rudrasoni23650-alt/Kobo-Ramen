export interface MenuItem {
  id: string;
  name: string;
  japaneseName: string;
  category: 'ramen' | 'small_plates' | 'sides' | 'drinks';
  price: string;
  description: string;
  highlight: string;
  tastingNotes: string[];
  ingredients: string[];
  dietary?: string[];
  brothViscosity?: number; // 1 to 5
  spiceLevel?: number; // 0 to 3
  pairing?: string;
  image: string;
}

export interface IngredientHotspot {
  id: string;
  name: string;
  japanese: string;
  x: number; // percentage
  y: number; // percentage
  description: string;
  source: string;
}

export interface LayerStep {
  step: number;
  title: string;
  japaneseTitle: string;
  subtitle: string;
  description: string;
  metric: string;
  details: string[];
  videoSrc?: string;
  poster?: string;
  startTime?: number;
  endTime?: number;
  shortLabel?: string;
}
