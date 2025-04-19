<script lang="ts">
	import { onDestroy, onMount } from 'svelte';

	interface Props {
		delay?: number;
		active: boolean;
	}

	let { delay = 100, active }: Props = $props();

	const spinner = '⣾⣽⣻⢿⡿⣟⣯⣷'.split('');

	let rafIdx: number | undefined = undefined;
	let lastTime = new Date().getTime();

	let spinnerIdx = $state(0);

	onMount(() => {
		lastTime = new Date().getTime();
		requestAnimationFrame(animate);
	});
	onDestroy(() => {
		if (rafIdx !== undefined) cancelAnimationFrame(rafIdx);
	});

	function animate() {
		if (new Date().getTime() - lastTime > delay) {
			lastTime = new Date().getTime();
			spinnerIdx = (spinnerIdx + 1) % spinner.length;
		}
		requestAnimationFrame(animate);
	}
</script>

<span class:active>
	{#if active}
		{spinner[spinnerIdx]}
	{:else}
		⣿
	{/if}
</span>

<style>
	span:not(.active) {
		color: gray;
	}
</style>
