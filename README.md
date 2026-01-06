# svelte-theme-picker

A customizable theme picker component for Svelte 5 applications.

## Features

- 10 built-in themes (dark and light modes)
- Fully customizable - add your own themes
- Persists selection to localStorage
- Applies CSS variables to your document
- Svelte 5 runes compatible
- Full TypeScript support
- Floating button or inline mode (vertical or horizontal)
- **Preview mode** - temporarily apply themes without persisting
- **JSON-driven themes** - define themes in JSON with production/test filtering
- **Theme catalogs** - organize themes with metadata, tags, and filtering
- **Headless mode** - use the store without any UI for full programmatic control
- **Performance optimized** - GPU-accelerated animations, batched DOM updates
- **Accessible** - ARIA labels, keyboard navigation (Escape to close)

## Installation

```bash
npm install svelte-theme-picker
# or
pnpm add svelte-theme-picker
# or
yarn add svelte-theme-picker
```

## Basic Usage

```svelte
<script>
  import { ThemePicker } from 'svelte-theme-picker';
</script>

<ThemePicker />
```

This adds a floating theme picker button to the bottom-right of your page.

## Configuration

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `config` | `ThemePickerConfig` | `{}` | Configuration options |
| `store` | `ThemeStore` | `undefined` | Custom theme store |
| `position` | `'bottom-right' \| 'bottom-left' \| 'top-right' \| 'top-left'` | `'bottom-right'` | Position of trigger button |
| `showTrigger` | `boolean` | `true` | Show floating button (false = inline mode) |
| `layout` | `'vertical' \| 'horizontal'` | `'vertical'` | Layout direction for inline mode |
| `onThemeChange` | `(id: string, theme: Theme) => void` | `undefined` | Callback when theme changes |

### Inline Layouts

```svelte
<!-- Vertical list with names and descriptions -->
<ThemePicker showTrigger={false} layout="vertical" />

<!-- Horizontal grid of color swatches (compact) -->
<ThemePicker showTrigger={false} layout="horizontal" />
```

### Configuration Options

```typescript
interface ThemePickerConfig {
  storageKey?: string;      // localStorage key (default: 'svelte-theme-picker')
  defaultTheme?: string;    // Default theme ID (default: 'dreamy')
  themes?: Record<string, Theme>;  // Custom themes
  cssVarPrefix?: string;    // CSS variable prefix
}
```

## Headless Mode (No UI)

The `ThemePicker` component is completely optional. You can use just the store and utilities for full programmatic control without rendering any UI. This is useful when:

- You want to control themes from your own settings page
- Themes are set based on user preferences from a database
- You're building a custom theme switcher UI
- You want to disable user theme switching entirely

```svelte
<script>
  // No ThemePicker component needed!
  import { themeStore, applyTheme, defaultThemes } from 'svelte-theme-picker';
  import { onMount } from 'svelte';

  onMount(() => {
    // Load theme from user preferences, database, API, etc.
    const userTheme = getUserPreference() || 'dreamy';
    themeStore.setTheme(userTheme);
    applyTheme(defaultThemes[userTheme]);

    // Optionally subscribe to persist changes
    return themeStore.subscribe((themeId) => {
      saveUserPreference(themeId);
    });
  });
</script>

<!-- Your app content - no picker UI rendered -->
<slot />
```

You get all the benefits (localStorage persistence, CSS variable application, TypeScript types) without any visible theme picker.

## Preview Mode (Temporary Themes)

Perfect for form-based theme selection where you want to preview themes without persisting them:

```svelte
<script>
  import { themeStore, applyTheme, defaultThemes } from 'svelte-theme-picker';
  import { onMount } from 'svelte';

  let selectedTheme = 'dreamy';

  onMount(() => {
    // When the page unmounts, revert to persisted theme
    return () => {
      themeStore.revertPreview();
    };
  });

  function previewTheme(themeId: string) {
    selectedTheme = themeId;
    // Preview without persisting to localStorage
    themeStore.previewTheme(themeId);
    applyTheme(defaultThemes[themeId]);
  }

  function saveTheme() {
    // Persist the selection
    themeStore.setTheme(selectedTheme);
  }
</script>

<select onchange={(e) => previewTheme(e.target.value)}>
  {#each Object.entries(defaultThemes) as [id, theme]}
    <option value={id}>{theme.name}</option>
  {/each}
</select>

<button onclick={saveTheme}>Save Theme</button>
```

### Store Preview Methods

