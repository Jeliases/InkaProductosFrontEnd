export interface Ticket{
    mensajeId?: number;
    emisorEmail: string;
    asunto: string;
    contenido: string;
    categoria: string;
    estado?: string;
    fechaEnvio?: string;



}