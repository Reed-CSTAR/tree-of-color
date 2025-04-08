<script lang="ts">
	import { onMount } from "svelte";
    import '@xterm/xterm/css/xterm.css'
    import type { Terminal } from "@xterm/xterm";
	import type { FitAddon } from "@xterm/addon-fit";

    interface Props {
        output: string;
    }

    let { output }: Props = $props()

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
        fitAddon.fit()
    });

    $effect(() => {
        if (term) {
            // todo: i hope the todo here is obvious. wow this is bad
            term.clear();
            term.write(output)
        }
    })
</script>

<svelte:window onresize={() => fitAddon?.fit()}></svelte:window>

<div class="terminal" bind:this={terminalDiv}></div>

<style>
    .terminal {
        width: 100%;
        height: 100%;
        background-color: black;
    }
</style>
