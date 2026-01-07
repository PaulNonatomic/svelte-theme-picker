/**
 * Theme color configuration
 */
export interface ThemeColors {
    /** Deepest background color */
    bgDeep: string;
    /** Mid-level background color */
    bgMid: string;
    /** Card/surface background color */
    bgCard: string;
    /** Glow/highlight background color */
    bgGlow: string;
    /** Overlay background color */
    bgOverlay: string;

    /** Primary palette colors (1-6, from most prominent to least) */
    primary1: string;
    primary2: string;
    primary3: string;
    primary4: string;
    primary5: string;
    primary6: string;

    /** Accent/neon colors for highlights */
    accent1: string;
    accent2: string;
    accent3: string;

    /** Primary text color */
    textPrimary: string;
    /** Secondary text color */
    textSecondary: string;
    /** Muted/disabled text color */
    textMuted: string;
}

/**
 * Theme font configuration
 */
export interface ThemeFonts {
    /** Font for headings */
    heading: string;
    /** Font for body text */
    body: string;
    /** Font for code/monospace */
    mono: string;
}

/**
 * Theme effect configuration
 */
export interface ThemeEffects {
    /** Color for glow effects */
    glowColor: string;
    /** Intensity of glow (0-1) */
    glowIntensity: number;
    /** Colors for particle effects */
    particleColors: string[];
    /** Whether to use noise texture */
    useNoise: boolean;
    /** Opacity of noise texture (0-1) */
    noiseOpacity: number;
}

/**
 * Complete theme definition
 */
export interface Theme {
    /** Display name of the theme */
    name: string;
    /** Short description of the theme */
    description: string;
    /** Color configuration */
    colors: ThemeColors;
    /** Font configuration */
    fonts: ThemeFonts;
    /** Effect configuration */
    effects: ThemeEffects;
    /** Theme mode for styling adjustments (affects picker UI, shadows, contrast) */
    mode?: 'light' | 'dark';
}

/**
 * Configuration options for the theme picker
 */
export interface ThemePickerConfig {
    /** Storage key for persisting theme selection */
    storageKey?: string;
    /** Default theme ID to use */
    defaultTheme?: string;
    /** Custom themes to use (replaces defaults if provided) */
    themes?: Record<string, Theme>;
    /** CSS variable prefix (default: none, uses standard names) */
    cssVarPrefix?: string;
    /** Enable cross-tab synchronization via storage events (default: false) */
    syncTabs?: boolean;
}

/**
 * Metadata for a theme in a catalog
 */
export interface ThemeMeta {
    /** Whether this theme is active/visible in the picker (default: true) */
    active?: boolean;
    /** Tags for categorizing themes (e.g., 'dark', 'light', 'seasonal', 'test') */
    tags?: string[];
    /** Sort order for display (lower numbers first) */
    order?: number;
    /** Date the theme was added */
    addedDate?: string;
    /** Whether this is a seasonal theme (optionally specify season) */
    seasonal?: string | boolean;
}

/**
 * A theme with its metadata for use in a catalog
 */
export interface ThemeCatalogEntry {
    /** The theme definition */
    theme: Theme;
    /** Metadata about the theme */
    meta?: ThemeMeta;
}

/**
 * A catalog of themes with metadata
 * Keys are theme IDs, values are theme definitions with metadata
 */
export type ThemeCatalog = Record<string, ThemeCatalogEntry>;

/**
 * Options for filtering themes from a catalog
 */
export interface ThemeFilterOptions {
    /** Only include active themes (default: true) */
    activeOnly?: boolean;
    /** Only include themes with ALL of these tags */
    tags?: string[];
    /** Only include themes with ANY of these tags */
    anyTags?: string[];
    /** Exclude themes with ANY of these tags */
    excludeTags?: string[];
}

/**
 * Configuration for SSR blocking script generation
 */
export interface SSRConfig {
    /** All available themes */
    themes: Record<string, Theme>;
    /** localStorage key for theme persistence (default: 'svelte-theme-picker-theme') */
    storageKey?: string;
    /** Default theme ID if none is stored */
    defaultTheme?: string;
    /** CSS variable prefix (default: none) */
    cssVarPrefix?: string;
    /** Whether to add no-transitions class during hydration (default: true) */
    preventTransitions?: boolean;
    /** Font configuration for preloading */
    fonts?: FontConfig;
}

/**
 * Configuration for font preloading
 */
export interface FontConfig {
    /** Font provider: 'google', 'local', or 'custom' */
    provider?: 'google' | 'local' | 'custom';
    /** Font weights to preload per category */
    weights?: {
        heading?: number[];
        body?: number[];
        mono?: number[];
    };
    /** Custom font URL generator (for 'custom' provider) */
    getFontUrl?: (fontName: string, weights: number[]) => string;
}

/**
 * CSS variable schema mapping theme properties to CSS variable names
 */
export interface ThemeSchema {
    /** Color property to CSS variable name mapping */
    colors: Record<keyof ThemeColors, string>;
    /** Font property to CSS variable name mapping */
    fonts: Record<keyof ThemeFonts, string>;
    /** Effect property to CSS variable name mapping */
    effects: Record<string, string>;
}
