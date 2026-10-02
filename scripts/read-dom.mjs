import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const directory = path.join(root, '.next', 'dev-dom');
const args = process.argv.slice(2);
const filter = args.find(arg => arg !== '--html');
try {
  const files = await readdir(directory);
  const snapshots = await Promise.all(files.filter(file => file.endsWith('.json'))
    .map(async file => {
      try { return JSON.parse(await readFile(path.join(directory, file), 'utf8')); }
      catch { return null; }
    }));
  const latest = snapshots.filter(item => item && (!filter || item.path === filter))
    .sort((a, b) => b.receivedAt.localeCompare(a.receivedAt))[0];
  if (!latest) throw new Error('No captured DOM. Open the local page in a visible tab.');
  const { html, ...metadata } = latest;
  console.log(JSON.stringify(metadata, null, 2));
  console.log(args.includes('--html') ? html : html
    .replace(/<svg\b[\s\S]*?<\/svg>/gi, '')
    .replace(/<style\b[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
