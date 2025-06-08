import { useState } from 'react';
import { searchMovies, fetchMoviesAdvanced, fetchMoviesAdvancedPaginated, type MovieSearchParams, type PaginatedSearchParams, type PaginatedMovieResults } from '../api/tmdb';
import { fetchBooksByAuthors, fetchBooksAdvanced, fetchBooksAdvancedPaginated, type BookSearchParams, type PaginatedBookSearchParams, type PaginatedBookResults } from '../api/books';
import type { Movie } from '../types/movie';
import type { Book } from '../types/book';

export function useRecommendations() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Nuevos estados para paginación
  const [moviePagination, setMoviePagination] = useState<{ currentPage: number; totalPages: number; totalResults: number }>({ 
    currentPage: 1, 
    totalPages: 0, 
    totalResults: 0 
  });
  const [bookPagination, setBookPagination] = useState<{ currentPage: number; totalPages: number; totalResults: number }>({ 
    currentPage: 1, 
    totalPages: 0, 
    totalResults: 0 
  });

  async function getRecommendations(genres: string[], authors: string[]) {
    setLoading(true);
    try {
      const [m, b] = await Promise.all([
        searchMovies({ genres }),
        fetchBooksByAuthors(authors),
      ]);
      setMovies(m);
      setBooks(b);
    } finally {
      setLoading(false);
    }
  }

  async function getMovieRecommendations(params: MovieSearchParams) {
    setLoading(true);
    try {
      // Use the advanced search function for more comprehensive results
      const searchParams = {
        genres: params.genres || [],
        title: params.title || '',
        actor: params.actor || ''
      };
      const movies = await fetchMoviesAdvanced(searchParams);
      setMovies(movies);
    } finally {
      setLoading(false);
    }
  }

  async function getBookRecommendations(params: BookSearchParams) {
    setLoading(true);
    try {
      const searchParams = {
        authors: params.authors || [],
        title: params.title || '',
        genre: params.genre || ''
      };
      const books = await fetchBooksAdvanced(searchParams);
      setBooks(books);
    } finally {
      setLoading(false);
    }
  }

  async function getMovieRecommendationsPaginated(params: PaginatedSearchParams) {
    setLoading(true);
    try {
      const result = await fetchMoviesAdvancedPaginated(params);
      setMovies(result.movies);
      setMoviePagination({
        currentPage: result.currentPage,
        totalPages: result.totalPages,
        totalResults: result.totalResults
      });
    } finally {
      setLoading(false);
    }
  }

  async function getBookRecommendationsPaginated(params: PaginatedBookSearchParams) {
    console.log('🎣 useRecommendations - getBookRecommendationsPaginated called');
    console.log('🎣 Params received in hook:', params);
    console.log('🎣 Authors type:', typeof params.authors);
    console.log('🎣 Authors value:', params.authors);
    console.log('🎣 Authors length:', params.authors?.length);
    
    setLoading(true);
    try {
      const result = await fetchBooksAdvancedPaginated(params);
      setBooks(result.books);
      setBookPagination({
        currentPage: result.currentPage,
        totalPages: result.totalPages,
        totalResults: result.totalResults
      });
    } finally {
      setLoading(false);
    }
  }

  return { 
    movies, 
    books, 
    loading, 
    moviePagination,
    bookPagination,
    getRecommendations, 
    getMovieRecommendations, 
    getBookRecommendations,
    getMovieRecommendationsPaginated,
    getBookRecommendationsPaginated
  };
}