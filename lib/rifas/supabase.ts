import { supabase } from '@/lib/supabase/client';
import { Rifa, RifaNumero, RifaParticipanteConNumeros, RegistrarParticipantePayload } from './types';

export { supabase };

/**
 * Obtener una rifa por su slug
 */
export async function getRifaPorSlug(slug: string): Promise<Rifa | null> {
  const { data, error } = await supabase
    .from('rifas')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (error) {
    console.error('❌ Error [getRifaPorSlug]:', error);
    return null;
  }

  return data as Rifa | null;
}

/**
 * Obtener las rifas creadas por el usuario autenticado
 */
export async function getMisRifasAdmin(): Promise<Rifa[]> {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from('rifas')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('❌ Error [getMisRifasAdmin]:', error);
    return [];
  }

  return (data as Rifa[]) || [];
}

/**
 * Crea una nueva rifa asociando al usuario en sesión
 */
export async function crearRifa(datos: Partial<Rifa>): Promise<Rifa> {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Debes iniciar sesión para crear una rifa.');
  }

  const { data, error } = await supabase
    .from('rifas')
    .insert([
      {
        ...datos,
        user_id: user.id,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error('❌ Error [crearRifa]:', error);
    throw new Error(error.message || 'Error al crear la rifa');
  }

  return data as Rifa;
}

/**
 * Obtener todos los números ocupados o reservados
 */
export async function getNumerosOcupados(rifaId: string): Promise<RifaNumero[]> {
  const { data, error } = await supabase
    .from('rifa_numeros')
    .select('id, rifa_id, numero, estado, participante_id, created_at')
    .eq('rifa_id', rifaId);

  if (error) {
    console.error('❌ Error [getNumerosOcupados]:', error);
    return [];
  }

  return data as RifaNumero[];
}

/**
 * Registro atómico de participante y selección de números
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
    console.error('❌ Error [registrarParticipante]:', {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });

    const mensajeError = error.message || error.details || '';

    if (mensajeError.includes('NUMEROS_OCUPADOS')) {
      const nums = mensajeError.split(':')[1] || '';
      throw new Error(`Los números elegidos ya se encuentran reservados u ocupados: ${nums}`);
    }

    throw new Error(mensajeError || 'Ocurrió un error al procesar tu selección. Intenta nuevamente.');
  }

  return data;
}

/**
 * Obtener la lista de participantes junto a sus números en el panel admin
 */
export async function getParticipantesAdmin(rifaId: string): Promise<RifaParticipanteConNumeros[]> {
  const { data: participantes, error: pError } = await supabase
    .from('rifa_participantes')
    .select('*')
    .eq('rifa_id', rifaId)
    .order('created_at', { ascending: false });

  if (pError) {
    console.error('❌ Error [getParticipantesAdmin - Participantes]:', pError);
    return [];
  }

  const { data: numeros, error: nError } = await supabase
    .from('rifa_numeros')
    .select('numero, participante_id')
    .eq('rifa_id', rifaId);

  if (nError) {
    console.error('❌ Error [getParticipantesAdmin - Números]:', nError);
    return [];
  }

  return participantes.map((p) => {
    const pIdNormalized = String(p.id).trim().toLowerCase();
    
    const nums = numeros
      .filter((n) => n.participante_id && String(n.participante_id).trim().toLowerCase() === pIdNormalized)
      .map((n) => n.numero);

    return {
      ...p,
      numeros: nums,
    };
  });
}

/**
 * Actualizar rifa por ID
 */
export async function actualizarRifa(id: string, datos: Partial<Rifa>): Promise<Rifa> {
  const { data, error } = await supabase
    .from('rifas')
    .update(datos)
    .eq('id', id)
    .select()
    .maybeSingle();

  if (error) {
    console.error('❌ Error [actualizarRifa]:', error);
    throw new Error(error.message || 'Error al actualizar la rifa.');
  }

  if (!data) {
    throw new Error('No se pudo actualizar la rifa. Verifica tus permisos de acceso.');
  }

  return data as Rifa;
}

/**
 * Cambiar estado de pago de un participante y sincronizar sus números
 */
export async function actualizarEstadoPagoParticipante(
  participanteId: string,
  estado: 'pagado' | 'pendiente',
  rifaId?: string
) {
  const { error: pError } = await supabase
    .from('rifa_participantes')
    .update({ estado_pago: estado })
    .eq('id', participanteId);

  if (pError) {
    throw new Error(pError.message || 'No se pudo actualizar el estado de pago del participante.');
  }

  const nuevoEstadoNumero = estado === 'pagado' ? 'ocupado' : 'reservado';

  let query = supabase
    .from('rifa_numeros')
    .update({ estado: nuevoEstadoNumero })
    .eq('participante_id', participanteId);

  if (rifaId) {
    query = query.eq('rifa_id', rifaId);
  }

  const { error: nError } = await query;

  if (nError) {
    throw new Error(nError.message || 'Error al sincronizar el estado de los números.');
  }
}

/**
 * Liberar un número reservado
 */
export async function liberarNumeroHuerfano(rifaId: string, numero: number) {
  const { error } = await supabase
    .from('rifa_numeros')
    .delete()
    .eq('rifa_id', rifaId)
    .eq('numero', numero);

  if (error) {
    throw new Error(error.message || 'No se pudo liberar el número.');
  }
}

/**
 * Subida de imágenes al bucket 'rifas-imagenes'
 */
export async function subirImagenRifa(file: File, rifaId: string): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${rifaId}-${Date.now()}.${fileExt}`;
  const filePath = `rifas/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('rifas-imagenes')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true,
    });

  if (uploadError) {
    throw new Error(`Error al subir imagen: ${uploadError.message}`);
  }

  const { data } = supabase.storage
    .from('rifas-imagenes')
    .getPublicUrl(filePath);

  return data.publicUrl;
}

/**
 * Iniciar sesión / Registro con OAuth Google
 */
export async function loginConGoogle(redirectTo?: string) {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: redirectTo || `${window.location.origin}/rifas/admin/crear`,
    },
  });

  if (error) {
    throw new Error(error.message || 'Error al conectar con Google');
  }

  return data;
}