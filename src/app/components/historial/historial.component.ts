import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SolicitudService } from '../../services/solicitud.service';
import { TrasladoService } from '../../services/traslado.service';
import { InventarioService } from '../../services/inventario.service';

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.css']
})
export class HistorialComponent implements OnInit {

  historial: any[] = [];
  rol: string = '';
  email: string = '';
  
  almacenes: any[] = [];
  almacenSeleccionado: number | undefined;

  constructor(
    private auth: AuthService,
    private productService: ProductService,
    private solicitudService: SolicitudService,
    private trasladoService: TrasladoService,
    private inventarioService: InventarioService
  ) {}

  ngOnInit(): void {
    // 1. Obtenemos los datos directamente de los nuevos métodos del AuthService
    this.rol = this.auth.getRol();
    this.email = this.auth.getEmail();

    if (!this.rol) {
      console.warn("No se detectó una sesión activa.");
      return;
    }

    // 2. Lógica de carga según el rol (Adaptado a la nueva estructura)
    
    if (this.rol === 'SUPERVISOR' || this.rol === 'ADMIN') {
      this.cargarAlmacenes();
    } else if (this.rol === 'USUARIO') {
      this.cargarMisSolicitudes();
    } else {
      console.warn("El rol actual no tiene acceso a esta vista o no está soportado:", this.rol);
    }
  }

  cargarAlmacenes() {
    this.inventarioService.getAlmacenes().subscribe({
      next: (data) => {
        this.almacenes = data;
        if (data.length > 0) {
          this.almacenSeleccionado = data[0].almacenId || data[0].id; // Selecciona el primero por defecto
          this.cargarHistorialGeneral();
        }
      },
      error: (err) => console.error("Error cargando almacenes", err)
    });
  }

  /**
   * Carga el Kardex o movimientos del sistema (Solo para SUPERVISOR)
   */
  cargarHistorialGeneral(): void {
    if (!this.almacenSeleccionado) return;
    
    this.trasladoService.getKardexPorAlmacen(this.almacenSeleccionado).subscribe({
      next: (res: any[]) => {
        // Calculamos inteligentemente si fue un ingreso o salida basándonos en los stocks
        this.historial = res.map(m => {
          const stockN = Number(m.stockNuevo);
          const stockA = Number(m.stockAnterior);
          return { 
            ...m, 
            expanded: false,
            esIngreso: stockN >= stockA,
            cantidadAbsoluta: Math.abs(Number(m.cantidadMovida))
          };
        });
      },
      error: (err) => {
        console.error("Error al obtener historial general:", err);
      }
    });
  }

  /**
   * Carga solo las solicitudes del usuario logueado (Solo para USUARIO)
   */
  private cargarMisSolicitudes(): void {
    this.solicitudService.getMisSolicitudes(this.email).subscribe({
      next: (res: any[]) => {
        this.historial = res.map(s => ({ ...s, expanded: false }));
      },
      error: (err) => {
        console.error("Error al obtener mis solicitudes:", err);
      }
    });
  }

  toggle(item: any) {
    item.expanded = !item.expanded;
  }
}