import { loadPyodide, type PyodideInterface } from 'pyodide';
import treeofcolorpy from '../../py/treeofcolor.py?raw';

let gid: number;
let gbuffer: SharedArrayBuffer;
let interrupt = new SharedArrayBuffer(1)

let running = false;

/** From pyodide */
type InFuncType = () => null | undefined | string | ArrayBuffer | Uint8Array | number;
const stdin: InFuncType = () => {
    // we add a timeout and use `wait` to allow processing of other tasks
    // (e.g. worker messages) in the event loop
    if (Atomics.wait(new Int32Array(gbuffer), 0, 0, 50) === 'timed-out') {
        if ((new Uint8Array(interrupt))[0] != 0) {
            throw "interrupted"
        }
        return 'wait\n';
    }

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
	pyodide.setStdout({
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

	pyodide.setStderr({
		raw(code) {
			self.postMessage({ output: code, id: gid });
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
		running = true;
		const result = await pyodide.runPythonAsync(python);
		running = false;
		self.postMessage({ output: result, id: gid, final: true });
	} catch (error) {
		if (typeof error === 'object' && error !== null && 'message' in error) {
			self.postMessage({ error: error.message, id, fatal: true });
		}
		running = false;
	}
});
