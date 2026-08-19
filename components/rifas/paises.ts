export interface Pais {
  nombre: string;
  codigo: string;
  bandera: string;
}

export const PAISES: Pais[] = [
  { nombre: 'Venezuela', codigo: '+58', bandera: '🇻🇪' },
  { nombre: 'Colombia', codigo: '+57', bandera: '🇨🇴' },
  { nombre: 'Estados Unidos', codigo: '+1', bandera: '🇺🇸' },
  { nombre: 'Argentina', codigo: '+54', bandera: '🇦🇷' },
  { nombre: 'Chile', codigo: '+56', bandera: '🇨🇱' },
  { nombre: 'Perú', codigo: '+51', bandera: '🇵🇪' },
  { nombre: 'Ecuador', codigo: '+593', bandera: '🇪🇨' },
  { nombre: 'España', codigo: '+34', bandera: '🇪🇸' },
  { nombre: 'México', codigo: '+52', bandera: '🇲🇽' },
  { nombre: 'República Dominicana', codigo: '+1', bandera: '🇩🇴' },
  { nombre: 'Panamá', codigo: '+507', bandera: '🇵🇦' },
  { nombre: 'Uruguay', codigo: '+598', bandera: '🇺🇾' },
];