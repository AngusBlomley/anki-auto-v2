# Anki Auto v2

A web app that automatically generates Japanese Anki flashcards from a single word input. Enter a Japanese word and the app fetches dictionary data, an example sentence, and audio pronunciations, then builds four ready-to-use card types that can be organised into decks and exported into Anki.

## How it works

1. Enter a Japanese word (e.g. 食べ物、魚、青い)
2. The backend fetches data from Jisho and Tatoeba
3. Google Text-to-Speech generates audio for the word and example sentence
4. Four card types are generated: **Listen**, **Word**, **Sentence**, and **Recall**
5. Preview and manage cards before saving
6. Export the decks as .apgk
7. Upload to anki

## Tech stack

- **Frontend** — React, TypeScript, Tailwind CSS, Vite
- **Backend** — Express, Node.js
- **Database** — Supabase
- **APIs** — Jisho, Tatoeba, Google Cloud Text-to-Speech

## Getting started

### Prerequisites

- Node.js
- A [Supabase](https://supabase.com) project
- A Google Cloud project with the Text-to-Speech API enabled and credentials configured

### Setup

```bash
npm install
```

Create a `.env` file in the root with your credentials:

```
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
GOOGLE_APPLICATION_CREDENTIALS=path/to/your/gcp-credentials.json
```

### Running

Start the backend:

```bash
npm run server
```

Start the frontend:

```bash
npm run dev
```
