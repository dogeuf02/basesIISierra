import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query') || '';

  if (query.length < 2) {
    return NextResponse.json({ error: 'Query must be at least 2 characters' }, { status: 400 });
  }

  // Usar búsqueda full-text en search_index
  const { data, error } = await supabase
    .from('search_index')
    .select('*')
    .textSearch('title', query, {
      type: 'websearch',
      config: 'english'
    })
    .limit(20);

  if (error) {
    // Fallback: búsqueda simple en resource
    const { data: fallbackData, error: fallbackError } = await supabase
      .from('resource')
      .select('*, author(name), category(name), keyword(keyword)')
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
      .limit(20);

    if (fallbackError) {
      return NextResponse.json({ error: fallbackError.message }, { status: 500 });
    }

    return NextResponse.json(fallbackData);
  }

  return NextResponse.json(data);
}
