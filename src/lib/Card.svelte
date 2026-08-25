<script lang="ts">
  import type { Snippet } from 'svelte';

  interface CardProps {
    class?: string;
    children: Snippet;
  }

  const { class: className = '', children }: CardProps = $props();
</script>

<div class="card {className}">
  {@render children()}
</div>
