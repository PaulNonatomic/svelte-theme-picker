# Migration Guide

This guide covers breaking changes and migration steps between versions of `svelte-theme-picker`.

---

## Migrating from 1.0.x to 1.1.0

Version 1.1.0 introduces SSR support, cross-tab synchronization, and improved CSS customization. While most changes are backward-compatible, there are some potentially breaking changes to be aware of.

### Breaking Changes Summary

| Change | Impact | Action Required |
|--------|--------|-----------------|
| CSS now uses theme variable fallbacks | Medium | Review picker appearance |
| `color-mix()` CSS function used | Low | Check browser support |
| `ThemeStore` interface has new `destroy()` method | Low | Add method if implementing custom stores |

---

### 1. CSS Styling Changes (Medium Impact)

#### What Changed

The `ThemePicker` component now uses your application's theme CSS variables as fallbacks. Previously, all colors were hardcoded:

```css
/* v1.0.x - Hardcoded values */
.stp-theme-picker {
  --stp-bg: #2a2a4a;
  --stp-text: #e8e0f0;
  --stp-accent: #a855f7;
}
```

```css
/* v1.1.0 - Theme variable fallbacks */
.stp-theme-picker {
  --stp-bg: var(--bg-card, #2a2a4a);
  --stp-text: var(--text-primary, #e8e0f0);
  --stp-accent: var(--accent-1, #a855f7);
}
```

#### Who Is Affected

- Applications that define `--bg-card`, `--text-primary`, `--accent-1`, or other theme variables
- The picker will now automatically inherit these values, which may change its appearance

#### Migration Steps

**Option A: Keep the new behavior (Recommended)**

The picker now automatically matches your theme. No action needed if this is desired.

**Option B: Restore v1.0.x appearance**

Override the picker's CSS variables explicitly to restore the original hardcoded look:

```css
/* Add to your global CSS */
.stp-theme-picker {
  --stp-bg: #2a2a4a;
  --stp-bg-hover: #3d3d6b;
  --stp-border: rgba(255, 255, 255, 0.1);
  --stp-text: #e8e0f0;
  --stp-text-muted: #9090b0;
  --stp-accent: #a855f7;
  --stp-trigger-bg: linear-gradient(135deg, #c9a0dc, #a855f7);
  --stp-trigger-color: #1a1a2e;
}
```

**Option C: Customize for your theme**

Take advantage of the new customization by setting picker variables to match your design system:

```css
.stp-theme-picker {
  --stp-bg: var(--my-surface-color);
  --stp-text: var(--my-text-color);
  --stp-accent: var(--my-brand-color);
}
```

---

### 2. Browser Support for `color-mix()` (Low Impact)

#### What Changed

The picker now uses the CSS `color-mix()` function for calculated colors (active states, borders, glows):

```css
--stp-bg-active: color-mix(in srgb, var(--stp-accent) 15%, transparent);
--stp-border: color-mix(in srgb, var(--stp-text) 10%, transparent);
```

#### Browser Support

| Browser | Minimum Version |
|---------|-----------------|
| Chrome | 111+ |
| Firefox | 113+ |
| Safari | 16.2+ |
| Edge | 111+ |

#### Who Is Affected

- Applications targeting older browsers (pre-2023)

#### Migration Steps

**Option A: Accept modern browser requirement**

Most users on current browsers will have support. No action needed.

**Option B: Add fallbacks for older browsers**

Override the affected properties with static values:

```css
.stp-theme-picker {
  /* Fallbacks for older browsers */
  --stp-bg-active: rgba(168, 85, 247, 0.15);
  --stp-border: rgba(255, 255, 255, 0.1);
  --stp-accent-glow: rgba(168, 85, 247, 0.3);
}
```

**Option C: Use a PostCSS plugin**

Add `postcss-color-mix-function` to your build process for automatic fallbacks.

---

### 3. ThemeStore Interface Change (Low Impact)

#### What Changed

The `ThemeStore` interface now includes a `destroy()` method for cleanup:

```typescript
// v1.1.0 ThemeStore interface
interface ThemeStore extends Writable<string> {
  // ... existing methods ...
  destroy: () => void;  // NEW
}
```

#### Who Is Affected

- Developers who implemented custom stores matching the `ThemeStore` interface
- NOT affected: Users of `createThemeStore()` or the default `themeStore`

#### Migration Steps

Add a `destroy()` method to your custom store implementation:

```typescript
// Before (v1.0.x)
const myCustomStore: ThemeStore = {
  subscribe,
  set,
  update,
  setTheme: (id) => { /* ... */ },
  getTheme: (id) => { /* ... */ },
  // ... other methods
};

// After (v1.1.0)
const myCustomStore: ThemeStore = {
  subscribe,
  set,
  update,
  setTheme: (id) => { /* ... */ },
  getTheme: (id) => { /* ... */ },
  // ... other methods
  destroy: () => {
    // Clean up any listeners, subscriptions, etc.
    // Can be empty if no cleanup needed
  },
};
```

---

## New Features in 1.1.0

These are additive features that require no migration:

### SSR Support

Prevent theme flash on page load:

```svelte
<script>
  import { ThemeHead, ThemePicker, defaultThemes } from 'svelte-theme-picker';
</script>

<ThemeHead themes={defaultThemes} defaultTheme="dreamy" />
<ThemePicker />
```

### Cross-Tab Synchronization

Sync themes across browser tabs:

```typescript
const store = createThemeStore({
  syncTabs: true,
});
```

### Theme Mode Property

Themes can now declare light/dark mode:

```typescript
const myTheme: Theme = {
  name: 'My Theme',
  mode: 'light', // or 'dark'
  // ...
};
```

---

## Guidance for AI Agents

When integrating or updating `svelte-theme-picker` in a codebase:

### Pre-Migration Checklist

1. **Check current version**: Look for `"svelte-theme-picker"` in `package.json`
2. **Identify CSS overrides**: Search for `.stp-` class selectors or `--stp-` CSS variables
3. **Check for custom ThemeStore implementations**: Search for `ThemeStore` type usage
4. **Review browser requirements**: Check if the project needs to support pre-2023 browsers

### Migration Commands

```bash
# Update the package
npm update svelte-theme-picker

# Or install specific version
npm install svelte-theme-picker@1.1.0
```

### Post-Migration Verification

1. **Visual check**: Verify the picker appearance matches expectations
2. **Browser test**: Test in the oldest supported browser
3. **Type check**: Run `npm run check` or `tsc` to catch interface mismatches

### Common Issues and Solutions

| Symptom | Cause | Solution |
|---------|-------|----------|
| Picker colors changed unexpectedly | Theme variables now used as fallbacks | Override `--stp-*` variables explicitly |
| TypeScript error on custom store | Missing `destroy()` method | Add `destroy: () => {}` to store |
| Picker looks broken in older browser | `color-mix()` not supported | Add CSS fallbacks or update browser requirement |

---

## Version History

| Version | Date | Notes |
|---------|------|-------|
| 1.1.0 | January 2026 | SSR support, cross-tab sync, CSS improvements |
| 1.0.0 | January 2026 | Initial release |
