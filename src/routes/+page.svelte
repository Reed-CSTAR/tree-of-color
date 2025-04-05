<script lang="ts">
    import Monaco from 'svelte-monaco/Monaco.svelte'
    import examplepy from '../../py/example.py?raw'
    import PyodideWorker from '../lib/worker?worker'

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

    async function run() {
        worker?.terminate();
        worker = new PyodideWorker();
        buffer = new SharedArrayBuffer(4);

        worker.postMessage({
            id: id++,
            python: value,
            buffer
        });

        worker.onmessage = (ev) => console.log(ev.data)

        frame()
    }

    function stop() {
        worker?.terminate();
        cancelAnimationFrame(raf)
    }

    function frame() {
        Atomics.notify(new Int32Array(buffer), 0)
        raf = requestAnimationFrame(frame);
    }
</script>

<div class="container">
    <header>

    </header>
    <main>
        <Monaco
            options={{ language: 'python', automaticLayout: true }}
            theme="vs-dark"
            on:ready={(event) => console.log(event.detail)}
            bind:value
        />
        <div class="vis">
            <button onclick={run}>Run</button>
            <button onclick={stop}>Stop</button>
        </div>
    </main>
    <footer>
        Source on GitHub
    </footer>
</div>

<style>
    :global(body, html) {
        width: 100vw;
        height: 100vh;
        padding: 0;
        margin: 0;
    }

    .container {
        width: 100%;
        max-height: 100vh;
        display: flex;
        flex-direction: column;
    }

    main {
        width: 80vw;
        height: 90vh;
        display: flex;
        flex-direction: row;
    }

    .vis {
        width: 20vw;
    }

    header {
        height: 5vh;
    }

    footer {
        height: 5vh;
    }
</style>