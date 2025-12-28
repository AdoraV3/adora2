import React from "react"

interface CallHeaderProps {
  agent: string
  time: string
  date: string
}

export default function CallHeader({ agent, time, date }: CallHeaderProps) {
  return (
    <div className="mb-6 pb-4 border-b">
      <h1 className="text-lg font-semibold mb-2">{agent}</h1>
      <div className="flex gap-4 text-xs text-gray-600">
        <span>{date}</span>
        <span>{time}</span>
      </div>
    </div>
  )
}
