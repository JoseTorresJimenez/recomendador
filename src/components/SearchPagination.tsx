import React from 'react';

interface SearchPaginationProps {
  currentPage: number;
  totalPages: number;
  totalResults: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  loading?: boolean;
}

export const SearchPagination: React.FC<SearchPaginationProps> = ({
  currentPage,
  totalPages,
  totalResults,
  itemsPerPage,
  onPageChange,
  loading = false
}) => {
  // No mostrar paginación si no hay resultados o solo hay una página
  if (totalPages <= 1) return null;

  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalResults);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages && !loading) {
      onPageChange(newPage);
    }
  };

  // Generar números de página para mostrar (máximo 7)
  const getPageNumbers = () => {
    const pageNumbers: number[] = [];
    
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else if (currentPage <= 4) {
      for (let i = 1; i <= 7; i++) {
        pageNumbers.push(i);
      }
    } else if (currentPage >= totalPages - 3) {
      for (let i = totalPages - 6; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      for (let i = currentPage - 3; i <= currentPage + 3; i++) {
        pageNumbers.push(i);
      }
    }
    
    return pageNumbers;
  };
  return (
    <div className="mt-6 sm:mt-8 bg-white/5 backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/10">
      {/* Statistics */}
      <div className="text-center mb-4 sm:mb-6">
        <p className="text-gray-300 text-sm sm:text-base">
          Mostrando <span className="font-bold text-white">{startIndex}</span> - <span className="font-bold text-white">{endIndex}</span> de{' '}
          <span className="font-bold text-white">{totalResults}</span> resultados
        </p>
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-col gap-3 sm:gap-4">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
          {/* First Page Button - only show for large datasets */}
          {totalPages > 5 && currentPage > 3 && (
            <button
              onClick={() => handlePageChange(1)}
              disabled={loading}
              className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 rounded-xl font-medium transition-all duration-300 text-sm sm:text-base ${
                loading
                  ? 'bg-white/5 text-gray-500 cursor-not-allowed'
                  : 'text-white bg-white/10 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>              <span className="hidden sm:inline">Primera</span>
              <span className="sm:hidden">1ª</span>
            </button>
          )}

          {/* Previous Button */}
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1 || loading}
            className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl font-medium transition-all duration-300 text-sm sm:text-base ${
              currentPage === 1 || loading
                ? 'bg-white/5 text-gray-500 cursor-not-allowed'
                : 'bg-white/10 text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="hidden sm:inline">Anterior</span>
            <span className="sm:hidden">Ant</span>
          </button>

          {/* Page Numbers */}
          <div className="flex items-center gap-1 sm:gap-2">
            {getPageNumbers().map(pageNum => (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                disabled={loading}
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl font-medium transition-all duration-300 text-sm sm:text-base ${
                  currentPage === pageNum
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25'
                    : loading
                    ? 'bg-white/5 text-gray-500 cursor-not-allowed'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white focus:outline-none focus:ring-2 focus:ring-purple-500'
                }`}
              >
                {pageNum}
              </button>
            ))}
          </div>

          {/* Next Button */}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || loading}
            className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl font-medium transition-all duration-300 text-sm sm:text-base ${
              currentPage === totalPages || loading
                ? 'bg-white/5 text-gray-500 cursor-not-allowed'
                : 'bg-white/10 text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500'
            }`}
          >
            <span className="hidden sm:inline">Siguiente</span>
            <span className="sm:hidden">Sig</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Last Page Button - only show for large datasets */}
          {totalPages > 5 && currentPage < totalPages - 2 && (
            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={loading}
              className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 rounded-xl font-medium transition-all duration-300 text-sm sm:text-base ${
                loading
                  ? 'bg-white/5 text-gray-500 cursor-not-allowed'
                  : 'text-white bg-white/10 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500'
              }`}
            >
              <span className="hidden sm:inline">Última</span>
              <span className="sm:hidden">Últ</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>

        {/* Quick navigation for large datasets */}
        {totalPages > 10 && (
          <div className="flex items-center justify-center gap-3 text-sm">
            <span className="text-gray-400">Ir a página:</span>
            <input
              type="number"
              min={1}
              max={totalPages}
              value={currentPage}
              onChange={(e) => {
                const page = parseInt(e.target.value);
                if (page >= 1 && page <= totalPages) {
                  handlePageChange(page);
                }
              }}
              disabled={loading}
              className={`w-16 bg-white/10 border border-white/20 rounded-lg px-2 py-1 text-white text-center focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            />
            <span className="text-gray-400">de {totalPages}</span>
          </div>
        )}

        {/* Loading indicator */}
        {loading && (
          <div className="text-center text-sm text-gray-400">
            <div className="inline-flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
              Cargando resultados...
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
