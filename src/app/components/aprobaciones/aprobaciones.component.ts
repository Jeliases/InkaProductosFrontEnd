import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AprobacionesService } from '../../services/aprobaciones.service';

@Component({
  selector: 'app-aprobaciones',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './aprobaciones.component.html',
  styleUrls: ['./aprobaciones.component.css']
})
export class AprobacionesComponent implements OnInit {

  solicitudes: any[] = [];

  constructor(private aprobacionesService: AprobacionesService) {}

  ngOnInit(): void {
    this.cargarPendientes();
  }

  cargarPendientes() {
    this.aprobacionesService.getPendientes().subscribe((res: any[]) => {
      this.solicitudes = res.map(s => ({ ...s, expanded: false }));
    });
  }

  // EXPANDIR / OCULTAR PRODUCTOS
  toggle(sol: any) {
    sol.expanded = !sol.expanded;
  }

  // APROBAR SOLICITUD
  aprobar(sol: any) {
    if (!confirm("¿Aprobar esta solicitud?")) return;

    this.aprobacionesService.aprobar(sol.solicitudId).subscribe({
      next: () => {
        alert("Solicitud aprobada correctamente");

        // Quitamos la tarjeta aprobada del listado
        this.solicitudes = this.solicitudes.filter(s => s.solicitudId !== sol.solicitudId);
      },
      error: err => {
        console.error(err);
        alert(err.error?.message || "Error al aprobar la solicitud");
      }
    });
  }

  //  RECHAZAR SOLICITUD
  rechazar(sol: any) {
    if (!confirm("¿Rechazar esta solicitud?")) return;

    this.aprobacionesService.rechazar(sol.solicitudId).subscribe({
      next: () => {
        alert("Solicitud rechazada");

        // Quitamos del listado
        this.solicitudes = this.solicitudes.filter(s => s.solicitudId !== sol.solicitudId);
      },
      error: err => {
        console.error(err);
        alert(err.error?.message || "Error al rechazar la solicitud");
      }
    });
  }

}
