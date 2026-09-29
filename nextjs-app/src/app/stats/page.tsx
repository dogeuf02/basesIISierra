'use client';

import { useEffect, useState } from 'react';
import MainLayout from '@/components/MainLayout';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import { Calendar, TrendingUp, Search, Download } from 'lucide-react';

interface DailyStats {
  date: string;
  total_events: number;
  top_search_terms: Array<{ term: string; count: number }>;
  top_downloads: Array<{ resource_id: number; title: string; count: number }>;
}

export default function StatsPage() {
  const [stats, setStats] = useState<DailyStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/stats');
      if (!res.ok) throw new Error('Error al cargar estadísticas');
      const data = await res.json();
      setStats(data);
    } catch (err) {
      setError('Error al cargar las estadísticas. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Estadísticas</h1>
          <p className="text-gray-600">Métricas de uso de la biblioteca digital</p>
        </div>

        {loading && <LoadingSpinner />}
        {error && <ErrorMessage message={error} />}
        {stats && (
          <div className="space-y-8">
            {/* Main Stats Card */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  Estadísticas del {new Date(stats.date).toLocaleDateString('es-ES', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </h2>
                <div className="flex items-center text-blue-600">
                  <Calendar className="h-6 w-6 mr-2" />
                  <span className="font-medium">Actualizado hoy</span>
                </div>
              </div>
              <div className="flex items-baseline gap-4">
                <span className="text-5xl font-extrabold text-blue-600">{stats.total_events}</span>
                <span className="text-gray-500">eventos totales</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Top Search Terms */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Search className="h-5 w-5 mr-2 text-blue-600" />
                  Términos de búsqueda más populares
                </h3>
                <div className="space-y-3">
                  {stats.top_search_terms.length > 0 ? (
                    stats.top_search_terms.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <span className="w-6 h-6 flex items-center justify-center bg-blue-100 text-blue-700 rounded-full text-sm font-bold mr-3">
                            {idx + 1}
                          </span>
                          <span className="font-medium text-gray-900">{item.term}</span>
                        </div>
                        <span className="text-gray-500 font-medium">{item.count} búsquedas</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-8">No hay búsquedas registradas hoy</p>
                  )}
                </div>
              </div>

              {/* Top Downloads */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Download className="h-5 w-5 mr-2 text-green-600" />
                  Recursos más descargados
                </h3>
                <div className="space-y-3">
                  {stats.top_downloads.length > 0 ? (
                    stats.top_downloads.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <span className="w-6 h-6 flex items-center justify-center bg-green-100 text-green-700 rounded-full text-sm font-bold mr-3">
                            {idx + 1}
                          </span>
                          <span className="font-medium text-gray-900 truncate max-w-xs">{item.title}</span>
                        </div>
                        <span className="text-gray-500 font-medium">{item.count} descargas</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-8">No hay descargas registradas hoy</p>
                  )}
                </div>
              </div>
            </div>

            {/* Trend Indicator */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Tendencia del día</h3>
                  <p className="text-gray-600">
                    {stats.total_events > 100
                      ? '¡Excelente actividad hoy!'
                      : stats.total_events > 50
                      ? 'Buena actividad en la biblioteca'
                      : 'Actividad moderada, ¡anima a más usuarios a participar!'}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-bold text-blue-600">{stats.total_events}</span>
                  <p className="text-sm text-gray-500">Eventos totales</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}