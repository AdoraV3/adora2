/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect, useRef } from "react"
import { Skeleton } from "antd"
import { motion } from "framer-motion"
import { useAuthStore } from "@/store/auth-store"
import { CallLogRow } from "./CallLogRow"
import { ChevronLeft, ChevronRight, PhoneCall } from "lucide-react"

interface CallLog {
  id: string
  agent: string
  date: string
  time: string
  transcription: string
  audioAvailable: boolean
  agentId: string
  businessId: string
  duration: number
  transcript?: string
  recordingUrl: string
  status: string
  createdAt: string
  updatedAt: string
}

interface RecentCallLogsProps {
  businessId?: string
}

const ITEMS_PER_PAGE = 10

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      easeOut: "easeOut",
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, easeOut: "easeOut" },
  },
}

const buttonVariants = {
  hover: { scale: 1.05, transition: { duration: 0.2 } },
  tap: { scale: 0.95 },
}

export function RecentCallLogs({ businessId }: RecentCallLogsProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const { callLogs, loading, error, fetchVapiCallLogs } = useAuthStore()
  const fetchCalledRef = useRef<string | null>(null)

  useEffect(() => {
    if (businessId && fetchCalledRef.current !== businessId) {
      fetchCalledRef.current = businessId
      fetchVapiCallLogs(businessId, 50)
    }
  }, [businessId])

  const displayedLogs = callLogs
    .map((log: any) => ({
      ...log,
      agent: "AI Agent",
      date: new Date(log.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "2-digit",
      }),
      time: new Date(log.createdAt).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
      audioAvailable: !!log.recordingUrl,
      transcription: log.transcript || "No transcription available",
    }))
    .slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  const totalPages = Math.ceil(callLogs.length / ITEMS_PER_PAGE)

  return (
    <motion.div
      className="w-full bg-white rounded-2xl p-6 shadow-lg border border-slate-100"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* HEADER */}
      <motion.div
        className="flex justify-between items-center mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="text-lg font-semibold text-slate-800">Recent Call Logs</h2>
        <motion.button
          className="text-sm text-blue-600 hover:underline"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          See all
        </motion.button>
      </motion.div>

      {/* LOADING STATE — Ant Design Skeleton with Animation */}
      {loading && (
        <motion.div
          className="space-y-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="space-y-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1, duration: 0.3 }}
            >
              <Skeleton active paragraph={{ rows: 1 }} />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* ERROR */}
      {!loading && error && (
        <motion.div
          className="text-center py-10"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <p className="text-sm text-red-500">Error loading call logs: {error}</p>
        </motion.div>
      )}

      {/* EMPTY STATE */}
      {!loading && callLogs.length === 0 && !error && (
        <motion.div
          className="text-center py-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}>
            <PhoneCall className="w-12 h-12 mx-auto text-slate-300 mb-3" />
          </motion.div>
          <p className="text-sm text-slate-600">No call logs yet</p>
        </motion.div>
      )}

      {/* TABLE */}
      {!loading && callLogs.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
          <div className="hidden md:grid grid-cols-5 bg-slate-50 p-3 rounded-md text-xs text-slate-600 font-semibold sticky top-0 border mb-3">
            <span>Agent</span>
            <span>Date</span>
            <span>Time</span>
            <span>Transcription</span>
            <span>Audio</span>
          </div>

          {/* Rows with Staggered Animation */}
          <motion.div
            className="flex flex-col divide-y"
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.1,
                  delayChildren: 0.2,
                },
              },
            }}
          >
            {displayedLogs.map((log) => (
              <motion.div key={log.id} variants={itemVariants}>
                <CallLogRow
                  log={{
                    id: log.id,
                    agent: log.agent,
                    date: log.date,
                    time: log.time,
                    transcription: log.transcription,
                    audioAvailable: log.audioAvailable,
                  }}
                />
              </motion.div>
            ))}
          </motion.div>

          {/* PAGINATION */}
          {totalPages > 1 && (
            <motion.div
              className="flex items-center justify-between mt-6 pt-4 border-t"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <p className="text-sm text-slate-600">
                Page {currentPage} of {totalPages}
              </p>

              <motion.div
                className="flex gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.3 }}
              >
                <motion.button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-40"
                  variants={buttonVariants}
                  whileHover={currentPage === 1 ? {} : "hover"}
                  whileTap={currentPage === 1 ? {} : "tap"}
                >
                  <ChevronLeft size={16} />
                </motion.button>

                <motion.button
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-40"
                  variants={buttonVariants}
                  whileHover={currentPage === totalPages ? {} : "hover"}
                  whileTap={currentPage === totalPages ? {} : "tap"}
                >
                  <ChevronRight size={16} />
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      )}
    </motion.div>
  )
}
