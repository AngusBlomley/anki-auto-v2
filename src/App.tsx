import { useState } from "react";
import { Play } from "lucide-react";
import Header from "./components/Header";
import Spinner from "./components/Spinner";

import type { TablesInsert } from "./types/supabase";

export default function App() {
  const [data, setData] = useState<TablesInsert<"card">[]>([]);
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isEditingId, setIsEdtingId] = useState<number>(0);

  const onSubmit = () => {
    const fetchData = async (data: string) => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:3000/getData", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ word: data }),
        });
        const jsonResponse = await response.json();
        console.log(jsonResponse);
        setData(() => [jsonResponse]);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData(input);
  };

  const playAudio = (base64Audio: string) => {
    const audio = new Audio(`data:audio/mp3;base64,${base64Audio}`);
    audio.play();
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
            className="p-2 bg-[#171717] border border-[#505050] rounded min-w-sm"
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            className="p-2 rounded cursor-pointer hover:bg-gray-200 bg-white text-black"
            onClick={onSubmit}
          >
            Generate Cards
          </button>
        </div>

        {/*
          The following <main> data map is invalid, this is mapping over the entire built api.
          This response needs to be split into 4 cards of different types and put
          into an array, then mapped over and displayed.
          */}

        <main className="flex justify-center">
          {loading ? (
            <Spinner />
          ) : (
            <div>
              {data.map((item, i) => (
                <div className="grid grid-cols-2 grid-rows-2 gap-4" key={i}>
                  <div className="relative flex border border-gray-400 rounded-md min-h-82 min-w-64">
                    <div className="absolute flex justify-center text-sm text-gray-300 font-extralight top-0 w-full rounded-t-md align-top p-2 border-b border-gray-400">
                      Listen
                    </div>
                    <div className="flex justify-center items-center h-full w-full py-3">
                      <button
                        className="cursor-pointer rounded-full p-1 bg-gray-300"
                        onClick={() => playAudio(item.word_audio_url!)}
                      >
                        <Play color="black" fill="black" />
                      </button>
                    </div>
                    <button className="absolute flex justify-center text-sm text-gray-300 font-extralight bottom-0 w-full rounded-b-md align-bottom p-2 border-t border-gray-400 hover:bg-gray-950 cursor-pointer">
                      Front
                    </button>
                  </div>
                  <div className="relative flex border border-gray-400 rounded-md min-h-82 min-w-64">
                    <div className="absolute flex justify-center text-sm text-gray-300 font-extralight top-0 w-full rounded-t-md align-top p-2 border-b border-gray-400">
                      Word
                    </div>
                    <div className="flex justify-center items-center h-full w-full py-3"></div>
                    <button className="absolute flex justify-center text-sm text-gray-300 font-extralight bottom-0 w-full rounded-b-md align-bottom p-2 border-t border-gray-400 hover:bg-gray-950 cursor-pointer">
                      Front
                    </button>
                  </div>
                  <div className="relative flex border border-gray-400 rounded-md min-h-82 min-w-64">
                    <div className="absolute flex justify-center text-sm text-gray-300 font-extralight top-0 w-full rounded-t-md align-top p-2 border-b border-gray-400">
                      Sentence
                    </div>
                    <div className="flex justify-center items-center h-full w-full py-3"></div>
                    <button className="absolute flex justify-center text-sm text-gray-300 font-extralight bottom-0 w-full rounded-b-md align-bottom p-2 border-t border-gray-400 hover:bg-gray-950 cursor-pointer">
                      Front
                    </button>
                  </div>
                  <div className="relative flex border border-gray-400 rounded-md min-h-82 min-w-64">
                    <div className="absolute flex justify-center text-sm text-gray-300 font-extralight top-0 w-full rounded-t-md align-top p-2 border-b border-gray-400">
                      Recall
                    </div>
                    <div className="flex justify-center items-center h-full w-full py-3"></div>
                    <button className="absolute flex justify-center text-sm text-gray-300 font-extralight bottom-0 w-full rounded-b-md align-bottom p-2 border-t border-gray-400 hover:bg-gray-950 cursor-pointer">
                      Front
                    </button>
                  </div>

                  <button
                    className="cursor-pointer"
                    onClick={() => playAudio(item.sentence_audio_url!)}
                  >
                    <Play />
                  </button>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </>
  );
}
