<script lang="ts">
  import { onMount } from 'svelte';

  const media = () => window.matchMedia('(prefers-color-scheme: dark)');

  let dark = $state(false);

  function apply(value: boolean) {
    dark = value;
    document.documentElement.classList.toggle('dark', value);
  }

  function setMode(value: boolean) {
    apply(value);

    if (media().matches === value) {
      localStorage.removeItem('theme');
    } else {
      localStorage.setItem('theme', value ? 'dark' : 'light');
    }
  }

  onMount(() => {
    dark = document.documentElement.classList.contains('dark');

    const matcher = media();
    const handleChange = ({ matches }: MediaQueryListEvent) => {
      if (!localStorage.getItem('theme')) apply(matches);
    };

    matcher.addEventListener('change', handleChange);
    return () => matcher.removeEventListener('change', handleChange);
  });
</script>

<svelte:head>
  <script>
    const theme = localStorage.getItem('theme');
    if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  </script>
</svelte:head>

<button
  class="btn-sm hover:bg-yellow m-4 size-6 shrink-0 p-0"
  onclick={() => setMode(!dark)}
  title="Toggle theme"
></button>
