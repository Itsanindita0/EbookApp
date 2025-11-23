import { Book } from "../types";

const API_URL = 'https://gutendex.com/books';

export const searchBooks = async (query: string): Promise<Book[]> => {
  try {
    const response = await fetch(`${API_URL}?search=${encodeURIComponent(query)}`);
    const data = await response.json();

    if (!data.results) return [];

    return data.results.map((item: any) => {
      const formats = item.formats;
      // Prioritize HTML for reading
      const readUrl = formats['text/html'] || formats['text/html; charset=utf-8'] || formats['application/pdf'] || formats['text/plain'] || formats['text/plain; charset=utf-8'];
      const thumbnail = formats['image/jpeg'] || 'https://via.placeholder.com/128x192?text=No+Cover';

      return {
        id: item.id.toString(),
        title: item.title,
        authors: item.authors.map((a: any) => a.name),
        description: item.summaries && item.summaries.length > 0 ? item.summaries[0] : 'No description available.',
        thumbnail: thumbnail,
        pdfUrl: readUrl, // We use pdfUrl to store the readable link (HTML/PDF)
        previewLink: readUrl,
        pageCount: 0,
        publishedDate: '',
        isUploaded: false
      };
    });
  } catch (error) {
    console.error("Error searching books:", error);
    return [];
  }
};
