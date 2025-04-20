# [tree-of-color](https://reed-cstar.github.io/tree-of-color/)

CSTAR's RF2025 display.

## for the curious

The web demo runs [Pyodide](https://pyodide.org/en/stable/), a port of [cpython](https://github.com/python/cpython) to [WebAssembly](https://webassembly.org/) using [Emscripten](https://emscripten.org/) on a [web worker](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API) (to avoid python execution from blocking the main thread) and communicates using
[stdin](https://en.wikipedia.org/wiki/Standard_streams#Standard_input_(stdin)) and [stderr](https://en.wikipedia.org/wiki/Standard_streams#Standard_error_(stderr)) (to allow users to still used stdout for printing debug info to the console) (the format is detailed in the [tree of color's py library's specification](https://github.com/Reed-CSTAR/tree-of-color/tree/main/py#readme)) over web worker messaging.

We refer to the web worker running Pyodide as the "daemon" (which is why it is described this way whenever you press "Kill"). The "Stop" command does not kill the web worker: rather, because of [a Pyodide limitation](https://github.com/pyodide/pyodide/discussions/4670) (and to avoid building our own version of Pyodide that supports asynchronous promises in its standard streams), the python script listens to a special keyword where it will terminate the program if it gets it. Sometimes, (e.g. through an infinite loop), the Python program does not hear this message and therefore needs to be fully restarted from the web worker level. 

This website was made with [SvelteKit](https://svelte.dev/), with the terminal emulator being powered by [xterm.js](https://xtermjs.org/), the (incredibly out of style) toasts by [svelte-french-toast](https://svelte-french-toast.com/), and other libraries described in [`package.json`](https://github.com/Reed-CSTAR/tree-of-color/blob/main/package.json).

## using other languages

As long as your program conforms to the specification listed: https://github.com/Reed-CSTAR/tree-of-color/tree/main/py#readme, and it isn't difficult to run (if you are using some non-standard language like `TASM`, please give us some reasonably reproducible environment! these scripts will be running on a feeble Raspberry PI), we may be able to support it - but please don't wait until the tree of color is about to be deployed!
