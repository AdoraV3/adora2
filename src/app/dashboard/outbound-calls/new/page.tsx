'use client'

import React, { useState, FC, InputHTMLAttributes, ChangeEvent, DragEvent } from 'react';
import { X, Clock, Calendar, ChevronDown, UploadCloud } from 'lucide-react';

// Reusable type for component props that include a label
type TitledComponentProps = {
  label: string;
  required?: boolean;
};

// ============================================================================
// Tag Component - Renders a single removable tag
// ============================================================================
type TagProps = {
  text: string;
  onRemove: () => void;
};

const Tag: FC<TagProps> = ({ text, onRemove }) => (
  <div className="flex items-center bg-orange-100 text-orange-800 text-sm font-medium mr-2 mb-2 px-3 py-1.5 rounded-md">
    <span>{text}</span>
    <button onClick={onRemove} className="ml-2 text-orange-600 hover:text-orange-800 focus:outline-none">
      <X size={16} />
    </button>
  </div>
);

// ============================================================================
// Tag Input Component - For entering multiple tags (e.g., names, numbers)
// ============================================================================
type TagInputProps = TitledComponentProps & {
  tags: string[];
  setTags: React.Dispatch<React.SetStateAction<string[]>>;
  placeholder?: string;
};

const TagInput: FC<TagInputProps> = ({ label, required, tags, setTags, placeholder }) => {
  const [inputValue, setInputValue] = useState('');

  // Handle input change
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  // Add a new tag when Enter is pressed
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim() !== '') {
      e.preventDefault();
      if (!tags.includes(inputValue.trim())) {
        setTags([...tags, inputValue.trim()]);
      }
      setInputValue('');
    }
  };

  // Remove a tag by its index
  const removeTag = (indexToRemove: number) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="flex flex-wrap items-center p-2 border border-gray-300 rounded-lg bg-white min-h-[44px]">
        {tags.map((tag, index) => (
          <Tag key={index} text={tag} onRemove={() => removeTag(index)} />
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={tags.length === 0 ? placeholder : ''}
          className="flex-grow bg-transparent focus:outline-none text-sm"
        />
      </div>
    </div>
  );
};


// ============================================================================
// Generic Input Field Component with Icon
// ============================================================================
type InputFieldProps = TitledComponentProps & InputHTMLAttributes<HTMLInputElement> & {
  icon: React.ReactNode;
};

const InputField: FC<InputFieldProps> = ({ label, required, icon, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      <input
        {...props}
        className="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 text-sm"
      />
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
        {icon}
      </div>
    </div>
  </div>
);


// ============================================================================
// Select Input Component
// ============================================================================
type SelectInputProps = TitledComponentProps & React.SelectHTMLAttributes<HTMLSelectElement> & {
  options: { value: string | number; label: string }[];
};

const SelectInput: FC<SelectInputProps> = ({ label, required, options, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      <select
        {...props}
        className="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-lg appearance-none focus:ring-orange-500 focus:border-orange-500 text-sm bg-white"
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
        <ChevronDown size={20} />
      </div>
    </div>
  </div>
);


// ============================================================================
// File Upload Component
// ============================================================================
type FileUploadProps = TitledComponentProps & {
  onFileChange: (file: File | null) => void;
};

const FileUpload: FC<FileUploadProps> = ({ label, required, onFileChange }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState('');

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setFileName(file.name);
      onFileChange(file);
    }
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      onFileChange(file);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-gray-400 font-normal">(Optional)</span>}
      </label>
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`flex flex-col items-center justify-center w-full p-6 border-2 border-dashed rounded-lg cursor-pointer
          ${isDragging ? 'border-orange-500 bg-orange-50' : 'border-gray-300 bg-gray-50'}`}
      >
        <input type="file" id="file-upload" className="hidden" onChange={handleFileSelect} />
        <label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
          <UploadCloud className="w-10 h-10 mb-3 text-gray-400" />
          <p className="mb-2 text-sm text-gray-500">
            <span className="font-semibold text-orange-600">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-gray-500">PDF, SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
          {fileName && <p className="mt-2 text-sm text-green-600">{fileName}</p>}
        </label>
      </div>
    </div>
  );
};


// ============================================================================
// Main Form Component
// ============================================================================
export default function ScoutForm() {
  // State for all form fields
  const [names, setNames] = useState<string[]>(['Ola Johnson', 'Ola Johnson', 'Ola Johnson', 'Ola Johnson', 'Ola Johnson', 'Ola Johnson', 'Ola Johnson', 'Ola Johnson', 'Ola Johnson', 'Ola Johnson']);
  const [numbers, setNumbers] = useState<string[]>(['0811132456', '0811132456', '0811132456', '0811132456', '0811132456', '0811132456', '0811132456', '0811132456', '0811132456', '0811132456']);
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('08:00');
  const [date, setDate] = useState('2024-01-12');
  const [callCycle, setCallCycle] = useState('2');
  const [knowledgeBase, setKnowledgeBase] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Log all form data to the console
    console.log({
      names,
      numbers,
      startTime,
      endTime,
      date,
      callCycle,
      knowledgeBase,
      uploadedFile,
    });
    // Here you would typically handle the form submission, e.g., send to an API
  };

  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Input */}
          <TagInput
            label="Name"
            required
            tags={names}
            setTags={setNames}
            placeholder="Add names..."
          />

          {/* Number Input */}
          <TagInput
            label="Number"
            required
            tags={numbers}
            setTags={setNumbers}
            placeholder="Add numbers..."
          />

          {/* Time Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Start Time"
              required
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              icon={<Clock size={20} />}
            />
            <InputField
              label="End Time"
              required
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              icon={<Clock size={20} />}
            />
          </div>

          {/* Date Input */}
          <InputField
            label="Date"
            required
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            icon={<Calendar size={20} />}
          />

          {/* Call Cycle Select */}
          <SelectInput
            label="Call Cycle"
            required
            value={callCycle}
            onChange={(e) => setCallCycle(e.target.value)}
            options={[
              { value: '1', label: '1' },
              { value: '2', label: '2' },
              { value: '3', label: '3' },
            ]}
          />

          {/* Knowledge Base Text Area */}
          <div>
            <label htmlFor="knowledge-base" className="block text-sm font-medium text-gray-700 mb-2">
              Knowledge Base <span className="text-red-500">*</span>
            </label>
            <textarea
              id="knowledge-base"
              rows={4}
              value={knowledgeBase}
              onChange={(e) => setKnowledgeBase(e.target.value)}
              placeholder="Type knowledge base or paste Url"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 text-sm"
            />
          </div>

          {/* File Upload */}
          <FileUpload
            label="Upload Knowledge Base"
            required
            onFileChange={setUploadedFile}
          />

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-orange-500 text-white font-semibold py-3 px-4 rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors duration-300"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
