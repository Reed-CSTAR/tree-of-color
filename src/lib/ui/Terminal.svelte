<script lang="ts">
	import { onMount } from 'svelte';
	import '@xterm/xterm/css/xterm.css';
	import type { Terminal } from '@xterm/xterm';
	import type { FitAddon } from '@xterm/addon-fit';
	import PaneHeader from './PaneHeader.svelte';

	interface Props {
		output: string;
	}

	let { output = $bindable() }: Props = $props();

	let terminalDiv = $state<HTMLDivElement>();
	let term = $state<Terminal>();
	let fitAddon = $state<FitAddon>();

	onMount(async () => {
		if (!terminalDiv) return;
		const { Terminal } = await import('@xterm/xterm');
		const { FitAddon } = await import('@xterm/addon-fit');
		term = new Terminal({ convertEol: true });
		fitAddon = new FitAddon();
		term.open(terminalDiv);
		term.loadAddon(fitAddon);
		term.write(output);
		fitAddon.fit();
	});

	$effect(() => {
		if (term) {
			// todo: i hope the todo here is obvious. wow this is bad
			term.clear();
			term.write(output);
		}
	});
</script>

<svelte:window onresize={() => fitAddon?.fit()} />

<div class="terminalPane">
	<PaneHeader onclear={() => output = ""}>Terminal</PaneHeader>
	<div class="terminalWrap">
		<div class="terminal" bind:this={terminalDiv}></div>
	</div>
</div>

<style>
	.terminal {
		width: 100%;
		background-color: black;
	}

	.terminalWrap {
		overflow-y: scroll;
		background-color: black;
		height: 100%;
		display: flex;
		flex: 1;
		min-height: 0;
	}

	.terminalPane {
		display: flex;
		height: 100%;
		flex-direction: column;
		flex: 1;
		min-height: 0;
	}
</style>
