'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface DailyStats {
  date: string;
  total_events: number;
  top_search_terms: Array<{ term: string; count: number }>;
  top_downloads: Array<{ resource_id: number; title: string; count: number }>;
}

export default function StatsPage() {
  const [stats, setStats] = useState<DailyStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/stats');
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link href="/" className="text-gray-600 hover:text-blue-600">← Volver</Link>
          <h1 className="text-xl font-bold text-gray-800 mt-2">Estadísticas</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <p className="text-gray-500">Cargando...</p>
        ) : stats ? (
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                Estadísticas del {new Date(stats.date).toLocaleDateString()}
              </h2>
              <p className="text-3xl font-bold text-blue-600">{stats.total_events} eventos</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg shadow-sm p-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Términos de búsqueda populares</h3>
                <div className="space-y-2">
                  {stats.top_search_terms?.map((item, idx) => (
                    <div key={idx} className="flex justify-between">
                      <span className="text-gray-700">{item.term}</span>
                      <span className="text-gray-500">{item.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Recursos más descargados</h3>
                <div className="space-y-2">
                  {stats.top_downloads?.map((item, idx) => (
                    <div key={idx} className="flex justify-between">
                      <span className="text-gray-700">{item.title}</span>
                      <span className="text-gray-500">{item.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-500">No hay estadísticas disponibles.</p>
        )}
      </main>
    </div>
  );
}
