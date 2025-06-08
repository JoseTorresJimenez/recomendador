import type { Movie } from '../types/movie';

const TMDB_API_KEY = import.meta.env.VITE_TMDB_KEY!;
const TMDB_BASE = 'https://api.themoviedb.org/3';

// Normaliza cadenas para comparar sin acentos y en minúsculas
const normalize = (s: string) =>
  s
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase();

// Mapeo de nombres de géneros a sus IDs en TMDb
const genreMap: Record<string, number> = {
  accion: 28,
  action: 28,
  animacion: 16,
  animation: 16,
  comedia: 35,
  comedy: 35,
  crimen: 80,
  crime: 80,
  documental: 99,
  documentary: 99,
  drama: 18,
  fantasia: 14,
  fantasy: 14,
  horror: 27,
  terror: 27,
  romance: 10749,
  'ciencia ficcion': 878,
  scifi: 878,
  'science fiction': 878,
  aventura: 12,
  adventure: 12,
  thriller: 53,
  western: 37,
  guerra: 10752,
  war: 10752,
  musical: 10402,
  misterio: 9648,
  mystery: 9648,
  historia: 36,
  history: 36,
  familia: 10751,
  family: 10751
};

/**
 * Obtiene películas basadas en un array de strings que pueden ser IDs o nombres de géneros.
 */
export async function fetchMoviesByGenres(genres: string[]): Promise<Movie[]> {
  // Convertir cada elemento a un ID numérico válido
  const ids = genres
    .map(g => {
      const t = g.trim();
      if (/^\d+$/.test(t)) {
        return Number(t);
      }
      return genreMap[normalize(t)];
    })
    .filter((id): id is number => typeof id === 'number');

  if (ids.length === 0) {
    return [];
  }

  const params = new URLSearchParams({
    api_key: TMDB_API_KEY,
    with_genres: ids.join(','),
    language: 'es-ES',
    sort_by: 'popularity.desc',
    page: '1',
  });

  const response = await fetch(`${TMDB_BASE}/discover/movie?${params}`);
  if (!response.ok) {
    throw new Error(`TMDb API error: ${response.status} ${response.statusText}`);
  }

  const { results } = await response.json();
  return results as Movie[];
}

/**
 * Busca películas por título
 */
export async function fetchMoviesByTitle(title: string): Promise<Movie[]> {
  if (!title.trim()) {
    return [];
  }

  const params = new URLSearchParams({
    api_key: TMDB_API_KEY,
    query: title.trim(),
    language: 'es-ES',
    page: '1',
  });

  const response = await fetch(`${TMDB_BASE}/search/movie?${params}`);
  if (!response.ok) {
    throw new Error(`TMDb API error: ${response.status} ${response.statusText}`);
  }

  const { results } = await response.json();
  return results as Movie[];
}

/**
 * Busca películas por actor/actriz
 */
export async function fetchMoviesByActor(actorName: string): Promise<Movie[]> {
  if (!actorName.trim()) {
    return [];
  }

  try {
    // Primero buscar al actor
    const actorParams = new URLSearchParams({
      api_key: TMDB_API_KEY,
      query: actorName.trim(),
      language: 'es-ES',
    });

    const actorResponse = await fetch(`${TMDB_BASE}/search/person?${actorParams}`);
    if (!actorResponse.ok) {
      throw new Error(`TMDb API error: ${actorResponse.status} ${actorResponse.statusText}`);
    }

    const { results: actors } = await actorResponse.json();
    if (actors.length === 0) {
      return [];
    }

    // Usar el primer actor encontrado
    const actorId = actors[0].id;

    // Buscar películas del actor
    const movieParams = new URLSearchParams({
      api_key: TMDB_API_KEY,
      with_cast: actorId.toString(),
      language: 'es-ES',
      sort_by: 'popularity.desc',
      page: '1',
    });

    const movieResponse = await fetch(`${TMDB_BASE}/discover/movie?${movieParams}`);
    if (!movieResponse.ok) {
      throw new Error(`TMDb API error: ${movieResponse.status} ${movieResponse.statusText}`);
    }

    const { results } = await movieResponse.json();
    return results as Movie[];
  } catch (error) {
    console.error('Error fetching movies by actor:', error);
    return [];
  }
}

/**
 * Función auxiliar para obtener el ID de un actor
 */
async function getActorId(actorName: string): Promise<number | null> {
  if (!actorName.trim()) return null;

  try {
    const params = new URLSearchParams({
      api_key: TMDB_API_KEY,
      query: actorName.trim(),
      language: 'es-ES',
    });

    const response = await fetch(`${TMDB_BASE}/search/person?${params}`);
    if (!response.ok) return null;

    const { results } = await response.json();
    return results.length > 0 ? results[0].id : null;
  } catch (error) {
    console.error('Error getting actor ID:', error);
    return null;
  }
}

/**
 * Función auxiliar para verificar si una película incluye a un actor específico
 */
