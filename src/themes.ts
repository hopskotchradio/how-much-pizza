import type { FoodType } from './types';

export interface Theme {
  name: string;
  bg: string;
  surface: string;
  surfaceHover: string;
  accent: string;
  accentGlow: string;
  text: string;
  textMuted: string;
  textDim: string;
}

export const LIGHT_THEMES: Record<FoodType, Theme> = {
  pizza: {
    name: 'Margherita',
    bg: '#fef9f5',
    surface: '#ffffff',
    surfaceHover: '#fff5f0',
    accent: '#d42b2b',
    accentGlow: 'rgba(212, 43, 43, 0.15)',
    text: '#2d1b11',
    textMuted: '#8b6f5e',
    textDim: '#c4a998',
  },
  tacos: {
    name: 'Fiesta',
    bg: '#fefdf5',
    surface: '#ffffff',
    surfaceHover: '#fefce8',
    accent: '#d97706',
    accentGlow: 'rgba(217, 119, 6, 0.15)',
    text: '#1c1917',
    textMuted: '#78716c',
    textDim: '#c4b5a3',
  },
  subs: {
    name: 'Deli Fresh',
    bg: '#f5faf7',
    surface: '#ffffff',
    surfaceHover: '#ecfdf5',
    accent: '#b45309',
    accentGlow: 'rgba(180, 83, 9, 0.15)',
    text: '#1a2e1a',
    textMuted: '#6b7c6b',
    textDim: '#a8b5a8',
  },
  wings: {
    name: 'Buffalo',
    bg: '#fef7f0',
    surface: '#ffffff',
    surfaceHover: '#fff3e8',
    accent: '#ea580c',
    accentGlow: 'rgba(234, 88, 12, 0.15)',
    text: '#27150b',
    textMuted: '#9a7262',
    textDim: '#cfb8a8',
  },
  chinese: {
    name: 'Lucky Red',
    bg: '#fef5f5',
    surface: '#ffffff',
    surfaceHover: '#fef2f2',
    accent: '#be123c',
    accentGlow: 'rgba(190, 18, 60, 0.15)',
    text: '#1a1a2e',
    textMuted: '#71717a',
    textDim: '#b5b5be',
  },
};

export const DARK_THEMES: Record<FoodType, Theme> = {
  pizza: {
    name: 'Margherita (Dark)',
    bg: '#1a0a0a',
    surface: '#2a1515',
    surfaceHover: '#3a2020',
    accent: '#e94560',
    accentGlow: 'rgba(233, 69, 96, 0.3)',
    text: '#fce8e8',
    textMuted: '#c49090',
    textDim: '#6b4040',
  },
  tacos: {
    name: 'Fiesta (Dark)',
    bg: '#1a1508',
    surface: '#2a2410',
    surfaceHover: '#3a3418',
    accent: '#f59e0b',
    accentGlow: 'rgba(245, 158, 11, 0.3)',
    text: '#fef3c7',
    textMuted: '#c4a040',
    textDim: '#6b5820',
  },
  subs: {
    name: 'Deli Fresh (Dark)',
    bg: '#0a1a0f',
    surface: '#152a1a',
    surfaceHover: '#1f3a25',
    accent: '#d97706',
    accentGlow: 'rgba(217, 119, 6, 0.3)',
    text: '#e8fce8',
    textMuted: '#80b080',
    textDim: '#406040',
  },
  wings: {
    name: 'Buffalo (Dark)',
    bg: '#1a0f08',
    surface: '#2a1a10',
    surfaceHover: '#3a2a18',
    accent: '#f97316',
    accentGlow: 'rgba(249, 115, 22, 0.3)',
    text: '#fef0e0',
    textMuted: '#c48850',
    textDim: '#6b4828',
  },
  chinese: {
    name: 'Lucky Red (Dark)',
    bg: '#1a0a10',
    surface: '#2a1520',
    surfaceHover: '#3a2030',
    accent: '#f43f5e',
    accentGlow: 'rgba(244, 63, 94, 0.3)',
    text: '#fce8f0',
    textMuted: '#c47090',
    textDim: '#6b3050',
  },
};

export function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.style.setProperty('--bg', theme.bg);
  root.style.setProperty('--surface', theme.surface);
  root.style.setProperty('--surface-hover', theme.surfaceHover);
  root.style.setProperty('--accent', theme.accent);
  root.style.setProperty('--accent-glow', theme.accentGlow);
  root.style.setProperty('--text', theme.text);
  root.style.setProperty('--text-muted', theme.textMuted);
  root.style.setProperty('--text-dim', theme.textDim);
}
