import { Timestamp } from "firebase/firestore";

export default interface Repostaje {
    key: string;
    cantidad: number;
    kilometraje: number;
    fecha: Timestamp;
    estado: boolean;
    imagen: string;
    ruta: string;
    placa: string;
}