import { useState } from "react";
import Header from "./components/Header";
import Spinner from "./components/Spinner";
import Card from "./components/Card";

import type { TablesInsert } from "./types/supabase";
import { X } from "lucide-react";

type Word = Omit<TablesInsert<"card">, "type">;

export default function App() {
  const [cards, setCards] = useState<TablesInsert<"card">[]>([]);
  const [words, setWords] = useState<Word[]>([]);
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [flipped, setFlipped] = useState<boolean[]>([]);

  const onSubmit = async (data: string) => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/getData", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ word: data }),
      });

      const wordData: Word = await response.json();

      // Derive all the word data we get from the getData response into 4 card types
      const cards: TablesInsert<"card">[] = [
        { ...wordData, type: "listen" },
        { ...wordData, type: "word" },
        { ...wordData, type: "sentence" },
        { ...wordData, type: "recall" },
      ];
      
      setCards(cards);
      setFlipped(new Array(cards.length).fill(false));
      setWords((prev) => [...prev, { ...wordData }]);
      console.log(wordData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const playAudio = (base64Audio: string) => {
    const audio = new Audio(`data:audio/mp3;base64,${base64Audio}`);
    audio.play();
  };

  // REDO
  const toggleSide = (i: number) => {
    setFlipped((prev) => prev.map((v, index) => (index === i ? !v : v)));
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
          ) : (
            <div>
              <div className="flex justify-between pb-4 min-w-xl">
                <h2 className="text-xl">Preview</h2>
                <button>
                  <X
                    className="cursor-pointer hover:opacity-50"
                    onClick={() => setCards([])}
                  />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {cards.map((card, i) => (
                  <div className="flex max-w-3xl" key={i}>
                    <div className="relative flex bg-[#141414] border border-[#404040] rounded-md min-h-82 min-w-72">
                      <div className="absolute flex justify-center text-xs text-gray-300 top-0 w-full rounded-t-md align-top p-2 border-b border-[#404040] ">
                        {card.type?.toUpperCase()}
                      </div>
                      <div className="flex flex-col items-center space-y-4 w-full py-10">
                        <Card
                          card={card}
                          isFlipped={flipped[i]}
                          playAudio={() =>
                            playAudio(
                              card.type === "sentence"
                                ? card.sentence_audio_url!
                                : card.word_audio_url!,
                            )
                          }
                        />
                      </div>
                      <div className="absolute bottom-8 border-[#404040]  border-t w-full"></div>
                      <button
                        onClick={() => toggleSide(i)}
                        className="absolute flex justify-center text-xs text-gray-300 opacity-50 hover:opacity-100 bottom-0 w-full rounded-b-md align-bottom p-2 hover:bg-[#121212] cursor-pointer"
                      >
                        {flipped[i] ? "Back" : "Front"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* List of words */}
        <div className="flex justify-center w-full">
          <table className="min-w-xl text-left">
            {/*{words.length > 0 && (*/}
            <thead>
              <tr className="border-b border-[#404040]">
                <th className="p-1">Word</th>
                <th>Reading</th>
                <th>Translation</th>
                <th>Manage</th>
              </tr>
            </thead>
            <tbody>
              {words.map((word, i) => (
                <tr key={i} className="border-b border-[#404040]">
                  <td className="p-1">{word.word}</td>
                  <td>{word.reading_word}</td>
                  <td>{word.english_word}</td>
                  <td></td>
                </tr>
              ))}
            </tbody>
            {/*)}*/}
          </table>
        </div>
      </div>
    </>
  );
}
