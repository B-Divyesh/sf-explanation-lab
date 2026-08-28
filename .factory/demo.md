# Demo sandbox

## Entry point

- Production: `https://explanation-lab.sociobot.in/demo`
- Local: `http://127.0.0.1:4173/demo`

The landing page action “Try it with sample data” opens this route in one click.

## Sample data

The demo includes three realistic explanations:

1. “Why a passing siren changes pitch” — completed nine days ago and due now.
2. “Why binary search needs sorted data” — completed three days ago.
3. “How a JavaScript closure remembers state” — a two-prompt draft.

Every sample is bundled in `src/storage.ts`, so it is available offline.

## Isolation and reset

Demo records use the IndexedDB database `demo:explanation-lab`. Real records use `explanation-lab`. Code selects one database for every read and write; it never combines them.

“Reset demo” clears the demo database and restores the three bundled samples. “Start for real” clears the demo database and opens a blank real practice form. Neither action changes real data.

The test `@claim:demo-isolation` creates a demo explanation and confirms that it does not appear in the real library.
