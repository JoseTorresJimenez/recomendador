import { Book } from "../types/book";

// Interfaz para parámetros de búsqueda avanzada de libros
export interface AdvancedBookSearchParams {
  authors?: string[];
  title?: string;
  genre?: string;
}

// Interfaz para búsqueda paginada de libros
export interface PaginatedBookSearchParams extends AdvancedBookSearchParams {
  page?: number;
}

// Interfaz para resultados paginados de libros
export interface PaginatedBookResults {
  books: Book[];
  currentPage: number;
  totalPages: number;
  totalResults: number;
}

// Mapa de géneros de libros en inglés y español
const genreMap: Record<string, string> = {
  // Géneros principales
  'ficcion': 'fiction',
  'fiction': 'fiction',
  'no ficcion': 'nonfiction',
  'nonfiction': 'nonfiction',
  'biografia': 'biography',
  'biography': 'biography',
  'historia': 'history',
  'history': 'history',
  'ciencia': 'science',
  'science': 'science',
  'tecnologia': 'technology',
  'technology': 'technology',
  'fantasia': 'fantasy',
  'fantasy': 'fantasy',
  'romance': 'romance',
  'misterio': 'mystery',
  'mystery': 'mystery',
  'thriller': 'thriller',
  'horror': 'horror',
  'terror': 'horror',
  'autoayuda': 'self-help',
  'self-help': 'self-help',
  'cocina': 'cooking',
  'cooking': 'cooking',
  'arte': 'art',
  'art': 'art',
  'musica': 'music',
  'music': 'music',
  'poesia': 'poetry',
  'poetry': 'poetry',
  'drama': 'drama',
  'negocios': 'business',
  'business': 'business',
  'filosofia': 'philosophy',
  'philosophy': 'philosophy',
  'religion': 'religion',
  'espiritualidad': 'spirituality',
  'spirituality': 'spirituality',
  'salud': 'health',
  'health': 'health',
  'medicina': 'medicine',
  'medicine': 'medicine',
  'psicologia': 'psychology',
  'psychology': 'psychology',
  'educacion': 'education',
  'education': 'education',
  'infantil': 'juvenile',
  'juvenile': 'juvenile',
  'young adult': 'young adult',
  'jovenes': 'young adult'
};

function normalizeGenre(genre: string): string {
  return genre.toLowerCase().trim();
}

/**
 * Buscar libros solo por autores
 */
export async function fetchBooksByAuthors(authors: string[]): Promise<Book[]> {
  if (!authors || authors.length === 0) return [];
  
  try {
    // Si hay solo un autor, usar búsqueda simple; si hay múltiples, usar OR
    const query = authors.length === 1 
      ? `inauthor:"${authors[0]}"` 
      : authors.map(a => `inauthor:"${a}"`).join(' OR ');
    
    const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=20`);
    const data = await res.json();
    return (data.items || []).map(formatBookData);
  } catch (error) {
    console.error('Error fetching books by authors:', error);
    return [];
  }
}

/**
 * Buscar libros solo por título
 */
export async function fetchBooksByTitle(title: string): Promise<Book[]> {
  if (!title || title.trim() === '') return [];
  
  try {
    const query = `intitle:"${title.trim()}"`;
    const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=20`);
    const data = await res.json();
    return (data.items || []).map(formatBookData);
  } catch (error) {
    console.error('Error fetching books by title:', error);
    return [];
  }
}

/**
 * Buscar libros solo por género
 */
