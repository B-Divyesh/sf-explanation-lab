export const STEP_KEYS = ['mechanism', 'boundary', 'example', 'counterexample'] as const;
export type StepKey = (typeof STEP_KEYS)[number];

export interface AudioNote {
  blob: Blob;
  mimeType: string;
  createdAt: string;
}

export interface ResponsePart {
  text: string;
  audio?: AudioNote;
}

export interface Explanation {
  id: string;
  topic: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  revisitAt?: string;
  lastRevisitedAt?: string;
  status: 'draft' | 'complete';
  responses: Record<StepKey, ResponsePart>;
}

export interface ExportFile {
  product: 'explanation-lab';
  version: 1;
  exportedAt: string;
  explanations: Array<Omit<Explanation, 'responses'> & {
    responses: Record<StepKey, {text: string; audio?: {dataUrl: string; mimeType: string; createdAt: string}}>;
  }>;
}

export const STEP_DETAILS: Record<StepKey, {number: string; short: string; title: string; prompt: string; hint: string}> = {
  mechanism: {
    number: '01', short: 'Explain', title: 'Explain the mechanism',
    prompt: 'What changes, in what order, and why?',
    hint: 'Name the parts. Then connect each cause to its effect.'
  },
  boundary: {
    number: '02', short: 'Boundary', title: 'Draw the boundary',
    prompt: 'What must be true? Where does this idea stop applying?',
    hint: 'List one assumption and one case outside the boundary.'
  },
  example: {
    number: '03', short: 'Example', title: 'Give an example',
    prompt: 'Use real values, a short trace, or a concrete case.',
    hint: 'Walk through the mechanism. Do not name the example only.'
  },
  counterexample: {
    number: '04', short: 'Counter', title: 'Find a counterexample',
    prompt: 'Change one condition so your explanation fails.',
    hint: 'Say which claim breaks and why it breaks.'
  }
};

export function emptyExplanation(topic: string): Explanation {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(), topic: topic.trim(), createdAt: now, updatedAt: now, status: 'draft',
    responses: {
      mechanism: {text: ''}, boundary: {text: ''}, example: {text: ''}, counterexample: {text: ''}
    }
  };
}
