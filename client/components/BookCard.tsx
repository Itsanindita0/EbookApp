import React from 'react';
import { Book } from '../types';
import { Download, Eye, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

interface BookCardProps {
  book: Book;
}

export const BookCard: React.FC<BookCardProps> = ({ book }) => {
  const navigate = useNavigate();
  const { addToHistory } = useApp();

  const handleRead = () => {
    addToHistory(book);

    const urlToRead = book.pdfUrl || book.previewLink;

    if (urlToRead || !book.isUploaded) {
      // Encode URL to pass as query param
      // For Google Books, we also need the ID to use the Embedded Viewer
      const queryParams = new URLSearchParams({
        url: urlToRead || '',
        title: book.title,
        id: book.id,
        isUploaded: book.isUploaded ? 'true' : 'false'
      });
      navigate(`/read?${queryParams.toString()}`);
    } else {
      alert("No reading format available for this book.");
    }
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (book.pdfUrl) {
      // Create a temporary link to force download
      const link = document.createElement('a');
      link.href = book.pdfUrl;
      link.download = `${book.title}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert("Direct download not available for this book.");
    }
  };

  return (
    <div className="group relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full border border-gray-100">
      <div className="relative h-64 overflow-hidden bg-gray-100">
        {book.thumbnail ? (
          <img
            src={book.thumbnail}
            alt={book.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <BookOpen size={48} />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-4">
          <button
            onClick={handleRead}
            className="text-white bg-primary p-2 rounded-full hover:bg-white hover:text-primary transition-colors"
            title="Read"
          >
            <Eye size={20} />
          </button>
          {book.pdfUrl && (
            <button
              onClick={handleDownload}
              className="text-white bg-secondary p-2 rounded-full hover:bg-white hover:text-secondary transition-colors"
              title="Download PDF"
            >
              <Download size={20} />
            </button>
          )}
        </div>
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-serif font-bold text-lg text-gray-800 line-clamp-1 mb-1" title={book.title}>
          {book.title}
        </h3>
        <p className="text-sm text-gray-500 mb-2 line-clamp-1">
          {book.authors.join(', ')}
        </p>
        <p className="text-xs text-gray-400 line-clamp-3 mb-4 flex-grow">
          {book.description || "No description available."}
        </p>

        <div className="mt-auto pt-3 border-t border-gray-100 flex flex-col gap-2">
          <div className="flex justify-between items-center text-xs text-gray-500 mb-2">
            <span>{book.publishedDate?.substring(0, 4) || 'N/A'}</span>
            <span>{book.pageCount ? `${book.pageCount} pages` : ''}</span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleRead}
              className="flex-1 bg-primary text-white text-sm py-2 rounded-lg hover:bg-amber-700 transition-colors flex items-center justify-center gap-1"
            >
              <Eye size={16} /> Read
            </button>
            {book.pdfUrl && (
              <button
                onClick={handleDownload}
                className="bg-gray-100 text-gray-700 p-2 rounded-lg hover:bg-gray-200 transition-colors"
                title="Download PDF"
              >
                <Download size={18} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
