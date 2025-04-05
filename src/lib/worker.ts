import { loadPyodide, type PyodideInterface } from 'pyodide';
import treeofcolorpy from '../../py/treeofcolor.py?raw';

let gid: number;
let gbuffer: SharedArrayBuffer;

class StdinFrameHandler {
	constructor() {}

	stdin() {
		Atomics.wait(new Int32Array(gbuffer), 0, 0);
		return 'frame\n';
	}
}

async function load(): Promise<PyodideInterface> {
	const pyodide = await loadPyodide({
		indexURL: '/artifacts/pyodide'
	});

	pyodide.setStdin(new StdinFrameHandler());
	pyodide.setStdout({
		raw(code) {
			self.postMessage({ output: code, id: gid });
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

self.onmessage = async (event) => {
	const pyodide = await pyodideLoader;
	const { id, python, buffer }: Message = event.data;
	self.postMessage({ loaded: true, data: event.data });

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
};
