import { useState } from "react";
import Header from "./components/Header";

interface JishoResponse {
  japanese: [{ word: string; reading: string }];
  senses: [{ english_definitions: string[] }];
  jlpt: string[];
}

function App() {
  const [input, setInput] = useState<string>("");

  const onSubmit = () => {
    const fetchData = async (data: string) => {
      try {
        const response = await fetch("http://localhost:3000/getData", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ word: data }),
        });
        const jsonResponse = await response.json();
        console.log(jsonResponse);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData(input);
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
            onClick={onSubmit}>
            Generate Cards
          </button>
        </div>

        {/* Display */}

        {/* table for displaying cards, 1 card per row, 4 cols: [kanji, reading, engilsh, crud] */}
        <table></table>
      </div>
    </>
  );
}

export default App;
