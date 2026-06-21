import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SoporteService } from '../../../services/soporte.service';
import { Ticket } from '../../../models/ticket.model';

@Component({
  selector: 'app-ticket-lista',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ticket-lista.component.html',
  styleUrl: './ticket-lista.component.css'
})
export class TicketListaComponent implements OnInit {

  tickets: Ticket[] = [];
  ticketsFiltrados: Ticket[] = [];
  estadoSeleccionado: string = 'TODOS';

  constructor(private soporteService: SoporteService) {}

  ngOnInit() {
    this.cargarTickets();
  }

  cargarTickets() {
    this.soporteService.obtenerTodos().subscribe({
      next: (data) => {
        this.tickets = data;
        this.aplicarFiltros();
      },
      error: (err) => console.error('Error al cargar la bandeja de tickets', err)
    });
  }

  aplicarFiltros() {
    if (this.estadoSeleccionado === 'TODOS') {
      this.ticketsFiltrados = this.tickets;
    } else {
      this.ticketsFiltrados = this.tickets.filter(t => t.estado === this.estadoSeleccionado);
    }
  }

  cambiarEstado(id: number | undefined, nuevoEstado: string) {
    if (!id) return;
    
    // Si confirma, llamamos al backend
    if(confirm(`¿Estás seguro de cambiar el estado a ${nuevoEstado}?`)) {
      this.soporteService.actualizarEstado(id, nuevoEstado).subscribe({
        next: () => {
          this.cargarTickets(); // Recargamos la tabla para ver el cambio
        },
        error: (err) => {
          console.error(err);
          alert('Hubo un error al actualizar el estado en la base de datos.');
        }
      });
    } else {
      this.cargarTickets(); // Si cancela, devolvemos el select a su estado original
    }
  }
}