"use client";

import { Mic } from 'lucide-react';
import Link from "next/link";
import { useEffect } from 'react';

interface CallLog {
  id: string;
  agent: string;
  date: string;
  time: string;
  transcription: string;
  audioAvailable: boolean;
}

export function CallLogRow({
  log,
}: {
  log: CallLog;
}) {
  useEffect(() => {
    console.log("[v0] CallLogRow - Received log:", log);
    console.log("[v0] CallLogRow - ID:", log.id);
  }, [log]);

  return (
    <Link href={`/dashboard/call-logs/${log.id}`}
      className="grid grid-cols-1 shadow-xs hover:bg-gray-100 md:grid-cols-5 gap-2 md:gap-4 items-center py-3 px-2 rounded-lg cursor-pointer
        transition-colors duration-200"
    >
      {/* Mobile labels */}
      <div className="md:hidden text-xs text-gray-500">Agent</div>
      <div className="text-xs">{log.agent}</div>

      <div className="md:hidden text-xs text-gray-500">Date</div>
      <div className="text-xs">{log.date}</div>

      <div className="md:hidden text-xs text-gray-500">Time</div>
      <div className="text-xs">{log.time}</div>

      <div className="md:hidden text-xs text-gray-500">Transcription</div>
      <div
        className="text-xs truncate text-gray-700"
      >
        {log.transcription}
      </div>

      <div className="md:hidden text-xs text-gray-500">Audio</div>
      <div className="flex items-center justify-start md:justify-center">
        <Mic
          size={18}
        />
      </div>
    </Link>
  );
}
