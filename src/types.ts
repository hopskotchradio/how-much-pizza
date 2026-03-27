export type FoodType = 'pizza' | 'tacos' | 'subs' | 'wings' | 'chinese';

export interface FoodConfig {
  label: string;
  emoji: string;
  unit: string;
  unitPlural: string;
  servingsPerUnit: number;
  description: string;
  // How many "servings" an average adult eats
  avgServingsPerAdult: number;
  avgServingsPerKid: number;
}

export interface OrderResult {
  units: number;
  totalServings: number;
  servingsPerPerson: number;
  leftoverServings: number;
  summary: string;
  tip: string;
}

export const FOOD_CONFIGS: Record<FoodType, FoodConfig> = {
  pizza: {
    label: 'Pizza',
    emoji: '🍕',
    unit: 'large pizza',
    unitPlural: 'large pizzas',
    servingsPerUnit: 8, // 8 slices per large
    description: 'slices',
    avgServingsPerAdult: 3,
    avgServingsPerKid: 1.5,
  },
  tacos: {
    label: 'Tacos',
    emoji: '🌮',
    unit: 'taco',
    unitPlural: 'tacos',
    servingsPerUnit: 1,
    description: 'tacos',
    avgServingsPerAdult: 3,
    avgServingsPerKid: 1.5,
  },
  subs: {
    label: 'Subs',
    emoji: '🥖',
    unit: 'full sub',
    unitPlural: 'full subs',
    servingsPerUnit: 2, // a full sub feeds ~2
    description: 'half subs',
    avgServingsPerAdult: 1.5,
    avgServingsPerKid: 1,
  },
  wings: {
    label: 'Wings',
    emoji: '🍗',
    unit: 'wing',
    unitPlural: 'wings',
    servingsPerUnit: 1,
    description: 'wings',
    avgServingsPerAdult: 10,
    avgServingsPerKid: 5,
  },
  chinese: {
    label: 'Chinese',
    emoji: '🥡',
    unit: 'entrée',
    unitPlural: 'entrées',
    servingsPerUnit: 2.5, // one entrée feeds ~2.5 people
    description: 'servings',
    avgServingsPerAdult: 1.5,
    avgServingsPerKid: 1,
  },
};

export const HUNGER_LABELS = [
  { value: 0, label: '"We already ate"', emoji: '😐' },
  { value: 1, label: 'Light snacking', emoji: '🙂' },
  { value: 2, label: 'Normal appetite', emoji: '😊' },
  { value: 3, label: 'Pretty hungry', emoji: '😋' },
  { value: 4, label: 'Starving', emoji: '🤤' },
  { value: 5, label: 'Post-workout football team', emoji: '🏈' },
];
