'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/MainLayout';
import ResourceCard from '@/components/ResourceCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import EmptyState from '@/components/EmptyState';

interface Resource {
  resource_id: number;
  title: string;
  description?: string;
  publication_year?: number;
  resource_type: string;
  language?: string;
}

const ITEMS_PER_PAGE = 12;

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const router = useRouter();

  const fetchResources = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/resources?skip=${page * ITEMS_PER_PAGE}&limit=${ITEMS_PER_PAGE}`);
      if (!res.ok) throw new Error('Error al cargar recursos');
      const data = await res.json();
      setResources(data);
      setHasMore(data.length === ITEMS_PER_PAGE);
    } catch (err) {
      setError('Error al cargar los recursos. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, [page]);

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Recursos</h1>
          <p className="text-gray-600">Explora nuestra colección completa de recursos digitales</p>
        </div>

        {loading && <LoadingSpinner />}
        {error && <ErrorMessage message={error} />}
        {!loading && !error && resources.length === 0 && (
          <EmptyState
            title="No hay recursos disponibles"
            message="No se encontraron recursos en la biblioteca."
          />
        )}
        {!loading && !error && resources.length > 0 && (
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
                <span className="text-sm text-gray-700 font-medium">Página {page + 1}</span>
                {resources && (
                  <span className="text-sm text-gray-500">({resources.length} recursos)</span>
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
    </MainLayout>
  );
}