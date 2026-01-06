import { Component, OnInit } from '@angular/core';
import { InventarioService } from '../../services/inventario.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-inventario',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.css']
})
export class InventarioComponent implements OnInit {

  categorias: any[] = [];
  almacenes: any[] = [];
  productos: any[] = [];

  categoriaId: number | null = null;
  almacenId: number | null = null;

  rol: string = "";

  constructor(
    private invService: InventarioService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.rol = this.auth.getRol();  // ← IMPORTANTE

    this.invService.getCategorias().subscribe(r => this.categorias = r);
    this.invService.getAlmacenes().subscribe(r => this.almacenes = r);
    this.cargarTodos();
  }

  cargarTodos() {
    this.invService.filtrarProductos().subscribe(r => this.productos = r);
  }

  filtrar() {
    this.invService.filtrarProductos(this.categoriaId!, this.almacenId!)
      .subscribe(r => this.productos = r);
  }

  limpiarFiltros() {
    this.categoriaId = null;
    this.almacenId = null;
    this.cargarTodos();
  }
  

  editar(prod: any) {
    alert("Abrir modal de edición para: " + prod.nombre);
  }

  eliminar(id: number) {
    if (!confirm("¿Seguro que deseas eliminar el producto?")) return;

    this.invService.eliminar(id).subscribe(() => {
      this.cargarTodos();
    });
  }

 
  
}
