import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import ResourceCard from '../components/ResourceCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import { resourcesService } from '../services/resources';

const ITEMS_PER_PAGE = 12;

export default function Resources() {
  const [page, setPage] = useState(0);
  const skip = page * ITEMS_PER_PAGE;

  const { data: resources, isLoading, error } = useQuery({
    queryKey: ['resources', 'all', skip],
    queryFn: () => resourcesService.getAll(skip, ITEMS_PER_PAGE),
  });

  // Determinar si hay más páginas basándose en si recibimos menos items de los solicitados
  const hasMore = resources ? resources.length === ITEMS_PER_PAGE : false;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Recursos</h1>
          <p className="text-gray-600">
            Explora nuestra colección completa de recursos digitales
          </p>
        </div>

        {isLoading && <LoadingSpinner />}
        {error && (
          <ErrorMessage message="Error al cargar los recursos. Por favor, intenta de nuevo." />
        )}
        {!isLoading && !error && resources && resources.length === 0 && (
          <EmptyState
            title="No hay recursos disponibles"
            message="No se encontraron recursos en la biblioteca."
          />
        )}
        {!isLoading && !error && resources && resources.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {resources.map((resource) => (
                <ResourceCard key={resource.resource_id} resource={resource} />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center space-x-4 mt-8">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                ← Anterior
              </button>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700 font-medium">
                  Página {page + 1}
                </span>
                {resources && (
                  <span className="text-sm text-gray-500">
                    ({resources.length} recursos)
                  </span>
                )}
              </div>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={!hasMore}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Siguiente →
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
