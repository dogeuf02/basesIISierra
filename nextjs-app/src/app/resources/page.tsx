'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Resource {
  resource_id: number;
  title: string;
  description?: string;
  publication_year?: number;
  resource_type: string;
}

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const limit = 20;

  useEffect(() => {
    fetchResources();
  }, [page]);

  const fetchResources = async () => {
    try {
      const res = await fetch(`/api/resources?skip=${page * limit}&limit=${limit}`);
      const data = await res.json();
      setResources(data);
    } catch (error) {
      console.error('Error fetching resources:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link href="/" className="text-gray-600 hover:text-blue-600">← Volver</Link>
          <h1 className="text-xl font-bold text-gray-800 mt-2">Recursos</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <p className="text-gray-500">Cargando...</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resources.map((resource) => (
                <Link
                  key={resource.resource_id}
                  href={`/resources/${resource.resource_id}`}
                  className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <h4 className="font-semibold text-gray-800 mb-2">{resource.title}</h4>
                  <p className="text-sm text-gray-500 mb-2">
                    {resource.resource_type} {resource.publication_year && `• ${resource.publication_year}`}
                  </p>
                  {resource.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">{resource.description}</p>
                  )}
                </Link>
              ))}
            </div>

            <div className="flex justify-center gap-4 mt-8">
              <button
                onClick={() => setPage(Math.max(0, page - 1))}
                disabled={page === 0}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md disabled:opacity-50"
              >
                Anterior
              </button>
              <span className="px-4 py-2 text-gray-600">Página {page + 1}</span>
              <button
                onClick={() => setPage(page + 1)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md"
              >
                Siguiente
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