```typescript
interface ThemeStore {
  // ... standard methods ...

  /** Preview a theme temporarily without persisting */
  previewTheme: (themeId: string) => void;

  /** Revert from preview back to the persisted theme */
  revertPreview: () => void;

  /** Check if currently in preview mode */
  isPreviewMode: () => boolean;

  /** Get the persisted theme ID (ignores preview) */
  getPersistedThemeId: () => string;
}
```

## Theme Catalogs

For larger applications, you may want to organize themes with metadata. Theme catalogs support:
- **Active/inactive** - Hide themes from production while keeping them documented
- **Tags** - Categorize themes (dark, light, seasonal, test, etc.)
- **Sorting** - Control display order
- **Filtering** - Show only relevant themes

### Catalog Structure

```typescript
import type { ThemeCatalog } from 'svelte-theme-picker';

const myCatalog: ThemeCatalog = {
  'brand-dark': {
    theme: { /* theme definition */ },
    meta: {
      active: true,           // Show in picker
      tags: ['dark', 'brand'],
      order: 1,               // Sort order
      seasonal: false,        // Or 'winter', 'spring', etc.
    }
  },
  'christmas': {
    theme: { /* theme definition */ },
    meta: {
      active: false,          // Hidden from picker
      tags: ['dark', 'seasonal'],
      seasonal: 'winter',
    }
  },
  'test-theme': {
    theme: { /* theme definition */ },
    meta: {
      active: false,          // Dev only
      tags: ['test'],
    }
  },
};
```

### Filtering Themes

```typescript
import {
  defaultThemeCatalog,
  filterCatalog,
  catalogToThemes,
  getActiveThemes,
  getThemesByTag,
  getThemesByAnyTag,
} from 'svelte-theme-picker';

// Get only active themes
const activeThemes = getActiveThemes(defaultThemeCatalog);

// Get themes by tag
const darkThemes = getThemesByTag(defaultThemeCatalog, 'dark');

// Get themes by any of several tags
const accentThemes = getThemesByAnyTag(defaultThemeCatalog, ['neon', 'vibrant']);

// Advanced filtering
const productionThemes = catalogToThemes(
  filterCatalog(defaultThemeCatalog, {
    activeOnly: true,
    excludeTags: ['test', 'seasonal'],
  })
);

// Use with ThemePicker
<ThemePicker config={{ themes: productionThemes }} />
```

### JSON-Driven Themes

Define your themes in a JSON file for easy management and version control:

**themes.json**
```json
{
  "brand-dark": {
    "theme": {
      "name": "Brand Dark",
      "description": "Official dark theme",
      "colors": {
        "bgDeep": "#0a0a12",
        "bgMid": "#12121a",
        "bgCard": "#1a1a24",
        "bgGlow": "#2a2a3a",
        "bgOverlay": "#0a0a12",
        "primary1": "#6366f1",
        "primary2": "#818cf8",
        "primary3": "#a5b4fc",
        "primary4": "#c7d2fe",
        "primary5": "#e0e7ff",
        "primary6": "#eef2ff",
        "accent1": "#8b5cf6",
        "accent2": "#a78bfa",
        "accent3": "#c4b5fd",
        "textPrimary": "#f8fafc",
        "textSecondary": "#cbd5e1",
        "textMuted": "#64748b"
      },
      "fonts": {
        "heading": "'Inter', sans-serif",
        "body": "'Inter', sans-serif",
        "mono": "'JetBrains Mono', monospace"
      },
      "effects": {
        "glowColor": "rgba(99, 102, 241, 0.15)",
        "glowIntensity": 0.3,
        "particleColors": ["#6366f1", "#8b5cf6"],
        "useNoise": false,
        "noiseOpacity": 0
      }
    },
    "meta": {
      "active": true,
      "tags": ["dark", "brand", "production"],
      "order": 1
    }
  },
  "christmas-special": {
    "theme": {
      "name": "Christmas",
      "description": "Festive holiday theme"
    },
    "meta": {
      "active": false,
      "tags": ["dark", "seasonal", "holiday"],
      "seasonal": "winter"
    }
  },
  "dev-test": {
    "theme": {
      "name": "Dev Test",
      "description": "Testing theme - not for production"
    },
    "meta": {
      "active": false,
      "tags": ["test", "dev"]
    }
  }
}
```

