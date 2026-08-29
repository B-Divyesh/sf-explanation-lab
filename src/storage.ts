import {STEP_KEYS, type AudioNote, type Explanation, type ExportFile, type ResponsePart, type StepKey} from './types';

const DB_VERSION = 1;
const STORE = 'explanations';

function databaseName(demo: boolean): string {
  return demo ? 'demo:explanation-lab' : 'explanation-lab';
}

function openDatabase(demo: boolean): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(databaseName(demo), DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE, {keyPath: 'id'});
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('The browser could not open local storage.'));
  });
}

async function run<T>(demo: boolean, mode: IDBTransactionMode, action: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const db = await openDatabase(demo);
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE, mode);
    const request = action(transaction.objectStore(STORE));
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('The browser could not save this change.'));
    transaction.oncomplete = () => db.close();
    transaction.onerror = () => { db.close(); reject(transaction.error ?? new Error('The browser could not save this change.')); };
  });
}

export async function listExplanations(demo: boolean): Promise<Explanation[]> {
  const items = await run<Explanation[]>(demo, 'readonly', (store) => store.getAll());
  return items.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function getExplanation(demo: boolean, id: string): Promise<Explanation | undefined> {
  return run<Explanation | undefined>(demo, 'readonly', (store) => store.get(id));
}

export async function saveExplanation(demo: boolean, explanation: Explanation): Promise<void> {
  await run<IDBValidKey>(demo, 'readwrite', (store) => store.put(explanation));
}

export async function removeExplanation(demo: boolean, id: string): Promise<void> {
  await run<undefined>(demo, 'readwrite', (store) => store.delete(id));
}

export async function clearExplanations(demo: boolean): Promise<void> {
  await run<undefined>(demo, 'readwrite', (store) => store.clear());
}

function daysAgo(days: number): string {
  return new Date(Date.now() - days * 86_400_000).toISOString();
}

function completeSample(id: string, topic: string, days: number, responses: Record<StepKey, string>): Explanation {
  const completedAt = daysAgo(days);
  return {
    id, topic, createdAt: completedAt, updatedAt: completedAt, completedAt,
    revisitAt: new Date(new Date(completedAt).getTime() + 7 * 86_400_000).toISOString(),
    status: 'complete',
    responses: Object.fromEntries(STEP_KEYS.map((key) => [key, {text: responses[key]}])) as Record<StepKey, ResponsePart>
  };
}

export async function seedDemo(force = false): Promise<void> {
  const current = await listExplanations(true);
  if (current.length && !force) return;
  if (force) await clearExplanations(true);
  const samples: Explanation[] = [
    completeSample('sample-doppler', 'Why a passing siren changes pitch', 9, {
      mechanism: 'The moving source emits each wave crest from a new position. In front, crests bunch together. Behind, they spread out. A listener receives bunched crests more often, so the pitch sounds higher.',
      boundary: 'This assumes the source moves slower than sound and the listener can detect the waves. It does not explain a sonic boom at or above the speed of sound.',
      example: 'An ambulance approaches at a steady speed. The crests in front reach a listener at shorter intervals. After it passes, the intervals grow and the pitch drops.',
      counterexample: 'If the siren is parked and only gets louder, the pitch does not change. Distance changes amplitude, but no source motion compresses the wave spacing.'
    }),
    completeSample('sample-binary-search', 'Why binary search needs sorted data', 3, {
      mechanism: 'Compare the target with the middle item. Sorting tells us which half cannot contain the target. Discard that half and repeat on the remaining interval.',
      boundary: 'The items need a stable order and a comparison rule. Random access also matters for the usual logarithmic time bound.',
      example: 'For [2, 5, 8, 12, 19] and target 12, compare with 8. Discard [2, 5, 8]. Then compare with 12 and stop.',
      counterexample: 'For [12, 2, 19, 5, 8], comparing 12 with middle value 19 would discard the right side. That removes 12 even though it is present.'
    }),
    {
      id: 'sample-closure', topic: 'How a JavaScript closure remembers state', createdAt: daysAgo(1), updatedAt: daysAgo(1), status: 'draft',
      responses: {
        mechanism: {text: 'A function keeps access to the lexical environment where it was created, even after the outer function returns.'},
        boundary: {text: 'The captured value follows the binding, not a frozen copy.'},
        example: {text: ''}, counterexample: {text: ''}
      }
    }
  ];
  await Promise.all(samples.map((item) => saveExplanation(true, item)));
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error ?? new Error('An audio note could not be exported.'));
    reader.readAsDataURL(blob);
  });
}

async function exportedPart(part: ResponsePart): Promise<{text: string; audio?: {dataUrl: string; mimeType: string; createdAt: string}}> {
  if (!part.audio) return {text: part.text};
  return {text: part.text, audio: {...part.audio, dataUrl: await blobToDataUrl(part.audio.blob)}};
}

export async function makeExport(demo: boolean): Promise<ExportFile> {
  const explanations = await listExplanations(demo);
  return {
    product: 'explanation-lab', version: 1, exportedAt: new Date().toISOString(),
    explanations: await Promise.all(explanations.map(async ({responses, ...item}) => ({
      ...item,
      responses: Object.fromEntries(await Promise.all(STEP_KEYS.map(async (key) => [key, await exportedPart(responses[key])]))) as ExportFile['explanations'][number]['responses']
    })))
  };
}

