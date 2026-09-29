'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface SearchResult {
  resource_id: number;
  title: string;
  description?: string;
  publication_year?: number;
  resource_type: string;
}

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (query) {
      fetchResults();
    }
  }, [query]);

  const fetchResults = async () => {
    try {
      const res = await fetch(`/api/search?query=${encodeURIComponent(query)}`);
      const data = await res.json();
      setResults(data);
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p className="text-gray-500">Buscando...</p>;
  }

  return (
    <div className="space-y-4">
      {results.length === 0 ? (
        <p className="text-gray-500">No se encontraron resultados para &quot;{query}&quot;</p>
      ) : (
        results.map((result) => (
          <Link
            key={result.resource_id}
            href={`/resources/${result.resource_id}`}
            className="block bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <h4 className="font-semibold text-gray-800 mb-2">{result.title}</h4>
            <p className="text-sm text-gray-500 mb-2">
              {result.resource_type} {result.publication_year && `• ${result.publication_year}`}
            </p>
            {result.description && (
              <p className="text-sm text-gray-600 line-clamp-2">{result.description}</p>
            )}
          </Link>
        ))
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link href="/" className="text-gray-600 hover:text-blue-600">← Volver</Link>
          <h1 className="text-xl font-bold text-gray-800 mt-2">Búsqueda</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <Suspense fallback={<p className="text-gray-500">Cargando...</p>}>
          <SearchResults />
        </Suspense>
      </main>
    </div>
  );
}
