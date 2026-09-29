import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST() {
  try {
    // 1. Limpiar índice existente
    const { error: deleteError } = await supabase
      .from('search_index')
      .delete()
      .neq('id', 0);

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    // 2. Obtener todos los recursos con sus relaciones
    const { data: resources, error: resourcesError } = await supabase
      .from('resource')
      .select(`
        resource_id,
        title,
        publication_year,
        resource_author(author(name)),
        resource_category(category(name)),
        resource_keyword(keyword(keyword))
      `);

    if (resourcesError) {
      return NextResponse.json({ error: resourcesError.message }, { status: 500 });
    }

    // 3. Transformar datos para search_index
    const searchDocuments = resources?.map((resource: any) => ({
      resource_id: resource.resource_id,
      title: resource.title,
      authors: resource.resource_author?.map((ra: any) => ra.author?.name).filter(Boolean) || [],
      categories: resource.resource_category?.map((rc: any) => rc.category?.name).filter(Boolean) || [],
      keywords: resource.resource_keyword?.map((rk: any) => rk.keyword?.keyword).filter(Boolean) || [],
      year: resource.publication_year,
    })) || [];

    // 4. Insertar en lote
    if (searchDocuments.length > 0) {
      const { error: insertError } = await supabase
        .from('search_index')
        .insert(searchDocuments);

      if (insertError) {
        return NextResponse.json({ error: insertError.message }, { status: 500 });
      }
    }

    return NextResponse.json({
      success: true,
      indexed: searchDocuments.length,
      message: `Índice de búsqueda reconstruido con ${searchDocuments.length} documentos`
    });
  } catch (error) {
    console.error('Error building search index:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}