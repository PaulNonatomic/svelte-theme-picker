<script lang="ts">
    import { generateBlockingScript, extractFonts, generateFontPreloadLinks } from './ssr.js';
    import type { Theme, FontConfig } from './types.js';

    interface Props {
        /** All available themes */
        themes: Record<string, Theme>;
        /** localStorage key for theme persistence */
        storageKey?: string;
        /** Default theme ID if none is stored */
        defaultTheme?: string;
        /** CSS variable prefix */
        cssVarPrefix?: string;
        /** Whether to prevent transitions during hydration (default: true) */
        preventTransitions?: boolean;
        /** Enable font preloading */
        preloadFonts?: boolean;
        /** Font configuration for preloading */
        fontConfig?: FontConfig;
    }

    let {
        themes,
        storageKey = 'svelte-theme-picker',
        defaultTheme,
        cssVarPrefix = '',
        preventTransitions = true,
        preloadFonts = false,
        fontConfig = { provider: 'google' },
    }: Props = $props();

    // Generate the blocking script
    const blockingScript = $derived(generateBlockingScript({
        themes,
        storageKey,
        defaultTheme,
        cssVarPrefix,
        preventTransitions,
    }));

    // Generate font preload links if enabled
    const fontLinks = $derived.by(() => {
        if (!preloadFonts) return '';

        const allFonts = new Set<string>();
        for (const theme of Object.values(themes)) {
            for (const font of extractFonts(theme)) {
                allFonts.add(font);
            }
        }
        return generateFontPreloadLinks([...allFonts], fontConfig);
    });

</script>

<svelte:head>
    {#if preloadFonts && fontLinks}
        <!-- eslint-disable-next-line svelte/no-at-html-tags -->
        {@html fontLinks}
    {/if}
    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
    {@html `<script>${blockingScript}</script>`}
    {#if preventTransitions}
        <!-- eslint-disable-next-line svelte/no-at-html-tags -->
        {@html '<style>.no-transitions,.no-transitions *,.no-transitions *::before,.no-transitions *::after{transition:none!important;animation:none!important}</style>'}
    {/if}
</svelte:head>
