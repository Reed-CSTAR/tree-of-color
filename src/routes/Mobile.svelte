<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import mobile from 'is-mobile';
	import { onMount } from 'svelte';

	interface Props {
		isMobile: boolean;
	}

	let { isMobile = $bindable() }: Props = $props();

	onMount(() => {
		if (mobile()) {
			isMobile = true;
		}
	});

	$effect(() => {
		if (!document.body) return;

		if (isMobile) {
			document.documentElement.classList.add('isMobile');
			document.body.classList.add('isMobile');
		} else {
			document.documentElement.classList.remove('isMobile');
			document.body.classList.remove('isMobile');
		}
	});
</script>

{#if isMobile}
	<div class="block">
		<h1>Mobile Warning!</h1>
		<p>This site does not work well on mobile devices.</p>
		<p>Please use a bigger device if you can.</p>
		<p>The layout may not work as intended if you continue.</p>

		<Button color={[50, 50, 50]} onclick={() => (isMobile = false)}>Continue</Button>
	</div>
{/if}

<style lang="scss">
	:global(html.isMobile) {
		overflow-y: hidden;
		overflow-x: hidden;
	}

	.block {
		position: fixed;
		top: 0;
		left: 0;
		z-index: 10000;
		width: 100%;
		height: 100%;
		color: white;
		background-color: black;
		text-align: center;

		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
	}
</style>
