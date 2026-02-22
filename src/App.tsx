import { useState } from "react";
import Header from "./components/Header";
import Spinner from "./components/Spinner";
import Card from "./components/Card";

import type { TablesInsert } from "./types/supabase";
import { X } from "lucide-react";

export default function App() {
  const [wordData, setWordData] = useState<TablesInsert<"card">[]>([]);
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // TODO'S:
  // 1. Add error handling so no api calls are wasted.
  // 2. Update input to take an array of strings for batch calls.
  // 2. Debounce the audio button for the length of the audio playing.

  // BUGS:
  // 1. Handle case where nothing is returned.
  // 2. Only show 1 group of 4 cards per time.

  const onSubmit = async (userInput: string) => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/getData", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ word: userInput }),
      });
      const wordDataRes = await response.json();
      setWordData((prev) => [...prev, { ...wordDataRes }]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col space-y-10 justify-center py-10">
        <Header />
        {/* Deck selection */}
        <div></div>

        <div className="flex justify-center gap-2">
          <input
            type="text"
            placeholder="Japanese words, E.G: 食べ物、魚、青い"
            className="p-2 bg-[#171717] border border-[#404040] rounded min-w-md"
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            className="p-2 rounded cursor-pointer hover:bg-gray-200 bg-white text-black"
            onClick={() => onSubmit(input)}
          >
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
        </div>

        {/* List of words */}

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
              {wordData.map((word) => (
                <tr className="border-b border-[#404040]">
                  <td className="p-1">{word.word}</td>
                  <td>{word.reading_word}</td>
                  <td>{word.english_word}</td>
                  <td></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
