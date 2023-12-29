import { Timestamp } from 'firebase/firestore';

export default interface Mantenimientos {
  key: string;
  kilometraje: number;
  proxcambio: number;
  placa: string;
  comentario: string;
  descripcion: string;
  fecha: Date;
/*   fecha: Timestamp; */
  imagen: string;
  imagen2?: string;
  estado: boolean;
}
