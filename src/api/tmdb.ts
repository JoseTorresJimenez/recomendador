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
  crimen: 80,
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
