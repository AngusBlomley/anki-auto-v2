import type { TablesInsert } from "../types/supabase";
import { Play } from "lucide-react";

interface CardProps {
  card: TablesInsert<"card">;
  isFlipped: boolean;
  playAudio: () => void;
}

const PlayButton = ({ playAudio }: { playAudio: () => void }) => {
  return (
    <button
      className="cursor-pointer rounded-full h-9 w-9 p-2 bg-gray-300 hover:bg-gray-400"
      onClick={playAudio}
    >
      <Play color="black" fill="black" size={21} />
    </button>
  );
};

// Build 4 seperate cards branched from the card type ("listen", "sentence", etc.)
function Card({ card, isFlipped, playAudio }: CardProps) {
  return (
    <>
      {card.type === "listen" && (
        <>
          <div className="mt-5">
            <PlayButton playAudio={playAudio} />
          </div>
          {isFlipped && (
            <>
              <div className="border-b w-3/4 opacity-35 py-2"></div>
              <div className="flex flex-col py-2 items-center space-y-2">
                <p className="mt-2">
                  <strong>{card.word}</strong> - {card.reading_word}
                </p>
                <p>{card.english_word}</p>
              </div>
            </>
          )}
        </>
      )}

      {card.type === "word" && (
        <>
          <p className="mt-5">{card.word}</p>
          {isFlipped && (
            <>
              <div className="border-b w-3/4 opacity-35 py-2"></div>
              <div className="flex flex-col py-2 items-center space-y-2">
                <PlayButton playAudio={playAudio} />
                <p className="mt-2">
                  <strong>{card.word}</strong> - {card.reading_word}
                </p>
                <p>{card.english_word}</p>
              </div>
            </>
          )}
        </>
      )}

      {card.type === "sentence" && (
        <>
          <p className="mt-5">{card.sentence}</p>
          {isFlipped && (
            <>
              <div className="border-b w-3/4 opacity-35 py-2"></div>
              <div className="flex flex-col py-2 items-center space-y-2">
                <PlayButton playAudio={playAudio} />
                <p className="flex flex-col space-y-1 mt-2 text-center">
                  <span>{card.reading_sentence}</span>
                  <span>{card.english_sentence}</span>
                  <span>
                    <strong>{card.word}</strong> - {card.reading_word}
                  </span>
                  <span>{card.english_word}</span>
                </p>
              </div>
            </>
          )}
        </>
      )}

      {card.type === "recall" && (
        <>
          <p className="mt-5">{card.english_word}</p>
          {isFlipped && (
            <>
              <div className="border-b w-3/4 opacity-35 py-2"></div>
              <div className="flex flex-col py-2 items-center space-y-2">
                <PlayButton playAudio={playAudio} />
                <p className="mt-2">
                  <strong>{card.word}</strong> - {card.reading_word}
                </p>
              </div>
            </>
          )}
        </>
      )}
    </>
  );
}

export default Card;
