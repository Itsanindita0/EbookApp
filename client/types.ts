export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Book {
  id: string;
  title: string;
  authors: string[];
  description: string;
  thumbnail: string;
  pdfUrl?: string; // Direct link to PDF if available
  previewLink?: string; // Fallback to external preview
  pageCount?: number;
  publishedDate?: string;
  isUploaded?: boolean; // To distinguish API books from user uploaded ones
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export type ViewMode = 'GRID' | 'LIST';
