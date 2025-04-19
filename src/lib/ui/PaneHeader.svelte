<script lang="ts">
	import type { Snippet } from 'svelte';
	import Button from '$lib/components/Button.svelte';

	interface Props {
		children: Snippet;
		onclear: () => void;
	}

	let { children, onclear }: Props = $props();
</script>

<div class="header">
	<h3>
		{@render children?.()}
	</h3>
	<Button color={[44, 50, 54]} onclick={onclear}>Clear</Button>
</div>

<style lang="scss">
	.header {
		display: flex;
		width: 100%;
		background-color: #1e1e1e;
		padding: 0.25rem 1rem;
		justify-content: space-between;

		h3 {
			color: white;
			margin: none;
		}
	}
</style>
