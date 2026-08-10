import React, { useRef, useState } from 'react';

const ImageUploader = ({ onFileSelect, currentImage, accept = "image/*", maxSizeMB = 5 }) => {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState(currentImage || null);
  const [fileDetails, setFileDetails] = useState(null);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = (file) => {
    setError(null);
    if (!file) return;

    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File is too large. Max size is ${maxSizeMB}MB.`);
      return;
    }

    setFileDetails({
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(2) + ' MB'
    });

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }

    onFileSelect(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const clearSelection = (e) => {
    e.stopPropagation();
    setPreview(currentImage || null);
    setFileDetails(null);
    onFileSelect(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="w-full">
      <div 
        className={`relative border-2 border-dashed rounded-2xl p-8 transition-all cursor-pointer overflow-hidden
          ${dragActive ? 'border-[#7C5CFF] bg-[#7C5CFF]/10' : 'border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/30'}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept={accept}
          onChange={handleChange}
        />
        
        <div className="flex flex-col items-center justify-center text-center">
          {preview ? (
            <div className="relative w-full max-w-[200px] mb-4 aspect-square rounded-xl overflow-hidden bg-black/20">
              <img src={preview} alt="Preview" className="w-full h-full object-contain" />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 text-3xl">
              📁
            </div>
          )}
          
          {fileDetails ? (
            <div>
              <p className="text-white font-medium break-all">{fileDetails.name}</p>
              <p className="text-[#CBD5E1] text-sm">{fileDetails.size}</p>
            </div>
          ) : (
            <div>
              <p className="text-white font-medium mb-1">Click to upload or drag and drop</p>
              <p className="text-[#CBD5E1] text-sm">Supported files up to {maxSizeMB}MB</p>
            </div>
          )}
        </div>

        {fileDetails && (
          <button 
            onClick={clearSelection}
            className="absolute top-2 right-2 p-2 rounded-lg bg-black/50 text-white hover:bg-red-500/80 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
      {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
    </div>
  );
};

export default ImageUploader;
