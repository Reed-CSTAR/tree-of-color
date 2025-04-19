<script lang="ts">
	import "@vscode-elements/elements/dist/vscode-single-select/index.js";
	import type { VscodeSingleSelect } from "@vscode-elements/elements/dist/vscode-single-select/index";
	import { onMount } from "svelte";

    interface Option {
        name: string;
        description: string
    }

    let select = $state<VscodeSingleSelect>();

    interface Props {
        options: Option[];
        value: string;
        onchange?: (newValue: string) => void
    }

    let { options, value = $bindable(), onchange }: Props = $props();
    
    onMount(() => {
        select?.addEventListener('change', () => {
            value = select!.value;
            onchange?.(value)
        })
    })
</script>

<div class="select">
    <vscode-single-select bind:this={select}>
        {#each options as { name, description }}
            <vscode-option
                {description}
            >{name}</vscode-option>
        {/each}
    </vscode-single-select>
</div>

<style>
    .select {
        height: 100%;
        display: flex;
        align-items: center;
    }
</style>
