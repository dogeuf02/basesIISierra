'use client';

import { useState } from 'react';
import MainLayout from '@/components/MainLayout';
import { Database, BarChart3, RefreshCw, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export default function AdminPage() {
  const [searchIndexResult, setSearchIndexResult] = useState<{ success: boolean; message: string } | null>(null);
  const [statsResult, setStatsResult] = useState<{ success: boolean; message: string } | null>(null);
  const [loading, setLoading] = useState<'search' | 'stats' | null>(null);

  const buildSearchIndex = async () => {
    setLoading('search');
    setSearchIndexResult(null);
    try {
      const res = await fetch('/api/admin/build-search-index', { method: 'POST' });
      const data = await res.json();
      setSearchIndexResult({ success: data.success, message: data.message || (data.error ? `Error: ${data.error}` : 'Completado') });
    } catch (error) {
      setSearchIndexResult({ success: false, message: `Error: ${error}` });
    } finally {
      setLoading(null);
    }
  };

  const generateStats = async () => {
    setLoading('stats');
    setStatsResult(null);
    try {
      const res = await fetch('/api/admin/generate-stats', { method: 'POST' });
      const data = await res.json();
      setStatsResult({ success: data.success, message: data.success ? `Stats generadas para ${data.date} (${data.total_events} eventos)` : `Error: ${data.error}` });
    } catch (error) {
      setStatsResult({ success: false, message: `Error: ${error}` });
    } finally {
      setLoading(null);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Panel de Administración</h1>
          <p className="text-gray-600">Herramientas de mantenimiento del sistema</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Build Search Index Card */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Database className="h-8 w-8 text-blue-600" />
              </div>
              <h2 className="ml-4 text-xl font-bold text-gray-900">Índice de Búsqueda</h2>
            </div>
            <p className="text-gray-600 mb-6">
              Reconstruye el índice de búsqueda full-text desde los recursos de la base de datos.
              Ejecuta esto después de agregar, modificar o eliminar recursos.
            </p>
            <button
              onClick={buildSearchIndex}
              disabled={loading === 'search'}
              className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {loading === 'search' ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Construyendo índice...
                </>
              ) : (
                <>
                  <RefreshCw className="h-5 w-5 mr-2" />
                  Construir Índice de Búsqueda
                </>
              )}
            </button>
            {searchIndexResult && (
              <div className={`mt-4 p-3 rounded-lg flex items-center gap-3 ${searchIndexResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                {searchIndexResult.success ? (
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                )}
                <p className={`text-sm ${searchIndexResult.success ? 'text-green-800' : 'text-red-800'}`}>
                  {searchIndexResult.message}
                </p>
              </div>
            )}
          </div>

          {/* Generate Stats Card */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <BarChart3 className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="ml-4 text-xl font-bold text-gray-900">Estadísticas Diarias</h2>
            </div>
            <p className="text-gray-600 mb-6">
              Genera estadísticas del día actual basadas en los logs de eventos (búsquedas, descargas, vistas).
              Se ejecuta automáticamente, pero puedes forzarlo aquí.
            </p>
            <button
              onClick={generateStats}
              disabled={loading === 'stats'}
              className="w-full px-4 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {loading === 'stats' ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Generando estadísticas...
                </>
              ) : (
                <>
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Generar Estadísticas del Día
                </>
              )}
            </button>
            {statsResult && (
              <div className={`mt-4 p-3 rounded-lg flex items-center gap-3 ${statsResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                {statsResult.success ? (
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                )}
                <p className={`text-sm ${statsResult.success ? 'text-green-800' : 'text-red-800'}`}>
                  {statsResult.message}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-3 flex items-center">
            <Database className="h-5 w-5 mr-2" />
            Requisitos previos
          </h3>
          <ol className="list-decimal list-inside space-y-2 text-blue-800">
            <li>Las tablas deben existir en Supabase (ejecutar <code className="bg-blue-100 px-1 rounded">scriptCreationSQL.sql</code> y <code className="bg-blue-100 px-1 rounded">scriptSeedSQL.sql</code> en el <a href="https://supabase.com/dashboard/project/qwxmzpfakobfjbvyunpt/sql" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-700">Editor SQL de Supabase</a>)</li>
            <li>Deshabilitar RLS en todas las tablas tras crearlas</li>
            <li>Ejecutar "Construir Índice de Búsqueda" para poblar la tabla <code className="bg-blue-100 px-1 rounded">search_index</code></li>
            <li>Ejecutar "Generar Estadísticas del Día" para poblar <code className="bg-blue-100 px-1 rounded">daily_stats</code></li>
          </ol>
        </div>
      </div>
    </MainLayout>
  );
}