import React from "react"

interface TranscriptProps {
  transcript: string
}

export default function Transcript({ transcript }: TranscriptProps) {
  const formatTranscript = (text: string) => {
    return text.split("\n").map((line, idx) => {
      if (line.startsWith("User:")) {
        return (
          <div key={idx} className="mb-3 pl-4 border-l-2 border-blue-300">
            <span className="font-semibold text-blue-600">User</span>
            <p className="text-xs mt-1">{line.replace("User:", "").trim()}</p>
          </div>
        )
      } else if (line.startsWith("AI:")) {
        return (
          <div key={idx} className="mb-3 pl-4 border-l-2 border-green-300">
            <span className="font-semibold text-green-600">AI</span>
            <p className="text-xs mt-1">{line.replace("AI:", "").trim()}</p>
          </div>
        )
      }
      return null
    })
  }

  return (
    <div className="mb-6">
      <h2 className="text-sm font-semibold mb-4">Call Transcript</h2>
      <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
        {formatTranscript(transcript)}
      </div>
    </div>
  )
}
