<script lang="ts">
	import Monaco from 'svelte-monaco/Monaco.svelte';
	import type MonacoE from 'monaco-editor';
	import examplepy from '../../py/example.py?raw';
	import PyodideWorker from '../lib/worker?worker';
	import Lights from '$lib/Lights.svelte';
	import { onMount } from 'svelte';
	import Icon from '@iconify/svelte';
	import tree from '@iconify-icons/iconoir/tree';
	import share from '@iconify-icons/iconoir/share-android';
	import vim from '@iconify-icons/vscode-icons/file-type-vim';

	/** The current script */
	let value = $state<string>(examplepy);
	/** Pyodide worker */
	let worker: Worker | undefined;
	/** The global id of our current pyodide worker as a sanity check */
	let id = $state<number>(0);
	/** Synchronises frames between us and the web worker. */
	let buffer: SharedArrayBuffer;
	/** RAF id */
	let raf: number;

	let lights = $state<Uint8Array>();

    let lastFrameTime: number;

	let editor = $state<MonacoE.editor.IStandaloneCodeEditor>()
	let vimMode = $state(false)

	let initVimMode: any;
	let vimInstance: any;

	onMount(async () => {
		const mvImport = await import('monaco-vim');
		initVimMode = mvImport.initVimMode;

		value = window.localStorage.getItem("toc:content") ?? ""
	});

	$effect(() => window.localStorage.setItem("toc:content", value))

	async function run() {
		worker?.terminate();
		worker = new PyodideWorker();
		buffer = new SharedArrayBuffer(4);

		worker.postMessage({
			id: id++,
			python: value,
			buffer
		});

		worker.onmessage = ({ data }) => {
			console.log(data);
			if (typeof data === 'object' && data !== null) {
				if ("output" in data && data["output"] instanceof Uint8Array) {
					lights = data["output"];
				}
			}
		}

        lastFrameTime = Date.now();
		frame();
	}

	function stop() {
		worker?.terminate();
		cancelAnimationFrame(raf);
	}

	$effect(() => {
		console.log(editor)
		if (editor) {
			if (vimMode) {
				vimInstance = initVimMode(editor, document.getElementById('statusBar'))
			} else {
				vimInstance?.dispose();
			}
		}
	})

	function frame() {
        if (Date.now() - lastFrameTime > 1000) {
            Atomics.notify(new Int32Array(buffer), 0);
            lastFrameTime = Date.now();
        }
        
        raf = requestAnimationFrame(frame);
	}
</script>

<div class="container">
	<header>
		<div class="left">
			<div class="icon">
				<Icon icon={tree} color="white" width="100%" height="100%" />
			</div>
			<h1>Tree of Color</h1>
		</div>
		<div class="right">
			<div class="iconAlign icon">
				<button class="smallIcon">
					<Icon icon={share} color="white" width="100%" height="100%" />
				</button>
			</div>
			<div class="iconAlign icon">
				<button class="smallIcon" onclick={() => vimMode = !vimMode}>
					<Icon icon={vim} color="white" width="100%" height="100%" />
				</button>
			</div>
		</div>
	</header>
	<main>
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
		<div class="vis">
			<button onclick={run}>Run</button>
			<button onclick={stop}>Stop</button>
			<div class="lights">
				<Lights {lights} />
			</div>
		</div>
	</main>
</div>

<style lang="scss">
	:global(body, html) {
		width: 100vw;
		height: 100vh;
		padding: 0;
		margin: 0;
	}

	.container {
		width: 100%;
		height: 100vh;
		display: flex;
		flex-direction: column;
	}

	main {
		width: 80vw;
		height: 100%;
		display: flex;
		flex-direction: row;
	}

	.vis {
		width: 20vw;
	}

	header {
		background-color: #1e1e1e;
		opacity: 0.9;
		padding: 0.75rem 0.5rem;
		display: flex;
		justify-content: space-between;


		.left {
			display: flex;
			align-items: center;
		}
	}

	h1 {
		margin: 0;
		color: #d4d4d4;
		font-weight: 800;
		margin-left: 0.5rem;
	}

	.editor {
		width: 100%;
		padding-top: 1rem;
		background-color: #1e1e1e;
		height: calc(100vh - (68px - 1rem) - 2 * 0.75rem - 1rem);
	}

	.editor:has(> .vimMode) {
		height: calc(100vh - (68px - 1rem) - 2 * 0.75rem - 1rem - 1rem);
	}

	.vimMode {
		background-color: #1e1e1e;
		color: #d4d4d4;
		width: 100%;
	}

	.icon {
		width: calc(68px - 1rem);
		height: calc(68px - 1rem);
	}

	button.smallIcon {
		width: calc(2 * (68px - 1rem) / 3);
		height: calc(2 * (68px - 1rem) / 3);
		background-color: rgba(0, 0, 0, 0);
		border: none;
		padding: 0;
		cursor: pointer;
	}

	.iconAlign {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.right {
		display: flex;
		gap: 0.25rem;
	}
</style>
