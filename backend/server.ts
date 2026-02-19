import textToSpeech from "@google-cloud/text-to-speech";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";

import type { TablesInsert } from "../src/types/supabase";

dotenv.config();

const app = express();
const port = 3000;
const ttsClient = new textToSpeech.TextToSpeechClient();

app.use(express.json());
app.use(cors());

interface Jisho {
  japanese: [{ word: string; reading: string }];
  senses: [{ english_definitions: string[] }];
  jlpt: string[];
}

interface Tatoeba {
  text: string;
  translations: [{ text: string }];
  transcriptions: [{ text: string }];
}

// API URLS
const JISHO_API = "https://jisho.org/api/v1/search/words?keyword=";
const TATOEBA_API = "https://api.tatoeba.org";

// TODO: Edge cases:
// 1. If a user types one kanji it can have many meanings, e.g. (空 → から、そら)
// Ans: Show all multiple word and sentence meanings

app.post("/getData", async (req, res) => {
  try {
    // Get Jisho
    const jishoRes = await fetch(`${JISHO_API}${req.body.word}`);
    const jishoParsed = await jishoRes.json();
    const jishoObj: Jisho = jishoParsed.data[0];

    // Get Tateoba
    const tatoebaRes = await fetch(`${TATOEBA_API}/v1/sentences?q=${req.body.word}&lang=jpn&sort=relevance&showtrans:lang=eng&include=transcriptions`,);
    const tatoebaParsed = await tatoebaRes.json();
    const tatoebaObj: Tatoeba = tatoebaParsed.data[0];
    
    // Get TTS // TODO: Eliminate DRY code
    const [ttsResWord] = await ttsClient.synthesizeSpeech({
      input: { text: jishoObj.japanese[0].reading },
      voice: {
        languageCode: "ja-JP",
        name: "ja-JP-Neural2-B",
      },
      audioConfig: {
        audioEncoding: "MP3",
      },
    });

    const [ttsResSentence] = await ttsClient.synthesizeSpeech({
      input: { text: tatoebaObj.text },
      voice: {
        languageCode: "ja-JP",
        name: "ja-JP-Neural2-B",
      },
      audioConfig: {
        audioEncoding: "MP3",
      },
    });
    
    // Format Data
    const cleanWord = jishoObj.japanese[0].word;
    
    // - Capitalise en definitions
    const sliceEnWords = jishoObj.senses[0].english_definitions.slice(0,2);
    const cleanEnWords = sliceEnWords.map((c) => c[0].toUpperCase() + c.slice(1)).join(", ");
    
    const cleanEnSentence = tatoebaObj.translations[0].text;
    const cleanJlpt = jishoObj.jlpt.join(", ");
    const cleanReadingWord = jishoObj.japanese[0].reading;
    
    // - Parse tatoeba furigana to hiragana. e.g. "お[前|まえ]はバナナ[人|じん]だ。" **REVISE**
    const cleanReadingSentence = tatoebaObj.transcriptions[0].text.replace(/\[.+?\|(.+?)\]/g, "$1").replace(/\|/g, "");

    // - Convert TTS to base64 string
    const audioWord = Buffer.from(
      ttsResWord.audioContent as Uint8Array,
    ).toString("base64");

    const audioSentence = Buffer.from(
      ttsResSentence.audioContent as Uint8Array,
    ).toString("base64");

    const builtResponse: TablesInsert<"card"> = {
      word: cleanWord,
      reading_word: cleanReadingWord,
      english_word: cleanEnWords,
      sentence: tatoebaObj.text,
      reading_sentence: cleanReadingSentence,
      english_sentence: cleanEnSentence,
      jlpt: cleanJlpt,
      word_audio_url: audioWord,
      sentence_audio_url: audioSentence,
    };

    res.json(builtResponse);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "something went wrong" });
  }
});

app.listen(port, () => {});