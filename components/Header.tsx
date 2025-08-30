
import React from 'react';
import { CameraIcon } from './icons/CameraIcon';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center space-x-3">
          <CameraIcon className="w-8 h-8 text-cyan-400" />
          <h1 className="text-2xl font-bold tracking-tight text-white">
            AI YouTube Thumbnail Generator
          </h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
