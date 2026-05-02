import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const { arenaId, action, fingerprint } = await request.json();

  // 1. Obtener la sesión del usuario
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return NextResponse.json({ error: 'ACCESO NO AUTORIZADO' }, { status: 401 });

  const userId = session.user.id;

  // 2. ACCIÓN: INICIAR PROTOCOLO (Descontar PitchX y activar reloj)
  if (action === 'INICIAR_PROTOCOLO') {
    // Obtener perfil y datos de la arena
    const { data: perfil } = await supabase.from('perfiles').select('*').eq('id', userId).single();
    const { data: arena } = await supabase.from('arenas').select('*').eq('id', arenaId).single();

    if (!perfil || !arena) return NextResponse.json({ error: 'DATOS NO ENCONTRADOS' }, { status: 404 });

    // Verificar si ya tiene una predicción activa
    const { data: existente } = await supabase
      .from('predicciones')
      .select('*')
      .eq('jugador_id', userId)
      .eq('arena_id', arenaId)
      .single();

    if (existente) return NextResponse.json({ error: 'CONTRATO YA INICIADO' }, { status: 400 });

    // Verificar Saldo (Regla de los 5 USD / 500 PitchX)
    if (perfil.pitchx_balance < arena.entry_cost) {
      return NextResponse.json({ error: 'SALDO INSUFICIENTE' }, { status: 402 });
    }

    // OPERACIÓN CRÍTICA: Descontar saldo y crear registro de predicción
    const { error: updateError } = await supabase.rpc('iniciar_contrato_calamar', {
      p_user_id: userId,
      p_arena_id: arenaId,
      p_cost: arena.entry_cost,
      p_fingerprint: fingerprint
    });

    if (updateError) return NextResponse.json({ error: 'ERROR EN BÓVEDA' }, { status: 500 });

    return NextResponse.json({ message: 'PROTOCOLO ACTIVADO', startTime: new Date() });
  }

  // 3. ACCIÓN: SELLAR CONTRATO (Enviar predicción final)
  if (action === 'SELLAR_CONTRATO') {
    const { respuestas } = await request.json();

    const { error } = await supabase
      .from('predicciones')
      .update({ respuestas, procesada: false })
      .eq('jugador_id', userId)
      .eq('arena_id', arenaId);

    if (error) return NextResponse.json({ error: 'ERROR AL SELLAR' }, { status: 500 });

    return NextResponse.json({ message: 'CONTRATO SELLADO EXITOSAMENTE' });
  }

  return NextResponse.json({ error: 'ACCIÓN INVÁLIDA' }, { status: 400 });
}