<script lang="ts">
  import { onMount, type Snippet } from 'svelte';
  import { fly, slide } from 'svelte/transition';

  let {
    class: className = '',
    children,
    icon,
    duration = 5000,
  }: {
    class?: string;
    children: Snippet;
    icon?: string;
    duration?: number;
  } = $props();

  let displayed = $state(false);

  onMount(() => {
    displayed = true;
    const timer = setTimeout(() => {
      displayed = false;
    }, duration);

    return () => clearTimeout(timer);
  });
</script>

{#if displayed}
  <div class="nb-toast {className}" transition:slide>
    {#if icon}
      <span class="nb-toast-icon" aria-hidden="true">{icon}</span>
    {/if}
    <span>{@render children()}</span>
    <button onclick={() => (displayed = false)} class="nb-toast-dismiss" type="button" aria-label="Dismiss">×</button>
  </div>
{/if}
