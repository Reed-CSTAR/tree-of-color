<script lang="ts">
	import { onMount } from "svelte";
    import { loadPyodide, type PyodideInterface } from 'pyodide';
    import Monaco from 'svelte-monaco/Monaco.svelte'

    let pyodide: PyodideInterface;

    let value = $state<string>("")

    onMount(async () => {
        pyodide = await loadPyodide({
            indexURL: "./artifacts/pyodide"
        })
    })
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
        width: 100%;
        height: 90vh;
    }

    header {
        height: 5vh;
    }

    footer {
        height: 5vh;
    }
</style>