import type { Theme, ThemeCatalog } from './types.js';

/**
 * Dreamy pastel theme with soft purples and pinks
 */
export const dreamy: Theme = {
    name: 'Dreamy',
    description: 'Soft pastels with dreamy atmosphere',
    mode: 'dark',
    colors: {
        bgDeep: '#1a1a2e',
        bgMid: '#232342',
        bgCard: '#2a2a4a',
        bgGlow: '#3d3d6b',
        bgOverlay: '#1a1a2e',

        primary1: '#c9a0dc',
        primary2: '#b8a9d9',
        primary3: '#e8a4c9',
        primary4: '#7eb8da',
        primary5: '#8ad4d4',
        primary6: '#f0c4a8',

        accent1: '#a855f7',
        accent2: '#ff6b9d',
        accent3: '#64c8ff',

        textPrimary: '#e8e0f0',
        textSecondary: '#c8c0d8',
        textMuted: '#9090b0',
    },
    fonts: {
        heading: "'Quicksand', sans-serif",
        body: "'Zen Maru Gothic', sans-serif",
        mono: "'Space Mono', monospace",
    },
    effects: {
        glowColor: 'rgba(168, 85, 247, 0.15)',
        glowIntensity: 0.3,
        particleColors: ['#c9a0dc', '#b8a9d9', '#e8a4c9', '#8ad4d4', '#a855f7'],
        useNoise: true,
        noiseOpacity: 0.03,
    },
};

/**
 * High contrast cyberpunk neon theme
 */
export const cyberpunk: Theme = {
    name: 'Cyberpunk',
    description: 'High contrast neons against dark backgrounds',
    mode: 'dark',
    colors: {
        bgDeep: '#0a0a0f',
        bgMid: '#12121a',
        bgCard: '#1a1a25',
        bgGlow: '#252535',
        bgOverlay: '#0f0a18',

        primary1: '#ff00ff',
        primary2: '#00ffff',
        primary3: '#ff0080',
        primary4: '#00ff80',
        primary5: '#8000ff',
        primary6: '#ffff00',

        accent1: '#ff00ff',
        accent2: '#00ffff',
        accent3: '#ff0080',

        textPrimary: '#ffffff',
        textSecondary: '#b0b0c0',
        textMuted: '#606080',
    },
    fonts: {
        heading: "'Orbitron', sans-serif",
        body: "'Rajdhani', sans-serif",
        mono: "'Fira Code', monospace",
    },
    effects: {
        glowColor: 'rgba(255, 0, 255, 0.2)',
        glowIntensity: 0.5,
        particleColors: ['#ff00ff', '#00ffff', '#ff0080', '#00ff80'],
        useNoise: false,
        noiseOpacity: 0,
    },
};

/**
 * Warm sunset oranges and purples
 */
export const sunset: Theme = {
    name: 'Sunset',
    description: 'Warm oranges and purples like a summer sunset',
    mode: 'dark',
    colors: {
        bgDeep: '#1a1020',
        bgMid: '#2a1830',
        bgCard: '#3a2040',
        bgGlow: '#4a2850',
        bgOverlay: '#1f0f1f',

        primary1: '#ff9966',
        primary2: '#ff6b8a',
        primary3: '#c084fc',
        primary4: '#fbbf24',
        primary5: '#fb7185',
        primary6: '#fdba74',

        accent1: '#f97316',
        accent2: '#ec4899',
        accent3: '#8b5cf6',

        textPrimary: '#fef3e2',
        textSecondary: '#e8d5c4',
        textMuted: '#a89080',
    },
    fonts: {
        heading: "'Playfair Display', serif",
        body: "'Lora', serif",
        mono: "'Source Code Pro', monospace",
    },
    effects: {
        glowColor: 'rgba(249, 115, 22, 0.15)',
        glowIntensity: 0.35,
        particleColors: ['#ff9966', '#ff6b8a', '#c084fc', '#fbbf24', '#fb7185'],
        useNoise: true,
        noiseOpacity: 0.02,
    },
};

/**
 * Deep ocean blues and teals
 */
export const ocean: Theme = {
    name: 'Ocean',
    description: 'Deep blues and teals with bioluminescent accents',
    mode: 'dark',
    colors: {
        bgDeep: '#0a1628',
        bgMid: '#0f2035',
        bgCard: '#152a42',
        bgGlow: '#1e3a50',
        bgOverlay: '#0a1420',

        primary1: '#38bdf8',
        primary2: '#22d3ee',
        primary3: '#2dd4bf',
        primary4: '#34d399',
        primary5: '#67e8f9',
        primary6: '#a5f3fc',

        accent1: '#06b6d4',
        accent2: '#14b8a6',
        accent3: '#0ea5e9',

        textPrimary: '#e0f7fa',
        textSecondary: '#b2ebf2',
        textMuted: '#6ba3b0',
    },
    fonts: {
        heading: "'Nunito', sans-serif",
        body: "'Open Sans', sans-serif",
        mono: "'Fira Code', monospace",
    },
    effects: {
        glowColor: 'rgba(34, 211, 238, 0.12)',
        glowIntensity: 0.25,
        particleColors: ['#38bdf8', '#22d3ee', '#2dd4bf', '#67e8f9'],
        useNoise: false,
        noiseOpacity: 0,
    },
};

