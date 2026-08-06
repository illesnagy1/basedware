<script lang="ts">
    import type { Snippet } from 'svelte';

    let {
        href,
        size = 'default',
        class: className = '',
        children,
        ...rest
    }: {
        href?: string;
        size?: 'default' | 'sm';
        class?: string;
        children: Snippet;
        [key: string]: unknown;
    } = $props();

    const base = $derived(size === 'sm' ? 'btn-sm' : 'btn');
</script>

{#if href}
    <a {href} class="{base} {className}" {...rest}>{@render children()}</a>
{:else}
    <button type="button" class="{base} {className}" {...rest}>{@render children()}</button>
{/if}
