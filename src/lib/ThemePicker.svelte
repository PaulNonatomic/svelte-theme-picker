<script lang="ts">
    import { onMount } from 'svelte';
    import type { Theme, ThemePickerConfig } from './types.js';
    import { defaultThemes, DEFAULT_THEME_ID } from './themes.js';
    import { createThemeStore, applyTheme, type ThemeStore } from './store.js';

    interface Props {
        /** Configuration options */
        config?: ThemePickerConfig;
        /** Custom theme store (if not provided, creates one internally) */
        store?: ThemeStore;
        /** Position of the trigger button */
        position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
        /** Whether to show the trigger button (false = inline mode) */
        showTrigger?: boolean;
        /** Layout direction for inline mode */
        layout?: 'vertical' | 'horizontal';
        /** Callback when theme changes */
        onThemeChange?: (themeId: string, theme: Theme) => void;
    }

    const {
        config = {},
        store = undefined,
        position = 'bottom-right',
        showTrigger = true,
        layout = 'vertical',
        onThemeChange = undefined,
    }: Props = $props();

    /*
     * These values are intentionally captured once from initial props.
     * The theme picker doesn't support changing config/store after mount.
     * This is by design - create a new component instance to change config.
     */
    // svelte-ignore state_referenced_locally
    const themeStore: ThemeStore = store ?? createThemeStore(config);
    // svelte-ignore state_referenced_locally
    const themes: Record<string, Theme> = config.themes ?? defaultThemes;
    // svelte-ignore state_referenced_locally
    const cssVarPrefix: string = config.cssVarPrefix ?? '';

    let isOpen = $state(false);
    // svelte-ignore state_referenced_locally
    let currentThemeId = $state(config.defaultTheme ?? DEFAULT_THEME_ID);

    onMount(() => {
        const unsubscribe = themeStore.subscribe((themeId) => {
            currentThemeId = themeId;
            const theme = themes[themeId];
            if (theme) {
                applyTheme(theme, cssVarPrefix);
                onThemeChange?.(themeId, theme);
            }
        });

        // Apply initial theme
        const initialTheme = themes[currentThemeId];
        if (initialTheme) {
            applyTheme(initialTheme, cssVarPrefix);
        }

        return unsubscribe;
    });

    function selectTheme(themeId: string) {
        themeStore.setTheme(themeId);
        isOpen = false;
    }

    function togglePanel() {
        isOpen = !isOpen;
    }

    function closePanel() {
        isOpen = false;
    }

    function handleKeydown(e: KeyboardEvent) {
        // Only process Escape when panel is open to minimize event handler overhead
        if (isOpen && e.key === 'Escape') {
            isOpen = false;
        }
    }
</script>

<svelte:window onkeydown={handleKeydown} />

<div
    class="stp-theme-picker"
    class:stp-bottom-right={position === 'bottom-right'}
    class:stp-bottom-left={position === 'bottom-left'}
    class:stp-top-right={position === 'top-right'}
    class:stp-top-left={position === 'top-left'}
    class:stp-inline={!showTrigger}
