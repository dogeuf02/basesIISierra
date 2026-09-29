'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import MainLayout from '@/components/MainLayout';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import { Calendar, BookOpen, Globe, Star, User } from 'lucide-react';

interface Resource {
  resource_id: number;
  title: string;
  description?: string;
  publication_year?: number;
  resource_type: string;
  language?: string;
  file_type?: string;
  file_size?: number;
}

interface Review {
  review_id: number;
  resource_id: number;
  user_id: number;
  rating: number;
  comment?: string;
  created_at: string;
}

interface Author {
  author_id: number;
  name: string;
  affiliation?: string;
}

interface Category {
  category_id: number;
  name: string;
}

interface Keyword {
  keyword_id: number;
  keyword: string;
}

export default function ResourceDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  const [resource, setResource] = useState<Resource | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  useEffect(() => {
    fetchResource();
    fetchReviews();
    fetchAuthors();
    fetchCategories();
    fetchKeywords();
  }, [id]);

  const fetchResource = async () => {
    try {
      const res = await fetch(`/api/resources/${id}`);
      if (!res.ok) throw new Error('Recurso no encontrado');
      const data = await res.json();
      setResource(data);
    } catch (err) {
      setError('Recurso no encontrado');
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await fetch(`/api/resources/${id}/reviews`);
      const data = await res.json();
      setReviews(data);
    } catch (err) {
      console.error('Error fetching reviews:', err);
    }
  };

  const fetchAuthors = async () => {
    try {
      const res = await fetch(`/api/resources/${id}/authors`);
      const data = await res.json();
      setAuthors(data);
    } catch (err) {
      console.error('Error fetching authors:', err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch(`/api/resources/${id}/categories`);
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchKeywords = async () => {
    try {
      const res = await fetch(`/api/resources/${id}/keywords`);
      const data = await res.json();
      setKeywords(data);
    } catch (err) {
      console.error('Error fetching keywords:', err);
    }
  };

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch(`/api/resources/${id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: 1, rating, comment }),
      });
      setComment('');
      fetchReviews();
    } catch (err) {
      console.error('Error submitting review:', err);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <LoadingSpinner />
        </div>
      </MainLayout>
    );
  }

  if (error || !resource) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <ErrorMessage message={error || 'Recurso no encontrado'} />
          <button
            onClick={() => router.push('/resources')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Volver a Recursos
          </button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <button
            onClick={() => router.push('/resources')}
            className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Volver a Recursos
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-8">
            <div className="mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                <BookOpen className="h-3 w-3 mr-1" />
                {resource.resource_type}
              </span>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">{resource.title}</h1>

            {resource.description && (
              <p className="text-gray-600 mb-6 text-lg">{resource.description}</p>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-sm text-gray-600">
              {resource.publication_year && (
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-gray-400" />
                  <span>{resource.publication_year}</span>
                </div>
              )}
              {resource.language && (
                <div className="flex items-center">
                  <Globe className="h-5 w-5 mr-2 text-gray-400" />
                  <span>{resource.language}</span>
                </div>
              )}
              {resource.file_type && (
                <div className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2 text-gray-400" />
                  <span>{resource.file_type.toUpperCase()}</span>
                </div>
              )}
              {resource.file_size && (
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-gray-400" />
                  <span>{(resource.file_size / 1024 / 1024).toFixed(2)} MB</span>
                </div>
              )}
            </div>

            {/* Authors */}
            {authors.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <User className="h-5 w-5 mr-2 text-gray-400" />
                  Autores
                </h3>
                <div className="flex flex-wrap gap-2">
                  {authors.map((author) => (
                    <span key={author.author_id} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                      {author.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Categories */}
            {categories.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Categorías</h3>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <span key={cat.category_id} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                      {cat.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Keywords */}
            {keywords.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Palabras Clave</h3>
                <div className="flex flex-wrap gap-2">
                  {keywords.map((kw) => (
                    <span key={kw.keyword_id} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                      {kw.keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Reviews Section */}
          <div className="border-t border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Reseñas</h2>

            <form onSubmit={submitReview} className="mb-8 p-6 bg-gray-50 rounded-lg">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Tu calificación</label>
                <div className="flex items-center gap-4">
                  {[5, 4, 3, 2, 1].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRating(r)}
                      className={`p-2 rounded-lg transition-colors ${
                        rating >= r ? 'bg-yellow-400' : 'bg-gray-200 hover:bg-gray-300'
                      }`}
                    >
                      <Star className={`h-6 w-6 ${rating >= r ? 'text-yellow-600' : 'text-gray-400'}`} fill="currentColor" />
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Comentario (opcional)</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  maxLength={500}
                  placeholder="Escribe tu opinión..."
                />
              </div>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Enviar reseña
              </button>
            </form>

            <div className="space-y-4">
              {reviews.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No hay reseñas aún. ¡Sé el primero en reseñar!</p>
              ) : (
                reviews.map((review) => (
                  <div key={review.review_id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((r) => (
                          <Star
                            key={r}
                            className={`h-5 w-5 ${r <= review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                            fill="currentColor"
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(review.created_at).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                    {review.comment && <p className="text-gray-700">{review.comment}</p>}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}