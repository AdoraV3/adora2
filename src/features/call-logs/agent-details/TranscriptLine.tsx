import { Dot } from "lucide-react";
import React from "react";

interface TranscriptLineProps {
  speaker: "Client" | "AI Assistant";
  text: string;
}

const TranscriptLine: React.FC<TranscriptLineProps> = ({ speaker, text }) => {
  return (
    <p className="mb-2 flex flex-wrap">
      <span> <Dot/> </span>
      <span className="font-semibold">{speaker}:</span>{" "}
      <span className="text-gray-700">{text}</span>
    </p>
  );
};

export default TranscriptLine;
