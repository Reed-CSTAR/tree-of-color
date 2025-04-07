<script lang="ts">
	import Monaco from 'svelte-monaco/Monaco.svelte';
	import type MonacoE from 'monaco-editor';
	import { onMount } from 'svelte';

    interface Props {
        value: string;
        vimMode: boolean;
    }

    let { value = $bindable(), vimMode }: Props = $props()

	let editor = $state<MonacoE.editor.IStandaloneCodeEditor>();

    let initVimMode: any;
	let vimInstance: any;

	onMount(async () => {
		const mvImport = await import('monaco-vim');
		initVimMode = mvImport.initVimMode;
    })

    $effect(() => {
		if (editor) {
			if (vimMode) {
				vimInstance = initVimMode(editor, document.getElementById('statusBar'));
			} else {
				vimInstance?.dispose();
			}
		}
	});
</script>

<div class="editor">
    <Monaco
        options={{ language: 'python', automaticLayout: true }}
        theme="vs-dark"
        on:ready={async ({ detail }) => {
            editor = detail;
        }}
        bind:value
    />
    <div id="statusBar" class:vimMode></div>
</div>

<style lang="scss">
    .editor {
        width: 100%;
        height: 100%;
    }

    .editor:has(> .vimMode) {
		height: calc(100% - 1.5rem);
	}

	.vimMode {
		background-color: #1e1e1e;
		color: #d4d4d4;
		width: 100%;
		height: 1.5rem;
		display: flex;
		align-items: center;
	}
</style>
