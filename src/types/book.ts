export interface Book {
  id: string;
  title: string;
  authors: string[];
  description: string;
  imageLinks: { thumbnail?: string };
  publishedDate: string;
  pageCount: number;
  categories: string[];
  averageRating: number;
  ratingsCount: number;
  language: string;
  previewLink: string;
  infoLink: string;
}