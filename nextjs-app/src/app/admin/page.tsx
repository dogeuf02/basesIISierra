'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function AdminPage() {
  const [searchIndexResult, setSearchIndexResult] = useState<string | null>(null);
  const [statsResult, setStatsResult] = useState<string | null>(null);
  const [loading, setLoading] = useState<'search' | 'stats' | null>(null);

  const buildSearchIndex = async () => {
    setLoading('search');
    setSearchIndexResult(null);
    try {
      const res = await fetch('/api/admin/build-search-index', { method: 'POST' });
      const data = await res.json();
      setSearchIndexResult(data.success ? `✅ ${data.message}` : `❌ ${data.error}`);
    } catch (error) {
      setSearchIndexResult(`❌ Error: ${error}`);
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
      setStatsResult(data.success ? `✅ Stats generadas para ${data.date} (${data.total_events} eventos)` : `❌ ${data.error}`);
    } catch (error) {
      setStatsResult(`❌ Error: ${error}`);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link href="/" className="text-gray-600 hover:text-blue-600">← Volver</Link>
          <h1 className="text-xl font-bold text-gray-800 mt-2">Administración</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Índice de Búsqueda</h2>
            <p className="text-gray-600 mb-4">
              Reconstruye el índice de búsqueda full-text desde los recursos de la base de datos.
              Ejecuta esto después de agregar/modificar recursos.
            </p>
            <button
              onClick={buildSearchIndex}
              disabled={loading === 'search'}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading === 'search' ? 'Construyendo...' : 'Construir Índice'}
            </button>
            {searchIndexResult && (
              <p className="mt-4 p-3 bg-gray-50 rounded text-sm">{searchIndexResult}</p>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Estadísticas Diarias</h2>
            <p className="text-gray-600 mb-4">
              Genera estadísticas del día actual basadas en los logs de eventos.
              Se ejecuta automáticamente cada día, pero puedes forzarlo aquí.
            </p>
            <button
              onClick={generateStats}
              disabled={loading === 'stats'}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              {loading === 'stats' ? 'Generando...' : 'Generar Stats'}
            </button>
            {statsResult && (
              <p className="mt-4 p-3 bg-gray-50 rounded text-sm">{statsResult}</p>
            )}
          </div>
        </div>

        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="font-semibold text-yellow-800 mb-2">⚠️ Paso Requerido</h3>
          <p className="text-yellow-700">
            Antes de usar estas funciones, debes crear las tablas en Supabase:
          </p>
          <ol className="list-decimal list-inside mt-2 text-yellow-700 space-y-1">
            <li>Ve a <a href="https://supabase.com/dashboard/project/qwxmzpfakobfjbvyunpt/sql" target="_blank" rel="noopener noreferrer" className="underline">Editor SQL de Supabase</a></li>
            <li>Ejecuta <code>SCRIPTS_DB/scriptCreationSQL.sql</code></li>
            <li>Ejecuta <code>SCRIPTS_DB/scriptSeedSQL.sql</code></li>
            <li>Vuelve aquí y haz clic en "Construir Índice"</li>
          </ol>
        </div>
      </main>
    </div>
  );
}