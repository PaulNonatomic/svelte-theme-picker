<script>
    import {
        ThemePicker,
        themeStore,
        applyTheme,
        defaultThemes,
        defaultThemeCatalog,
        getActiveThemes,
        getThemesByTag,
        filterCatalog,
        catalogToThemes,
        getCatalogTags,
    } from '$lib';

    let lastTheme = $state(null);
    let showInline = $state(false);
    let customPickerTheme = $state('dreamy');
    let copiedId = $state(null);

    async function copyCode(code, id) {
        try {
            await navigator.clipboard.writeText(code);
            copiedId = id;
            setTimeout(() => {
                if (copiedId === id) copiedId = null;
            }, 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    }

    // Reactive preview mode status
    let isInPreviewMode = $state(false);
    let persistedThemeId = $state('');

    function updatePreviewStatus() {
        isInPreviewMode = themeStore.isPreviewMode();
        persistedThemeId = themeStore.getPersistedThemeId();
    }

    function handleThemeChange(themeId, theme) {
        lastTheme = { id: themeId, name: theme.name };
        updatePreviewStatus();
    }

    function setRandomTheme() {
        const themeIds = Object.keys(defaultThemes);
        const randomId = themeIds[Math.floor(Math.random() * themeIds.length)];
        const theme = defaultThemes[randomId];
        themeStore.setTheme(randomId);
        applyTheme(theme);
        lastTheme = { id: randomId, name: theme.name };
        updatePreviewStatus();
    }

    function resetToDefault() {
        const defaultId = 'dreamy';
        const theme = defaultThemes[defaultId];
        themeStore.setTheme(defaultId);
        applyTheme(theme);
        lastTheme = { id: defaultId, name: theme.name };
        customPickerTheme = defaultId;
        updatePreviewStatus();
    }

    // Custom picker: preview theme on click
    function selectCustomTheme(themeId) {
        customPickerTheme = themeId;
        const theme = defaultThemes[themeId];
        themeStore.previewTheme(themeId);
        applyTheme(theme);
        lastTheme = { id: themeId, name: theme.name };
        updatePreviewStatus();
    }

    // Custom picker: save the selection
    function saveCustomTheme() {
        themeStore.setTheme(customPickerTheme);
        updatePreviewStatus();
    }

    // Custom picker: revert to saved theme
    function revertToSaved() {
        themeStore.revertPreview();
        const revertedId = themeStore.getCurrentThemeId();
        customPickerTheme = revertedId;
        applyTheme(defaultThemes[revertedId]);
        lastTheme = { id: revertedId, name: defaultThemes[revertedId]?.name };
        updatePreviewStatus();
    }

    // Catalog filtering examples
    const allTags = getCatalogTags(defaultThemeCatalog);
    const activeThemes = getActiveThemes(defaultThemeCatalog);
    const darkThemes = getThemesByTag(defaultThemeCatalog, 'dark');
    const lightThemes = getThemesByTag(defaultThemeCatalog, 'light');
    const productionThemes = catalogToThemes(
        filterCatalog(defaultThemeCatalog, {
            activeOnly: true,
            excludeTags: ['test'],
        })
    );

    // Code snippets for examples (using \x3C to escape < in script tags)
    const codeSnippets = {
        basic: `\x3Cscript>
  import { ThemePicker } from 'svelte-theme-picker';
\x3C/script>

\x3CThemePicker />`,

        config: `\x3Cscript lang="ts">
  import {
    ThemePicker,
    type Theme,
    type ThemePickerConfig
  } from 'svelte-theme-picker';

  const config: ThemePickerConfig = {
    storageKey: 'my-app-theme',
    defaultTheme: 'ocean',
  };

  function handleChange(id: string, theme: Theme) {
    console.log('Theme changed:', theme.name);
  }
\x3C/script>

\x3CThemePicker
  {config}
  position="bottom-left"
  onThemeChange={handleChange}
/>`,

        programmatic: `\x3Cscript lang="ts">
  import {
    themeStore,
    applyTheme,
    defaultThemes
  } from 'svelte-theme-picker';

  // Change theme programmatically
  themeStore.setTheme('cyberpunk');

  // Subscribe to theme changes
  themeStore.subscribe((themeId) => {
    const theme = defaultThemes[themeId];
    console.log('Now using:', theme?.name);
  });

  // Apply a theme directly
  applyTheme(defaultThemes.sunset);
\x3C/script>`,

        headless: `\x3Cscript lang="ts">
  // No ThemePicker component needed!
  import {
    themeStore,
    applyTheme,
    defaultThemes
  } from 'svelte-theme-picker';
  import { onMount } from 'svelte';

  onMount(() => {
    // Load theme from user preferences, database, etc.
    const userTheme = getUserPreference() || 'dreamy';
    themeStore.setTheme(userTheme);
    applyTheme(defaultThemes[userTheme]);

    // Subscribe to persist changes
    return themeStore.subscribe((themeId) => {
      saveUserPreference(themeId);
    });
  });
\x3C/script>

\x3C!-- Your app content - no picker UI rendered -->
\x3Cslot />`,

        customThemes: `\x3Cscript lang="ts">
  import {
    ThemePicker,
    type Theme
  } from 'svelte-theme-picker';

  const myThemes: Record<string, Theme> = {
    'brand-dark': {
      name: 'Brand Dark',
      description: 'Our brand colors',
      colors: {
        bgDeep: '#0f172a',
        bgMid: '#1e293b',
        bgCard: '#334155',
        bgGlow: '#475569',
        bgOverlay: '#1e293b',
        primary1: '#38bdf8',
        primary2: '#0ea5e9',
        primary3: '#06b6d4',
        primary4: '#22d3ee',
        primary5: '#67e8f9',
        primary6: '#a5f3fc',
        accent1: '#f472b6',
        accent2: '#ec4899',
        accent3: '#db2777',
        textPrimary: '#f8fafc',
        textSecondary: '#cbd5e1',
        textMuted: '#64748b',
      },
      fonts: {
        heading: "'Inter', sans-serif",
        body: "'Inter', sans-serif",
        mono: "'Fira Code', monospace",
      },
      effects: {
        glowColor: 'rgba(56, 189, 248, 0.2)',
        glowIntensity: 0.3,
        particleColors: ['#38bdf8', '#f472b6'],
        useNoise: false,
        noiseOpacity: 0,
      },
    },
  };
\x3C/script>

\x3CThemePicker
  config={{
    themes: myThemes,
    defaultTheme: 'brand-dark'
  }}
/>`,

        jsonDriven: `// themes.json - Define ALL themes (production + test)
{
  "brand-dark": {
    "theme": { /* full theme */ },
    "meta": { "active": true, "tags": ["dark", "brand"] }
  },
  "christmas": {
    "theme": { /* seasonal theme */ },
    "meta": { "active": false, "tags": ["seasonal"] }
  }
}

// Load and filter for production
import { loadCatalogFromJSON, getActiveThemes } from 'svelte-theme-picker';
import themesJson from './themes.json';

const catalog = loadCatalogFromJSON(themesJson);
const productionThemes = getActiveThemes(catalog);

\x3CThemePicker config={{ themes: productionThemes }} />`,

        previewMode: `\x3Cscript>
  import { themeStore, applyTheme, defaultThemes } from 'svelte-theme-picker';
  import { onMount } from 'svelte';

  let selectedTheme = 'dreamy';

  onMount(() => {
    // Revert if user leaves without saving
    return () => themeStore.revertPreview();
  });

  function previewTheme(id) {
    selectedTheme = id;
    themeStore.previewTheme(id);  // Temporary
    applyTheme(defaultThemes[id]);
  }

  function saveTheme() {
    themeStore.setTheme(selectedTheme);  // Persist
  }
\x3C/script>`,

        ssrSupport: `\x3C!-- src/routes/+layout.svelte -->
\x3Cscript>
  import { ThemeHead, ThemePicker, defaultThemes } from 'svelte-theme-picker';
  import { onMount } from 'svelte';

  // Remove no-transitions class after hydration
  onMount(() => {
    setTimeout(() => {
      document.documentElement.classList.remove('no-transitions');
    }, 50);
  });
\x3C/script>

\x3C!-- Prevents theme flash on page load -->
\x3CThemeHead
  themes={defaultThemes}
  storageKey="my-app-theme"
  defaultTheme="dreamy"
  preloadFonts={true}
/>

\x3CThemePicker config={{ storageKey: 'my-app-theme' }} />
\x3Cslot />`,

        crossTabSync: `\x3Cscript>
  import { createThemeStore, ThemePicker } from 'svelte-theme-picker';
  import { onDestroy } from 'svelte';

  // Create store with cross-tab sync enabled
  const store = createThemeStore({
    syncTabs: true,  // Theme changes sync across tabs
    storageKey: 'my-app-theme',
  });

  // Clean up listener when component unmounts
  onDestroy(() => {
    store.destroy();
  });
\x3C/script>

\x3CThemePicker {store} />`,

        cssVars: `/* Backgrounds */
--bg-deep, --bg-mid, --bg-card, --bg-glow, --bg-overlay

/* Primary palette (1-6) */
--primary-1, --primary-2, --primary-3,
--primary-4, --primary-5, --primary-6

/* Accent colors (1-3) */
--accent-1, --accent-2, --accent-3

/* Text colors */
--text-primary, --text-secondary, --text-muted

/* Fonts */
--font-heading, --font-body, --font-mono

/* Effects */
--shadow-glow, --glow-color, --glow-intensity`,

        coreTypes: `interface Theme {
  name: string;
  description: string;
  colors: ThemeColors;
  fonts: ThemeFonts;
  effects: ThemeEffects;
  mode?: 'light' | 'dark';  // v1.1.0+
}

interface ThemePickerConfig {
  storageKey?: string;
  defaultTheme?: string;
  themes?: Record<string, Theme>;
  cssVarPrefix?: string;
  syncTabs?: boolean;  // v1.1.0+ Cross-tab sync
}`,

        storeInterface: `interface ThemeStore extends Writable<string> {
  setTheme: (themeId: string) => void;
  getTheme: (themeId: string) => Theme | undefined;
  getAllThemes: () => Record<string, Theme>;
  getCurrentThemeId: () => string;
  // Preview mode methods
  previewTheme: (themeId: string) => void;
  revertPreview: () => void;
  isPreviewMode: () => boolean;
  getPersistedThemeId: () => string;
  // Cleanup (v1.1.0+)
  destroy: () => void;
}`,

        catalogTypes: `interface ThemeMeta {
  active?: boolean;      // Show in production?
  tags?: string[];       // e.g. ['dark', 'brand']
  order?: number;        // Sort order
  seasonal?: string | boolean;  // 'winter', 'spring', etc.
  addedDate?: string;    // ISO date string
}

interface ThemeCatalogEntry {
  theme: Theme;
  meta?: ThemeMeta;
}

type ThemeCatalog = Record<string, ThemeCatalogEntry>;

interface ThemeFilterOptions {
  activeOnly?: boolean;  // Only active: true
  tags?: string[];       // Must have ALL tags
  anyTags?: string[];    // Must have ANY tag
  excludeTags?: string[];  // Exclude these tags
}`,

        filtering: `// Get themes by tag
const darkThemes = getThemesByTag(catalog, 'dark');

// Get only production-ready themes
const production = catalogToThemes(
  filterCatalog(catalog, {
    activeOnly: true,
    excludeTags: ['test', 'seasonal'],
  })
);

// Use filtered themes with picker
\x3CThemePicker config={{ themes: production }} />`,
    };
</script>

<svelte:head>
    <title>Svelte Theme Picker Demo</title>
</svelte:head>

<main>
    <h1>Svelte Theme Picker</h1>
    <p>A beautiful, customizable theme picker component for Svelte applications.</p>

    <section>
        <h2>Features</h2>
        <ul class="features-list">
            <li>10 beautiful built-in themes (dark and light modes)</li>
            <li>Fully customizable - add your own themes</li>
            <li>Persists selection to localStorage</li>
            <li>Applies CSS variables to your document</li>
            <li>Svelte 5 runes compatible</li>
            <li>Full TypeScript support</li>
            <li>Floating button or inline mode (vertical/horizontal)</li>
            <li><strong>Preview mode</strong> - temporarily apply themes without persisting</li>
            <li><strong>JSON-driven themes</strong> - define themes in JSON with production/test filtering</li>
            <li><strong>Theme catalogs</strong> - organize with metadata, tags, and filtering</li>
            <li><strong>Headless mode</strong> - use the store without UI for programmatic control</li>
            <li><strong>SSR support</strong> - prevent theme flash with ThemeHead component</li>
            <li><strong>Cross-tab sync</strong> - automatically sync themes across browser tabs</li>
        </ul>
    </section>

    <section>
        <h2>Current Theme</h2>
        {#if lastTheme}
            <p>Selected: <strong>{lastTheme.name}</strong> (<code>{lastTheme.id}</code>)</p>
        {:else}
            <p>Click the theme button in the bottom-right corner to select a theme.</p>
        {/if}
        {#if isInPreviewMode}
            <p class="preview-status">
                <span class="preview-badge">Preview Mode</span>
                Saved theme: <code>{persistedThemeId}</code>
            </p>
        {/if}
        <div class="button-row">
            <button class="demo-button" onclick={setRandomTheme}>Random Theme</button>
            <button class="demo-button secondary" onclick={resetToDefault}>Reset to Default</button>
            <button class="demo-button secondary" onclick={() => showInline = !showInline}>
                {showInline ? 'Hide' : 'Show'} Inline Picker
            </button>
        </div>
    </section>

    {#if showInline}
        <section>
            <h2>Horizontal Layout</h2>
            <p>Use <code>layout="horizontal"</code> for a compact grid of color swatches:</p>
            <div class="inline-picker-container horizontal">
                <ThemePicker showTrigger={false} layout="horizontal" onThemeChange={handleThemeChange} />
            </div>
        </section>

        <section>
            <h2>Vertical Layout</h2>
            <p>Default vertical list with theme names and descriptions:</p>
            <div class="inline-picker-container">
                <ThemePicker showTrigger={false} onThemeChange={handleThemeChange} />
            </div>
        </section>

        <section>
            <h2>Custom Theme Picker UI</h2>
            <p>Build your own picker using the exported utilities. Perfect for forms:</p>
            <div class="custom-picker-demo">
                <div class="theme-grid">
                    {#each Object.entries(defaultThemes) as [id, theme]}
                        <button
                            type="button"
                            class="theme-swatch"
                            class:selected={customPickerTheme === id}
                            onclick={() => selectCustomTheme(id)}
                            title={theme.name}
                        >
                            <div class="swatch-colors">
                                <span style="background: {theme.colors.primary1}"></span>
                                <span style="background: {theme.colors.primary3}"></span>
                                <span style="background: {theme.colors.primary5}"></span>
                                <span style="background: {theme.colors.accent1}"></span>
                            </div>
                            <span class="swatch-name">{theme.name}</span>
                        </button>
                    {/each}
                </div>
                <div class="custom-picker-actions">
                    <button class="demo-button" onclick={saveCustomTheme}>
                        Save Selection
                    </button>
                    {#if isInPreviewMode}
                        <button class="demo-button secondary" onclick={revertToSaved}>
                            Revert to Saved
                        </button>
                    {/if}
                    <span class="preview-note">
                        {#if isInPreviewMode}
                            <span class="preview-badge small">Previewing</span>
                        {/if}
                        <strong>{defaultThemes[customPickerTheme]?.name}</strong>
                    </span>
                </div>
            </div>
        </section>

        <section>
            <h2>Theme Catalogs & Filtering</h2>
            <p>Organize themes with metadata for production/test filtering:</p>

            <div class="catalog-demo">
                <div class="catalog-stats">
                    <div class="stat-item">
                        <span class="stat-label">All Tags</span>
                        <div class="tag-list">
                            {#each allTags as tag}
                                <span class="tag">{tag}</span>
                            {/each}
                        </div>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Active Themes</span>
                        <span class="stat-value">{Object.keys(activeThemes).length}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Dark Themes</span>
                        <span class="stat-value">{Object.keys(darkThemes).length}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Light Themes</span>
                        <span class="stat-value">{Object.keys(lightThemes).length}</span>
                    </div>
                </div>

                <div class="code-section">
                    <div class="code-header">
                        <h3>Filtering Example</h3>
                        <button class="copy-btn" onclick={() => copyCode(codeSnippets.filtering, 'filtering')}>
                            {#if copiedId === 'filtering'}
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                                    <polyline points="20 6 9 17 4 12"/>
                                </svg>
                                Copied!
                            {:else}
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                                </svg>
                                Copy
                            {/if}
                        </button>
                    </div>
                    <pre><code>{codeSnippets.filtering}</code></pre>
                </div>
            </div>
        </section>
    {/if}

    <section class="demo-cards">
        <h2>Theme Colors</h2>
        <div class="cards">
            <div class="card">
                <h3>Primary Colors</h3>
                <div class="color-swatches">
                    <div class="swatch" style="background: var(--primary-1)"></div>
                    <div class="swatch" style="background: var(--primary-2)"></div>
                    <div class="swatch" style="background: var(--primary-3)"></div>
                    <div class="swatch" style="background: var(--primary-4)"></div>
                    <div class="swatch" style="background: var(--primary-5)"></div>
                    <div class="swatch" style="background: var(--primary-6)"></div>
                </div>
            </div>
            <div class="card">
                <h3>Accent Colors</h3>
                <div class="color-swatches">
                    <div class="swatch accent" style="background: var(--accent-1)"></div>
                    <div class="swatch accent" style="background: var(--accent-2)"></div>
                    <div class="swatch accent" style="background: var(--accent-3)"></div>
                </div>
            </div>
            <div class="card">
                <h3>Text Hierarchy</h3>
                <p style="color: var(--text-primary)">Primary text color</p>
                <p style="color: var(--text-secondary)">Secondary text color</p>
                <p style="color: var(--text-muted)">Muted text color</p>
            </div>
        </div>
    </section>

    <section>
        <h2>Implementation</h2>

        <div class="code-section">
            <p class="code-description">Drop in a floating theme picker button with zero configuration. Appears in the bottom-right corner by default.</p>
            <div class="code-header">
                <h3>Basic Usage</h3>
                <button class="copy-btn" onclick={() => copyCode(codeSnippets.basic, 'basic')}>
                    {#if copiedId === 'basic'}
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                            <polyline points="20 6 9 17 4 12"/>
                        </svg>
                        Copied!
                    {:else}
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                        </svg>
                        Copy
                    {/if}
                </button>
            </div>
            <pre><code>{codeSnippets.basic}</code></pre>
        </div>

        <div class="code-section">
            <p class="code-description">Customize the storage key, default theme, button position, and get notified when themes change.</p>
            <div class="code-header">
                <h3>With Configuration</h3>
                <button class="copy-btn" onclick={() => copyCode(codeSnippets.config, 'config')}>
                    {#if copiedId === 'config'}
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                            <polyline points="20 6 9 17 4 12"/>
                        </svg>
                        Copied!
                    {:else}
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                        </svg>
                        Copy
                    {/if}
                </button>
            </div>
            <pre><code>{codeSnippets.config}</code></pre>
        </div>

        <div class="code-section">
            <p class="code-description">Control themes via the store API. Useful for custom UIs, keyboard shortcuts, or syncing with external state.</p>
            <div class="code-header">
                <h3>Programmatic Control</h3>
                <button class="copy-btn" onclick={() => copyCode(codeSnippets.programmatic, 'programmatic')}>
                    {#if copiedId === 'programmatic'}
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                            <polyline points="20 6 9 17 4 12"/>
                        </svg>
                        Copied!
                    {:else}
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                        </svg>
                        Copy
                    {/if}
                </button>
            </div>
            <pre><code>{codeSnippets.programmatic}</code></pre>
        </div>

        <div class="code-section">
            <p class="code-description">The ThemePicker component is optional. Use just the store and utilities for full control without any UI.</p>
            <div class="code-header">
                <h3>Headless Mode (No UI)</h3>
                <button class="copy-btn" onclick={() => copyCode(codeSnippets.headless, 'headless')}>
                    {#if copiedId === 'headless'}
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                            <polyline points="20 6 9 17 4 12"/>
                        </svg>
                        Copied!
                    {:else}
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                        </svg>
                        Copy
                    {/if}
                </button>
            </div>
            <pre><code>{codeSnippets.headless}</code></pre>
        </div>

        <div class="code-section">
            <p class="code-description">Define your own brand themes with full control over colors, fonts, and visual effects.</p>
            <div class="code-header">
                <h3>Custom Themes</h3>
                <button class="copy-btn" onclick={() => copyCode(codeSnippets.customThemes, 'customThemes')}>
                    {#if copiedId === 'customThemes'}
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                            <polyline points="20 6 9 17 4 12"/>
                        </svg>
                        Copied!
                    {:else}
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                        </svg>
                        Copy
                    {/if}
                </button>
            </div>
            <pre><code>{codeSnippets.customThemes}</code></pre>
        </div>

        <div class="code-section">
            <p class="code-description">Store themes in JSON files with metadata for filtering. Keep test and seasonal themes documented but hidden from production.</p>
            <div class="code-header">
                <h3>JSON-Driven Themes</h3>
                <button class="copy-btn" onclick={() => copyCode(codeSnippets.jsonDriven, 'jsonDriven')}>
                    {#if copiedId === 'jsonDriven'}
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                            <polyline points="20 6 9 17 4 12"/>
                        </svg>
                        Copied!
                    {:else}
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                        </svg>
                        Copy
                    {/if}
                </button>
            </div>
            <pre><code>{codeSnippets.jsonDriven}</code></pre>
        </div>

        <div class="code-section">
            <p class="code-description">Temporarily apply themes without persisting to localStorage. Ideal for settings forms where users can preview before saving.</p>
            <div class="code-header">
                <h3>Preview Mode (Forms)</h3>
                <button class="copy-btn" onclick={() => copyCode(codeSnippets.previewMode, 'previewMode')}>
                    {#if copiedId === 'previewMode'}
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                            <polyline points="20 6 9 17 4 12"/>
                        </svg>
                        Copied!
                    {:else}
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                        </svg>
                        Copy
                    {/if}
                </button>
            </div>
            <pre><code>{codeSnippets.previewMode}</code></pre>
        </div>

        <div class="code-section new-feature">
            <p class="code-description">Prevent theme flash during SSR hydration. The ThemeHead component injects a blocking script that applies CSS variables before first paint.</p>
            <div class="code-header">
                <h3>SSR Support (v1.1.0+)</h3>
                <button class="copy-btn" onclick={() => copyCode(codeSnippets.ssrSupport, 'ssrSupport')}>
                    {#if copiedId === 'ssrSupport'}
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                            <polyline points="20 6 9 17 4 12"/>
                        </svg>
                        Copied!
                    {:else}
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                        </svg>
                        Copy
                    {/if}
                </button>
            </div>
            <pre><code>{codeSnippets.ssrSupport}</code></pre>
        </div>

        <div class="code-section new-feature">
            <p class="code-description">Automatically sync theme changes across browser tabs. When a user changes the theme in one tab, all other tabs update instantly.</p>
            <div class="code-header">
                <h3>Cross-Tab Sync (v1.1.0+)</h3>
                <button class="copy-btn" onclick={() => copyCode(codeSnippets.crossTabSync, 'crossTabSync')}>
                    {#if copiedId === 'crossTabSync'}
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                            <polyline points="20 6 9 17 4 12"/>
                        </svg>
                        Copied!
                    {:else}
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                        </svg>
                        Copy
                    {/if}
                </button>
            </div>
            <pre><code>{codeSnippets.crossTabSync}</code></pre>
        </div>

        <div class="code-section">
            <p class="code-description">These CSS custom properties are automatically set on your document root when a theme is applied.</p>
            <div class="code-header">
                <h3>CSS Variables Applied</h3>
                <button class="copy-btn" onclick={() => copyCode(codeSnippets.cssVars, 'cssVars')}>
                    {#if copiedId === 'cssVars'}
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                            <polyline points="20 6 9 17 4 12"/>
                        </svg>
                        Copied!
                    {:else}
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                        </svg>
                        Copy
                    {/if}
                </button>
            </div>
            <pre><code>{codeSnippets.cssVars}</code></pre>
        </div>
    </section>

    <section>
        <h2>TypeScript Types</h2>
        <p>All types are exported for full TypeScript support. Import what you need for type-safe theme definitions.</p>

        <div class="code-section">
            <p class="code-description">Main interfaces for theme definitions and picker configuration.</p>
            <div class="code-header">
                <h3>Core Types</h3>
                <button class="copy-btn" onclick={() => copyCode(codeSnippets.coreTypes, 'coreTypes')}>
                    {#if copiedId === 'coreTypes'}
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                            <polyline points="20 6 9 17 4 12"/>
                        </svg>
                        Copied!
                    {:else}
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                        </svg>
                        Copy
                    {/if}
                </button>
            </div>
            <pre><code>{codeSnippets.coreTypes}</code></pre>
        </div>

        <div class="code-section">
            <p class="code-description">The theme store extends Svelte's Writable store with theme-specific methods including preview mode.</p>
            <div class="code-header">
                <h3>Store Interface</h3>
                <button class="copy-btn" onclick={() => copyCode(codeSnippets.storeInterface, 'storeInterface')}>
                    {#if copiedId === 'storeInterface'}
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                            <polyline points="20 6 9 17 4 12"/>
                        </svg>
                        Copied!
                    {:else}
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                        </svg>
                        Copy
                    {/if}
                </button>
            </div>
            <pre><code>{codeSnippets.storeInterface}</code></pre>
        </div>

        <div class="code-section">
            <p class="code-description">Types for organizing themes with metadata, tags, and filtering options.</p>
            <div class="code-header">
                <h3>Catalog Types (for JSON-driven themes)</h3>
                <button class="copy-btn" onclick={() => copyCode(codeSnippets.catalogTypes, 'catalogTypes')}>
                    {#if copiedId === 'catalogTypes'}
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                            <polyline points="20 6 9 17 4 12"/>
                        </svg>
                        Copied!
                    {:else}
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                        </svg>
                        Copy
                    {/if}
                </button>
            </div>
            <pre><code>{codeSnippets.catalogTypes}</code></pre>
        </div>
    </section>

    <ThemePicker onThemeChange={handleThemeChange} />
</main>

<style>
    :global(body) {
        margin: 0;
        padding: 0;
        min-height: 100vh;
        background: var(--bg-deep, #1a1a2e);
        color: var(--text-primary, #e8e0f0);
        font-family: var(--font-body, system-ui, sans-serif);
        transition: background 0.3s ease, color 0.3s ease;
        /* Firefox scrollbar */
        scrollbar-width: thin;
        scrollbar-color: var(--accent-1, #a855f7) var(--bg-mid, #232342);
    }

    /* Webkit scrollbar (Chrome, Safari, Edge) */
    :global(::-webkit-scrollbar) {
        width: 10px;
        height: 10px;
    }

    :global(::-webkit-scrollbar-track) {
        background: var(--bg-mid, #232342);
    }

    :global(::-webkit-scrollbar-thumb) {
        background: var(--accent-1, #a855f7);
        border-radius: 5px;
        border: 2px solid var(--bg-mid, #232342);
    }

    :global(::-webkit-scrollbar-thumb:hover) {
        background: var(--primary-1, #c9a0dc);
    }

    :global(::-webkit-scrollbar-corner) {
        background: var(--bg-mid, #232342);
    }

    main {
        max-width: 900px;
        margin: 0 auto;
        padding: 2rem;
        padding-bottom: 6rem;
    }

    h1 {
        font-family: var(--font-heading, system-ui, sans-serif);
        font-size: 2.5rem;
        margin-bottom: 0.5rem;
        background: linear-gradient(135deg, var(--primary-1, #c9a0dc), var(--accent-1, #a855f7));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }

    h2 {
        font-family: var(--font-heading, system-ui, sans-serif);
        color: var(--primary-1, #c9a0dc);
        margin-top: 2.5rem;
        margin-bottom: 1rem;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        padding-bottom: 0.5rem;
    }

    h3 {
        margin-top: 0;
        margin-bottom: 0.75rem;
        color: var(--text-secondary, #c8c0d8);
        font-size: 1rem;
    }

    section {
        margin-bottom: 2rem;
    }

    ul {
        line-height: 1.8;
    }

    .features-list {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 0.5rem 2rem;
        padding-left: 1.25rem;
    }

    .features-list li {
        line-height: 1.6;
    }

    @media (max-width: 640px) {
        .features-list {
            grid-template-columns: 1fr;
        }
    }

    code {
        font-family: var(--font-mono, 'Fira Code', monospace);
        background: var(--bg-card, #2a2a4a);
        padding: 0.2em 0.4em;
        border-radius: 4px;
        font-size: 0.9em;
    }

    pre {
        margin: 0;
        padding: 0;
    }

    pre code {
        display: block;
        padding: 1rem;
        overflow-x: auto;
        font-size: 0.85rem;
        line-height: 1.5;
    }

    .button-row {
        display: flex;
        gap: 0.75rem;
        margin-top: 1rem;
        flex-wrap: wrap;
    }

    .demo-button {
        padding: 0.6rem 1.2rem;
        border: none;
        border-radius: 8px;
        font-size: 0.9rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
        background: linear-gradient(135deg, var(--primary-1, #c9a0dc), var(--accent-1, #a855f7));
        color: var(--bg-deep, #1a1a2e);
    }

    .demo-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(168, 85, 247, 0.3);
    }

    .demo-button.secondary {
        background: var(--bg-card, #2a2a4a);
        color: var(--text-primary, #e8e0f0);
        border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .demo-button.secondary:hover {
        background: var(--bg-glow, #3d3d6b);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }

    .inline-picker-container {
        margin-top: 2rem;
        max-width: 360px;
    }

    .inline-picker-container.horizontal {
        max-width: 100%;
    }

    /* Custom Theme Picker Demo */
    .custom-picker-demo {
        margin-top: 2rem;
        padding: 1.5rem;
        background: var(--bg-card, #2a2a4a);
        border-radius: 12px;
        border: 1px solid color-mix(in srgb, var(--text-primary, #e8e0f0) 15%, transparent);
        box-shadow: 0 2px 8px color-mix(in srgb, var(--text-primary, #000) 8%, transparent);
    }

    .theme-grid {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
    }

    .theme-swatch {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 6px;
        padding: 8px;
        background: transparent;
        border: 2px solid transparent;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s ease;
    }

    .theme-swatch:hover {
        background: rgba(255, 255, 255, 0.05);
        transform: translateY(-2px);
    }

    .theme-swatch.selected {
        border-color: var(--accent-1, #a855f7);
        background: rgba(168, 85, 247, 0.15);
    }

    .swatch-colors {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 2px;
        width: 40px;
        height: 40px;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    }

    .swatch-colors span {
        width: 100%;
        height: 100%;
    }

    .swatch-name {
        font-size: 0.7rem;
        color: var(--text-muted, #9090b0);
        text-align: center;
    }

    .theme-swatch.selected .swatch-name {
        color: var(--text-primary, #e8e0f0);
        font-weight: 500;
    }

    .custom-picker-actions {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-top: 1.5rem;
        padding-top: 1rem;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .preview-note {
        font-size: 0.85rem;
        color: var(--text-secondary, #c8c0d8);
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .preview-status {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        margin-top: 0.5rem;
    }

    .preview-badge {
        display: inline-block;
        padding: 0.25rem 0.6rem;
        background: linear-gradient(135deg, var(--accent-1, #a855f7), var(--accent-2, #ff6b9d));
        color: white;
        font-size: 0.75rem;
        font-weight: 600;
        border-radius: 4px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    .preview-badge.small {
        padding: 0.15rem 0.4rem;
        font-size: 0.65rem;
    }

    /* Catalog Demo Styles */
    .catalog-demo {
        margin-top: 1rem;
    }

    .catalog-stats {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
        gap: 1rem;
        margin-bottom: 1.5rem;
    }

    .stat-item {
        background: var(--bg-card, #2a2a4a);
        padding: 1rem;
        border-radius: 8px;
        border: 1px solid color-mix(in srgb, var(--text-primary, #e8e0f0) 15%, transparent);
        box-shadow: 0 2px 6px color-mix(in srgb, var(--text-primary, #000) 6%, transparent);
    }

    .stat-label {
        display: block;
        font-size: 0.75rem;
        color: var(--text-muted, #9090b0);
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: 0.5rem;
    }

    .stat-value {
        font-size: 1.5rem;
        font-weight: 600;
        color: var(--primary-1, #c9a0dc);
    }

    .tag-list {
        display: flex;
        flex-wrap: wrap;
        gap: 0.4rem;
    }

    .tag {
        display: inline-block;
        padding: 0.2rem 0.5rem;
        background: var(--bg-glow, #3d3d6b);
        color: var(--text-secondary, #c8c0d8);
        font-size: 0.7rem;
        border-radius: 4px;
        border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .cards {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
    }

    .card {
        background: var(--bg-card, #2a2a4a);
        padding: 1.5rem;
        border-radius: 12px;
        border: 1px solid color-mix(in srgb, var(--text-primary, #e8e0f0) 15%, transparent);
        box-shadow: 0 2px 8px color-mix(in srgb, var(--text-primary, #000) 10%, transparent);
    }

    .color-swatches {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
    }

    .swatch {
        width: 40px;
        height: 40px;
        border-radius: 8px;
        border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .swatch.accent {
        box-shadow: 0 0 20px currentColor;
    }

    .code-section {
        margin-bottom: 1.5rem;
        background: var(--bg-card, #2a2a4a);
        border-radius: 12px;
        border: 1px solid color-mix(in srgb, var(--text-primary, #e8e0f0) 15%, transparent);
        box-shadow: 0 2px 8px color-mix(in srgb, var(--text-primary, #000) 8%, transparent);
        overflow: hidden;
    }

    .code-description {
        margin: 0;
        padding: 0.75rem 1rem;
        font-size: 0.85rem;
        color: var(--text-secondary, #c8c0d8);
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        background: rgba(255, 255, 255, 0.02);
    }

    .code-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.75rem 1rem;
        background: rgba(255, 255, 255, 0.05);
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .code-header h3 {
        margin: 0;
        padding: 0;
        background: transparent;
        border: none;
        font-size: 0.85rem;
        color: var(--primary-1, #c9a0dc);
    }

    .code-section h3 {
        margin: 0;
        padding: 0.75rem 1rem;
        background: rgba(255, 255, 255, 0.05);
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        font-size: 0.85rem;
        color: var(--primary-1, #c9a0dc);
    }

    .code-section pre code {
        background: transparent;
    }

    .code-section.new-feature {
        border-color: var(--accent-1, #a855f7);
        box-shadow: 0 0 20px rgba(168, 85, 247, 0.15);
    }

    .code-section.new-feature .code-header h3::after {
        content: 'NEW';
        margin-left: 0.5rem;
        padding: 0.15rem 0.4rem;
        background: linear-gradient(135deg, var(--accent-1, #a855f7), var(--accent-2, #ff6b9d));
        color: white;
        font-size: 0.6rem;
        font-weight: 600;
        border-radius: 3px;
        vertical-align: middle;
    }

    .copy-btn {
        display: flex;
        align-items: center;
        gap: 0.4rem;
        padding: 0.35rem 0.7rem;
        font-size: 0.75rem;
        font-weight: 500;
        color: var(--text-secondary, #c8c0d8);
        background: var(--bg-glow, #3d3d6b);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.2s ease;
    }

    .copy-btn:hover {
        background: var(--accent-1, #a855f7);
        color: white;
        border-color: var(--accent-1, #a855f7);
    }

    .copy-btn svg {
        flex-shrink: 0;
    }

    p {
        margin: 0.5rem 0;
        line-height: 1.6;
    }

    @media (max-width: 640px) {
        main {
            padding: 1.5rem;
        }

        h1 {
            font-size: 2rem;
        }

        .code-section pre code {
            font-size: 0.75rem;
        }
    }
</style>
