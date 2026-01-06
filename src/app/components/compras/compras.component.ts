import { Component, OnInit } from '@angular/core';
import { ComprasService } from '../../services/compras.service';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-compras',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './compras.component.html',
  styleUrls: ['./compras.component.css']
})
export class ComprasComponent implements OnInit {

  almacenes: any[] = [];
  productosFiltrados: any[] = [];
  carrito: any[] = [];

  origenId: number = 0;
  destinoId: number = 0;

  esAdmin: boolean = false;
  usuarioEmail: string = '';

  constructor(
    private comprasService: ComprasService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.esAdmin = this.auth.getRol() === 'ADMIN';
    this.usuarioEmail = this.auth.getEmail();

    this.cargarData();
  }

  cargarData() {
    this.comprasService.getAlmacenes().subscribe(r => this.almacenes = r);
  }

  // FILTRAR PRODUCTOS SEGÚN ALMACÉN ORIGEN
  filtrarProductos() {
    if (!this.origenId) {
      this.productosFiltrados = [];
      return;
    }

    this.comprasService.filtrarProductos(this.origenId)
      .subscribe(r => this.productosFiltrados = r);
  }

  // AGREGAR AL CARRITO
  agregarAlCarrito(prod: any, cant: number) {
    cant = Number(cant);
    if (cant <= 0) return;

    this.carrito.push({
      productoId: prod.productoId,
      nombre: prod.nombre,
      cantidad: cant,
      sku: prod.sku
    });
  }

  vaciarCarrito() {
    this.carrito = [];
  }

  // CONFIRMAR OPERACIÓN
  confirmarOperacion() {
    if (!this.origenId || !this.destinoId) {
      alert("Debes seleccionar almacén origen y destino.");
      return;
    }

    if (this.origenId === this.destinoId) {
      alert("El origen y destino deben ser distintos.");
      return;
    }

    if (this.carrito.length === 0) {
      alert("No hay productos en el carrito.");
      return;
    }

    const payload = {
      origenId: this.origenId,
      destinoId: this.destinoId,
      usuarioEmail: this.usuarioEmail,
      esAdmin: this.esAdmin,
      items: this.carrito.map(c => ({
        productoId: c.productoId,
        cantidad: c.cantidad
      }))
    };

    // USER → SOLO ENVÍA SOLICITUD
    if (!this.esAdmin) {
      this.comprasService.enviarSolicitud(payload).subscribe({
        next: () => {
          alert("Solicitud enviada al administrador.");
          this.vaciarCarrito();
        },
        error: err => {
          console.error(err);
          alert(err.error?.message || "Error al enviar solicitud.");
        }
      });
      return;
    }

    // ADMIN → REALIZA MOVIMIENTO REAL
    this.comprasService.realizarTransaccion(payload).subscribe({
      next: () => {
        alert("Movimiento realizado con éxito.");
        this.vaciarCarrito();
      },
      error: err => {
        console.error(err);
        alert(err.error?.message || "Error al procesar transacción.");
      }
    });
  }

}
