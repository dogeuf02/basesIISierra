import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import { categoriesService } from '../services/categories';
import { Tag } from 'lucide-react';

export default function Categories() {
  const { data: categories, isLoading, error } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesService.getAll(),
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Categorías</h1>
          <p className="text-gray-600">
            Explora los recursos organizados por categorías
          </p>
        </div>

        {isLoading && <LoadingSpinner />}
        {error && (
          <ErrorMessage message="Error al cargar las categorías. Por favor, intenta de nuevo." />
        )}
        {!isLoading && !error && categories && categories.length === 0 && (
          <EmptyState
            title="No hay categorías disponibles"
            message="No se encontraron categorías en la biblioteca."
          />
        )}
        {!isLoading && !error && categories && categories.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Link
                key={category.category_id}
                to={`/categories/${category.category_id}`}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 p-6 group"
              >
                <div className="flex items-center mb-4">
                  <Tag className="h-8 w-8 text-primary-600 mr-3" />
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                    {category.name}
                  </h3>
                </div>
                <p className="text-gray-600">
                  Ver recursos en esta categoría →
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
