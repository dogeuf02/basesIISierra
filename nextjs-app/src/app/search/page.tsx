'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import MainLayout from '@/components/MainLayout';
import SearchBar from '@/components/SearchBar';
import ResourceCard from '@/components/ResourceCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import EmptyState from '@/components/EmptyState';
import { Search, ArrowLeft } from 'lucide-react';

interface SearchResult {
  resource_id: number;
  title: string;
  description?: string;
  publication_year?: number;
  resource_type: string;
  language?: string;
}

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (query) {
      fetchResults();
    }
  }, [query]);

  const fetchResults = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/search?query=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error('Error en la búsqueda');
      const data = await res.json();
      setResults(data);
    } catch (err) {
      setError('Error al buscar recursos. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-4">
      {error && <ErrorMessage message={error} />}
      {results.length === 0 ? (
        <EmptyState
          icon="search"
          title={`No se encontraron resultados para "${query}"`}
          message="Intenta con otros términos de búsqueda o verifica la ortografía."
        />
      ) : (
        <>
          <div className="mb-6">
            <p className="text-gray-600">
              Se encontraron <span className="font-bold text-gray-900">{results.length}</span> resultado{results.length !== 1 ? 's' : ''} para
              <span className="font-bold text-blue-600 ml-1">"{query}"</span>
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((result) => (
              <ResourceCard key={result.resource_id} resource={result} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => window.history.back()}
              className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Resultados de búsqueda</h1>
              {query && <p className="text-gray-600">Mostrando resultados para: <span className="font-medium text-blue-600">"{query}"</span></p>}
            </div>
          </div>
          <div className="max-w-2xl">
            <SearchBar defaultValue={query} className="w-full" />
          </div>
        </div>

        <SearchResults />
      </div>
    </MainLayout>
  );
}