export interface Producto {
    productoId?: number; 
    nombre: string;
    descripcion: string;
    sku: string;
    precioLista: number;
    stock?: number;
    activo: number;
    categoriaId?: number; 
    cantidadSeleccionada?: number; 
}