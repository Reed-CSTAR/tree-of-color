import { createWriteStream } from 'node:fs';
import fs from 'node:fs/promises'
import path from 'node:path';
import { Readable } from 'node:stream';
import { finished } from 'node:stream/promises';

const artifactsDir = path.resolve("./static", "./artifacts")

await fs.mkdir(artifactsDir, { recursive: true });
const destination = path.resolve(artifactsDir, "tmp.tar.bz2")

// TODO: dynamic version extraction of pyoxide from package.json
console.log(`Downloading artifact on 0.27.5 to ${destination}`)
const url = "https://github.com/pyodide/pyodide/releases/download/0.27.5/pyodide-core-0.27.5.tar.bz2"

// https://stackoverflow.com/a/51302466/7589775
const fileStream = createWriteStream(destination, { flags: 'w' })

const response = await fetch(url);

await finished(Readable.fromWeb(response.body as any).pipe(fileStream))


