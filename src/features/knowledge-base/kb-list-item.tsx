"use client"

import { File, Trash2, Edit2, Link2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface KBListItemProps {
  id: string
  title: string
  fileType?: string
  createdAt: string
  onDelete: (id: string) => void
  onUpdate: (id: string) => void
  onAttachToAssistant: (id: string) => void
}

export function KBListItem({
  id,
  title,
  fileType,
  createdAt,
  onDelete,
  onUpdate,
  onAttachToAssistant,
}: KBListItemProps) {
  const [showConfirm, setShowConfirm] = useState(false)

  const formattedDate = new Date(createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          <File className="w-5 h-5 text-orange-500 mt-1 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">{title}</h3>
            <div className="flex gap-2 mt-1 text-xs text-gray-500">
              <span>{fileType || "text"}</span>
              <span>•</span>
              <span>{formattedDate}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2 ml-4">
          <Button size="sm" variant="ghost" onClick={() => onAttachToAssistant(id)} title="Attach to Assistant">
            <Link2 className="w-4 h-4 text-blue-600" />
          </Button>
          <Button size="sm" variant="ghost" onClick={() => onUpdate(id)} title="Edit">
            <Edit2 className="w-4 h-4 text-gray-600" />
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setShowConfirm(true)} title="Delete">
            <Trash2 className="w-4 h-4 text-red-600" />
          </Button>
        </div>
      </div>

      {showConfirm && (
        <div className="mt-3 p-3 bg-red-50 rounded border border-red-200">
          <p className="text-sm text-red-900 mb-2">Delete this knowledge base?</p>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => setShowConfirm(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => {
                onDelete(id)
                setShowConfirm(false)
              }}
            >
              Delete
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
