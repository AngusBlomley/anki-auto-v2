import { useState, useRef } from "react";
import type { TablesInsert } from "../types/supabase";
import { Play } from "lucide-react";

interface CardProps {
  wordData: TablesInsert<"card">;
  cardType: string;
}

interface PlayButtonProps {
  playAudio: () => void;
  isPlaying: boolean;
}

const PlayButton = ({ playAudio, isPlaying }: PlayButtonProps) => {
  return (
    <button
      className="cursor-pointer rounded-full h-9 w-9 p-2 bg-gray-300 hover:bg-gray-400"
      disabled={isPlaying}
      onClick={playAudio}
    >
      <Play color="black" fill="black" size={21} />
    </button>
  );
};

function Card({ wordData, cardType }: CardProps) {
  const [flipped, setFlipped] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);

  const playAudio = () => {
    const url =
      cardType === "sentence"
        ? wordData.sentence_audio_url!
        : wordData.word_audio_url!;

    audioRef.current = new Audio(`data:audio/mp3;base64,${url}`);
    setIsPlaying(true);
    audioRef.current.play();
    audioRef.current.addEventListener("ended", () => {
      setIsPlaying(false);
    });
  };

  return (
    <div className="relative flex bg-[#141414] border border-[#404040] rounded-md min-h-82 max-w-82">
      <div className="absolute flex justify-center text-xs text-gray-300 top-0 w-full rounded-t-md align-top p-2 border-b border-[#404040]">
        {cardType?.toUpperCase()}
      </div>
      <div className="flex flex-col items-center space-y-4 px-4 w-full min-h-96 py-10 text-center">
        {cardType === "listening" && (
          <>
            <div className="mt-5">
              <PlayButton playAudio={playAudio} isPlaying={isPlaying} />
            </div>
            {flipped && (
              <>
                <div className="border-b w-3/4 opacity-35 py-2"></div>
                <div className="flex flex-col py-2 items-center space-y-2">
                  <p className="mt-2">
                    <strong>{wordData.word}</strong> - {wordData.reading_word}
                  </p>
                  <p>{wordData.english_word}</p>
                </div>
              </>
            )}
          </>
        )}

        {cardType === "word" && (
          <>
            <p className="mt-5">{wordData.word}</p>
            {flipped && (
              <>
                <div className="border-b w-3/4 opacity-35 py-2"></div>
                <div className="flex flex-col py-2 items-center space-y-2">
                  <PlayButton playAudio={playAudio} isPlaying={isPlaying} />
                  <p className="mt-2">
                    <strong>{wordData.word}</strong> - {wordData.reading_word}
                  </p>
                  <p>{wordData.english_word}</p>
                </div>
              </>
            )}
          </>
        )}

        {cardType === "sentence" && (
          <>
            <p className="mt-5">{wordData.sentence}</p>
            {flipped && (
              <>
                <div className="border-b w-3/4 opacity-35 py-2"></div>
                <div className="flex flex-col py-2 items-center space-y-2">
                  <PlayButton playAudio={playAudio} isPlaying={isPlaying} />
                  <p className="flex flex-col space-y-1 mt-2 text-center">
                    <span>{wordData.reading_sentence}</span>
                    <span>{wordData.english_sentence}</span>
                    <span>
                      <strong>{wordData.word}</strong> - {wordData.reading_word}
                    </span>
                    <span>{wordData.english_word}</span>
                  </p>
                </div>
              </>
            )}
          </>
        )}

        {cardType === "recall" && (
          <>
            <p className="mt-5">{wordData.english_word}</p>
            {flipped && (
              <>
                <div className="border-b w-3/4 opacity-35 py-2"></div>
                <div className="flex flex-col py-2 items-center space-y-2">
                  <PlayButton playAudio={playAudio} isPlaying={isPlaying} />
                  <p className="mt-2">
                    <strong>{wordData.word}</strong> - {wordData.reading_word}
                  </p>
                </div>
              </>
            )}
          </>
        )}
      </div>
      <div className="absolute bottom-8 border-[#404040] border-t w-full"></div>
      <button
        onClick={() => setFlipped(!flipped)}
        className="absolute flex justify-center text-xs text-gray-300 opacity-50 hover:opacity-100 bottom-0 w-full rounded-b-md align-bottom p-2 hover:bg-[#121212] cursor-pointer"
      >
        {flipped ? "Back" : "Front"}
      </button>
    </div>
  );
}

export default Card;
