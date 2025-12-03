import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import ResourceCard from '../components/ResourceCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import { resourcesService } from '../services/resources';
import { BookOpen, TrendingUp, Users } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();

  const { data: resources, isLoading, error } = useQuery({
    queryKey: ['resources', 'recent'],
    queryFn: () => resourcesService.getAll(0, 6),
  });

  const handleSearch = (query: string) => {
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6">
            Biblioteca Digital
            <span className="block text-primary-600 mt-2">Universitaria</span>
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
            <BookOpen className="h-12 w-12 text-primary-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Recursos Digitales</h3>
            <p className="text-gray-600">
              Accede a miles de libros, artículos y documentos académicos
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-md text-center">
            <TrendingUp className="h-12 w-12 text-primary-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Búsqueda Avanzada</h3>
            <p className="text-gray-600">
              Encuentra exactamente lo que necesitas con nuestra herramienta de búsqueda
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-md text-center">
            <Users className="h-12 w-12 text-primary-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Comunidad</h3>
            <p className="text-gray-600">
              Comparte reseñas y descubre recursos recomendados por otros usuarios
            </p>
          </div>
        </div>
      </section>

      {/* Recent Resources Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Recursos Recientes</h2>
          <button
            onClick={() => navigate('/resources')}
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            Ver todos →
          </button>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((resource) => (
              <ResourceCard key={resource.resource_id} resource={resource} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
