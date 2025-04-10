import { loadPyodide, type PyodideInterface } from 'pyodide';
import treeofcolorpy from '../../py/treeofcolor.py?raw';

// global identifier for the currently running process.
// it's quite useful for debugging!
let gid: number;

// the global buffer shared by the main thread,
// allowing them to send frame requests
let gbuffer: SharedArrayBuffer;

let interrupt = new SharedArrayBuffer(1)

/** From pyodide */
type InFuncType = () => null | undefined | string | ArrayBuffer | Uint8Array | number;

const stdin: InFuncType = () => {
    // we add a timeout and use `wait` to allow processing of other tasks
    // (e.g. worker messages) in the event loop
    if (Atomics.wait(new Int32Array(gbuffer), 0, 0, 50) === 'timed-out') {
        if ((new Uint8Array(interrupt))[0] != 0) {
            return 'throw\n';
        }
        return 'wait\n';
    }

	// allows us to accurately count frames on the client side (some are dropped)
	// during worker initialiaztion
	self.postMessage({ receivedFrame: true });

    return 'frame\n';
}

async function load(): Promise<PyodideInterface> {
	const pyodide = await loadPyodide({
		indexURL: '/tree-of-color/artifacts/pyodide',
	});

	let buffer = new Uint8Array(1500);
	let idx = 0;

	pyodide.setStdin({ stdin });
    pyodide.setInterruptBuffer(interrupt)
	pyodide.setStderr({
		isatty: true,
		raw(code) {
			buffer[idx] = code;
			idx++;
			if (idx == buffer.length) {
				self.postMessage({ output: buffer, id: gid });
				buffer = new Uint8Array(1500);
				idx = 0;
			}
		}
	});

	pyodide.setStdout({
		batched(code) {
			self.postMessage({ output: code, id: gid, stdout: true });
		}
	});

	pyodide.FS.writeFile('./treeofcolor.py', treeofcolorpy);

	return pyodide;
}

const pyodideLoader = load();

interface Message {
	id: number;
	python: string;
	buffer: SharedArrayBuffer;
}

self.addEventListener("message", async (event) => {
	const pyodide = await pyodideLoader;

	if (typeof event.data !== 'object' || event.data === null) {
		self.postMessage({ worker: true, message: 'malformed request' });
		return;
	}

    (new Uint8Array(interrupt))[0] = 0;

	const { id, python, buffer }: Message = event.data;
	self.postMessage({ loaded: true, data: event.data, interrupt });

	gid = id;
	gbuffer = buffer;

	try {
		const result = await pyodide.runPythonAsync(python);
		self.postMessage({ output: result, id: gid, final: true });
	} catch (error) {
		if (typeof error === 'object' && error !== null && 'message' in error) {
			self.postMessage({ error: error.message, id, fatal: true });
		}
	}
});
