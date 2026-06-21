import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SoporteService } from '../../../services/soporte.service';
import { AuthService } from '../../../services/auth.service';
import { Ticket } from '../../../models/ticket.model';

@Component({
  selector: 'app-ticket-nuevo',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink], // <-- FormsModule es vital para los inputs
  templateUrl: './ticket-nuevo.component.html',
  styleUrl: './ticket-nuevo.component.css'
})
export class TicketNuevoComponent implements OnInit {
  
  ticket: Ticket = {
    emisorEmail: '',
    asunto: '',
    contenido: '',
    categoria: 'OTROS'
  };

  mensajeExito: string = '';
  cargando: boolean = false;

  constructor(
    private soporteService: SoporteService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Al abrir la pantalla, le inyectamos el email de la sesión activa
    this.ticket.emisorEmail = this.authService.getEmail();
  }

  enviarTicket() {
    this.cargando = true;
    
    this.soporteService.crearTicket(this.ticket).subscribe({
      next: (respuesta) => {
        this.mensajeExito = '¡Ticket enviado correctamente al Administrador!';
        this.cargando = false;
        
        // Limpiamos el formulario (dejamos la categoría por defecto)
        this.ticket.asunto = '';
        this.ticket.contenido = '';
        this.ticket.categoria = 'OTROS';
        
        // El mensaje de éxito desaparece a los 4 segundos
        setTimeout(() => this.mensajeExito = '', 4000);
      },
      error: (err) => {
        console.error('Error al enviar el ticket:', err);
        alert('Hubo un problema de conexión con el servidor. Revisa la consola.');
        this.cargando = false;
      }
    });
  }
}