import React from "react";
import { FileText, RefreshCw, Trash2 } from "lucide-react";

interface UploadedFileProps {
  fileName: string;
  fileSize: string;
  fileType: string;
  onSwap: () => void;
  onDelete: () => void;
}

const UploadedFile: React.FC<UploadedFileProps> = ({ fileName, fileSize, fileType, onSwap, onDelete }) => {
  return (
    <div className="w-full bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-sm font-semibold mb-3">
        Upload Receipt <span className="text-red-500">*</span>
      </h2>

      {/* File Info Box */}
      <div className="flex items-center gap-3 border border-gray-200 rounded-lg p-3 mb-4">
        <FileText className="text-orange-500 w-6 h-6" />
        <div>
          <p className="text-gray-700 font-medium">{fileName}</p>
          <p className="text-xs text-gray-500">{fileType} | {fileSize}</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={onSwap}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md bg-orange-50 text-orange-600 border border-orange-200 hover:bg-orange-100"
        >
          <RefreshCw size={16} /> Swap file
        </button>
        <button
          onClick={onDelete}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md bg-orange-50 text-orange-600 border border-orange-200 hover:bg-orange-100"
        >
          <Trash2 size={16} /> Delete
        </button>
      </div>
    </div>
  );
};

export default UploadedFile;
