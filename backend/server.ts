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

const JISHO_API = "https://jisho.org/api/v1/search/words?keyword=";
const TATOEBA_API = "https://api.tatoeba.org";

// TODO: Edge cases:
// 1. If a user types one kanji it can have many meanings, e.g. (空 → から、そら)
// Ans: Show all multiple word and sentence meanings
// 2. If no kanji in sentence, reading sentence is not parsed correctly.

app.post("/getData", async (req, res) => {
  try {
    // Jisho
    const jishoRes = await fetch(`${JISHO_API}${req.body.word}`);
    const jishoParsed = await jishoRes.json();
    const jishoObj: Jisho = jishoParsed.data[0];

    // Tateoba
    const tatoebaRes = await fetch(
      `${TATOEBA_API}/v1/sentences?q=${req.body.word}&lang=jpn&sort=relevance&showtrans:lang=eng&include=transcriptions`,
    );
    const tatoebaParsed = await tatoebaRes.json();
    const tatoebaObj: Tatoeba = tatoebaParsed.data[0];

    // Parse tatoeba furigana to hiragana. e.g. "お[前|まえ]はバナナ[人|じん]だ。" **REVISE**
    const readingSentence = tatoebaObj.transcriptions[0].text
      .replace(/\[.+?\|(.+?)\]/g, "$1")
      .replace(/\|/g, "");

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

    const audioWord = Buffer.from(
      ttsResWord.audioContent as Uint8Array,
    ).toString("base64");

    const audioSentence = Buffer.from(
      ttsResSentence.audioContent as Uint8Array,
    ).toString("base64");

    const builtResponse: TablesInsert<"card"> = {
      word: jishoObj.japanese[0].word,
      reading_word: jishoObj.japanese[0].reading,
      english_word: jishoObj.senses[0].english_definitions.join(", "),
      sentence: tatoebaObj.text,
      reading_sentence: readingSentence,
      english_sentence: tatoebaObj.translations[0].text,
      jlpt: jishoObj.jlpt.join(", "),
      sentence_audio_url: audioSentence,
      word_audio_url: audioWord,
    };

    console.log(builtResponse);
    res.json(builtResponse);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "something went wrong" });
  }
});

app.listen(port, () => {});
