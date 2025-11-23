import { Book } from "./types";

export const BACKGROUND_IMAGE = "https://images.unsplash.com/photo-1507842217121-9e96e4769ea0?q=80&w=1920&auto=format&fit=crop";

// A few reliable public domain PDFs for the "Featured" section
export const FEATURED_BOOKS: Book[] = [
  {
    id: "alice-in-wonderland",
    title: "Alice's Adventures in Wonderland",
    authors: ["Lewis Carroll"],
    description: "The classic fantasy novel about a young girl named Alice who falls through a rabbit hole into a fantasy world.",
    thumbnail: "https://www.gutenberg.org/cache/epub/11/pg11.cover.medium.jpg",
    pdfUrl: "https://www.adobe.com/support/products/enterprise/knowledgecenter/media/c4611_sample_explain.pdf", // Using a sample PDF for demo reliability as Gutenberg doesn't host direct PDF links often
    publishedDate: "1865",
    pageCount: 100
  },
  {
    id: "sample-pdf-report",
    title: "Annual Report Sample",
    authors: ["Corporate Demo"],
    description: "A sample PDF document to demonstrate the reading and downloading capabilities of the EBookVerse application.",
    thumbnail: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800",
    pdfUrl: "https://unec.edu.az/application/uploads/2014/12/pdf-sample.pdf",
    publishedDate: "2023",
    pageCount: 15
  }
];

export const MOCK_USER = {
  id: "u1",
  name: "Jane Reader",
  email: "jane@example.com"
};