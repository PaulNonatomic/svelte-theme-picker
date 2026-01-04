import { writable, type Writable } from 'svelte/store';
import type { Theme, ThemePickerConfig } from './types.js';
import { defaultThemes, DEFAULT_THEME_ID } from './themes.js';

const isBrowser = typeof window !== 'undefined';

/**
 * Theme store interface with preview support
 */
export interface ThemeStore extends Writable<string> {
    /** Set the current theme by ID (persists to localStorage) */
    setTheme: (themeId: string) => void;
    /** Get a theme by ID */
    getTheme: (themeId: string) => Theme | undefined;
    /** Get all available themes */
    getAllThemes: () => Record<string, Theme>;
    /** Get the current theme ID (may be preview theme) */
    getCurrentThemeId: () => string;
    /** Get the persisted theme ID (ignores preview) */
    getPersistedThemeId: () => string;
    /** Preview a theme temporarily without persisting */
    previewTheme: (themeId: string) => void;
    /** Revert from preview back to the persisted theme */
    revertPreview: () => void;
    /** Check if currently in preview mode */
    isPreviewMode: () => boolean;
}

/**
 * Create a theme store with the given configuration
 */
export function createThemeStore(config: ThemePickerConfig = {}): ThemeStore {
    const {
        storageKey = 'svelte-theme-picker',
        defaultTheme = DEFAULT_THEME_ID,
        themes = defaultThemes,
    } = config;

    function getInitialTheme(): string {
        if (isBrowser) {
            try {
                const stored = localStorage.getItem(storageKey);
                if (stored && themes[stored]) {
                    return stored;
                }
            } catch (_error: unknown) {
                // localStorage may be unavailable (private browsing, storage quota exceeded, etc.)
                // Fall through to default theme
            }
        }
        return themes[defaultTheme] ? defaultTheme : Object.keys(themes)[0] || DEFAULT_THEME_ID;
    }

    let persistedThemeId = getInitialTheme();
    let currentThemeId = persistedThemeId;
    let previewMode = false;

    const { subscribe, set, update } = writable<string>(currentThemeId);

    const store: ThemeStore = {
        subscribe,
        set,
        update,
        setTheme: (themeId: string) => {
            if (themes[themeId]) {
                persistedThemeId = themeId;
                currentThemeId = themeId;
                previewMode = false;
                set(themeId);
                if (isBrowser) {
                    try {
                        localStorage.setItem(storageKey, themeId);
                    } catch (_error: unknown) {
                        // localStorage may be unavailable (private browsing, storage quota exceeded, etc.)
                        // Theme is still applied in memory, just won't persist across sessions
                    }
                }
            }
        },
        getTheme: (themeId: string) => themes[themeId],
        getAllThemes: () => themes,
        getCurrentThemeId: () => currentThemeId,
        getPersistedThemeId: () => persistedThemeId,
        previewTheme: (themeId: string) => {
            if (themes[themeId]) {
                currentThemeId = themeId;
                previewMode = true;
                set(themeId);
                // Note: Does NOT persist to localStorage
            }
        },
        revertPreview: () => {
            if (previewMode) {
                currentThemeId = persistedThemeId;
                previewMode = false;
                set(persistedThemeId);
            }
        },
        isPreviewMode: () => previewMode,
    };

    return store;
}

/**
 * Apply a theme's CSS variables to the document.
 * Uses requestAnimationFrame to batch DOM updates for better performance.
 */
export function applyTheme(theme: Theme, prefix: string = ''): void {
    if (!isBrowser) return;

    // Use requestAnimationFrame to batch all CSS variable updates into a single frame
    // This prevents multiple repaints/reflows during theme transitions
    requestAnimationFrame(() => {
        const root = document.documentElement;
        const p = prefix ? `${prefix}-` : '';

        // Background colors
        root.style.setProperty(`--${p}bg-deep`, theme.colors.bgDeep);
        root.style.setProperty(`--${p}bg-mid`, theme.colors.bgMid);
        root.style.setProperty(`--${p}bg-card`, theme.colors.bgCard);
        root.style.setProperty(`--${p}bg-glow`, theme.colors.bgGlow);
        root.style.setProperty(`--${p}bg-overlay`, theme.colors.bgOverlay);

        // Primary palette
        root.style.setProperty(`--${p}primary-1`, theme.colors.primary1);
        root.style.setProperty(`--${p}primary-2`, theme.colors.primary2);
        root.style.setProperty(`--${p}primary-3`, theme.colors.primary3);
        root.style.setProperty(`--${p}primary-4`, theme.colors.primary4);
        root.style.setProperty(`--${p}primary-5`, theme.colors.primary5);
        root.style.setProperty(`--${p}primary-6`, theme.colors.primary6);

        // Accent colors
        root.style.setProperty(`--${p}accent-1`, theme.colors.accent1);
        root.style.setProperty(`--${p}accent-2`, theme.colors.accent2);
        root.style.setProperty(`--${p}accent-3`, theme.colors.accent3);

        // Text colors
        root.style.setProperty(`--${p}text-primary`, theme.colors.textPrimary);
        root.style.setProperty(`--${p}text-secondary`, theme.colors.textSecondary);
        root.style.setProperty(`--${p}text-muted`, theme.colors.textMuted);

        // Fonts
        root.style.setProperty(`--${p}font-heading`, theme.fonts.heading);
        root.style.setProperty(`--${p}font-body`, theme.fonts.body);
        root.style.setProperty(`--${p}font-mono`, theme.fonts.mono);

        // Effects
        root.style.setProperty(`--${p}shadow-glow`, `0 0 40px ${theme.effects.glowColor}`);
        root.style.setProperty(`--${p}glow-color`, theme.effects.glowColor);
        root.style.setProperty(`--${p}glow-intensity`, theme.effects.glowIntensity.toString());
    });
}

/**
 * Default theme store instance
 */
export const themeStore = createThemeStore();