**Loading and filtering for production:**
```typescript
import {
  loadCatalogFromJSON,
  getActiveThemes,
  filterCatalog,
  catalogToThemes,
} from 'svelte-theme-picker';

// Load themes from JSON (e.g., fetched or imported)
import themesJson from './themes.json';
const catalog = loadCatalogFromJSON(themesJson);

// Get only production-ready themes (active: true)
const productionThemes = getActiveThemes(catalog);

// Or with more advanced filtering
const productionThemes = catalogToThemes(
  filterCatalog(catalog, {
    activeOnly: true,
    excludeTags: ['test', 'seasonal'],
  })
);

// Use with ThemePicker
<ThemePicker config={{ themes: productionThemes }} />
```

This pattern lets you:
- **Document all themes** in one place (production, test, seasonal)
- **Control which themes are active** in production via the `active` flag
- **Filter by tags** for specific use cases (e.g., only dark themes)
- **Version control** your theme definitions alongside your code

### Catalog Utilities

```typescript
// Convert simple themes to catalog
import { themesToCatalog } from 'svelte-theme-picker';
const catalog = themesToCatalog(myThemes, { active: true });

// Merge catalogs (combine default themes with your custom ones)
import { mergeCatalogs, defaultThemeCatalog } from 'svelte-theme-picker';
const combined = mergeCatalogs(defaultThemeCatalog, myCatalog);

// Get all tags in a catalog
import { getCatalogTags } from 'svelte-theme-picker';
const tags = getCatalogTags(myCatalog); // ['dark', 'brand', 'seasonal', ...]

// Sort catalog by order
import { sortCatalog } from 'svelte-theme-picker';
const sorted = sortCatalog(myCatalog);
```

## Custom Theme Picker UI

For complete control over the theme picker UI (e.g., in forms), you can build your own using the exported utilities. This is useful when you need color swatches in a specific layout or want to match your app's design system.

### Color Swatch Grid (Form Integration)

```svelte
<script lang="ts">
  import {
    themeStore,
    applyTheme,
    defaultThemes,
    type Theme
  } from 'svelte-theme-picker';
  import { onMount } from 'svelte';

  let selectedTheme = $state('dreamy');

  // Revert to saved theme when leaving the page
  onMount(() => {
    return () => themeStore.revertPreview();
  });

  function previewTheme(themeId: string) {
    selectedTheme = themeId;
    themeStore.previewTheme(themeId);
    applyTheme(defaultThemes[themeId]);
  }

  function saveSelection() {
    // Persist the theme when form is submitted
    themeStore.setTheme(selectedTheme);
  }
</script>

<div class="theme-grid">
  {#each Object.entries(defaultThemes) as [id, theme]}
    <button
      type="button"
      class="theme-swatch"
      class:selected={selectedTheme === id}
      onclick={() => previewTheme(id)}
      title={theme.name}
    >
      <div class="colors">
        <span style="background: {theme.colors.primary1}"></span>
        <span style="background: {theme.colors.primary3}"></span>
        <span style="background: {theme.colors.primary5}"></span>
        <span style="background: {theme.colors.accent1}"></span>
      </div>
      <span class="name">{theme.name}</span>
    </button>
  {/each}
</div>

<style>
  .theme-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .theme-swatch {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 8px;
    background: transparent;
    border: 2px solid transparent;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .theme-swatch:hover {
    background: rgba(255, 255, 255, 0.05);
  }

  .theme-swatch.selected {
    border-color: var(--accent-1, #a855f7);
    background: rgba(168, 85, 247, 0.1);
  }

  .colors {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 2px;
    width: 32px;
    height: 32px;
    border-radius: 6px;
    overflow: hidden;
  }

  .colors span {
    width: 100%;
    height: 100%;
  }

  .name {
    font-size: 0.75rem;
    color: var(--text-secondary, #a0a0a0);
  }

  .theme-swatch.selected .name {
    color: var(--text-primary, #fff);
  }
</style>
```

### Using with Forms

When integrating theme selection in a form (e.g., collection creation), use the preview pattern:

1. **On mount**: Save the current theme with `getPersistedThemeId()`
2. **On selection**: Use `previewTheme()` + `applyTheme()` for live preview
3. **On cancel/leave**: Call `revertPreview()` to restore the original theme
4. **On save**: Call `setTheme()` to persist the selection

```svelte
<script>
  import { themeStore, applyTheme, defaultThemes } from 'svelte-theme-picker';
  import { onMount } from 'svelte';

  let selectedTheme = 'dreamy';
  let formSubmitted = false;

  onMount(() => {
    // Restore original theme if user leaves without saving
    return () => {
      if (!formSubmitted) {
        themeStore.revertPreview();
      }
    };
  });

  function selectTheme(themeId) {
    selectedTheme = themeId;
    themeStore.previewTheme(themeId);
    applyTheme(defaultThemes[themeId]);
  }

  function handleSubmit() {
    formSubmitted = true;
    themeStore.setTheme(selectedTheme);
    // ... save to database
  }
</script>
```

