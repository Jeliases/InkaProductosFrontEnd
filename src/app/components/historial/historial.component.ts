import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.css']
})
export class HistorialComponent implements OnInit {

  historial: any[] = [];
  rol: string = '';
  email: string = '';

  constructor(
    private auth: AuthService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    // 1. Obtenemos los datos directamente de los nuevos métodos del AuthService
    this.rol = this.auth.getRol();
    this.email = this.auth.getEmail();

    if (!this.rol) {
      console.warn("No se detectó una sesión activa.");
      return;
    }

    // 2. Lógica de carga según el rol profesional (ADMIN, USER, TI)
    // El método getRol() ya nos devuelve el nombre limpio sin "ROLE_"
    
    if (this.rol === 'ADMIN') {
      this.cargarHistorialGeneral();
    } else if (this.rol === 'USER') {
      this.cargarMisSolicitudes();
    } else {
      console.warn("El rol actual no tiene acceso a esta vista o no está soportado:", this.rol);
    }
  }

  /**
   * Carga todos los movimientos del sistema (Solo para ADMIN)
   */
  private cargarHistorialGeneral(): void {
    this.productService.getHistorialGeneral().subscribe({
      next: (res: any[]) => {
        // Añadimos la propiedad expanded para el control de la UI
        this.historial = res.map(m => ({ ...m, expanded: false }));
      },
      error: (err) => {
        console.error("Error al obtener historial general:", err);
      }
    });
  }

  /**
   * Carga solo las solicitudes del usuario logueado (Solo para USER)
   */
  private cargarMisSolicitudes(): void {
    this.productService.getMisSolicitudes(this.email).subscribe({
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