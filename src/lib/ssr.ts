import type { Theme, SSRConfig, FontConfig, ThemeSchema, ThemeColors, ThemeFonts } from './types.js';

/**
 * CSS variable schema - maps theme properties to CSS variable names.
 * Use this to ensure consistency between blocking scripts and runtime.
 */
export const themeSchema: ThemeSchema = {
    colors: {
        bgDeep: 'bg-deep',
        bgMid: 'bg-mid',
        bgCard: 'bg-card',
        bgGlow: 'bg-glow',
        bgOverlay: 'bg-overlay',
        primary1: 'primary-1',
        primary2: 'primary-2',
        primary3: 'primary-3',
        primary4: 'primary-4',
        primary5: 'primary-5',
        primary6: 'primary-6',
        accent1: 'accent-1',
        accent2: 'accent-2',
        accent3: 'accent-3',
        textPrimary: 'text-primary',
        textSecondary: 'text-secondary',
        textMuted: 'text-muted',
    },
    fonts: {
        heading: 'font-heading',
        body: 'font-body',
        mono: 'font-mono',
    },
    effects: {
        shadowGlow: 'shadow-glow',
        glowColor: 'glow-color',
        glowIntensity: 'glow-intensity',
    },
};

/**
 * Get CSS variable declarations for a theme as a string.
 * Useful for generating inline styles or CSS rules.
 */
export function getThemeCSS(theme: Theme, prefix: string = ''): string {
    const p = prefix ? `${prefix}-` : '';
    const vars: string[] = [];

    // Colors
    for (const [key, cssVar] of Object.entries(themeSchema.colors)) {
        const value = theme.colors[key as keyof ThemeColors];
        vars.push(`--${p}${cssVar}: ${value}`);
    }

    // Fonts
    for (const [key, cssVar] of Object.entries(themeSchema.fonts)) {
        const value = theme.fonts[key as keyof ThemeFonts];
        vars.push(`--${p}${cssVar}: ${value}`);
    }

    // Effects
    vars.push(`--${p}${themeSchema.effects.shadowGlow}: 0 0 40px ${theme.effects.glowColor}`);
    vars.push(`--${p}${themeSchema.effects.glowColor}: ${theme.effects.glowColor}`);
    vars.push(`--${p}${themeSchema.effects.glowIntensity}: ${theme.effects.glowIntensity}`);

    return vars.join('; ');
}

/**
 * Apply theme CSS variables to an HTML element synchronously.
 * This is the same logic as the runtime applyTheme but without requestAnimationFrame,
 * making it suitable for use in blocking scripts.
 */
export function applyThemeToElement(element: HTMLElement, theme: Theme, prefix: string = ''): void {
    const p = prefix ? `${prefix}-` : '';

    // Background colors
    element.style.setProperty(`--${p}bg-deep`, theme.colors.bgDeep);
    element.style.setProperty(`--${p}bg-mid`, theme.colors.bgMid);
    element.style.setProperty(`--${p}bg-card`, theme.colors.bgCard);
    element.style.setProperty(`--${p}bg-glow`, theme.colors.bgGlow);
    element.style.setProperty(`--${p}bg-overlay`, theme.colors.bgOverlay);

    // Primary palette
    element.style.setProperty(`--${p}primary-1`, theme.colors.primary1);
    element.style.setProperty(`--${p}primary-2`, theme.colors.primary2);
    element.style.setProperty(`--${p}primary-3`, theme.colors.primary3);
    element.style.setProperty(`--${p}primary-4`, theme.colors.primary4);
    element.style.setProperty(`--${p}primary-5`, theme.colors.primary5);
    element.style.setProperty(`--${p}primary-6`, theme.colors.primary6);

    // Accent colors
    element.style.setProperty(`--${p}accent-1`, theme.colors.accent1);
    element.style.setProperty(`--${p}accent-2`, theme.colors.accent2);
    element.style.setProperty(`--${p}accent-3`, theme.colors.accent3);

    // Text colors
    element.style.setProperty(`--${p}text-primary`, theme.colors.textPrimary);
    element.style.setProperty(`--${p}text-secondary`, theme.colors.textSecondary);
    element.style.setProperty(`--${p}text-muted`, theme.colors.textMuted);

    // Fonts
    element.style.setProperty(`--${p}font-heading`, theme.fonts.heading);
    element.style.setProperty(`--${p}font-body`, theme.fonts.body);
    element.style.setProperty(`--${p}font-mono`, theme.fonts.mono);

    // Effects
    element.style.setProperty(`--${p}shadow-glow`, `0 0 40px ${theme.effects.glowColor}`);
    element.style.setProperty(`--${p}glow-color`, theme.effects.glowColor);
    element.style.setProperty(`--${p}glow-intensity`, theme.effects.glowIntensity.toString());
}

/**
 * Extract font family names from a theme.
 * Parses CSS font-family values to extract the primary font name.
 */
