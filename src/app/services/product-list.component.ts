import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductoService } from './producto.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './product-list.component.html'
})
export class ProductListComponent implements OnInit {
  productos: any[] = [];
  mostrarInactivos: boolean = false;
  categorias: any[] = [];

  constructor(private productoService: ProductoService) {}

  ngOnInit() {
    this.cargarCategorias();
    this.cargarProductos();
  }

  cargarCategorias() {
    this.productoService.getCategorias().subscribe(res => {
      this.categorias = res;
    });
  }

  getCategoriaNombre(id: number): string {
    if (!id) return 'Sin categoría';
    const cat = this.categorias.find(c => c.categoriaId === id || c.id === id);
    return cat ? cat.nombre : `Categoría ${id}`;
  }

  cargarProductos() {
    const activo = this.mostrarInactivos ? false : true;
    this.productoService.getProductos(activo).subscribe(res => {
      this.productos = res;
    });
  }

  onFiltroChange() {
    this.cargarProductos();
  }

  desactivar(producto: any) {
    if (confirm(`¿Estás seguro de que deseas desactivar el producto '${producto.nombre}'? No podrás seleccionarlo en nuevas transacciones.`)) {
      this.productoService.desactivarProducto(producto.productoId || producto.id).subscribe(() => {
        alert('Producto desactivado exitosamente');
        this.cargarProductos();
      });
    }
  }
}