async function movieHasActor(movieId: number, actorId: number): Promise<boolean> {
  try {
    const response = await fetch(
      `${TMDB_BASE}/movie/${movieId}/credits?api_key=${TMDB_API_KEY}`
    );
    if (!response.ok) return false;

    const { cast } = await response.json();
    return cast.some((castMember: any) => castMember.id === actorId);
  } catch (error) {
    console.error('Error checking movie cast:', error);
    return false;
  }
}

/**
 * Interfaz para parámetros de búsqueda avanzada
 */
export interface AdvancedSearchParams {
  genres?: string[];
  title?: string;
  actor?: string;
}

/**
 * Búsqueda avanzada integrada que combina géneros, título y actor
 */
export async function fetchMoviesAdvanced(searchParams: AdvancedSearchParams): Promise<Movie[]> {
  const { genres = [], title = '', actor = '' } = searchParams;

  const hasGenres = genres.length > 0;
  const hasTitle = title.trim().length > 0;
  const hasActor = actor.trim().length > 0;

  // Si no hay criterios, retornar vacío
  if (!hasGenres && !hasTitle && !hasActor) {
    return [];
  }

  try {
    // CASO 1: Solo título
    if (hasTitle && !hasActor && !hasGenres) {
      return await fetchMoviesByTitle(title);
    }

    // CASO 2: Solo actor
    if (hasActor && !hasTitle && !hasGenres) {
      return await fetchMoviesByActor(actor);
    }

    // CASO 3: Solo géneros
    if (hasGenres && !hasTitle && !hasActor) {
      return await fetchMoviesByGenres(genres);
    }

    // CASO 4: Título + Actor (sin géneros)
    if (hasTitle && hasActor && !hasGenres) {
      const [titleResults, actorResults] = await Promise.all([
        fetchMoviesByTitle(title),
        fetchMoviesByActor(actor)
      ]);

      // Encontrar intersección por ID
      return titleResults.filter(titleMovie =>
        actorResults.some(actorMovie => actorMovie.id === titleMovie.id)
      );
    }

    // CASO 5: Géneros + Actor (sin título)
    if (hasGenres && hasActor && !hasTitle) {
      const actorId = await getActorId(actor);
      if (!actorId) return [];

      const genreIds = genres
        .map(g => {
          const t = g.trim();
          if (/^\d+$/.test(t)) return Number(t);
          return genreMap[normalize(t)];
        })
        .filter((id): id is number => typeof id === 'number');

      if (genreIds.length === 0) return [];

      // Usar discover API con géneros y actor
      const params = new URLSearchParams({
        api_key: TMDB_API_KEY,
        with_cast: actorId.toString(),
        with_genres: genreIds.join(','),
        language: 'es-ES',
        sort_by: 'popularity.desc',
        page: '1',
      });

      const response = await fetch(`${TMDB_BASE}/discover/movie?${params}`);
      if (!response.ok) return [];

      const { results } = await response.json();
      return results as Movie[];
    }

    // CASO 6: Géneros + Título (sin actor)
    if (hasGenres && hasTitle && !hasActor) {
      const titleResults = await fetchMoviesByTitle(title);
      const genreIds = genres
        .map(g => {
          const t = g.trim();
          if (/^\d+$/.test(t)) return Number(t);
          return genreMap[normalize(t)];
        })
        .filter((id): id is number => typeof id === 'number');

      if (genreIds.length === 0) return titleResults;

      // Filtrar por géneros
      return titleResults.filter(movie => {
        if ((movie as any).genre_ids) {
          return (movie as any).genre_ids.some((id: number) => genreIds.includes(id));
        }
        return false;
      });
    }

    // CASO 7: Todos los parámetros (Géneros + Título + Actor)
    if (hasGenres && hasTitle && hasActor) {
      // Estrategia: empezar por título, filtrar por actor, después por géneros
      const titleResults = await fetchMoviesByTitle(title);
      const actorId = await getActorId(actor);
      
      if (!actorId) return [];

      // Filtrar películas que incluyan al actor
      const moviesWithActor: Movie[] = [];
      for (const movie of titleResults) {
        const hasActorInMovie = await movieHasActor(movie.id, actorId);
        if (hasActorInMovie) {
          moviesWithActor.push(movie);
        }
      }

      // Filtrar por géneros
      const genreIds = genres
        .map(g => {
          const t = g.trim();
          if (/^\d+$/.test(t)) return Number(t);
          return genreMap[normalize(t)];
        })
        .filter((id): id is number => typeof id === 'number');

      if (genreIds.length === 0) return moviesWithActor;

      return moviesWithActor.filter(movie => {
        if ((movie as any).genre_ids) {
          return (movie as any).genre_ids.some((id: number) => genreIds.includes(id));
        }
        return false;
      });
    }

    return [];
  } catch (error) {
    console.error('Error in advanced movie search:', error);
    return [];
  }
}

/**
 * Función principal de búsqueda que actúa como wrapper
 */
export async function searchMovies(params: AdvancedSearchParams): Promise<Movie[]> {
  return await fetchMoviesAdvanced(params);
}

