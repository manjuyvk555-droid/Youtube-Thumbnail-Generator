
import React, { useState, useCallback, ChangeEvent } from 'react';
import { generateThumbnail } from '../services/geminiService';
import { SparklesIcon } from './icons/SparklesIcon';
import { UploadIcon } from './icons/UploadIcon';
import ThumbnailPreview from './ThumbnailPreview';
import { fileToBase64 } from '../utils/fileUtils';

const ThumbnailGenerator: React.FC = () => {
  const [title, setTitle] = useState<string>('');
  const [headshotFile, setHeadshotFile] = useState<File | null>(null);
  const [headshotPreview, setHeadshotPreview] = useState<string | null>(null);
  const [generatedThumbnail, setGeneratedThumbnail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) { // 4MB limit
        setError("File is too large. Please upload an image under 4MB.");
        return;
      }
      setError(null);
      setHeadshotFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setHeadshotPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = useCallback(async () => {
    if (!title || !headshotFile) {
      setError('Please provide both a title and a headshot image.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedThumbnail(null);

    try {
      const headshotBase64 = await fileToBase64(headshotFile);
      const { data, mimeType } = headshotBase64;
      const result = await generateThumbnail(title, data, mimeType);
      setGeneratedThumbnail(`data:${result.mimeType};base64,${result.data}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [title, headshotFile]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
      <div className="bg-gray-800 rounded-lg p-6 shadow-2xl space-y-6">
        <div>
          <label htmlFor="video-title" className="block text-sm font-medium text-gray-300 mb-2">
            YouTube Video Title
          </label>
          <input
            type="text"
            id="video-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., My Craziest Adventure Yet!"
            className="w-full bg-gray-700 border-gray-600 text-white rounded-md p-3 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Upload Your Headshot
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              <UploadIcon className="mx-auto h-12 w-12 text-gray-500" />
              <div className="flex text-sm text-gray-400">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer bg-gray-800 rounded-md font-medium text-cyan-400 hover:text-cyan-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-800 focus-within:ring-cyan-500"
                >
                  <span>Upload a file</span>
                  <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/png, image/jpeg, image/webp" />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">PNG, JPG, WEBP up to 4MB</p>
              {headshotFile && <p className="text-sm text-green-400 mt-2">Selected: {headshotFile.name}</p>}
            </div>
          </div>
        </div>
        
        {error && <p className="text-red-400 text-sm">{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={isLoading || !title || !headshotFile}
          className="w-full flex items-center justify-center bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:scale-100"
        >
          <SparklesIcon className="w-5 h-5 mr-2" />
          {isLoading ? 'Generating...' : 'Generate Thumbnail'}
        </button>
      </div>

      <ThumbnailPreview
        isLoading={isLoading}
        error={error}
        generatedThumbnail={generatedThumbnail}
        headshotPreview={headshotPreview}
      />
    </div>
  );
};

export default ThumbnailGenerator;
