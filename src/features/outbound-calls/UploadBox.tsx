import React, { useState, DragEvent } from "react";

const UploadBox: React.FC = () => {
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFileName(event.target.files[0].name);
    }
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      setFileName(event.dataTransfer.files[0].name);
    }
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Upload Knowledge Base (Optional)
      </label>
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="w-full border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 p-6 text-center cursor-pointer hover:border-orange-400 transition"
      >
        <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
          <span className="text-gray-600 font-medium">
            {fileName ? fileName : "Click to upload or drag and drop"}
          </span>
          <span className="text-xs text-gray-400">
            PDF, SVG, PNG, JPG or GIF (MAX: 800x400px)
          </span>
        </label>
        <input
          id="file-upload"
          type="file"
          accept=".pdf,.svg,.png,.jpg,.jpeg,.gif"
          className="hidden"
          onChange={handleFileSelect}
        />
      </div>
    </div>
  );
};

export default UploadBox;
