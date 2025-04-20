<script lang="ts">
	// some generic py editor. with an optional vim mode. and linting
	import Monaco from 'svelte-monaco/Monaco.svelte';
	import type MonacoE from 'monaco-editor';
	import { onMount } from 'svelte';
	import type { Workspace, Diagnostic } from '@astral-sh/ruff-wasm-bundler';

	interface Props {
		value: string;
		vimMode: boolean;
	}

	let { value = $bindable(), vimMode }: Props = $props();

	let monaco = $state<typeof MonacoE>();
	let editor = $state<MonacoE.editor.IStandaloneCodeEditor>();

	let initVimMode: any;
	let vimInstance: any;
	let workspace = $state<Workspace>();
	let diagonistics = $state<Diagnostic[]>([]);

	onMount(async () => {
		const [mvImport, { Workspace: WorkspaceInstance }] = await Promise.all([
			import('monaco-vim'),
			import('@astral-sh/ruff-wasm-bundler')
		]);

		initVimMode = mvImport.initVimMode;

		workspace = new WorkspaceInstance({
			lint: {}
		});
	});

	$effect(() => {
		if (editor) {
			if (vimMode) {
				vimInstance = initVimMode(editor, document.getElementById('statusBar'));
			} else {
				vimInstance?.dispose();
			}
		}

		if (workspace) {
			diagonistics = workspace.check(value);
		}
	});

	$effect(() => {
		const model = editor?.getModel();
		console.log(diagonistics);
		if (monaco && model) {
			monaco.editor.setModelMarkers(
				model,
				'owner',
				diagonistics.map((diagnostic) => ({
					severity: 4, // see MarkerSeverity
					message: diagnostic.message,
					startLineNumber: diagnostic.start_location.row,
					startColumn: diagnostic.start_location.column,
					endLineNumber: diagnostic.end_location.row,
					endColumn: diagnostic.end_location.column
				}))
			);
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
		bind:monaco
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