// Interfaz para búsqueda paginada
export interface PaginatedSearchParams extends AdvancedSearchParams {
  page?: number;
}

// Interfaz para resultados paginados
export interface PaginatedMovieResults {
  movies: Movie[];
  currentPage: number;
  totalPages: number;
  totalResults: number;
}

/**
 * Búsqueda avanzada paginada de películas
 */
export async function fetchMoviesAdvancedPaginated(searchParams: PaginatedSearchParams): Promise<PaginatedMovieResults> {
  const { genres = [], title = '', actor = '', page = 1 } = searchParams;

  const hasGenres = genres.length > 0;
  const hasTitle = title.trim().length > 0;
  const hasActor = actor.trim().length > 0;

  // Si no hay criterios, retornar vacío
  if (!hasGenres && !hasTitle && !hasActor) {
    return { movies: [], currentPage: 1, totalPages: 0, totalResults: 0 };
  }

  try {
    // Para búsquedas simples, podemos usar la API con paginación directa
    if (hasGenres && !hasTitle && !hasActor) {
      return await fetchMoviesByGenresPaginated(genres, page);
    }

    if (hasTitle && !hasGenres && !hasActor) {
      return await fetchMoviesByTitlePaginated(title, page);
    }

    if (hasActor && !hasTitle && !hasGenres) {
      return await fetchMoviesByActorPaginated(actor, page);
    }

    // Para búsquedas complejas, obtenemos múltiples páginas y las combinamos
    const allMovies = await fetchMoviesAdvanced(searchParams);
    
    // Simulamos paginación con los resultados obtenidos
    const itemsPerPage = 20;
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedMovies = allMovies.slice(startIndex, endIndex);
    
    return {
      movies: paginatedMovies,
      currentPage: page,
      totalPages: Math.ceil(allMovies.length / itemsPerPage),
      totalResults: allMovies.length
    };
  } catch (error) {
    console.error('Error in paginated movie search:', error);
    return { movies: [], currentPage: 1, totalPages: 0, totalResults: 0 };
  }
}

/**
 * Búsqueda paginada por géneros
 */
async function fetchMoviesByGenresPaginated(genres: string[], page: number = 1): Promise<PaginatedMovieResults> {
  const genreIds = genres
    .map(g => {
      const t = g.trim();
      if (/^\d+$/.test(t)) return Number(t);
      return genreMap[normalize(t)];
    })
    .filter((id): id is number => typeof id === 'number');

  if (genreIds.length === 0) {
    return { movies: [], currentPage: 1, totalPages: 0, totalResults: 0 };
  }

  const params = new URLSearchParams({
    api_key: TMDB_API_KEY,
    with_genres: genreIds.join(','),
    language: 'es-ES',
    sort_by: 'popularity.desc',
    page: page.toString(),
  });

  const response = await fetch(`${TMDB_BASE}/discover/movie?${params}`);
  if (!response.ok) {
    return { movies: [], currentPage: 1, totalPages: 0, totalResults: 0 };
  }

  const data = await response.json();
  return {
    movies: data.results as Movie[],
    currentPage: data.page,
    totalPages: Math.min(data.total_pages, 500), // API limit
    totalResults: data.total_results
  };
}

/**
 * Búsqueda paginada por título
 */
async function fetchMoviesByTitlePaginated(title: string, page: number = 1): Promise<PaginatedMovieResults> {
  const params = new URLSearchParams({
    api_key: TMDB_API_KEY,
    query: title,
    language: 'es-ES',
    page: page.toString(),
  });

  const response = await fetch(`${TMDB_BASE}/search/movie?${params}`);
  if (!response.ok) {
    return { movies: [], currentPage: 1, totalPages: 0, totalResults: 0 };
  }

  const data = await response.json();
  return {
    movies: data.results as Movie[],
    currentPage: data.page,
    totalPages: Math.min(data.total_pages, 500), // API limit
    totalResults: data.total_results
  };
}

/**
 * Búsqueda paginada por actor
 */
async function fetchMoviesByActorPaginated(actor: string, page: number = 1): Promise<PaginatedMovieResults> {
  const actorId = await getActorId(actor);
  if (!actorId) {
    return { movies: [], currentPage: 1, totalPages: 0, totalResults: 0 };
  }

  const params = new URLSearchParams({
    api_key: TMDB_API_KEY,
    with_cast: actorId.toString(),
    language: 'es-ES',
    sort_by: 'popularity.desc',
    page: page.toString(),
  });

  const response = await fetch(`${TMDB_BASE}/discover/movie?${params}`);
  if (!response.ok) {
    return { movies: [], currentPage: 1, totalPages: 0, totalResults: 0 };
  }

  const data = await response.json();
  return {
    movies: data.results as Movie[],
    currentPage: data.page,
    totalPages: Math.min(data.total_pages, 500), // API limit
    totalResults: data.total_results
  };
}

// Exportar tipos para compatibilidad
export type { AdvancedSearchParams as MovieSearchParams };