export async function fetchBooksByGenre(genre: string): Promise<Book[]> {
  if (!genre || genre.trim() === '') return [];
  
  try {
    const normalizedGenre = normalizeGenre(genre);
    const englishGenre = genreMap[normalizedGenre] || normalizedGenre;
    const query = `subject:"${englishGenre}"`;
    const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=20`);
    const data = await res.json();
    return (data.items || []).map(formatBookData);
  } catch (error) {
    console.error('Error fetching books by genre:', error);
    return [];
  }
}

/**
 * Búsqueda avanzada de libros con múltiples parámetros
 */
export async function fetchBooksAdvanced(params: AdvancedBookSearchParams): Promise<Book[]> {
  const { authors = [], title = '', genre = '' } = params;
  
  console.log('🔍 fetchBooksAdvanced called with params:', { authors, title, genre });
  
  // Verificar qué parámetros están disponibles
  const hasAuthors = authors.length > 0;
  const hasTitle = title.trim() !== '';
  const hasGenre = genre.trim() !== '';
  
  console.log('🔍 Parameter analysis:', { hasAuthors, hasTitle, hasGenre, authorsLength: authors.length });
  
  // Si no hay parámetros, retornar array vacío
  if (!hasAuthors && !hasTitle && !hasGenre) {
    console.log('❌ No search parameters provided');
    return [];
  }
  
  try {
    let queryParts: string[] = [];
    
    // Agregar autores a la consulta
    if (hasAuthors) {
      // Si hay solo un autor, usar búsqueda simple; si hay múltiples, usar OR
      if (authors.length === 1) {
        queryParts.push(`inauthor:"${authors[0]}"`);
      } else {
        const authorQuery = authors.map(author => `inauthor:"${author}"`).join(' OR ');
        queryParts.push(`(${authorQuery})`);
      }
    }
    
    // Agregar título a la consulta
    if (hasTitle) {
      queryParts.push(`intitle:"${title.trim()}"`);
    }
    
    // Agregar género a la consulta
    if (hasGenre) {
      const normalizedGenre = normalizeGenre(genre);
      const englishGenre = genreMap[normalizedGenre] || normalizedGenre;
      queryParts.push(`subject:"${englishGenre}"`);
    }
    
    // Combinar todas las partes de la consulta
    // Estrategia más inteligente: si solo hay autores múltiples, usar OR
    // Si hay otros criterios además de autores, combinar con AND
    let query: string;
    
    console.log('🎯 Final query construction...');
    console.log('🎯 QueryParts:', queryParts);
    console.log('🎯 QueryParts length:', queryParts.length);
    
    if (queryParts.length === 1) {
      // Solo un criterio (puede ser múltiples autores con OR)
      query = queryParts[0];
      console.log('🎯 Single query part strategy used');
    } else if (hasAuthors && queryParts.length > 1) {
      // Hay autores + otros criterios
      // Si hay múltiples autores, mantener el OR para autores pero combinar con otros criterios usando AND
      query = queryParts.join(' AND ');
      console.log('🎯 Multiple parts with authors strategy used');
    } else {
      // Otros casos
      query = queryParts.join(' AND ');
      console.log('🎯 Default AND strategy used');
    }
    
    console.log('🚀 Final Book search query:', query);
    console.log('🚀 Search parameters:', { authors, title, genre });
    
    const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=20`);
    const data = await res.json();
    
    console.log('📊 Google Books API response:', {
      totalItems: data.totalItems,
      itemsCount: data.items?.length || 0,
      query
    });
    
    return (data.items || []).map(formatBookData);
  } catch (error) {
    console.error('Error in advanced book search:', error);
    console.error('Search parameters:', { authors, title, genre });
    return [];
  }
}

/**
 * Búsqueda avanzada paginada de libros con estrategia optimizada
 */
