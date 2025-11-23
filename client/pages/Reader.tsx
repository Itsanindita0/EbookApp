import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download } from 'lucide-react';

declare global {
  interface Window {
    google: any;
  }
}

export const Reader: React.FC = () => {
  const query = new URLSearchParams(useLocation().search);
  const pdfUrl = query.get('url');
  const title = query.get('title') || 'Book Reader';
  const bookId = query.get('id');
  const navigate = useNavigate();

  useEffect(() => {
    // No special initialization needed for iframe reading
  }, []);

  if (!pdfUrl) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">No Book Loaded</h2>
          <button onClick={() => navigate('/')} className="mt-4 text-primary underline">Go Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-slate-900">
      <header className="h-14 bg-slate-800 text-white flex items-center justify-between px-4 shadow-md z-10">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-slate-700 rounded-full transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="font-serif font-medium text-lg truncate max-w-md">{title}</h1>
        </div>
        {pdfUrl && (
          <a
            href={pdfUrl}
            download
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm bg-primary px-3 py-1.5 rounded hover:bg-amber-700 transition-colors"
          >
            <Download size={16} /> <span className="hidden sm:inline">Download/Open</span>
          </a>
        )}
      </header>

      <div className="flex-grow relative bg-gray-500 overflow-hidden">
        <iframe
          src={pdfUrl}
          className="w-full h-full border-none bg-white"
          title="Book Reader"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        />
      </div>
    </div>
  );
};
