import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketsTiService } from '../../services/tickets-ti.service';

@Component({
  selector: 'app-ticket-ti',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ticket-ti.component.html',
  styleUrls: ['./ticket-ti.component.css']
})
export class TicketTiComponent implements OnInit {

  tickets: any[] = [];

  constructor(private ticketService: TicketsTiService) {}

  ngOnInit(): void {
    this.cargarPendientes();
  }

  cargarPendientes() {
    this.ticketService.getPendientes().subscribe({
      next: res => {
        this.tickets = res;
      },
      error: err => {
        console.error("Error cargando tickets:", err);
      }
    });
  }

  atender(ticket: any) {
    if (!confirm("¿Marcar este ticket como atendido?")) return;

    this.ticketService.atender(ticket.mensajeId).subscribe({
      next: () => {
        alert("Ticket atendido correctamente");
        this.tickets = this.tickets.filter(t => t.mensajeId !== ticket.mensajeId);
      },
      error: err => {
        console.error("Error atendiendo ticket:", err);
        alert("Hubo un problema al atender el ticket.");
      }
    });
  }
}