export function extractFonts(theme: Theme): string[] {
    const fonts: string[] = [];
    const fontValues = [theme.fonts.heading, theme.fonts.body, theme.fonts.mono];

    for (const fontValue of fontValues) {
        // Extract the first font family from a CSS font-family value
        // e.g., "'Quicksand', sans-serif" -> "Quicksand"
        const match = fontValue.match(/^['"]?([^'",]+)/);
        if (match && match[1]) {
            const fontName = match[1].trim();
            // Exclude generic font families
            if (!['sans-serif', 'serif', 'monospace', 'cursive', 'fantasy', 'system-ui'].includes(fontName.toLowerCase())) {
                if (!fonts.includes(fontName)) {
                    fonts.push(fontName);
                }
            }
        }
    }

    return fonts;
}

/**
 * Generate Google Fonts preload links for the given font names.
 */
export function generateFontPreloadLinks(fonts: string[], config: FontConfig = {}): string {
    const { provider = 'google', weights = {} } = config;

    if (provider !== 'google' || fonts.length === 0) {
        return '';
    }

    const defaultWeights = {
        heading: weights.heading || [400, 600, 700],
        body: weights.body || [400, 500],
        mono: weights.mono || [400],
    };

    // For simplicity, use all weights for each font
    const allWeights = [...new Set([
        ...defaultWeights.heading,
        ...defaultWeights.body,
        ...defaultWeights.mono,
    ])].sort((a, b) => a - b);

    const fontSpecs = fonts.map(font => {
        const weightStr = allWeights.join(';');
        return `family=${encodeURIComponent(font)}:wght@${weightStr}`;
    });

    const url = `https://fonts.googleapis.com/css2?${fontSpecs.join('&')}&display=swap`;

    return `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${url}">`;
}

/**
 * Generate a blocking script that prevents theme flash on page load.
 * This script should be placed in the <head> of your HTML before any other scripts.
 *
 * The script:
 * 1. Reads the stored theme from localStorage
 * 2. Applies CSS variables immediately (before paint)
 * 3. Optionally adds a 'no-transitions' class to prevent transition animations during hydration
 * 4. Optionally preloads fonts for the current theme
 */
export function generateBlockingScript(config: SSRConfig): string {
    const {
        themes,
        storageKey = 'svelte-theme-picker',
        defaultTheme,
        cssVarPrefix = '',
        preventTransitions = true,
    } = config;

    // Determine the actual default theme
    const themeIds = Object.keys(themes);
    const fallbackDefault = defaultTheme && themes[defaultTheme] ? defaultTheme : themeIds[0];

    // Serialize themes for the blocking script (only what's needed: colors, fonts, effects)
    const minimalThemes: Record<string, { colors: Theme['colors']; fonts: Theme['fonts']; effects: Theme['effects'] }> = {};
    for (const [id, theme] of Object.entries(themes)) {
        minimalThemes[id] = {
            colors: theme.colors,
            fonts: theme.fonts,
            effects: theme.effects,
        };
    }

    const themesJson = JSON.stringify(minimalThemes);
    const prefix = cssVarPrefix ? `${cssVarPrefix}-` : '';

    // Generate the blocking script
    const script = `(function(){
var T=${themesJson};
var k="${storageKey}";
var d="${fallbackDefault}";
var p="${prefix}";
var r=document.documentElement;
${preventTransitions ? 'r.classList.add("no-transitions");' : ''}
try{var s=localStorage.getItem(k);if(!s||!T[s])s=d;}catch(e){s=d;}
var t=T[s];if(t){
var c=t.colors,f=t.fonts,e=t.effects;
r.style.setProperty("--"+p+"bg-deep",c.bgDeep);
r.style.setProperty("--"+p+"bg-mid",c.bgMid);
r.style.setProperty("--"+p+"bg-card",c.bgCard);
r.style.setProperty("--"+p+"bg-glow",c.bgGlow);
r.style.setProperty("--"+p+"bg-overlay",c.bgOverlay);
r.style.setProperty("--"+p+"primary-1",c.primary1);
r.style.setProperty("--"+p+"primary-2",c.primary2);
r.style.setProperty("--"+p+"primary-3",c.primary3);
r.style.setProperty("--"+p+"primary-4",c.primary4);
r.style.setProperty("--"+p+"primary-5",c.primary5);
r.style.setProperty("--"+p+"primary-6",c.primary6);
r.style.setProperty("--"+p+"accent-1",c.accent1);
r.style.setProperty("--"+p+"accent-2",c.accent2);
r.style.setProperty("--"+p+"accent-3",c.accent3);
r.style.setProperty("--"+p+"text-primary",c.textPrimary);
r.style.setProperty("--"+p+"text-secondary",c.textSecondary);
r.style.setProperty("--"+p+"text-muted",c.textMuted);
r.style.setProperty("--"+p+"font-heading",f.heading);
r.style.setProperty("--"+p+"font-body",f.body);
r.style.setProperty("--"+p+"font-mono",f.mono);
r.style.setProperty("--"+p+"shadow-glow","0 0 40px "+e.glowColor);
r.style.setProperty("--"+p+"glow-color",e.glowColor);
r.style.setProperty("--"+p+"glow-intensity",e.glowIntensity);
r.setAttribute("data-theme",s);
}})();`;

    return script;
}

/**
 * Generate a complete SSR script tag that can be inserted into HTML.
 * Includes the blocking script and optionally font preload links.
 */
export function generateSSRHead(config: SSRConfig): string {
    const { themes, fonts } = config;
    const parts: string[] = [];

    // Add font preload links if configured
    if (fonts) {
        // Get all unique fonts from all themes
        const allFonts = new Set<string>();
        for (const theme of Object.values(themes)) {
            for (const font of extractFonts(theme)) {
                allFonts.add(font);
            }
        }
        const fontLinks = generateFontPreloadLinks([...allFonts], fonts);
        if (fontLinks) {
            parts.push(fontLinks);
        }
    }

    // Add the blocking script
    parts.push(`<script>${generateBlockingScript(config)}</script>`);

    // Add no-transitions CSS if enabled
    if (config.preventTransitions !== false) {
        parts.push(`<style>.no-transitions,.no-transitions *,.no-transitions *::before,.no-transitions *::after{transition:none!important;animation:none!important}</style>`);
    }

    return parts.join('\n');
}
