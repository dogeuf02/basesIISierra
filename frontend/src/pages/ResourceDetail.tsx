import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { resourcesService } from '../services/resources';
import {
  Calendar,
  BookOpen,
  Globe,
  User,
  Tag,
  Star,
  ArrowLeft,
  Users,
} from 'lucide-react';
import type { ReviewInput } from '../types';

export default function ResourceDetail() {
  const { id } = useParams<{ id: string }>();
  const resourceId = parseInt(id || '0');
  const queryClient = useQueryClient();
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [userId, setUserId] = useState(1); // En producción, esto vendría de autenticación

  const { data: resource, isLoading, error } = useQuery({
    queryKey: ['resource', resourceId],
    queryFn: () => resourcesService.getById(resourceId),
    enabled: !!resourceId,
  });

  const { data: authors } = useQuery({
    queryKey: ['resource', resourceId, 'authors'],
    queryFn: () => resourcesService.getAuthors(resourceId),
    enabled: !!resourceId,
  });

  const { data: categories } = useQuery({
    queryKey: ['resource', resourceId, 'categories'],
    queryFn: () => resourcesService.getCategories(resourceId),
    enabled: !!resourceId,
  });

  const { data: keywords } = useQuery({
    queryKey: ['resource', resourceId, 'keywords'],
    queryFn: () => resourcesService.getKeywords(resourceId),
    enabled: !!resourceId,
  });

  const { data: reviews } = useQuery({
    queryKey: ['resource', resourceId, 'reviews'],
    queryFn: () => resourcesService.getReviews(resourceId),
    enabled: !!resourceId,
  });

  const reviewMutation = useMutation({
    mutationFn: (review: ReviewInput) => resourcesService.addReview(resourceId, review),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resource', resourceId, 'reviews'] });
      setReviewComment('');
      setReviewRating(5);
    },
  });

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    reviewMutation.mutate({
      user_id: userId,
      rating: reviewRating,
      comment: reviewComment || undefined,
    });
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message="Error al cargar el recurso." />;
  if (!resource) return null;

  const averageRating =
    reviews && reviews.length > 0
      ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
      : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          to="/resources"
          className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Volver a recursos
        </Link>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-primary-100 text-primary-800">
                    <BookOpen className="h-4 w-4 mr-1" />
                    {resource.resource_type}
                  </span>
                  {averageRating > 0 && (
                    <div className="flex items-center">
                      <Star className="h-5 w-5 text-yellow-400 fill-current" />
                      <span className="ml-1 text-gray-700 font-medium">
                        {averageRating.toFixed(1)} ({reviews?.length || 0} reseñas)
                      </span>
                    </div>
                  )}
                </div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">{resource.title}</h1>
              </div>
            </div>

            {resource.description && (
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">{resource.description}</p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {resource.publication_year && (
                <div className="flex items-center text-gray-700">
                  <Calendar className="h-5 w-5 mr-3 text-gray-400" />
                  <span className="font-medium">Año:</span>
                  <span className="ml-2">{resource.publication_year}</span>
                </div>
              )}
              {resource.language && (
                <div className="flex items-center text-gray-700">
                  <Globe className="h-5 w-5 mr-3 text-gray-400" />
                  <span className="font-medium">Idioma:</span>
                  <span className="ml-2">{resource.language}</span>
                </div>
              )}
            </div>

            {authors && authors.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Autores
                </h3>
                <div className="flex flex-wrap gap-2">
                  {authors.map((author) => (
                    <span
                      key={author.author_id}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800"
                    >
                      {author.name}
                      {author.affiliation && (
                        <span className="ml-2 text-xs text-gray-500">
                          ({author.affiliation})
                        </span>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {categories && categories.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <Tag className="h-5 w-5 mr-2" />
                  Categorías
                </h3>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <span
                      key={category.category_id}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800"
                    >
                      {category.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {keywords && keywords.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Palabras clave</h3>
                <div className="flex flex-wrap gap-2">
                  {keywords.map((keyword) => (
                    <span
                      key={keyword.keyword_id}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700"
                    >
                      #{keyword.keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Users className="h-6 w-6 mr-2" />
            Reseñas
          </h2>

          {/* Add Review Form */}
          <form onSubmit={handleSubmitReview} className="mb-8 p-6 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Añadir reseña</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Calificación
              </label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => setReviewRating(rating)}
                    className={`focus:outline-none ${
                      rating <= reviewRating
                        ? 'text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  >
                    <Star className="h-8 w-8 fill-current" />
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comentario (opcional)
              </label>
              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Escribe tu reseña aquí..."
              />
            </div>
            <button
              type="submit"
              disabled={reviewMutation.isPending}
              className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {reviewMutation.isPending ? 'Enviando...' : 'Enviar reseña'}
            </button>
          </form>

          {/* Reviews List */}
          {reviews && reviews.length > 0 ? (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.review_id} className="border-b border-gray-200 pb-6 last:border-0">
                  <div className="flex items-center mb-2">
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <Star
                          key={rating}
                          className={`h-5 w-5 ${
                            rating <= review.rating
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-500">
                      {new Date(review.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  {review.comment && (
                    <p className="text-gray-700 mt-2">{review.comment}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              Aún no hay reseñas para este recurso. ¡Sé el primero en dejar una!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
