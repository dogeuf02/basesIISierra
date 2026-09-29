'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/MainLayout';
import SearchBar from '@/components/SearchBar';
import ResourceCard from '@/components/ResourceCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import EmptyState from '@/components/EmptyState';
import { BookOpen, TrendingUp, Users } from 'lucide-react';

interface Resource {
  resource_id: number;
  title: string;
  description?: string;
  publication_year?: number;
  resource_type: string;
  language?: string;
}

export default function HomePage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
      const res = await fetch('/api/resources?limit=6');
      if (!res.ok) throw new Error('Error al cargar recursos');
      const data = await res.json();
      setResources(data);
    } catch (err) {
      setError('Error al cargar los recursos. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6">
            Biblioteca Digital
            <span className="block text-blue-600 mt-2">Universitaria</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Explora nuestra colección digital de recursos académicos, libros, artículos y más
          </p>
          <div className="max-w-2xl mx-auto">
            <SearchBar onSearch={handleSearch} className="w-full" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-lg p-6 shadow-md text-center">
            <BookOpen className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Recursos Digitales</h3>
            <p className="text-gray-600">Accede a miles de libros, artículos y documentos académicos</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-md text-center">
            <TrendingUp className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Búsqueda Avanzada</h3>
            <p className="text-gray-600">Encuentra exactamente lo que necesitas con nuestra herramienta de búsqueda</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-md text-center">
            <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Comunidad</h3>
            <p className="text-gray-600">Comparte reseñas y descubre recursos recomendados por otros usuarios</p>
          </div>
        </div>
      </section>

      {/* Recent Resources Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Recursos Recientes</h2>
          <button
            onClick={() => router.push('/resources')}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Ver todos →
          </button>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((resource) => (
              <ResourceCard key={resource.resource_id} resource={resource} />
            ))}
          </div>
        )}
      </section>
    </MainLayout>
  );
}