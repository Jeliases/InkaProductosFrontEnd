import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SolicitudService } from '../../services/solicitud.service';

@Component({
  selector: 'app-admin-solicitudes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-solicitudes.component.html'
})
export class AdminSolicitudesComponent implements OnInit {

  solicitudesPendientes: any[] = [];

  constructor(private solicitudService: SolicitudService) {}

  ngOnInit(): void {
    this.cargarPendientes();
  }

  cargarPendientes() {
    this.solicitudService.getPendientes().subscribe({
      next: (res) => {
        // Filtramos localmente para asegurar que solo se muestren las PENDIENTES.
        // Esto nos protege por si el backend envía solicitudes ya aprobadas o rechazadas.
        this.solicitudesPendientes = res.filter((s: any) => s.estado === 'PENDIENTE');
      },
      error: (err) => console.error("Error cargando solicitudes pendientes", err)
    });
  }

  aprobar(id: number) {
    if (confirm("¿Estás seguro de aprobar esta solicitud? Se realizará el traslado de stock en los almacenes.")) {
      // Ocultamos la fila inmediatamente para evitar un doble clic accidental
      this.solicitudesPendientes = this.solicitudesPendientes.filter(s => s.solicitudId !== id);
      
      this.solicitudService.aprobarSolicitud(id).subscribe({
        next: () => {
          alert("Solicitud Aprobada con éxito. El stock ha sido actualizado.");
          this.cargarPendientes(); // Recargar la lista
        },
        error: (err) => {
          alert("Error al aprobar la solicitud.");
          this.cargarPendientes(); // Restauramos la lista si hubo un fallo
        }
      });
    }
  }

  rechazar(id: number) {
    if (confirm("¿Estás seguro de rechazar esta solicitud?")) {
      // Ocultamos la fila inmediatamente para evitar un doble clic accidental
      this.solicitudesPendientes = this.solicitudesPendientes.filter(s => s.solicitudId !== id);
      
      this.solicitudService.rechazarSolicitud(id).subscribe({
        next: () => {
          alert("Solicitud Rechazada.");
          this.cargarPendientes(); // Recargar la lista
        },
        error: (err) => {
          alert("Error al rechazar la solicitud.");
          this.cargarPendientes(); // Restauramos la lista si hubo un fallo
        }
      });
    }
  }

  toggle(solicitud: any) {
    solicitud.expanded = !solicitud.expanded;
  }
}