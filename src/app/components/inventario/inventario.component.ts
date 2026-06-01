import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InventarioService } from '../../services/inventario.service';

@Component({
  selector: 'app-inventario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.css']
})
export class InventarioComponent implements OnInit {

  productos: any[] = [];
  categorias: any[] = [];
  almacenes: any[] = [];

  categoriaSeleccionada: number | undefined;
  almacenSeleccionado: number | undefined;

  constructor(private inventarioService: InventarioService) { }

  ngOnInit(): void {
    this.cargarCategorias();
    this.cargarAlmacenes();
    this.aplicarFiltros(); // Carga inicial de todos los productos
  }

  cargarCategorias() {
    this.inventarioService.getCategorias().subscribe({
      next: (data) => this.categorias = data,
      error: (err) => console.error('Error cargando categorías', err)
    });
  }

  cargarAlmacenes() {
    this.inventarioService.getAlmacenes().subscribe({
      next: (data) => this.almacenes = data,
      error: (err) => console.error('Error cargando almacenes', err)
    });
  }

  aplicarFiltros() {
    this.inventarioService.filtrarProductos(this.categoriaSeleccionada, this.almacenSeleccionado).subscribe({
      next: (data) => this.productos = data,
      error: (err) => console.error('Error filtrando productos', err)
    });
  }

  limpiarFiltros() {
    this.categoriaSeleccionada = undefined;
    this.almacenSeleccionado = undefined;
    this.aplicarFiltros();
  }
}