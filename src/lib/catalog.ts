import type { Theme, ThemeCatalog, ThemeCatalogEntry, ThemeFilterOptions, ThemeMeta } from './types.js';

/**
 * Convert a simple themes record to a catalog with default metadata
 */
export function themesToCatalog(
    themes: Record<string, Theme>,
    defaultMeta: Partial<ThemeMeta> = {}
): ThemeCatalog {
    const catalog: ThemeCatalog = {};
    for (const [id, theme] of Object.entries(themes)) {
        catalog[id] = {
            theme,
            meta: { active: true, ...defaultMeta },
        };
    }
    return catalog;
}

/**
 * Extract just the themes from a catalog (for use with ThemePicker)
 */
export function catalogToThemes(catalog: ThemeCatalog): Record<string, Theme> {
    const themes: Record<string, Theme> = {};
    for (const [id, entry] of Object.entries(catalog)) {
        themes[id] = entry.theme;
    }
    return themes;
}

/**
 * Filter themes from a catalog based on options
 */
export function filterCatalog(
    catalog: ThemeCatalog,
    options: ThemeFilterOptions = {}
): ThemeCatalog {
    const {
        activeOnly = true,
        tags,
        anyTags,
        excludeTags,
    } = options;

    const filtered: ThemeCatalog = {};

    for (const [id, entry] of Object.entries(catalog)) {
        const meta = entry.meta || {};
        const themeTags = meta.tags || [];

        // Filter by active status
        if (activeOnly && meta.active === false) {
            continue;
        }

        // Filter by required tags (ALL must match)
        if (tags && tags.length > 0) {
            const hasAllTags = tags.every((tag) => themeTags.includes(tag));
            if (!hasAllTags) continue;
        }

        // Filter by any tags (ANY must match)
        if (anyTags && anyTags.length > 0) {
            const hasAnyTag = anyTags.some((tag) => themeTags.includes(tag));
            if (!hasAnyTag) continue;
        }

        // Exclude by tags
        if (excludeTags && excludeTags.length > 0) {
            const hasExcludedTag = excludeTags.some((tag) => themeTags.includes(tag));
            if (hasExcludedTag) continue;
        }

        filtered[id] = entry;
    }

    return filtered;
}

/**
 * Get only active themes from a catalog as a simple themes record
 */
export function getActiveThemes(catalog: ThemeCatalog): Record<string, Theme> {
    return catalogToThemes(filterCatalog(catalog, { activeOnly: true }));
}

/**
 * Get themes by tag from a catalog
 */
export function getThemesByTag(catalog: ThemeCatalog, tag: string): Record<string, Theme> {
    return catalogToThemes(filterCatalog(catalog, { tags: [tag] }));
}

/**
 * Get themes by any of the given tags
 */
export function getThemesByAnyTag(catalog: ThemeCatalog, tags: string[]): Record<string, Theme> {
    return catalogToThemes(filterCatalog(catalog, { anyTags: tags }));
}

/**
 * Sort catalog entries by their order property
 */
export function sortCatalog(catalog: ThemeCatalog): ThemeCatalog {
    const entries = Object.entries(catalog);
    entries.sort((a, b) => {
        const orderA = a[1].meta?.order ?? 999;
        const orderB = b[1].meta?.order ?? 999;
        return orderA - orderB;
    });
    return Object.fromEntries(entries);
}

/**
 * Get all unique tags from a catalog
 */
export function getCatalogTags(catalog: ThemeCatalog): string[] {
    const tagSet = new Set<string>();
    for (const entry of Object.values(catalog)) {
        const tags = entry.meta?.tags || [];
        for (const tag of tags) {
            tagSet.add(tag);
        }
    }
    return Array.from(tagSet).sort();
}

/**
 * Create a catalog entry with defaults
 */
export function createCatalogEntry(
    theme: Theme,
    meta: ThemeMeta = {}
): ThemeCatalogEntry {
    return {
        theme,
        meta: {
            active: true,
            tags: [],
            ...meta,
        },
    };
}

/**
 * Merge multiple catalogs (later catalogs override earlier ones)
 */
export function mergeCatalogs(...catalogs: ThemeCatalog[]): ThemeCatalog {
    return Object.assign({}, ...catalogs);
}

/**
 * Type guard to check if a value is a valid theme entry
 */
function isValidThemeEntry(entry: unknown): entry is ThemeCatalogEntry {
    if (typeof entry !== 'object' || entry === null) {
        return false;
    }
    const obj = entry as Record<string, unknown>;
    if (typeof obj.theme !== 'object' || obj.theme === null) {
        return false;
    }
    const theme = obj.theme as Record<string, unknown>;
    return (
        typeof theme.name === 'string' &&
        typeof theme.description === 'string' &&
        typeof theme.colors === 'object' &&
        theme.colors !== null &&
        typeof theme.fonts === 'object' &&
        theme.fonts !== null &&
        typeof theme.effects === 'object' &&
        theme.effects !== null
    );
}

/**
 * Load themes from a JSON object (useful for loading from files)
 * The JSON should match the ThemeCatalog structure
 * @throws {Error} If the JSON is not a valid ThemeCatalog
 */
export function loadCatalogFromJSON(json: unknown): ThemeCatalog {
    if (typeof json !== 'object' || json === null) {
        throw new Error('Invalid catalog JSON: expected an object');
    }

    const catalog: ThemeCatalog = {};
    const entries = Object.entries(json as Record<string, unknown>);

    for (const [id, entry] of entries) {
        if (!isValidThemeEntry(entry)) {
            throw new Error(
                `Invalid theme entry for "${id}": missing required fields (theme.name, theme.description, theme.colors, theme.fonts, theme.effects)`
            );
        }
        catalog[id] = entry;
    }

    return catalog;
}