>
    {#if showTrigger}
        <button
            type="button"
            class="stp-trigger"
            onclick={togglePanel}
            title="Switch theme"
            aria-label="Open theme switcher"
            aria-expanded={isOpen}
            aria-haspopup="dialog"
        >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20" aria-hidden="true">
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3"/>
                <line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/>
                <line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
        </button>
    {/if}

    {#if isOpen || !showTrigger}
        {#if showTrigger}
            <!-- Backdrop for closing panel - intentionally non-interactive for screen readers -->
            <!-- svelte-ignore a11y_no_static_element_interactions a11y_click_events_have_key_events -->
            <div class="stp-backdrop" onclick={closePanel} aria-hidden="true"></div>
        {/if}
        <div class="stp-panel" class:stp-panel-inline={!showTrigger} class:stp-horizontal={layout === 'horizontal'}>
            <div class="stp-header">
                <h3 class="stp-title">Theme</h3>
                {#if showTrigger}
                    <button type="button" class="stp-close" onclick={closePanel} aria-label="Close theme picker">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18" aria-hidden="true">
                            <line x1="18" y1="6" x2="6" y2="18"/>
                            <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                    </button>
                {/if}
            </div>
            <div class="stp-list" role="listbox" aria-label="Available themes">
                {#each Object.entries(themes) as [id, theme]}
                    <button
                        type="button"
                        class="stp-option"
                        class:stp-active={currentThemeId === id}
                        onclick={() => selectTheme(id)}
                        role="option"
                        aria-selected={currentThemeId === id}
                    >
                        <div class="stp-preview" aria-hidden="true">
                            <div class="stp-colors">
                                <span style="background: {theme.colors.primary1}"></span>
                                <span style="background: {theme.colors.primary3}"></span>
                                <span style="background: {theme.colors.primary5}"></span>
                                <span style="background: {theme.colors.accent1}"></span>
                            </div>
                        </div>
                        <div class="stp-info">
                            <span class="stp-name">{theme.name}</span>
                            <span class="stp-desc">{theme.description}</span>
                        </div>
                        {#if currentThemeId === id}
                            <svg class="stp-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18" aria-hidden="true">
                                <polyline points="20 6 9 17 4 12"/>
                            </svg>
                        {/if}
                    </button>
                {/each}
            </div>
        </div>
    {/if}
</div>

<style>
    /*
     * CSS Custom Properties for ThemePicker
     * Override these to customize the picker appearance:
     *
     * Colors:
     *   --stp-bg          : Panel background color
     *   --stp-bg-hover    : Hover state background
     *   --stp-bg-active   : Active/selected item background
     *   --stp-border      : Border color
     *   --stp-text        : Primary text color
     *   --stp-text-muted  : Secondary/muted text color
     *   --stp-accent      : Accent color (trigger, scrollbar, checks)
     *   --stp-accent-glow : Glow effect color for trigger
     *
     * Trigger button:
     *   --stp-trigger-bg       : Trigger button background
     *   --stp-trigger-color    : Trigger button icon color
     *
     * Layout:
     *   --stp-radius      : Panel border radius
     *   --stp-radius-sm   : Button/item border radius
     *   --stp-space       : Standard spacing
     *   --stp-space-sm    : Small spacing
     *   --stp-transition  : Transition duration/easing
     *
     * Example usage:
     *   :root {
     *     --stp-bg: var(--bg-card);
     *     --stp-text: var(--text-primary);
     *     --stp-accent: var(--accent-1);
     *   }
     */
    .stp-theme-picker {
        /* Fallback to theme variables, then to default values */
        --stp-bg: var(--bg-card, #2a2a4a);
        --stp-bg-hover: var(--bg-glow, #3d3d6b);
        --stp-bg-active: color-mix(in srgb, var(--stp-accent, var(--accent-1, #a855f7)) 15%, transparent);
        --stp-border: color-mix(in srgb, var(--stp-text, var(--text-primary, #e8e0f0)) 10%, transparent);
        --stp-text: var(--text-primary, #e8e0f0);
        --stp-text-muted: var(--text-muted, #9090b0);
        --stp-accent: var(--accent-1, #a855f7);
        --stp-accent-glow: color-mix(in srgb, var(--stp-accent) 30%, transparent);
        --stp-trigger-bg: linear-gradient(135deg, var(--primary-3, #c9a0dc), var(--stp-accent));
        --stp-trigger-color: var(--bg-deep, #1a1a2e);
        --stp-radius: 12px;
        --stp-radius-sm: 8px;
        --stp-space: 12px;
        --stp-space-sm: 8px;
        --stp-transition: 0.2s ease;

        /* Performance: Use CSS containment for better rendering performance */
        contain: layout style;
        position: fixed;
        z-index: 1000;
    }

    .stp-inline {
        position: relative;
    }

    .stp-bottom-right {
        bottom: 24px;
        right: 24px;
    }

    .stp-bottom-left {
        bottom: 24px;
        left: 24px;
    }

    .stp-top-right {
        top: 24px;
        right: 24px;
    }

    .stp-top-left {
        top: 24px;
        left: 24px;
    }

    .stp-trigger {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        border: none;
        background: var(--stp-trigger-bg);
        color: var(--stp-trigger-color);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow:
            0 4px 20px var(--stp-accent-glow),
            0 0 40px color-mix(in srgb, var(--stp-accent) 10%, transparent);
        transition: transform var(--stp-transition), box-shadow var(--stp-transition);
        /* Performance: Hint browser to prepare GPU layer for animations */
        will-change: transform;
    }

    .stp-trigger:hover {
        transform: scale(1.1);
        box-shadow:
            0 8px 30px var(--stp-accent-glow),
            0 0 60px color-mix(in srgb, var(--stp-accent) 20%, transparent);
    }

    .stp-backdrop {
        position: fixed;
        inset: 0;
        z-index: -1;
    }

    .stp-panel {
        position: absolute;
        width: 320px;
        background: color-mix(in srgb, var(--stp-bg) 95%, transparent);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px); /* Safari support */
        border-radius: var(--stp-radius);
        border: 1px solid var(--stp-border);
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
        overflow: hidden;
        animation: stp-slideIn 0.2s ease-out;
        /* Performance: Promote to GPU layer for backdrop-filter */
        transform: translateZ(0);
    }

    .stp-bottom-right .stp-panel,
    .stp-bottom-left .stp-panel {
        bottom: 60px;
    }

    .stp-bottom-right .stp-panel {
        right: 0;
    }

    .stp-bottom-left .stp-panel {
        left: 0;
    }

    .stp-top-right .stp-panel,
    .stp-top-left .stp-panel {
        top: 60px;
    }

    .stp-top-right .stp-panel {
        right: 0;
    }

    .stp-top-left .stp-panel {
        left: 0;
    }

    .stp-panel-inline {
        position: relative !important;
        bottom: auto !important;
        right: auto !important;
        left: auto !important;
        top: auto !important;
        margin-top: 8px;
        animation: none;
    }

    /* Horizontal layout for inline mode */
    .stp-horizontal {
        width: auto;
        max-width: 100%;
    }

    .stp-horizontal .stp-header {
        display: none;
    }

    .stp-horizontal .stp-list {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        max-height: none;
        padding: var(--stp-space);
    }

    .stp-horizontal .stp-option {
        flex-direction: column;
        width: auto;
        padding: var(--stp-space-sm);
        gap: 6px;
    }

    .stp-horizontal .stp-info {
        display: none;
    }

    .stp-horizontal .stp-check {
        position: absolute;
        top: -4px;
        right: -4px;
        background: var(--stp-accent);
        border-radius: 50%;
        padding: 2px;
        width: 16px;
        height: 16px;
    }

    .stp-horizontal .stp-option {
        position: relative;
    }

    .stp-horizontal .stp-colors {
        width: 40px;
        height: 40px;
    }

    @keyframes stp-slideIn {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .stp-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: var(--stp-space);
        border-bottom: 1px solid var(--stp-border);
    }

    .stp-title {
        margin: 0;
        font-size: 0.9rem;
        font-weight: 600;
        color: var(--stp-text);
    }

    .stp-close {
        background: transparent;
        border: none;
        color: var(--stp-text-muted);
        cursor: pointer;
        padding: 4px;
        border-radius: var(--stp-radius-sm);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background-color var(--stp-transition), color var(--stp-transition);
    }

    .stp-close:hover {
        background: var(--stp-bg-hover);
        color: var(--stp-text);
    }

    .stp-list {
        padding: var(--stp-space-sm);
        max-height: 400px;
        overflow-y: auto;
        scrollbar-width: thin;
        scrollbar-color: var(--stp-accent) transparent;
    }

    .stp-list::-webkit-scrollbar {
        width: 6px;
    }

    .stp-list::-webkit-scrollbar-track {
        background: transparent;
    }

    .stp-list::-webkit-scrollbar-thumb {
        background: color-mix(in srgb, var(--stp-accent) 50%, transparent);
        border-radius: 3px;
    }

    .stp-list::-webkit-scrollbar-thumb:hover {
        background: var(--stp-accent);
    }

    .stp-option {
        width: 100%;
        display: flex;
        align-items: center;
        gap: var(--stp-space);
        padding: var(--stp-space-sm) var(--stp-space);
        background: transparent;
        border: none;
        border-radius: var(--stp-radius-sm);
        cursor: pointer;
        transition: background-color var(--stp-transition);
        text-align: left;
    }

    .stp-option:hover {
        background: var(--stp-bg-hover);
    }

    .stp-option.stp-active {
        background: var(--stp-bg-active);
    }

    .stp-preview {
        flex-shrink: 0;
    }

    .stp-colors {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 2px;
        width: 32px;
        height: 32px;
        border-radius: 6px;
        overflow: hidden;
    }

    .stp-colors span {
        width: 100%;
        height: 100%;
    }

    .stp-info {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 2px;
    }

    .stp-name {
        font-size: 0.85rem;
        font-weight: 500;
        color: var(--stp-text);
    }

    .stp-desc {
        font-size: 0.7rem;
        color: var(--stp-text-muted);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .stp-check {
        flex-shrink: 0;
        color: var(--accent-2, #8ad4d4);
    }

    @media (max-width: 640px) {
        .stp-bottom-right,
        .stp-bottom-left {
            bottom: 16px;
        }

        .stp-bottom-right {
            right: 16px;
        }

        .stp-bottom-left {
            left: 16px;
        }

        .stp-panel {
            width: calc(100vw - 48px);
        }

        .stp-bottom-right .stp-panel {
            right: -16px;
        }

        .stp-bottom-left .stp-panel {
            left: -16px;
        }
    }
</style>
