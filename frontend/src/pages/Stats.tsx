import { useQuery } from '@tanstack/react-query';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { statsService } from '../services/stats';
import { TrendingUp, Search, Download, Calendar } from 'lucide-react';

export default function Stats() {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['stats', 'latest'],
    queryFn: () => statsService.getLatest(),
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Estadísticas</h1>
          <p className="text-gray-600">
            Estadísticas y métricas de la biblioteca digital
          </p>
        </div>

        {isLoading && <LoadingSpinner />}
        {error && (
          <ErrorMessage message="Error al cargar las estadísticas. Por favor, intenta de nuevo." />
        )}

        {!isLoading && !error && stats && (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total de Eventos</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {stats.total_events.toLocaleString()}
                    </p>
                  </div>
                  <TrendingUp className="h-12 w-12 text-primary-600" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Fecha</p>
                    <p className="text-lg font-semibold text-gray-900 mt-2 flex items-center">
                      <Calendar className="h-5 w-5 mr-2" />
                      {new Date(stats.date).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Search Terms */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <Search className="h-6 w-6 mr-2 text-primary-600" />
                Términos de Búsqueda Más Populares
              </h2>
              {stats.top_search_terms && stats.top_search_terms.length > 0 ? (
                <div className="space-y-3">
                  {stats.top_search_terms.slice(0, 10).map((item: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <span className="text-gray-900 font-medium">
                        #{index + 1} {item.term || item}
                      </span>
                      {typeof item === 'object' && item.count && (
                        <span className="text-primary-600 font-semibold">
                          {item.count} búsquedas
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  No hay datos de búsquedas disponibles
                </p>
              )}
            </div>

            {/* Top Downloads */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <Download className="h-6 w-6 mr-2 text-primary-600" />
                Descargas Más Populares
              </h2>
              {stats.top_downloads && stats.top_downloads.length > 0 ? (
                <div className="space-y-3">
                  {stats.top_downloads.slice(0, 10).map((item: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <span className="text-gray-900 font-medium">
                        #{index + 1}{' '}
                        {typeof item === 'object' ? item.title || `Recurso ${item.resource_id}` : item}
                      </span>
                      {typeof item === 'object' && item.count && (
                        <span className="text-primary-600 font-semibold">
                          {item.count} descargas
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  No hay datos de descargas disponibles
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