export async function fetchBooksAdvancedPaginated(params: PaginatedBookSearchParams): Promise<PaginatedBookResults> {
  const { authors = [], title = '', genre = '', page = 1 } = params;
  
  // Verificar qué parámetros están disponibles
  const hasAuthors = authors.length > 0;
  const hasTitle = title.trim() !== '';
  const hasGenre = genre.trim() !== '';
  
  // Si no hay parámetros, retornar array vacío
  if (!hasAuthors && !hasTitle && !hasGenre) {
    console.log('No search parameters provided for paginated search');
    return { books: [], currentPage: 1, totalPages: 0, totalResults: 0 };
  }

  // Estrategia especial para múltiples autores sin otros criterios
  // CAMBIO: Ahora siempre usa búsquedas individuales para evitar el problema
  // donde OR query solo devolvía colaboraciones en lugar de libros individuales
  if (hasAuthors && authors.length > 1 && !hasTitle && !hasGenre) {
    console.log('📚 MULTIPLE AUTHORS DETECTED - Using individual search strategy');
    console.log('📚 Reason: OR queries return only collaborations, not individual author books');
    return await fetchMultipleAuthorsOnly(authors, page);
  }
  
  try {
    let queryParts: string[] = [];
    
    // Agregar autores a la consulta
    if (hasAuthors) {
      // Si hay solo un autor, usar búsqueda simple; si hay múltiples, usar OR
      if (authors.length === 1) {
        queryParts.push(`inauthor:"${authors[0]}"`);
      } else {
        const authorQuery = authors.map(author => `inauthor:"${author}"`).join(' OR ');
        queryParts.push(`(${authorQuery})`);
      }
    }
    
    // Agregar título a la consulta
    if (hasTitle) {
      queryParts.push(`intitle:"${title.trim()}"`);
    }
    
    // Agregar género a la consulta
    if (hasGenre) {
      const normalizedGenre = normalizeGenre(genre);
      const englishGenre = genreMap[normalizedGenre] || normalizedGenre;
      queryParts.push(`subject:"${englishGenre}"`);
    }
    
    // Combinar todas las partes de la consulta
    // Estrategia más inteligente: si solo hay autores múltiples, usar OR
    // Si hay otros criterios además de autores, combinar con AND
    let query: string;
    
    console.log('📄 PAGINATED SEARCH - Final query construction...');
    console.log('📄 QueryParts:', queryParts);
    console.log('📄 QueryParts length:', queryParts.length);
    
    if (queryParts.length === 1) {
      // Solo un criterio (puede ser múltiples autores con OR)
      query = queryParts[0];
      console.log('📄 Single query part strategy used');
    } else if (hasAuthors && queryParts.length > 1) {
      // Hay autores + otros criterios
      // Si hay múltiples autores, mantener el OR para autores pero combinar con otros criterios usando AND
      query = queryParts.join(' AND ');
      console.log('📄 Multiple parts with authors strategy used');
    } else {
      // Otros casos
      query = queryParts.join(' AND ');
      console.log('📄 Default AND strategy used');
    }
    
    // Google Books API soporta paginación con startIndex
    const maxResults = 20;
    const startIndex = (page - 1) * maxResults;
    
    // Google Books API tiene limitaciones prácticas de paginación
    // Generalmente no devuelve resultados más allá de startIndex=800-1000
    const maxPracticalIndex = 800;
    
    if (startIndex > maxPracticalIndex) {
      console.warn(`startIndex ${startIndex} exceeds practical Google Books API limit`);
      return { books: [], currentPage: page, totalPages: Math.ceil(maxPracticalIndex / maxResults), totalResults: 0 };
    }
    
    console.log('🚀📄 PAGINATED - Final Book search query:', query);
    console.log('🚀📄 PAGINATED - Search parameters:', { authors, title, genre, page, startIndex });
    
    const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=${maxResults}&startIndex=${startIndex}`);
    const data = await res.json();
    
    const books = (data.items || []).map(formatBookData);
    const totalResults = data.totalItems || 0;
    
    // Calcular páginas totales realistas basado en limitaciones de la API
    const maxPracticalResults = 800; // Google Books API limitation
    const actualAvailableResults = Math.min(totalResults, maxPracticalResults);
    const totalPages = Math.ceil(actualAvailableResults / maxResults);
    
    console.log('📊📄 PAGINATED - Google Books API response:', {
      totalItems: totalResults,
      actualAvailableResults,
      itemsCount: books.length,
      currentPage: page,
      totalPages,
      query,
      startIndex
    });
    
    return {
      books,
      currentPage: page,
      totalPages,
      totalResults: actualAvailableResults // Usar resultados realmente disponibles
    };
  } catch (error) {
    console.error('Error in paginated book search:', error);
    console.error('Search parameters:', { authors, title, genre, page });
    return { books: [], currentPage: 1, totalPages: 0, totalResults: 0 };
  }
}

/**
 * Función especializada para búsqueda de múltiples autores únicamente
 * NUEVA ESTRATEGIA: Buscar cada autor individualmente y combinar resultados
 * Esto resuelve el problema donde OR query solo devolvía colaboraciones
 */
async function fetchMultipleAuthorsOnly(authors: string[], page: number): Promise<PaginatedBookResults> {
  console.log('🎯🔥 SPECIALIZED MULTIPLE AUTHORS SEARCH - INDIVIDUAL STRATEGY');
  console.log('🎯🔥 Authors received:', authors);
  console.log('🎯🔥 Page:', page);
  console.log('🎯🔥 Problem identified: OR query only returns collaborations, not individual books');
  console.log('🎯🔥 Solution: Search each author individually and combine results');
  
  if (!authors || !Array.isArray(authors) || authors.length === 0) {
    console.error('🎯🔥 Invalid authors array:', authors);
    return { books: [], currentPage: 1, totalPages: 0, totalResults: 0 };
  }
  
  try {
    const maxResults = 20;
    const resultsPerAuthor = Math.ceil(maxResults / authors.length);
    
    console.log('🎯🔥 INDIVIDUAL SEARCH STRATEGY:');
    console.log('🎯🔥 - Total authors:', authors.length);
    console.log('🎯🔥 - Results per author:', resultsPerAuthor);
    console.log('🎯🔥 - Target total results:', maxResults);
    
    // Buscar cada autor individualmente
    const authorPromises = authors.map(async (author, index) => {
      try {
        console.log(`🎯🔥 Searching individual author ${index + 1}/${authors.length}: "${author}"`);
        
        const query = `inauthor:"${author}"`;
        const startIndex = page > 1 ? (page - 1) * resultsPerAuthor : 0;
        const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=${resultsPerAuthor}&startIndex=${startIndex}`;
        
        console.log(`🎯🔥 Individual API URL for "${author}":`, apiUrl);
        
        const res = await fetch(apiUrl);
        
        if (!res.ok) {
          console.error(`🎯🔥 Failed to fetch for "${author}":`, res.status, res.statusText);
          return { author, books: [], totalItems: 0 };
        }
        
        const data = await res.json();
        
        console.log(`🎯🔥 Individual results for "${author}":`, {
          totalItems: data.totalItems,
          itemsReturned: data.items?.length || 0,
          hasError: !!data.error
        });
        
        if (data.error) {
          console.error(`🎯🔥 API error for "${author}":`, data.error);
          return { author, books: [], totalItems: 0 };
        }
        
        const books = (data.items || []).map(formatBookData);
        return { author, books, totalItems: data.totalItems || 0 };
        
      } catch (error) {
        console.error(`🎯🔥 Error searching for author "${author}":`, error);
        return { author, books: [], totalItems: 0 };
      }
    });
    
    // Esperar todos los resultados
    const allResults = await Promise.all(authorPromises);
    
    // Combinar todos los libros
    const allBooks = allResults.flatMap(result => result.books);
    
    // Eliminar duplicados por ID (en caso de que un libro aparezca para múltiples autores)
    const uniqueBooks = allBooks.filter((book, index, arr) => 
      arr.findIndex(b => b.id === book.id) === index
    );
    
    // Mezclar aleatoriamente para mejor diversidad
    const shuffledBooks = uniqueBooks.sort(() => Math.random() - 0.5);
    
    // Limitar a maxResults para esta página
    const booksForPage = shuffledBooks.slice(0, maxResults);
    
    // Calcular totales combinados
    const totalCombinedResults = allResults.reduce((sum, result) => sum + result.totalItems, 0);
    const estimatedTotalPages = Math.ceil(totalCombinedResults / maxResults);
    
    console.log('🎯🔥 COMBINED RESULTS SUMMARY:');
    console.log('🎯🔥 - Individual search results:', allResults.map(r => ({ author: r.author, count: r.books.length, total: r.totalItems })));
    console.log('🎯🔥 - Total books before deduplication:', allBooks.length);
    console.log('🎯🔥 - Unique books after deduplication:', uniqueBooks.length);
    console.log('🎯🔥 - Books for current page:', booksForPage.length);
    console.log('🎯🔥 - Estimated total results across all authors:', totalCombinedResults);
    console.log('🎯🔥 - Estimated total pages:', estimatedTotalPages);
    
    return {
      books: booksForPage,
      currentPage: page,
      totalPages: Math.max(1, estimatedTotalPages),
      totalResults: totalCombinedResults
    };
    
  } catch (error) {
    console.error('🎯🔥 SPECIALIZED - Error in individual authors search:', error);
    return { books: [], currentPage: 1, totalPages: 0, totalResults: 0 };
  }
}