function dataUrlToAudio(dataUrl: string, mimeType: string, createdAt: string): AudioNote {
  const [, encoded = ''] = dataUrl.split(',');
  const bytes = Uint8Array.from(atob(encoded), (character) => character.charCodeAt(0));
  return {blob: new Blob([bytes], {type: mimeType}), mimeType, createdAt};
}

function validString(value: unknown): value is string {
  return typeof value === 'string';
}

export function parseImport(text: string): Explanation[] {
  let file: unknown;
  try {
    file = JSON.parse(text);
  } catch {
    throw new Error('This file is not valid JSON. Choose an Explanation Lab JSON backup and try again.');
  }
  if (!file || typeof file !== 'object' || !('product' in file) || file.product !== 'explanation-lab' || !('explanations' in file) || !Array.isArray(file.explanations)) {
    throw new Error('This is not an Explanation Lab export. Choose a JSON file exported by this app.');
  }
  if (file.explanations.length > 10_000) throw new Error('This backup contains too many explanations to import safely.');
  const ids = new Set<string>();
  return file.explanations.map((raw: unknown, index: number) => {
    if (!raw || typeof raw !== 'object' || !('id' in raw) || !validString(raw.id) || !raw.id.trim() || raw.id.length > 200 || !('topic' in raw) || !validString(raw.topic) || raw.topic.trim().length < 3 || raw.topic.length > 100 || !('responses' in raw) || !raw.responses || typeof raw.responses !== 'object') {
      throw new Error('One explanation is incomplete. Export the file again and retry.');
    }
    if (ids.has(raw.id)) throw new Error(`The backup contains the ID “${raw.id}” more than once. Remove the duplicate and retry.`);
    ids.add(raw.id);
    const source = raw as Record<string, unknown>;
    const sourceResponses = raw.responses as Record<string, unknown>;
    const responses = Object.fromEntries(STEP_KEYS.map((key) => {
      const part = sourceResponses[key];
      if (!part || typeof part !== 'object' || !('text' in part) || !validString(part.text) || part.text.length > 6000) throw new Error(`The ${key} response is missing or too long.`);
      const audioValue = 'audio' in part ? part.audio : undefined;
      let audio: AudioNote | undefined;
      if (audioValue !== undefined) {
        if (!audioValue || typeof audioValue !== 'object' || !('dataUrl' in audioValue) || !validString(audioValue.dataUrl) || !('mimeType' in audioValue) || !validString(audioValue.mimeType) || !audioValue.mimeType.startsWith('audio/') || !('createdAt' in audioValue) || !validDate(audioValue.createdAt)) {
          throw new Error(`The ${key} audio note is invalid.`);
        }
        const prefix = `data:${audioValue.mimeType};base64,`;
        if (!audioValue.dataUrl.startsWith(prefix)) throw new Error(`The ${key} audio note has an invalid format.`);
        try {
          audio = dataUrlToAudio(audioValue.dataUrl, audioValue.mimeType, audioValue.createdAt);
        } catch {
          throw new Error(`The ${key} audio note could not be read.`);
        }
      }
      return [key, {text: part.text, ...(audio ? {audio} : {})}];
    })) as Record<StepKey, ResponsePart>;
    if (!validDate(source.createdAt) || !validDate(source.updatedAt)) throw new Error(`Explanation ${index + 1} has an invalid practice date.`);
    if (!validOptionalDate(source.completedAt) || !validOptionalDate(source.revisitAt) || !validOptionalDate(source.lastRevisitedAt)) throw new Error(`Explanation ${index + 1} has an invalid completion or revisit date.`);
    if (source.status !== 'draft' && source.status !== 'complete') throw new Error(`Explanation ${index + 1} has an invalid status.`);
    return {
      id: raw.id, topic: raw.topic.trim(), responses,
      createdAt: source.createdAt,
      updatedAt: source.updatedAt,
      completedAt: source.completedAt,
      revisitAt: source.revisitAt,
      lastRevisitedAt: source.lastRevisitedAt,
      status: source.status
    } satisfies Explanation;
  });
}

export async function importExplanations(demo: boolean, explanations: Explanation[]): Promise<void> {
  if (!explanations.length) return;
  const db = await openDatabase(demo);
  await new Promise<void>((resolve, reject) => {
    const transaction = db.transaction(STORE, 'readwrite');
    const store = transaction.objectStore(STORE);
    explanations.forEach((item) => store.put(item));
    transaction.oncomplete = () => { db.close(); resolve(); };
    transaction.onerror = () => { db.close(); reject(transaction.error ?? new Error('The import could not be saved. No work was changed.')); };
    transaction.onabort = () => { db.close(); reject(transaction.error ?? new Error('The import could not be saved. No work was changed.')); };
  });
}

function validDate(value: unknown): value is string {
  return validString(value) && value.trim() !== '' && Number.isFinite(Date.parse(value));
}

function validOptionalDate(value: unknown): value is string | undefined {
  return value === undefined || validDate(value);
}
