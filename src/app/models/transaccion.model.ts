export interface ItemCarrito {
    productoId: number;
    sku: string;       
    nombre: string;    
    cantidadSeleccionada: number;
  }
  
  export interface TransaccionRequest {
    origenId: number;
    destinoId: number;
    usuarioEmail: string;
    esAdmin: boolean;
    items: { productoId: number; cantidad: number }[];
  }