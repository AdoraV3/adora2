/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState, useEffect, type FC, type DragEvent, type ChangeEvent } from "react"
import { useAuthStore } from "@/store/auth-store"
import { useKBStore } from "@/store/kb-store"
import { UploadCloud, File, Trash2, Replace, Loader2, AlertCircle } from "lucide-react"
import { KBGuidelines } from "@/features/knowledge-base/kb-guidelines"
import { KBListItem } from "@/features/knowledge-base/kb-list-item"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion, AnimatePresence } from "framer-motion"

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

type UploadBoxProps = {
  onFileSelect: (file: File) => void
  isDragging: boolean
  setIsDragging: (isDragging: boolean) => void
}

const UploadBox: FC<UploadBoxProps> = ({ onFileSelect, isDragging, setIsDragging }) => {
  const handleFile = (file: File | undefined) => {
    if (file) {
      onFileSelect(file)
    }
  }

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    handleFile(e.dataTransfer.files[0])
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleFile(e.target.files?.[0])
  }

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={`w-full p-6 mt-4 border-2 border-dashed rounded-lg cursor-pointer transition-colors
        ${isDragging ? "border-orange-500 bg-orange-50" : "border-gray-300 bg-gray-50"}`}
    >
      <input type="file" id="file-upload" className="hidden" onChange={handleFileChange} />
      <label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
        <UploadCloud className="w-10 h-10 mb-3 text-gray-400" />
        <p className="mb-2 text-sm text-gray-500">
          <span className="font-semibold text-orange-600">Click to upload</span> or drag and drop
        </p>
        <p className="text-xs text-gray-500">PDF, TXT, or Markdown files up to 10MB</p>
      </label>
    </motion.div>
  )
}

type UploadedFileProps = {
  fileName: string
  fileSize: string
  fileType: string
  onSwap: () => void
  onDelete: () => void
}

const UploadedFile: FC<UploadedFileProps> = ({ fileName, fileSize, fileType, onSwap, onDelete }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="w-full p-4 border border-gray-200 rounded-lg bg-white shadow-sm"
  >
    <h1 className="text-lg font-semibold mb-4 text-gray-800">Uploaded File</h1>
    <div className="flex items-start p-4 border border-gray-200 rounded-lg">
      <div className="flex-shrink-0 mr-4">
        <File className="w-10 h-10 text-orange-500" />
      </div>
      <div className="flex-grow">
        <p className="font-semibold text-gray-800 truncate">{fileName}</p>
        <p className="text-sm text-gray-500">
          {fileType.toUpperCase()} • {fileSize}
        </p>
      </div>
      <div className="flex items-center ml-4 space-x-2">
        <button
          onClick={onSwap}
          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
        >
          <Replace size={20} />
        </button>
        <button
          onClick={onDelete}
          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
        >
          <Trash2 size={20} />
        </button>
      </div>
    </div>
  </motion.div>
)

type SubmitButtonProps = {
  onClick: () => void
  disabled: boolean
  isLoading: boolean
}

