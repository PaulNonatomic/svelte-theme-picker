// Components
export { default as ThemePicker } from './ThemePicker.svelte';

// Types
export type {
    Theme,
    ThemeColors,
    ThemeFonts,
    ThemeEffects,
    ThemePickerConfig,
    // Catalog types
    ThemeMeta,
    ThemeCatalogEntry,
    ThemeCatalog,
    ThemeFilterOptions,
} from './types.js';

// Store
export {
    createThemeStore,
    applyTheme,
    themeStore,
    type ThemeStore,
} from './store.js';

// Default themes
export {
    defaultThemes,
    defaultThemeCatalog,
    DEFAULT_THEME_ID,
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
} from './themes.js';

// Catalog utilities
export {
    themesToCatalog,
    catalogToThemes,
    filterCatalog,
    getActiveThemes,
    getThemesByTag,
    getThemesByAnyTag,
    sortCatalog,
    getCatalogTags,
    createCatalogEntry,
    mergeCatalogs,
    loadCatalogFromJSON,
} from './catalog.js';
