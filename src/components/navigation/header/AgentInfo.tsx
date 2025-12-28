"use client";

import Link from "next/link";

interface AgentInfoProps {
  agentNumber: string;
}

export function AgentInfo({ agentNumber }: AgentInfoProps) {
  return (
    <div className="font-medium text-gray-800 hidden lg:flex">
      Agent Number:{" "}
      <Link
        href={`tel:${agentNumber}`}
        className="text-blue-600 font-semibold hover:underline"
      >
        {agentNumber}
      </Link>
    </div>
  );
}
