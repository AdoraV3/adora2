"use client"

import React, { useRef, useState } from "react"

interface AudioButtonProps {
  audioUrl: string
  stereoUrl?: string
}

export default function AudioButton({ audioUrl, stereoUrl }: AudioButtonProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration)
    }
  }

  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return "0:00"
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  return (
    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        src={audioUrl}
      />
      <div className="flex items-center gap-4 mb-3">
        <button
          onClick={handlePlayPause}
          className="flex items-center justify-center w-8 h-8 bg-[#E05E00] text-white rounded-full hover:bg-[#E05E00]"
        >
          {isPlaying ? "⏸" : "▶"}
        </button>
        <div className="flex-1">
          <div className="bg-gray-200 h-2 rounded-full cursor-pointer"
            onClick={(e) => {
              if (audioRef.current) {
                const rect = e.currentTarget.getBoundingClientRect()
                const newTime = (e.clientX - rect.left) / rect.width * duration
                audioRef.current.currentTime = newTime
              }
            }}
          >
            <div
              className="bg-[#E05E00] h-2 rounded-full"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
          </div>
        </div>
        <span className="text-xs text-gray-600">
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>
      </div>
      {stereoUrl && (
        <a
          href={stereoUrl}
          download
          className="text-xs text-[#E05E00] hover:underline"
        >
          Download Stereo Recording
        </a>
      )}
    </div>
  )
}
