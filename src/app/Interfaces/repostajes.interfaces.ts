import { Timestamp } from "firebase/firestore";

export default interface Repostajes {
    key: string;
    cantidad: number;
    kilometraje: number;
    fecha: Date;
    estado: boolean;
    imagen: string;
    ruta: string;
    placa: string;
}