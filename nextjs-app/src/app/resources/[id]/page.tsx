'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

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

export default function ResourceDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [resource, setResource] = useState<Resource | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  useEffect(() => {
    fetchResource();
    fetchReviews();
  }, [id]);

  const fetchResource = async () => {
    try {
      const res = await fetch(`/api/resources/${id}`);
      const data = await res.json();
      setResource(data);
    } catch (error) {
      console.error('Error fetching resource:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await fetch(`/api/resources/${id}/reviews`);
      const data = await res.json();
      setReviews(data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
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
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Cargando...</div>;
  }

  if (!resource) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Recurso no encontrado</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link href="/resources" className="text-gray-600 hover:text-blue-600">← Volver a recursos</Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">{resource.title}</h1>
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
            <div><span className="font-medium">Tipo:</span> {resource.resource_type}</div>
            {resource.publication_year && <div><span className="font-medium">Año:</span> {resource.publication_year}</div>}
            {resource.language && <div><span className="font-medium">Idioma:</span> {resource.language}</div>}
            {resource.file_type && <div><span className="font-medium">Archivo:</span> {resource.file_type}</div>}
          </div>
          {resource.description && (
            <p className="text-gray-700">{resource.description}</p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Reseñas</h2>
          
          <form onSubmit={submitReview} className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Calificación</label>
              <select
                value={rating}
                onChange={(e) => setRating(parseInt(e.target.value))}
                className="px-3 py-2 border border-gray-300 rounded-md"
              >
                {[5, 4, 3, 2, 1].map((r) => (
                  <option key={r} value={r}>{r} estrella{r > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Comentario</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                rows={3}
                maxLength={500}
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Enviar reseña
            </button>
          </form>

          <div className="space-y-4">
            {reviews.length === 0 ? (
              <p className="text-gray-500">No hay reseñas aún.</p>
            ) : (
              reviews.map((review) => (
                <div key={review.review_id} className="p-4 border-b border-gray-100">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-yellow-500">{'★'.repeat(review.rating)}</span>
                    <span className="text-sm text-gray-500">
                      {new Date(review.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  {review.comment && <p className="text-gray-700">{review.comment}</p>}
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
