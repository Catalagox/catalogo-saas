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
    .maybeSingle();

  if (error) {
    console.error('❌ Error [getRifaActiva]:', {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });
    return null;
  }

  return data as Rifa | null;
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
    console.error('❌ Error [getNumerosOcupados]:', {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
      rifaId,
    });
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
    console.error('❌ Error [registrarParticipante]:', {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
      payload,
    });

    if (error.message.includes('NUMEROS_OCUPADOS')) {
      const nums = error.message.split(':')[1];
      throw new Error(`Los siguientes números ya fueron ocupados: ${nums}`);
    }
    throw new Error(error.message || 'Ocurrió un error al procesar tu selección. Intenta de nuevo.');
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
    console.error('❌ Error [getParticipantesAdmin - Participantes]:', {
      message: pError.message,
      details: pError.details,
      hint: pError.hint,
      code: pError.code,
      rifaId,
    });
    return [];
  }

  const { data: numeros, error: nError } = await supabase
    .from('rifa_numeros')
    .select('numero, participante_id')
    .eq('rifa_id', rifaId);

  if (nError) {
    console.error('❌ Error [getParticipantesAdmin - Números]:', {
      message: nError.message,
      details: nError.details,
      hint: nError.hint,
      code: nError.code,
      rifaId,
    });
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

/**
 * Actualiza los datos de la rifa (Título, Precio, Imagen, Términos, etc.)
 */
export async function actualizarRifa(id: string, datos: Partial<Rifa>): Promise<Rifa> {
  console.log('🔄 Intentando actualizar rifa ID:', id, 'con los datos:', datos);

  const { data, error } = await supabase
    .from('rifas')
    .update(datos)
    .eq('id', id)
    .select()
    .maybeSingle();

  if (error) {
    console.error('❌ Error [actualizarRifa]:', {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
      datosEnviados: datos,
    });
    throw new Error(error.message || 'Error al actualizar la rifa en Supabase');
  }

  if (!data) {
    console.error(`❌ Error [actualizarRifa]: No se devolvió ningún registro tras la actualización para el ID: ${id}. Posible problema de permisos RLS o la fila fue eliminada.`);
    throw new Error(`No se pudo actualizar. Verifica que tengas permisos (RLS) para modificar la tabla 'rifas' o que el ID sea correcto.`);
  }

  console.log('✅ Rifa actualizada exitosamente:', data);
  return data as Rifa;
}

/**
 * Actualiza el estado de pago del participante ('pagado' | 'pendiente') 
 * y sincroniza la tabla 'rifa_numeros'
 */
export async function actualizarEstadoPagoParticipante(
  rifaId: string,
  participanteId: string, 
  estado: 'pagado' | 'pendiente'
) {
  console.log(`🔄 Cambiando estado de pago del participante ${participanteId} a: ${estado}`);

  // 1. Actualizar el registro en rifa_participantes
  const { error: pError } = await supabase
    .from('rifa_participantes')
    .update({ estado_pago: estado })
    .eq('id', participanteId);

  if (pError) {
    console.error('❌ Error [actualizarEstadoPagoParticipante]:', pError);
    throw new Error(pError.message || 'No se pudo actualizar el estado de pago del participante.');
  }

  // 2. Sincronizar el estado de sus números en 'rifa_numeros'
  const nuevoEstadoNumero = estado === 'pagado' ? 'ocupado' : 'reservado';

  const { error: nError } = await supabase
    .from('rifa_numeros')
    .update({ estado: nuevoEstadoNumero })
    .eq('rifa_id', rifaId)
    .eq('participante_id', participanteId);

  if (nError) {
    console.error('❌ Error al sincronizar tabla rifa_numeros:', nError);
    throw new Error(nError.message || 'Se actualizó el participante pero falló la actualización de sus números.');
  }

  console.log(`✅ Estado de pago y números actualizados a '${nuevoEstadoNumero}' correctamente.`);
}

/**
 * Libera/Elimina un número huérfano o específico de la tabla rifa_numeros
 */
export async function liberarNumeroHuerfano(rifaId: string, numero: number) {
  console.log(`🔄 Eliminando número huérfano #${numero} de la rifa ${rifaId}...`);

  const { error } = await supabase
    .from('rifa_numeros')
    .delete()
    .eq('rifa_id', rifaId)
    .eq('numero', numero);

  if (error) {
    console.error('❌ Error [liberarNumeroHuerfano]:', error);
    throw new Error(error.message || 'No se pudo liberar el número huérfano.');
  }

  console.log(`✅ Número #${numero} liberado exitosamente.`);
}

/**
 * Sube una imagen al Storage de Supabase en el bucket 'rifas-imagenes'
 */
export async function subirImagenRifa(file: File, rifaId: string): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${rifaId}-${Date.now()}.${fileExt}`;
  const filePath = `rifas/${fileName}`;

  console.log(`🔄 Subiendo imagen ${fileName} al bucket 'rifas-imagenes'...`);

  const { error: uploadError } = await supabase.storage
    .from('rifas-imagenes')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true,
    });

  if (uploadError) {
    console.error('❌ Error [subirImagenRifa - Upload]:', {
      message: uploadError.message,
      filePath,
      fileType: file.type,
      fileSize: file.size,
    });
    throw new Error(`Error al subir imagen: ${uploadError.message}`);
  }

  const { data } = supabase.storage
    .from('rifas-imagenes')
    .getPublicUrl(filePath);

  console.log('✅ Imagen subida correctamente. URL pública:', data.publicUrl);
  return data.publicUrl;
}

/**
 * Función de Administración: Confirma el pago de un participante vía RPC.
 */
export async function confirmarPagoNumerosParticipante(rifaId: string, participanteId: string) {
  console.log(`🔄 Supabase: Confirmando pago para participante ${participanteId} en rifa ${rifaId}. Actualizando números a 'ocupado'...`);

  const { data, error } = await supabase.rpc('confirmar_pago_participante', {
    p_rifa_id: rifaId,
    p_participante_id: participanteId
  });

  if (error) {
    console.error('❌ Error [confirmarPagoNumerosParticipante]:', {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
      rifaId,
      participanteId,
    });
    throw new Error(error.message || 'Error al actualizar el estado de los números en Supabase.');
  }

  console.log(`✅ Supabase: Números actualizados correctamente a 'ocupado'.`, data);
  return data;
}