/**
 * Clean monochromatic with purple accents
 */
export const mono: Theme = {
    name: 'Mono',
    description: 'Clean monochromatic design with subtle accents',
    mode: 'dark',
    colors: {
        bgDeep: '#111111',
        bgMid: '#1a1a1a',
        bgCard: '#222222',
        bgGlow: '#2a2a2a',
        bgOverlay: '#141418',

        primary1: '#a0a0a0',
        primary2: '#909090',
        primary3: '#b0b0b0',
        primary4: '#808080',
        primary5: '#c0c0c0',
        primary6: '#d0d0d0',

        accent1: '#a855f7',
        accent2: '#9333ea',
        accent3: '#7c3aed',

        textPrimary: '#f5f5f5',
        textSecondary: '#a0a0a0',
        textMuted: '#606060',
    },
    fonts: {
        heading: "'Inter', sans-serif",
        body: "'Inter', sans-serif",
        mono: "'JetBrains Mono', monospace",
    },
    effects: {
        glowColor: 'rgba(168, 85, 247, 0.1)',
        glowIntensity: 0.15,
        particleColors: ['#a0a0a0', '#808080', '#a855f7'],
        useNoise: false,
        noiseOpacity: 0,
    },
};

/**
 * Cherry blossom inspired pinks
 */
export const sakura: Theme = {
    name: 'Sakura',
    description: 'Delicate cherry blossom pinks with spring greens',
    mode: 'dark',
    colors: {
        bgDeep: '#1a1520',
        bgMid: '#251d28',
        bgCard: '#2f2532',
        bgGlow: '#3d303f',
        bgOverlay: '#1a1018',

        primary1: '#ffb7c5',
        primary2: '#ffc1cc',
        primary3: '#ff91a4',
        primary4: '#98d8aa',
        primary5: '#c9e4ca',
        primary6: '#ffe5ec',

        accent1: '#ff69b4',
        accent2: '#ff1493',
        accent3: '#50c878',

        textPrimary: '#fff0f3',
        textSecondary: '#e8c4cc',
        textMuted: '#a08088',
    },
    fonts: {
        heading: "'Zen Maru Gothic', sans-serif",
        body: "'Zen Maru Gothic', sans-serif",
        mono: "'Source Code Pro', monospace",
    },
    effects: {
        glowColor: 'rgba(255, 105, 180, 0.15)',
        glowIntensity: 0.3,
        particleColors: ['#ffb7c5', '#ffc1cc', '#ff91a4', '#98d8aa', '#ff69b4'],
        useNoise: true,
        noiseOpacity: 0.02,
    },
};

/**
 * Aurora borealis greens and purples
 */
export const aurora: Theme = {
    name: 'Aurora',
    description: 'Mystical aurora borealis dancing across the sky',
    mode: 'dark',
    colors: {
        bgDeep: '#0a0f1a',
        bgMid: '#0f1725',
        bgCard: '#151f30',
        bgGlow: '#1a2840',
        bgOverlay: '#081018',

        primary1: '#00ff87',
        primary2: '#00d4aa',
        primary3: '#7b68ee',
        primary4: '#00bfff',
        primary5: '#9370db',
        primary6: '#40e0d0',

        accent1: '#00ff87',
        accent2: '#7b68ee',
        accent3: '#00bfff',

        textPrimary: '#e0fff4',
        textSecondary: '#a0d4c4',
        textMuted: '#607a70',
    },
    fonts: {
        heading: "'Comfortaa', sans-serif",
        body: "'Nunito Sans', sans-serif",
        mono: "'Fira Code', monospace",
    },
    effects: {
        glowColor: 'rgba(0, 255, 135, 0.12)',
        glowIntensity: 0.35,
        particleColors: ['#00ff87', '#00d4aa', '#7b68ee', '#00bfff', '#9370db'],
        useNoise: false,
        noiseOpacity: 0,
    },
};

/**
 * Deep space with cosmic nebulae
 */
export const galaxy: Theme = {
    name: 'Galaxy',
    description: 'Deep space with distant stars and cosmic nebulae',
    mode: 'dark',
    colors: {
        bgDeep: '#05050f',
        bgMid: '#0a0a1a',
        bgCard: '#101025',
        bgGlow: '#181835',
        bgOverlay: '#08081a',

        primary1: '#e0b0ff',
        primary2: '#b0c4de',
        primary3: '#dda0dd',
        primary4: '#87ceeb',
        primary5: '#ffefd5',
        primary6: '#e6e6fa',

        accent1: '#9d4edd',
        accent2: '#c77dff',
        accent3: '#7b2cbf',

        textPrimary: '#f0e6ff',
        textSecondary: '#c4b5d4',
        textMuted: '#6a5a7a',
    },
    fonts: {
        heading: "'Cinzel', serif",
        body: "'Raleway', sans-serif",
        mono: "'Fira Code', monospace",
    },
    effects: {
        glowColor: 'rgba(157, 78, 221, 0.15)',
        glowIntensity: 0.3,
        particleColors: ['#e0b0ff', '#b0c4de', '#dda0dd', '#ffefd5', '#9d4edd'],
        useNoise: false,
        noiseOpacity: 0,
    },
};

