export interface Rifa {
  id: string;
  titulo: string;
  descripcion: string | null;
  premio: string;
  imagen_url: string | null;
  precio_numero: number;
  cantidad_numeros: number;
  fecha_sorteo: string;
  estado: 'activa' | 'finalizada' | 'cancelada';
  terminos_condiciones?: string;
  created_at: string;
}

export interface RifaNumero {
  id: string;
  rifa_id: string;
  numero: number;
  estado: 'disponible' | 'reservado' | 'ocupado';
  participante_id: string | null;
  created_at: string;
}

export interface RifaParticipante {
  id: string;
  rifa_id: string;
  nombre: string;
  pais: string;
  telefono: string;
  created_at: string;
}

export interface RifaParticipanteConNumeros extends RifaParticipante {
  numeros: number[];
}

export interface RegistrarParticipantePayload {
  rifa_id: string;
  nombre: string;
  pais: string;
  telefono: string;
  numeros: number[];
}