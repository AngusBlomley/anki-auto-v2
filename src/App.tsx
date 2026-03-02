import { useState } from "react";
import Header from "./components/Header";
import Spinner from "./components/Spinner";
import Card from "./components/Card";

import type { TablesInsert } from "./types/supabase";
import { X } from "lucide-react";

// TODO: 

export default function App() {
  const [wordData, setWordData] = useState<TablesInsert<"card">[]>([]);
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [serverError, setServerError] = useState("");

  const onSubmit = async (userInput: string) => {
    // Array Conversion
    const arr = [
      ...new Set(
        userInput
          .split(/[,、]/)
          .map((w) => w.trim())
          .filter(Boolean),
      ),
    ];

    // Skip Duplicates
    const word = wordData.map((word) => word.word);
    const filted = arr.filter((a) => !word.includes(a));

    // Japanese Regex
    const isJapanese = /^[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF\s,、]+$/.test(
      userInput,
    );

    if (!isJapanese) {
      setError("Please enter valid Japanese words and try again..");
      return;
    }

    // Max Word Limit
    if (filted.length > 1000) {
      setError("Exceeded limit of 1000 words..");
      return;
    }

    setError("");
    setServerError("");
    setLoading(true);

    const promises = filted.map(async (word) => {
      const data = await fetch("http://localhost:3000/getData", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ word: word }),
      });
      return await data.json();
    });

    const results = await Promise.allSettled(promises);

    results.forEach((result) => {
      if (result.status === "fulfilled") {
        setWordData((prev) => [...prev, result.value]);
      } else {
        setServerError("Failed to fetch...");
      }
    });
    setLoading(false);
  };

  return (
    <>
      <div className="flex flex-col space-y-10 justify-center py-10">
        <Header />
        {/* Deck selection */}
        <div></div>

        <div className="flex justify-center gap-2">
          <div className="flex flex-col">
            <input
              type="text"
              placeholder="食べ物、寿司、美味し"
              className="p-2 bg-[#171717] border border-[#404040] rounded min-w-md"
              onChange={(e) => setInput(e.target.value)}
            />
            {error && <span className="p-2 text-red-400">{error}</span>}
          </div>
          <button
            className="p-2 max-h-10 rounded cursor-pointer hover:bg-gray-200 bg-white text-black"
            onClick={() => onSubmit(input)}>
            Generate Cards
          </button>
        </div>

        {/* Preview */}
        <div className="flex justify-center">
          {loading ? (
            <Spinner />
          ) : wordData.length > 0 ? (
            <div>
              <div className="flex justify-between pb-4 min-w-xl">
                <h2 className="text-xl">Preview</h2>
                <button>
                  <X className="cursor-pointer hover:opacity-50" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                {["listening", "word", "sentence", "recall"].map(
                  (cardType, i) => (
                    <Card
                      key={i}
                      wordData={wordData.at(-1)!}
                      cardType={cardType}
                    />
                  ),
                )}
              </div>
            </div>
          ) : null}
          {serverError && <span className="text-red-400">{serverError}</span>}
        </div>

        {/* List of words */}
        {wordData.length > 0 && (
          <div className="flex justify-center w-full">
            <table className="min-w-xl text-left">
              <thead>
                <tr className="border-b border-[#404040]">
                  <th className="p-1">Word</th>
                  <th>Reading</th>
                  <th>Translation</th>
                  <th>Manage</th>
                </tr>
              </thead>
              <tbody>
                {wordData.map((word, i) => (
                  <tr key={i} className="border-b border-[#404040]">
                    <td className="p-1">{word.word || word.reading_word}</td>
                    <td className="p-1">{word.reading_word}</td>
                    <td className="p-1">{word.english_word}</td>
                    <td className="p-1"></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
