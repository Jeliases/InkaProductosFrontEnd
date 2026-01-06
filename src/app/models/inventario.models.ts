export interface Inventario {
    // Coincide con @EmbeddedId en Java
    id: {
      almacenId: number;
      productoId: number;
    };
    // Coincide con las relaciones @ManyToOne
    almacen: {
      almacenId: number;
      nombre: string;
    };
    producto: {
      productoId: number;
      nombre: string;
      sku: string;
      precioLista: number;
      categoria: {
        categoriaId: number;
        nombre: string;
      };
    };

    cantidad: number;
  }