/**
 * Clean, creamy light theme
 */
export const milk: Theme = {
    name: 'Milk',
    description: 'Clean and creamy whites with warm neutral accents',
    mode: 'light',
    colors: {
        bgDeep: '#fefefe',
        bgMid: '#faf9f7',
        bgCard: '#ffffff',
        bgGlow: '#f5f4f2',
        bgOverlay: '#eae8e4',

        primary1: '#8b7355',
        primary2: '#a09080',
        primary3: '#c4b8a8',
        primary4: '#d4c8b8',
        primary5: '#e8e0d8',
        primary6: '#6b5b4b',

        accent1: '#7c6650',
        accent2: '#9a8070',
        accent3: '#5c4c3c',

        textPrimary: '#2d2a26',
        textSecondary: '#5a5650',
        textMuted: '#908880',
    },
    fonts: {
        heading: "'DM Sans', sans-serif",
        body: "'DM Sans', sans-serif",
        mono: "'JetBrains Mono', monospace",
    },
    effects: {
        glowColor: 'rgba(139, 115, 85, 0.1)',
        glowIntensity: 0.1,
        particleColors: ['#c4b8a8', '#d4c8b8', '#a09080', '#e8e0d8'],
        useNoise: false,
        noiseOpacity: 0,
    },
};

/**
 * Modern light theme with purple accents
 */
export const light: Theme = {
    name: 'Light',
    description: 'A crisp, modern light theme with purple accents',
    mode: 'light',
    colors: {
        bgDeep: '#ffffff',
        bgMid: '#f8f9fa',
        bgCard: '#ffffff',
        bgGlow: '#f0f0f5',
        bgOverlay: '#e8e8f0',

        primary1: '#7c3aed',
        primary2: '#8b5cf6',
        primary3: '#a78bfa',
        primary4: '#6366f1',
        primary5: '#c4b5fd',
        primary6: '#818cf8',

        accent1: '#7c3aed',
        accent2: '#ec4899',
        accent3: '#06b6d4',

        textPrimary: '#1a1a2e',
        textSecondary: '#4a4a5a',
        textMuted: '#9090a0',
    },
    fonts: {
        heading: "'Inter', sans-serif",
        body: "'Inter', sans-serif",
        mono: "'JetBrains Mono', monospace",
    },
    effects: {
        glowColor: 'rgba(124, 58, 237, 0.1)',
        glowIntensity: 0.15,
        particleColors: ['#7c3aed', '#8b5cf6', '#a78bfa', '#ec4899', '#06b6d4'],
        useNoise: false,
        noiseOpacity: 0,
    },
};

/**
 * Default themes included with the package
 */
export const defaultThemes: Record<string, Theme> = {
    dreamy,
    cyberpunk,
    sunset,
    ocean,
    mono,
    sakura,
    aurora,
    galaxy,
    milk,
    light,
};

/**
 * Default theme ID
 */
export const DEFAULT_THEME_ID = 'dreamy' as const;

/**
 * Default themes as a catalog with metadata
 * This format supports filtering by tags, active status, etc.
 */
export const defaultThemeCatalog: ThemeCatalog = {
    dreamy: {
        theme: dreamy,
        meta: {
            active: true,
            tags: ['dark', 'pastel', 'default'],
            order: 1,
        },
    },
    cyberpunk: {
        theme: cyberpunk,
        meta: {
            active: true,
            tags: ['dark', 'neon', 'high-contrast'],
            order: 2,
        },
    },
    sunset: {
        theme: sunset,
        meta: {
            active: true,
            tags: ['dark', 'warm'],
            order: 3,
        },
    },
    ocean: {
        theme: ocean,
        meta: {
            active: true,
            tags: ['dark', 'cool', 'calm'],
            order: 4,
        },
    },
    mono: {
        theme: mono,
        meta: {
            active: true,
            tags: ['dark', 'minimal', 'professional'],
            order: 5,
        },
    },
    sakura: {
        theme: sakura,
        meta: {
            active: true,
            tags: ['dark', 'pastel', 'pink'],
            seasonal: 'spring',
            order: 6,
        },
    },
    aurora: {
        theme: aurora,
        meta: {
            active: true,
            tags: ['dark', 'nature', 'vibrant'],
            order: 7,
        },
    },
    galaxy: {
        theme: galaxy,
        meta: {
            active: true,
            tags: ['dark', 'space', 'cosmic'],
            order: 8,
        },
    },
    milk: {
        theme: milk,
        meta: {
            active: true,
            tags: ['light', 'neutral', 'minimal'],
            order: 9,
        },
    },
    light: {
        theme: light,
        meta: {
            active: true,
            tags: ['light', 'modern', 'professional'],
            order: 10,
        },
    },
};