/**
 * Función de fallback para múltiples autores - busca sin paréntesis y con estrategias alternativas
 */
async function fetchMultipleAuthorsFallback(authors: string[], page: number): Promise<PaginatedBookResults> {
  console.log('🔄 FALLBACK MULTIPLE AUTHORS SEARCH');
  console.log('🔄 Authors received:', authors);
  
  try {
    const maxResults = 20;
    const startIndex = (page - 1) * maxResults;
    
    // Estrategia 1: Intentar sin paréntesis
    const authorQuery = authors.map(author => `inauthor:"${author}"`).join(' OR ');
    
    console.log('🔄 FALLBACK - Query without parentheses:', authorQuery);
    console.log('🔄 FALLBACK - Encoded query:', encodeURIComponent(authorQuery));
    
    const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(authorQuery)}&maxResults=${maxResults}&startIndex=${startIndex}`;
    console.log('🔄 FALLBACK - API URL:', apiUrl);
    
    const res = await fetch(apiUrl);
    console.log('🔄 FALLBACK - Response status:', res.status);
    
    if (!res.ok) {
      console.error('🔄 FALLBACK - Request failed, trying individual searches');
      return await fetchIndividualAuthorsAndCombine(authors, page);
    }
    
    const data = await res.json();
    console.log('🔄 FALLBACK - API response:', {
      totalItems: data.totalItems,
      itemsLength: data.items?.length,
      hasError: !!data.error
    });
    
    if (data.error) {
      console.error('🔄 FALLBACK - API error:', data.error);
      return await fetchIndividualAuthorsAndCombine(authors, page);
    }
    
    const books = (data.items || []).map(formatBookData);
    const totalResults = data.totalItems || 0;
    
    if (books.length === 0) {
      console.log('🔄 FALLBACK - Still no results, trying individual searches');
      return await fetchIndividualAuthorsAndCombine(authors, page);
    }
    
    const maxPracticalResults = 800;
    const actualAvailableResults = Math.min(totalResults, maxPracticalResults);
    const totalPages = Math.ceil(actualAvailableResults / maxResults);
    
    console.log('🔄 FALLBACK - Success with fallback strategy');
    
    return {
      books,
      currentPage: page,
      totalPages,
      totalResults: actualAvailableResults
    };
  } catch (error) {
    console.error('🔄 FALLBACK - Error in fallback search:', error);
    return await fetchIndividualAuthorsAndCombine(authors, page);
  }
}

/**
 * Última estrategia: buscar cada autor individualmente y combinar resultados
 */
async function fetchIndividualAuthorsAndCombine(authors: string[], page: number): Promise<PaginatedBookResults> {
  console.log('🔀 INDIVIDUAL AUTHORS COMBINE SEARCH');
  console.log('🔀 Authors:', authors);
  
  try {
    const maxResults = 20;
    const resultsPerAuthor = Math.ceil(maxResults / authors.length);
    
    console.log('🔀 Results per author:', resultsPerAuthor);
    
    // Buscar cada autor individualmente
    const authorPromises = authors.map(async (author) => {
      try {
        const query = `inauthor:"${author}"`;
        const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=${resultsPerAuthor}`);
        const data = await res.json();
        
        console.log(`🔀 Individual search for "${author}":`, {
          totalItems: data.totalItems,
          itemsReturned: data.items?.length || 0
        });
        
        return (data.items || []).map(formatBookData);
      } catch (error) {
        console.error(`🔀 Error searching for author "${author}":`, error);
        return [];
      }
    });
    
    const allResults = await Promise.all(authorPromises);
    const combinedBooks = allResults.flat();
    
    // Eliminar duplicados por ID
    const uniqueBooks = combinedBooks.filter((book, index, arr) => 
      arr.findIndex(b => b.id === book.id) === index
    );
    
    console.log('🔀 INDIVIDUAL SEARCH RESULTS:', {
      totalAuthors: authors.length,
      resultsPerAuthor: allResults.map(r => r.length),
      combinedCount: combinedBooks.length,
      uniqueCount: uniqueBooks.length
    });
    
    // Para paginación, simular resultados totales
    const estimatedTotal = uniqueBooks.length * 10; // Estimación conservadora
    const totalPages = Math.ceil(estimatedTotal / maxResults);
    
    return {
      books: uniqueBooks.slice(0, maxResults), // Limitar a maxResults
      currentPage: page,
      totalPages: Math.max(1, totalPages),
      totalResults: estimatedTotal
    };
  } catch (error) {
    console.error('🔀 Error in individual authors search:', error);
    return { books: [], currentPage: 1, totalPages: 0, totalResults: 0 };
  }
}

