
import React, { useRef } from 'react';
import { Upload, Camera, FileText, X } from 'lucide-react';

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  onClear: () => void;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ onFileSelect, selectedFile, onClear }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      {!selectedFile ? (
        <div 
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed border-slate-300 rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all group"
        >
          <input
            type="file"
            className="hidden"
            ref={inputRef}
            onChange={handleFileChange}
            accept="image/*,application/pdf"
          />
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Upload className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-slate-800">Upload medical document</h3>
          <p className="text-slate-500 text-center mt-2 text-sm">
            Take a photo of a prescription, lab report, or hospital bill.<br/>
            Supports PDF and Images.
          </p>
          <div className="flex space-x-4 mt-6">
            <button className="flex items-center space-x-2 px-4 py-2 bg-slate-100 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-200">
              <Camera className="w-4 h-4" />
              <span>Camera</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-slate-100 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-200">
              <FileText className="w-4 h-4" />
              <span>Browse Files</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="relative bg-white border border-slate-200 rounded-2xl p-4 flex items-center shadow-sm">
          <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mr-4">
            <FileText className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 truncate">{selectedFile.name}</p>
            <p className="text-xs text-slate-500">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
          </div>
          <button 
            onClick={onClear}
            className="p-2 text-slate-400 hover:text-red-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};
