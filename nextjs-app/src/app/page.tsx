'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Resource {
  resource_id: number;
  title: string;
  description?: string;
  publication_year?: number;
  resource_type: string;
}

export default function HomePage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      router.push('/login');
    }
  }, [router]);

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const res = await fetch('/api/resources?limit=10');
      const data = await res.json();
      setResources(data);
    } catch (error) {
      console.error('Error fetching resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800">Biblioteca Digital</h1>
          <nav className="flex gap-4">
            <Link href="/" className="text-gray-600 hover:text-blue-600">Inicio</Link>
            <Link href="/resources" className="text-gray-600 hover:text-blue-600">Recursos</Link>
            <Link href="/categories" className="text-gray-600 hover:text-blue-600">Categorías</Link>
            <Link href="/stats" className="text-gray-600 hover:text-blue-600">Estadísticas</Link>
            <button
              onClick={() => {
                localStorage.removeItem('user');
                localStorage.removeItem('token');
                router.push('/login');
              }}
              className="text-red-600 hover:text-red-700"
            >
              Cerrar sesión
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Bienvenido a la Biblioteca Digital Universitaria
          </h2>
          <p className="text-gray-600 mb-8">
            Explora nuestra colección de recursos académicos digitales
          </p>

          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar recursos..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Buscar
              </button>
            </div>
          </form>
        </div>

        <section>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Recursos recientes</h3>
          {loading ? (
            <p className="text-gray-500">Cargando...</p>
          ) : (
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
          )}
        </section>
      </main>
    </div>
  );
}
