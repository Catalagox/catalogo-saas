import { supabase } from '@/lib/supabase/client';
import { Rifa, RifaNumero, RifaParticipanteConNumeros, RegistrarParticipantePayload } from './types';

/**
 * Obtener la primera rifa activa para la vista pública
 */
export async function getRifaActiva(): Promise<Rifa | null> {
  const { data, error } = await supabase
    .from('rifas')
    .select('*')
    .eq('estado', 'activa')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error) {
    console.error('Error al obtener la rifa activa:', error);
    return null;
  }

  return data as Rifa;
}

/**
 * Obtener todos los números ocupados/reservados de una rifa
 */
export async function getNumerosOcupados(rifaId: string): Promise<RifaNumero[]> {
  const { data, error } = await supabase
    .from('rifa_numeros')
    .select('id, rifa_id, numero, estado, participante_id, created_at')
    .eq('rifa_id', rifaId);

  if (error) {
    console.error('Error al obtener números:', error);
    return [];
  }

  return data as RifaNumero[];
}

/**
 * Llama a la función de Supabase para registrar participante y reservar números de forma atómica
 */
export async function registrarParticipante(payload: RegistrarParticipantePayload) {
  const { data, error } = await supabase.rpc('registrar_participante_con_numeros', {
    p_rifa_id: payload.rifa_id,
    p_nombre: payload.nombre,
    p_pais: payload.pais,
    p_telefono: payload.telefono,
    p_numeros: payload.numeros,
  });

  if (error) {
    if (error.message.includes('NUMEROS_OCUPADOS')) {
      const nums = error.message.split(':')[1];
      throw new Error(`Los siguientes números ya fueron ocupados: ${nums}`);
    }
    throw new Error('Ocurrió un error al procesar tu selección. Intenta de nuevo.');
  }

  return data;
}

/**
 * Obtiene los participantes y sus números asignados para el panel de administración
 */
export async function getParticipantesAdmin(rifaId: string): Promise<RifaParticipanteConNumeros[]> {
  const { data: participantes, error: pError } = await supabase
    .from('rifa_participantes')
    .select('*')
    .eq('rifa_id', rifaId)
    .order('created_at', { ascending: false });

  if (pError) {
    console.error('Error al obtener participantes:', pError);
    return [];
  }

  const { data: numeros, error: nError } = await supabase
    .from('rifa_numeros')
    .select('numero, participante_id')
    .eq('rifa_id', rifaId);

  if (nError) {
    console.error('Error al obtener números:', nError);
    return [];
  }

  // Agrupar los números asignados por participante
  return participantes.map((p) => {
    const nums = numeros
      .filter((n) => n.participante_id === p.id)
      .map((n) => n.numero);
    return {
      ...p,
      numeros: nums,
    };
  });
}