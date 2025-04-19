<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		title?: string;
		disabled?: boolean;
		onclick: () => void;
		children: Snippet;
		color: [r: number, g: number, b: number];
	}

	let { title, disabled, onclick, children, color }: Props = $props();

	let r = $derived(color[0]);
	let g = $derived(color[1]);
	let b = $derived(color[2]);
</script>

<button
	{onclick}
	{disabled}
	{title}
	style:background-color="rgba({r}, {g}, {b}, 0.2)"
	style:border-bottom="2px solid rgb({r}, {g}, {b})">{@render children?.()}</button
>

<style lang="scss">
	button {
		padding: 0.5rem 1rem;
		border-radius: 0.2rem;
		font-size: 1.5rem;
		font-weight: 300;
		cursor: pointer;
		border: none;
		background: none;
		color: white;

		&:disabled {
			cursor: not-allowed;
			opacity: 0.2;
			background-color: rgba(50, 50, 50, 0.2) !important;
			border-bottom: 2px solid rgb(50, 50, 50) !important;
		}

		&:hover:not(:disabled) {
			filter: brightness(120%);
		}
	}
</style>
