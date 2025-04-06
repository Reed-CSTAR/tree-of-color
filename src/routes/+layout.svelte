<script lang="ts">
	import '@fontsource/fira-sans/200.css';
	import '@fontsource/fira-sans/300.css';
	import '@fontsource/fira-sans/400.css';
	import './app.css';

	import { Toaster } from 'svelte-french-toast';

	interface Props {
		children: import('svelte').Snippet;
	}

	const { children } = $props();
</script>

<Toaster />

{@render children?.()}