## Custom Themes

You can provide your own themes:

```svelte
<script>
  import { ThemePicker, type Theme } from 'svelte-theme-picker';

  const myThemes: Record<string, Theme> = {
    'my-theme': {
      name: 'My Theme',
      description: 'A custom theme',
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
        heading: "'Inter', sans-serif",
        body: "'Inter', sans-serif",
        mono: "'JetBrains Mono', monospace",
      },
      effects: {
        glowColor: 'rgba(168, 85, 247, 0.15)',
        glowIntensity: 0.3,
        particleColors: ['#c9a0dc', '#a855f7'],
        useNoise: false,
        noiseOpacity: 0,
      },
    },
  };
</script>

<ThemePicker config={{ themes: myThemes, defaultTheme: 'my-theme' }} />
```

## CSS Variables

The theme picker applies these CSS variables to your document:

### Background Colors
- `--bg-deep` - Deepest background
- `--bg-mid` - Mid-level background
- `--bg-card` - Card/surface background
- `--bg-glow` - Glow/highlight background
- `--bg-overlay` - Overlay background

### Primary Colors (1-6)
- `--primary-1` through `--primary-6`

### Accent Colors (1-3)
- `--accent-1` through `--accent-3`

### Text Colors
- `--text-primary`
- `--text-secondary`
- `--text-muted`

### Fonts
- `--font-heading`
- `--font-body`
- `--font-mono`

### Effects
- `--shadow-glow`
- `--glow-color`
- `--glow-intensity`

## Using the Store Directly

```svelte
<script>
  import { themeStore, applyTheme, defaultThemes } from 'svelte-theme-picker';

  // Subscribe to changes
  $effect(() => {
    const theme = defaultThemes[$themeStore];
    if (theme) {
      console.log('Theme changed to:', theme.name);
    }
  });

  // Change theme programmatically
  function setDarkMode() {
    themeStore.setTheme('mono');
  }
</script>
```

## Built-in Themes

| ID | Name | Tags | Description |
|----|------|------|-------------|
| `dreamy` | Dreamy | dark, pastel | Soft pastels with dreamy atmosphere |
| `cyberpunk` | Cyberpunk | dark, neon | High contrast neons |
| `sunset` | Sunset | dark, warm | Warm oranges and purples |
| `ocean` | Ocean | dark, cool | Deep blues and teals |
| `mono` | Mono | dark, minimal | Clean monochromatic |
| `sakura` | Sakura | dark, pastel | Cherry blossom pinks |
| `aurora` | Aurora | dark, nature | Northern lights greens and purples |
| `galaxy` | Galaxy | dark, space | Deep space cosmic colors |
| `milk` | Milk | light, neutral | Clean, creamy light theme |
| `light` | Light | light, modern | Modern light theme with purple accents |

## Performance

The theme picker is optimized to minimize impact on your application:

- **CSS Containment**: Uses `contain: layout style` to isolate rendering
- **GPU Acceleration**: Animations use `transform` and `will-change` for smooth 60fps transitions
- **Batched DOM Updates**: Theme changes use `requestAnimationFrame` to batch all CSS variable updates into a single paint frame
- **Efficient Transitions**: Only animates specific properties instead of `transition: all`
- **Minimal Bundle**: ~75KB total including all 10 built-in themes

## Accessibility

The component follows accessibility best practices:

- **Keyboard Navigation**: Press `Escape` to close the theme panel
- **ARIA Labels**: All interactive elements have proper `aria-label` attributes
- **Role Attributes**: Theme list uses `role="listbox"` with `role="option"` items
- **Focus Management**: Proper `aria-expanded` and `aria-haspopup` on trigger button
- **Screen Reader Support**: Decorative elements marked with `aria-hidden="true"`

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Safari: Full support including `-webkit-backdrop-filter` for blur effects
- Graceful degradation: localStorage errors are handled silently (e.g., private browsing)

## TypeScript

Full TypeScript support with exported types:

```typescript
import type {
  Theme,
  ThemeColors,
  ThemeFonts,
  ThemeEffects,
  ThemePickerConfig,
  ThemeCatalog,
  ThemeCatalogEntry,
  ThemeMeta,
  ThemeFilterOptions,
} from 'svelte-theme-picker';
```

## License

MIT
