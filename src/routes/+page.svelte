<script lang="ts">
	import { onMount } from "svelte";
    import { loadPyodide, type PyodideInterface } from 'pyodide';
    import Monaco from 'svelte-monaco/Monaco.svelte'

    let pyodide: PyodideInterface;

    let value = $state<string>("");

    function stdin(): string {
        return ""
    }

    function stdout(msg: string) {
        console.log(msg)
    }
    
    function stderr(msg: string) {
        console.error(msg)
    }

    onMount(async () => {
        pyodide = await loadPyodide({
            indexURL: "./artifacts/pyodide",
            stdin,
            stdout,
            stderr
        })
    })

    async function run() {
        console.log(await pyodide.runPythonAsync(value))
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