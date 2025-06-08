import React from 'react';
import { useSearchHistory, clearSearchHistory } from '../hooks/useSearchHistory';

function formatFilters(item: any) {
  if (item.type === 'movie' && item.filters.genres) {
    return `Géneros: ${item.filters.genres.join(', ')}`;
  }
  if (item.type === 'book' && item.filters.authors) {
    return `Autores: ${item.filters.authors.join(', ')}`;
  }
  return '';
}

export const HistoryView: React.FC = () => {
  const [type, setType] = React.useState<'movie' | 'book' | ''>('');
  const [query, setQuery] = React.useState('');  const [currentPage, setCurrentPage] = React.useState(1);  const [itemsPerPage, setItemsPerPage] = React.useState(() => {
    // Load saved preference from localStorage
    const saved = localStorage.getItem('historyItemsPerPage');
    return saved ? parseInt(saved) : 10;
  });
  const [isChangingPage, setIsChangingPage] = React.useState(false);
  const [showClearConfirm, setShowClearConfirm] = React.useState(false);
  const { history, loading } = useSearchHistory(type || undefined, query);

  // Calculate pagination
  const totalPages = Math.ceil(history.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = history.slice(startIndex, endIndex);

  // Save itemsPerPage preference to localStorage
  React.useEffect(() => {
    localStorage.setItem('historyItemsPerPage', itemsPerPage.toString());
  }, [itemsPerPage]);
  // Smooth page change effect
  const handlePageChange = (newPage: number) => {
    setIsChangingPage(true);
    setTimeout(() => {
      setCurrentPage(newPage);
      setIsChangingPage(false);
    }, 150);
  };
  // Export history function
  const exportHistory = () => {
    const dataToExport = history.map(item => ({
      tipo: item.type === 'movie' ? 'Película' : 'Libro',
      consulta: item.query,
      filtros: formatFilters(item),
      fecha: new Date(item.timestamp).toLocaleString('es-PE')
    }));

    const csvContent = [
      ['Tipo', 'Consulta', 'Filtros', 'Fecha'].join(','),
      ...dataToExport.map(row => [
        `"${row.tipo}"`,
        `"${row.consulta}"`,
        `"${row.filtros}"`,
        `"${row.fecha}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `historial-busquedas-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };
  // Clear history function
  const clearHistory = async () => {
    try {
      await clearSearchHistory();
      setShowClearConfirm(false);
      // The onSnapshot listener in useSearchHistory will automatically update the UI
    } catch (error) {
      console.error('Error clearing history:', error);
      alert('Error al limpiar el historial. Por favor, inténtalo de nuevo.');
    }
  };
  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [type, query, itemsPerPage]);

  // Keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {        switch (e.key) {
          case 'ArrowLeft':
            e.preventDefault();
            handlePageChange(Math.max(currentPage - 1, 1));
            break;
          case 'ArrowRight':
            e.preventDefault();
            handlePageChange(Math.min(currentPage + 1, totalPages));
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [totalPages]);
  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      {/* Header Section */}
      <div className="text-center mb-8 sm:mb-12">
        <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 mb-4 sm:mb-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg">
          <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3 sm:mb-4 mobile-heading-scale">
          Historial de Búsquedas
        </h2>
        <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto mobile-text-scale">
          Revisa tus búsquedas anteriores y encuentra patrones en tus preferencias
        </p>
      </div>      {/* Filter Controls */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 border border-white/10">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              🎬 Filtrar por tipo
            </label>
            <select
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 h-12 sm:h-auto text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm hover:bg-white/15 touch-target focus-visible-enhanced mobile-text-scale"
              value={type}
              onChange={e => setType(e.target.value as any)}
            >
              <option value="" className="bg-slate-800">Todos los tipos</option>
              <option value="movie" className="bg-slate-800">🎬 Películas</option>
              <option value="book" className="bg-slate-800">📚 Libros</option>
            </select>
          </div>
          <div className="flex-2 lg:flex-3">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              🔍 Buscar en historial
            </label>
            <div className="relative">
              <input
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 pl-12 h-12 sm:h-auto text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm hover:bg-white/15 touch-target focus-visible-enhanced mobile-text-scale"
                placeholder="Buscar por título, género, autor..."
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
              <svg className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>          {/* Export and Clear Buttons */}
          {history.length > 0 && (
            <div className="flex-none">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                🛠️ Acciones
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={exportHistory}
                  className="flex items-center justify-center gap-2 px-3 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-medium hover:from-green-600 hover:to-emerald-600 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 shadow-lg shadow-green-500/25 touch-target focus-visible-enhanced mobile-button-enhanced"
                  title="Exportar historial a CSV"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="hidden sm:inline">CSV</span>
                </button>
                <button
                  onClick={() => setShowClearConfirm(true)}
                  className="flex items-center justify-center gap-2 px-3 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-medium hover:from-red-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-300 shadow-lg shadow-red-500/25 touch-target focus-visible-enhanced mobile-button-enhanced"
                  title="Limpiar todo el historial"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span className="sm:hidden">🗑️</span>
                  <span className="hidden sm:inline">Limpiar</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full animate-spin">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <p className="text-gray-300 text-lg">Cargando historial...</p>
          </div>
        ) : history.length === 0 ? (
          <div className="p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-gray-300 text-lg mb-2">No hay búsquedas registradas</p>
            <p className="text-gray-500">Realiza tu primera búsqueda para ver el historial aquí</p>
          </div>        ) : (
          <div className={`divide-y divide-white/10 transition-opacity duration-300 ${isChangingPage ? 'opacity-50' : 'opacity-100'}`}>
            {currentItems.map((item, i) => (
              <div 
                key={i} 
                className="p-4 sm:p-6 hover:bg-white/5 transition-all duration-300 group"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 sm:mb-3">
                      <span className={`inline-flex items-center px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-semibold transition-all duration-300 group-hover:scale-105 ${
                        item.type === 'movie' 
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25' 
                          : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/25'
                      }`}>
                        {item.type === 'movie' ? '🎬 Película' : '📚 Libro'}
                      </span>
                      <div className="flex-1 h-px bg-gradient-to-r from-white/20 to-transparent"></div>
                    </div>
                    
                    <h3 className="font-bold text-white text-lg sm:text-xl mb-2 group-hover:text-purple-300 transition-colors duration-300 mobile-heading-scale">
                      {item.query}
                    </h3>
                    
                    {formatFilters(item) && (
                      <div className="flex items-center gap-2 text-gray-400 text-sm mobile-text-scale">
                        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        <span className="break-words">{formatFilters(item)}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 sm:gap-3 text-gray-400 mt-2 lg:mt-0">
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm font-medium whitespace-nowrap mobile-text-scale">
                      {new Date(item.timestamp).toLocaleString('es-PE', { 
                        dateStyle: 'short', 
                        timeStyle: 'short' 
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>      {/* Pagination Section */}
      {history.length > 0 && (
        <div className="mt-6 sm:mt-8 bg-white/5 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-white/10">
          {/* Stats */}
          <div className="text-center mb-4 sm:mb-6">
            <p className="text-gray-300 mobile-text-scale">
              Mostrando <span className="font-bold text-white">{startIndex + 1}</span> - <span className="font-bold text-white">{Math.min(endIndex, history.length)}</span> de{' '}
              <span className="font-bold text-white">{history.length}</span> búsquedas
            </p>
          </div>{/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex flex-col gap-4">              {/* Main pagination row */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">                {/* First Page Button */}
                {totalPages > 5 && currentPage > 3 && (
                  <button
                    onClick={() => handlePageChange(1)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl font-medium text-white bg-white/10 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                    </svg>
                    Primera
                  </button>
                )}

                {/* Previous Button */}
                <button
                  onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                  disabled={currentPage === 1}
                  className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl font-medium transition-all duration-300 touch-target focus-visible-enhanced mobile-button-enhanced ${
                    currentPage === 1
                      ? 'bg-white/5 text-gray-500 cursor-not-allowed'
                      : 'bg-white/10 text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <span className="hidden sm:inline">Anterior</span>
                </button>

                {/* Page Numbers */}
                <div className="flex items-center gap-1 sm:gap-2 mobile-scroll overflow-x-auto">
                  {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 7) {
                      pageNum = i + 1;
                    } else if (currentPage <= 4) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 3) {
                      pageNum = totalPages - 6 + i;
                    } else {
                      pageNum = currentPage - 3 + i;
                    }                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-10 h-10 rounded-xl font-medium transition-all duration-300 touch-target focus-visible-enhanced mobile-button-enhanced flex-shrink-0 ${
                          currentPage === pageNum
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25'
                            : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white focus:outline-none focus:ring-2 focus:ring-purple-500'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                {/* Next Button */}
                <button
                  onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl font-medium transition-all duration-300 touch-target focus-visible-enhanced mobile-button-enhanced ${
                    currentPage === totalPages
                      ? 'bg-white/5 text-gray-500 cursor-not-allowed'
                      : 'bg-white/10 text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500'
                  }`}
                >
                  <span className="hidden sm:inline">Siguiente</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {/* Last Page Button */}
                {totalPages > 5 && currentPage < totalPages - 2 && (
                  <button
                    onClick={() => handlePageChange(totalPages)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl font-medium text-white bg-white/10 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                  >
                    Última
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Quick navigation */}
              {totalPages > 10 && (
                <div className="flex items-center justify-center gap-3 text-sm">
                  <span className="text-gray-400">Ir a página:</span>
                  <input
                    type="number"
                    min={1}
                    max={totalPages}
                    value={currentPage}                    onChange={(e) => {
                      const page = parseInt(e.target.value);
                      if (page >= 1 && page <= totalPages) {
                        handlePageChange(page);
                      }
                    }}
                    className="w-16 bg-white/10 border border-white/20 rounded-lg px-2 py-1 text-white text-center focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <span className="text-gray-400">de {totalPages}</span>
                </div>
              )}
            </div>
          )}
          {/* Items per page selector */}
          <div className="flex items-center justify-center gap-3 mt-6 pt-6 border-t border-white/10">
            <span className="text-gray-300 text-sm">Items por página:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                const newItemsPerPage = parseInt(e.target.value);
                setItemsPerPage(newItemsPerPage);
                setCurrentPage(1); // Reset to first page
              }}
              className="bg-white/10 border border-white/20 rounded-lg px-3 py-1 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value={5} className="bg-slate-800">5</option>
              <option value={10} className="bg-slate-800">10</option>
              <option value={20} className="bg-slate-800">20</option>
              <option value={50} className="bg-slate-800">50</option>
            </select>
          </div>
        </div>
      )}      {/* Clear Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 safe-area-top safe-area-bottom">
          <div className="bg-slate-800 border border-white/20 rounded-2xl p-4 sm:p-6 max-w-md w-full mx-4 shadow-2xl mobile-card-shadow">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 mb-4 bg-gradient-to-br from-red-500 to-pink-500 rounded-full">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2 mobile-heading-scale">
                ¿Confirmar eliminación?
              </h3>
              <p className="text-gray-300 mb-4 sm:mb-6 mobile-text-scale">
                Esta acción eliminará todo tu historial de búsquedas de forma permanente. 
                No se puede deshacer.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="px-4 sm:px-6 py-3 bg-white/10 text-white rounded-xl font-medium hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-300 touch-target focus-visible-enhanced mobile-button-enhanced mobile-text-scale"
                >
                  Cancelar
                </button>
                <button
                  onClick={clearHistory}
                  className="px-4 sm:px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-medium hover:from-red-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-300 shadow-lg shadow-red-500/25 touch-target focus-visible-enhanced mobile-button-enhanced mobile-text-scale"
                >
                  Sí, eliminar todo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