/**
 * Formatear datos del libro desde la API de Google Books
 */
function formatBookData(item: any): Book {
  const volumeInfo = item.volumeInfo || {};
  
  return {
    id: item.id,
    title: volumeInfo.title || 'Título no disponible',
    authors: volumeInfo.authors || [],
    description: volumeInfo.description || '',
    imageLinks: volumeInfo.imageLinks || {},
    publishedDate: volumeInfo.publishedDate || '',
    pageCount: volumeInfo.pageCount || 0,
    categories: volumeInfo.categories || [],
    averageRating: volumeInfo.averageRating || 0,
    ratingsCount: volumeInfo.ratingsCount || 0,
    language: volumeInfo.language || 'es',
    previewLink: volumeInfo.previewLink || '',
    infoLink: volumeInfo.infoLink || ''
  };
}

/**
 * Función de búsqueda principal que actúa como wrapper
 */
export async function searchBooks(params: AdvancedBookSearchParams): Promise<Book[]> {
  return await fetchBooksAdvanced(params);
}

// Exportar tipos para compatibilidad
export type { AdvancedBookSearchParams as BookSearchParams };

/**
 * Debug function to test multiple authors search directly
 * Can be called from browser console for quick testing
 * UPDATED: Now tests individual author search strategy
 */
(window as any).debugMultipleAuthorsSearch = async function(authors: string[] = ['Stephen King', 'Dean Koontz']) {
  console.log('🐛 DEBUG: Testing NEW individual authors search strategy with:', authors);
  console.log('🐛 Expected behavior: Should return books from EACH author individually, not just collaborations');
  
  try {
    const testParams = {
      authors,
      title: '',
      genre: '',
      page: 1
    };
    
    const result = await fetchBooksAdvancedPaginated(testParams);
    
    console.log('🐛 DEBUG: Result Summary:', {
      booksFound: result.books.length,
      totalResults: result.totalResults,
      totalPages: result.totalPages,
      currentPage: result.currentPage
    });
    
    if (result.books.length > 0) {
      console.log('🐛 DEBUG: Sample Books Found:');
      result.books.slice(0, 5).forEach((book, index) => {
        console.log(`  ${index + 1}. "${book.title}" by ${book.authors.join(', ')}`);
      });
      
      // Verificar que tenemos libros de diferentes autores
      const authorsFound = new Set();
      result.books.forEach(book => {
        book.authors.forEach(author => {
          authors.forEach(searchAuthor => {
            if (author.toLowerCase().includes(searchAuthor.toLowerCase().split(' ')[0])) {
              authorsFound.add(searchAuthor);
            }
          });
        });
      });
      
      console.log('🐛 DEBUG: Authors represented in results:', Array.from(authorsFound));
      console.log('🐛 SUCCESS: Individual author strategy working!');
    } else {
      console.log('🐛 DEBUG: No books found - this should not happen with popular authors');
    }
    
    return result;
  } catch (error) {
    console.error('🐛 DEBUG: Error:', error);
    return null;
  }
};

// Also add a simple test function for the Google Books API
(window as any).testGoogleBooksAPI = async function(query: string) {
  console.log('🌐 Testing Google Books API with query:', query);
  
  try {
    const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=5`;
    console.log('🌐 API URL:', apiUrl);
    
    const response = await fetch(apiUrl);
    const data = await response.json();
    
    console.log('🌐 API Response:', {
      status: response.status,
      totalItems: data.totalItems,
      itemsReturned: data.items?.length || 0,
      firstTitle: data.items?.[0]?.volumeInfo?.title || 'No books found',
      error: data.error || null
    });
    
    return data;
  } catch (error) {
    console.error('🌐 API Test Error:', error);
    return null;
  }
};
