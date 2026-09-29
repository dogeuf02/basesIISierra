import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST() {
  try {
    const today = new Date().toISOString().split('T')[0];

    // 1. Obtener logs de hoy
    const { data: logs, error: logsError } = await supabase
      .from('log_events')
      .select('*')
      .gte('timestamp', `${today}T00:00:00.000Z`)
      .lt('timestamp', `${today}T23:59:59.999Z`);

    if (logsError) {
      return NextResponse.json({ error: logsError.message }, { status: 500 });
    }

    const totalEvents = logs?.length || 0;

    // 2. Top términos de búsqueda
    const searchTerms = logs
      ?.filter((log: any) => log.type === 'search' && log.query)
      .map((log: any) => log.query)
      .reduce((acc: Record<string, number>, term: string) => {
        acc[term] = (acc[term] || 0) + 1;
        return acc;
      }, {}) || {};

    const topSearchTerms = Object.entries(searchTerms)
      .sort(([, a]: [string, number], [, b]: [string, number]) => b - a)
      .slice(0, 5)
      .map(([term, count]) => ({ term, count }));

    // 3. Top descargas
    const downloads = logs
      ?.filter((log: any) => log.type === 'download' && log.resource_id)
      .map((log: any) => log.resource_id)
      .reduce((acc: Record<number, number>, id: number) => {
        acc[id] = (acc[id] || 0) + 1;
        return acc;
      }, {}) || {};

    const topDownloadIds = Object.entries(downloads)
      .sort(([, a]: [string, number], [, b]: [string, number]) => b - a)
      .slice(0, 5);

    // Obtener títulos de los recursos más descargados
    const topDownloads = [];
    for (const [resourceId, count] of topDownloadIds) {
      const { data: resource } = await supabase
        .from('resource')
        .select('title')
        .eq('resource_id', parseInt(resourceId))
        .single();

      if (resource) {
        topDownloads.push({
          resource_id: parseInt(resourceId),
          title: resource.title,
          count,
        });
      }
    }

    // 4. Insertar/actualizar estadísticas
    const { error: upsertError } = await supabase
      .from('daily_stats')
      .upsert({
        date: today,
        total_events: totalEvents,
        top_search_terms: topSearchTerms,
        top_downloads: topDownloads,
      });

    if (upsertError) {
      return NextResponse.json({ error: upsertError.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      date: today,
      total_events: totalEvents,
      top_search_terms: topSearchTerms,
      top_downloads: topDownloads,
    });
  } catch (error) {
    console.error('Error generating stats:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}