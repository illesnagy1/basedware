<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
    import '@fontsource/syne/800.css';
    import '@fontsource/space-grotesk/700.css';
	import '@fontsource/inter/500.css'
	import Theme from '$lib/Theme.svelte';
	import Progress from '$lib/Progress.svelte';
  	import "../app.css";
	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<nav class="flex flex-row justify-between items-center gap-4 dark:bg-black dark:text-white bg-bg py-1 px-5 border-b-5 border-black dark:border-white sticky top-0 z-50">
	<Theme />
	<h1>ALTERCOM<span class="text-red-500">.</span></h1>
</nav>

<Progress />
{@render children()}
