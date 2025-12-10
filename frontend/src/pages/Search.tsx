import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import SearchBar from '../components/SearchBar';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import { searchService } from '../services/search';
import { BookOpen, Calendar } from 'lucide-react';
import type { SearchResult } from '../types';

export default function Search() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';

  const { data: results, isLoading, error } = useQuery({
    queryKey: ['search', query],
    queryFn: () => searchService.search(query),
    enabled: !!query && query.trim().length > 0,
  });

  const handleSearch = (newQuery: string) => {
    navigate(`/search?q=${encodeURIComponent(newQuery)}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Búsqueda</h1>
          <div className="max-w-2xl">
            <SearchBar onSearch={handleSearch} defaultValue={query} />
          </div>
        </div>

        {!query && (
          <EmptyState
            icon="search"
            title="Buscar recursos"
            message="Ingresa un término de búsqueda para comenzar"
          />
        )}

        {query && isLoading && <LoadingSpinner />}
        {query && error && (
          <ErrorMessage message="Error al realizar la búsqueda. Por favor, intenta de nuevo." />
        )}
        {query && !isLoading && !error && results && results.length === 0 && (
          <EmptyState
            icon="search"
            title="No se encontraron resultados"
            message={`No se encontraron recursos para "${query}"`}
          />
        )}

        {query && !isLoading && !error && results && results.length > 0 && (
          <>
            <div className="mb-6">
              <p className="text-gray-600">
                Se encontraron <span className="font-semibold">{results.length}</span> resultados
                para "{query}"
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((result: SearchResult) => (
                <Link
                  key={result.resource_id}
                  to={`/resources/${result.resource_id}`}
                  className="block bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 p-6 group"
                >
                  <div className="mb-4">
                    <BookOpen className="h-6 w-6 text-primary-600 mb-2" />
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2">
                      {result.title}
                    </h3>
                  </div>

                  {result.authors && result.authors.length > 0 && (
                    <div className="mb-3">
                      <p className="text-sm text-gray-600 mb-1">Autores:</p>
                      <p className="text-sm text-gray-800 line-clamp-2">
                        {result.authors.join(', ')}
                      </p>
                    </div>
                  )}

                  {result.year && (
                    <div className="flex items-center text-sm text-gray-600 mb-3">
                      <Calendar className="h-4 w-4 mr-1" />
                      {result.year}
                    </div>
                  )}

                  {result.categories && result.categories.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {result.categories.slice(0, 3).map((category, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-primary-100 text-primary-800"
                        >
                          {category}
                        </span>
                      ))}
                    </div>
                  )}

                  {result.keywords && result.keywords.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {result.keywords.slice(0, 3).map((keyword, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700"
                        >
                          #{keyword}
                        </span>
                      ))}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
