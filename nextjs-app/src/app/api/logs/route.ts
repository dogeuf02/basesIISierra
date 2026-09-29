import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('user_id');
  const resourceId = searchParams.get('resource_id');

  let query = supabase.from('log_events').select('*');

  if (userId) {
    query = query.eq('user_id', userId);
  } else if (resourceId) {
    query = query.eq('resource_id', resourceId);
  }

  const { data, error } = await query.order('timestamp', { ascending: false }).limit(100);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const { data, error } = await supabase
    .from('log_events')
    .insert({
      type: body.type,
      user_id: body.user_id,
      resource_id: body.resource_id,
      query: body.query,
      metadata: body.metadata || {},
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
