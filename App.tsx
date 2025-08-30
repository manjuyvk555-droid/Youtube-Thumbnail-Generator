
import React from 'react';
import Header from './components/Header';
import ThumbnailGenerator from './components/ThumbnailGenerator';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <ThumbnailGenerator />
      </main>
    </div>
  );
};

export default App;
