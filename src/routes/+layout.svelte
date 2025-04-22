<script lang="ts">
	import '@fontsource/fira-sans/200.css';
	import '@fontsource/fira-sans/300.css';
	import '@fontsource/fira-sans/400.css';
	import '@fontsource/fira-code';
	import './app.css';

	import { Toaster } from 'svelte-french-toast';
	import Mobile from './Mobile.svelte';

	interface Props {
		children: import('svelte').Snippet;
	}

	const { children }: Props = $props();

	let isMobile = $state(false);
</script>

<Mobile bind:isMobile />

<Toaster />

{#if !isMobile}
	{@render children?.()}
{/if}
