<script lang="ts">
	import PyodideWorker from '../lib/worker?worker';
	import Lights from '$lib/Lights.svelte';
	import { onMount } from 'svelte';
	import Icon from '@iconify/svelte';
	import tree from '@iconify-icons/iconoir/tree';
	import share from '@iconify-icons/iconoir/share-android';
	import github from '@iconify-icons/iconoir/github';
	import vim from '@iconify-icons/vscode-icons/file-type-vim';
	import { examples } from '$lib/examples';
	import lz from 'lz-string';
    import toast from 'svelte-french-toast';
	import Editor from '$lib/Editor.svelte';
	import Select from '$lib/Select.svelte';
	import Terminal from '$lib/Terminal.svelte';

	const { decompressFromBase64, compressToBase64 } = lz;

	/** The current script */
	let value = $state<string>(
		`# There are more examples at the top right dropdown! This one
# is intended to only display solid green.\n` + examples[0][1]
	);
	let hasCheckedHash = $state(false);

	let example = $state<string>(examples[0][0]);

	let status = $state<'stopped' | 'starting' | 'started' | 'fatal'>('stopped');

	/** Pyodide worker */
	let worker: Worker | undefined;
	/** The global id of our current pyodide worker as a sanity check */
	let id = $state<number>(0);
	/** Synchronises frames between us and the web worker. */
	let buffer: SharedArrayBuffer;
    let interruptBuffer: SharedArrayBuffer;
	/** RAF id */
	let raf: number;

	let lights = $state<Uint8Array>();

	let lastFrameTime: number;

	let vimMode = $state(false);
	let terminalMode = $state(false);
	let consoleOutput = $state("")

	onMount(async () => {
		if (window.location.hash.substring(1)) {
			value = decompressFromBase64(window.location.hash.substring(1));
		}
		hasCheckedHash = true;
	});

	$effect.pre(() => {
		if (hasCheckedHash) window.location.hash = compressToBase64(value);
	});

	/** Notifies the worker to stop waiting for a frame signal */
	function requestWorkerFrame() {
		Atomics.notify(new Int32Array(buffer), 0);
	}

	async function run(refreshWorker = false) {
		status = 'starting';

		if (refreshWorker || !worker) {
			worker?.terminate();
			worker = new PyodideWorker();
		}

		buffer = new SharedArrayBuffer(4);

		worker.postMessage({
			id: id++,
			python: value,
			buffer
		});

		worker.onmessage = ({ data }) => {
			console.log(data);
			if (typeof data === 'object' && data !== null) {
				if ('loaded' in data && data['loaded'] && data["interrupt"]) {
					status = 'started';
                    interruptBuffer = data["interrupt"]
				}

				if ('error' in data) {
					consoleOutput += data.error;
					if ('fatal' in data) {
						status = 'fatal';
					}
				}

				if ('output' in data && data['output'] instanceof Uint8Array) {
					lights = data['output'];
				}
			}
		};

        worker.onerror = (ev) => console.error(ev)
        worker.onmessageerror = (ev) => console.error(ev)

		lastFrameTime = Date.now();
		frame();
	}

	function stop(hard = false) {
		if (hard) {
			worker?.terminate();
			worker = undefined;
		} else {
            (new Uint8Array(interruptBuffer))[0] = 2;
		}
		cancelAnimationFrame(raf);
		status = 'stopped';
	}

	function frame() {
		if (Date.now() - lastFrameTime > 1000) {
			requestWorkerFrame();
			lastFrameTime = Date.now();
		}

		raf = requestAnimationFrame(frame);
	}
</script>