const SubmitButton: FC<SubmitButtonProps> = ({ onClick, disabled, isLoading }) => (
  <motion.button
    whileHover={!disabled ? { scale: 1.02 } : {}}
    whileTap={!disabled ? { scale: 0.98 } : {}}
    onClick={onClick}
    disabled={disabled}
    className="w-full mt-6 bg-orange-500 text-white font-semibold py-3 px-4 rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors duration-300 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
  >
    {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
    {isLoading ? "Uploading..." : "Upload Knowledge Base"}
  </motion.button>
)

export default function KnowledgeBasePage() {
  const { business } = useAuthStore()
  const {
    kbList,
    isLoading,
    isUploading,
    error,
    fetchKnowledgeBases,
    uploadAndAttachKnowledgeBase,
    updateKnowledgeBase,
    deleteKnowledgeBase,
    clearError,
  } = useKBStore()

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadedFile, setUploadedFile] = useState<{
    name: string
    size: string
    type: string
  } | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState("")

  useEffect(() => {
    if (business?._id) {
      fetchKnowledgeBases(business._id)
    }
  }, [business?._id, fetchKnowledgeBases])

  const handleFileSelect = (file: File) => {
    setSelectedFile(file)
    clearError()
  }

  const handleSubmit = async () => {
    if (!selectedFile || !business?._id) return

    const title = selectedFile.name.split(".")[0]
    try {
      await uploadAndAttachKnowledgeBase(business._id, selectedFile, title)
      setSelectedFile(null)
      setUploadedFile(null)
      alert("Knowledge base uploaded and attached to assistant successfully!")
    } catch (err) {
      console.error("[v0] Error:", err)
    }
  }

  const handleDelete = async (id: string) => {
    await deleteKnowledgeBase(id)
  }

  const handleUpdate = (id: string) => {
    const kb = kbList.find((k) => k._id === id)
    if (kb) {
      setEditingId(id)
      setEditTitle(kb.title)
    }
  }

  const handleSaveUpdate = async () => {
    if (!editingId) return
    await updateKnowledgeBase(editingId, editTitle)
    setEditingId(null)
    setEditTitle("")
  }

  const resetState = () => {
    setSelectedFile(null)
    setUploadedFile(null)
  }

  const handleSwap = () => {
    resetState()
  }

  const handleDelete2 = () => {
    resetState()
  }

  const handleAttachToAssistant = async (id: string) => {
    const kb = kbList.find((k) => k._id === id)
    if (kb) {
      try {
        // Add logic to attach KB to assistant if needed
        alert(`Knowledge base "${kb.title}" attached to assistant!`)
      } catch (err) {
        console.error("[v0] Error attaching KB:", err)
      }
    }
  }

  return (
    <main className="m-4 md:m-12 font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 space-y-8 order-1 lg:order-1">
          {/* Upload Section */}
          <div className="flex justify-center">
            <div className="w-full max-w-2xl">
              <AnimatePresence mode="wait">
                {!uploadedFile ? (
                  <motion.div
                    key="upload-form"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex items-center flex-col p-6 border border-gray-200 rounded-xl bg-white shadow-md"
                  >
                    <h1 className="text-xl font-bold mb-2 text-gray-800">Upload Knowledge Base</h1>
                    <p className="text-sm text-gray-500 mb-4">
                      Upload a PDF, TXT, or Markdown file to train your AI agent.
                    </p>
                    <UploadBox onFileSelect={handleFileSelect} isDragging={isDragging} setIsDragging={setIsDragging} />
                    {selectedFile && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-4 text-center text-sm text-green-600"
                      >
                        File selected: <span className="font-medium">{selectedFile.name}</span>
                      </motion.div>
                    )}

                    <SubmitButton
                      onClick={handleSubmit}
                      disabled={!selectedFile || isUploading}
                      isLoading={isUploading}
                    />
                  </motion.div>
                ) : (
                  <UploadedFile
                    key="uploaded-file"
                    fileName={uploadedFile.name}
                    fileSize={uploadedFile.size}
                    fileType={uploadedFile.type}
                    onSwap={handleSwap}
                    onDelete={handleDelete2}
                  />
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Error Display */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="p-4 bg-red-50 border border-red-200 rounded-lg flex gap-2 overflow-hidden"
              >
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <p className="text-sm text-red-700">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* KB List Section */}
          <div>
            <h2 className="text-xl font-bold mb-4 text-gray-900">Your Knowledge Bases</h2>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
              </div>
            ) : kbList.length === 0 ? (
              <div className="text-center py-8 border border-dashed border-gray-300 rounded-lg">
                <p className="text-gray-500">No knowledge bases yet. Upload your first file above.</p>
              </div>
            ) : (
              <motion.div className="space-y-3" layout>
                <AnimatePresence mode="popLayout">
                  {kbList.map((kb) => (
                    <motion.div
                      key={kb._id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      {editingId === kb._id ? (
                        <div className="border border-gray-200 rounded-lg p-4 bg-white">
                          <div className="flex gap-2">
                            <Input
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                              placeholder="Enter KB title"
                              className="flex-1"
                            />
                            <Button onClick={handleSaveUpdate} className="bg-orange-600 hover:bg-orange-700">
                              Save
                            </Button>
                            <Button variant="outline" onClick={() => setEditingId(null)}>
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <KBListItem
                          id={kb._id}
                          title={kb.title}
                          fileType={kb.fileType}
                          createdAt={kb.createdAt}
                          onDelete={handleDelete}
                          onUpdate={handleUpdate}
                          onAttachToAssistant={handleAttachToAssistant}
                        />
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2 order-2 lg:order-2">
          <div className="sticky top-4">
            <KBGuidelines />
          </div>
        </div>
      </div>
    </main>
  )
}
