
import React from 'react';
import { DownloadIcon } from './icons/DownloadIcon';

interface ThumbnailPreviewProps {
  isLoading: boolean;
  error: string | null;
  generatedThumbnail: string | null;
  headshotPreview: string | null;
}

const LoadingSpinner: React.FC = () => (
  <div className="flex flex-col items-center justify-center h-full">
    <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-cyan-500"></div>
    <p className="mt-4 text-gray-400">AI is creating magic...</p>
    <p className="text-sm text-gray-500">This may take a moment.</p>
  </div>
);

const Placeholder: React.FC = () => (
    <div className="flex items-center justify-center h-full bg-gray-800/50 rounded-lg">
        <div className="text-center text-gray-500">
            <p className="font-semibold">Thumbnail Preview</p>
            <p className="text-sm">Your generated thumbnail will appear here.</p>
        </div>
    </div>
);

const ThumbnailPreview: React.FC<ThumbnailPreviewProps> = ({ isLoading, error, generatedThumbnail, headshotPreview }) => {
  return (
    <div className="bg-gray-800 rounded-lg p-4 shadow-2xl flex flex-col">
      <div className="aspect-video w-full bg-gray-900 rounded-md flex items-center justify-center overflow-hidden">
        {isLoading ? (
          <LoadingSpinner />
        ) : error && !generatedThumbnail ? (
            <div className="text-center text-red-400 p-4">{error}</div>
        ) : generatedThumbnail ? (
          <img src={generatedThumbnail} alt="Generated Thumbnail" className="w-full h-full object-contain" />
        ) : headshotPreview ? (
            <img src={headshotPreview} alt="Headshot Preview" className="w-full h-full object-contain" />
        ) : (
          <Placeholder />
        )}
      </div>
      {generatedThumbnail && (
        <a
          href={generatedThumbnail}
          download="youtube_thumbnail.png"
          className="mt-4 w-full flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300"
        >
          <DownloadIcon className="w-5 h-5 mr-2" />
          Download Thumbnail
        </a>
      )}
    </div>
  );
};

export default ThumbnailPreview;