<div class="container">
	<header>
		<div class="left">
			<div class="logoContainer">
                <div class="logo">
                    <Icon icon={tree} color="white" width="100%" height="100%" />
                </div>
            </div>
			<h1>Tree of Color</h1>
		</div>
		<div class="right">
			<Select
				bind:value={example}
				onchange={() => (value = example)}
				options={examples}
			/>
			<div class="iconAlign icon">
				<button class="smallIcon" title="Share" onclick={() => {
                    navigator.clipboard.writeText(location.href);
                    toast.success("Copied share link to clipboard!")
                }}>
					<Icon icon={share} color="white" width="100%" height="100%" />
				</button>
			</div>
			<div class="iconAlign icon">
				<button class="smallIcon" onclick={() => (vimMode = !vimMode)} title="Vim Mode">
					<Icon icon={vim} color="white" width="100%" height="100%" />
				</button>
			</div>
			<div class="iconAlign icon">
				<a class="smallIcon" href="https://github.com/Reed-CSTAR/tree-of-color" target="_blank">
					<Icon icon={github} color="white" width="100%" height="100%" />
				</a>
			</div>
		</div>
	</header>
	<main>
		<div class="editor">
			<Editor {vimMode} bind:value />
		</div>
		<div class="vis">
			{#if terminalMode}
				<Terminal output={consoleOutput} />
			{:else}
            	<Lights {lights} />
			{/if}
			<div class="toolbar">
				<div class="buttons">
					<button
						disabled={status === 'started' || status === 'starting'}
						id="run"
						onclick={() => run(false)}
					>
						Run
					</button>
					<button
						disabled={status === 'stopped' || status === 'fatal'}
						id="stop"
						onclick={() => stop(false)}>Stop</button
					>
					<button id="console" onclick={() => terminalMode = !terminalMode}>Console</button>
					<button
                        id="clear"
                        onclick={() => (lights = undefined)}
                        disabled={lights == undefined}
                        title="Clears off the current LED lights"
                    >Clear</button>
					<button
						id="kill"
                        title="Restarts the Python Service Worker"
                        disabled={worker == undefined}
						onclick={() => {
							lights = undefined;
							stop(true);
						}}>Kill</button
					>
					<button
                        disabled={status === 'stopped' || status === 'fatal'}
						id="animate"
						onclick={() => {
							requestWorkerFrame();
						}}>Animate</button
					>
				</div>
				<div class="status">
                    {#if status === 'fatal'}
                        <!-- we give a nicer name to fatal errors to discourage killing -->
					    halted
                    {:else}
                        {status}
                    {/if}
				</div>
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
		width: 100vw;
		height: 100%;
		display: flex;
		flex-direction: row;
	}

	.vis {
		width: 100%;
		display: flex;
		flex-direction: column;
		justify-content: space-between;

		.toolbar {
			width: 100%;
			display: flex;
			padding: 0.5rem;
			gap: 0.5rem;
			justify-content: space-between;
			align-items: center;
			background-color: #1e1e1e;
			border-left: 1px solid #252525;

			.status {
				color: white;
				margin-right: 0.5rem;
				font-size: 1.5rem;
			}

			.buttons button {
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
					opacity: 0.5;
				}

				&#run {
					background-color: rgba(234, 255, 150, 0.2);
					border-bottom: 2px solid rgb(234, 255, 150);
				}

				&#stop {
					background-color: rgba(212, 66, 64, 0.2);
					border-bottom: 2px solid rgb(212, 66, 64);
				}

				&#console {
					background-color: rgba(0, 122, 204, 0.2);
					border-bottom: 2px solid rgb(0, 122, 204);
				}

				&#clear {
					background-color: rgba(44, 50, 54, 0.2);
					border-bottom: 2px solid rgb(44, 50, 54);
				}

                &#kill {
					background-color: rgba(59, 0, 0, 0.2);
					border-bottom: 2px solid rgb(59, 0, 0);
				}

                &#animate {
					background-color: rgba(134, 0, 175, 0.2);
					border-bottom: 2px solid rgb(134, 0, 175);
				}

				&:hover {
					filter: brightness(120%);
				}
			}
		}
	}

	header {
		background-color: #1e1e1e;
		border-bottom: 1px solid #252525;
		padding: 0.75rem 0.5rem;
		display: flex;
		justify-content: space-between;

		.left {
			display: flex;
			align-items: center;
		}

        .logo {
            height: calc(68px - 1rem);
            display: flex;
            align-items: center;
            justify-content: center;

            .logo {
                width: calc(68px - 4px - 1rem);
                height: calc(68px - 4px - 1rem);
            }
        }

        h1 {
            margin: 0;
            color: #d4d4d4;
            font-weight: 400;
            margin-left: calc(0.5rem + 4px);
        }
	}

	.editor {
		width: 100%;
		padding-top: 1rem;
		background-color: #1e1e1e;
		height: calc(100vh - (68px - 1rem) - 2 * 0.75rem - 1px);
	}

	.smallIcon {
		width: calc(4 * (68px - 1rem) / 5);
		height: calc(4 * (68px - 1rem) / 5);
		background-color: rgba(0, 0, 0, 0);
		border: none;
		padding: 0;
		display: inline-block;
		cursor: pointer;
	}

	.iconAlign {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.right {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.25rem;
	}
</style>
