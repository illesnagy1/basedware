<script lang="ts">
	import { onMount } from 'svelte'


	let dark = $state()

	let hidden = $state(true)

	onMount(() => {
		dark = document.documentElement.classList.contains('dark')

		hidden = false

		const matcher = window.matchMedia('(prefers-color-scheme: dark)')
		matcher.addEventListener('change', handleChange)
		return () => matcher.removeEventListener('change', handleChange)
	})

	function handleChange({ matches: dark }: MediaQueryListEvent) {
		if (!localStorage.theme) {
			setMode(dark)
		}
	}

	function toggle() {
		setMode(!dark)
	}

	function setMode(value: boolean) {
		dark = value

		if (dark) {
			document.documentElement.classList.add('dark')
		} else {
			document.documentElement.classList.remove('dark')
		}

		localStorage.theme = dark ? 'dark' : 'light'

		if (window.matchMedia(`(prefers-color-scheme: ${localStorage.theme})`).matches) {
			localStorage.removeItem('theme')
		}
	}
</script>
<svelte:head>
	<script>
		if (localStorage.theme === 'dark' || (!localStorage.theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
			document.documentElement.classList.add('dark')
		} else {
			document.documentElement.classList.remove('dark')
		}
	</script>
</svelte:head>

<button
	class="btn-sm w-6 h-6 p-0 m-4 hover:bg-yellow"
	class:hidden
	onclick={toggle}
>
</button>
