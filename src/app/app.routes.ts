import { Routes } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { InventarioComponent } from './components/inventario/inventario.component';
import { ComprasComponent } from './components/compras/compras.component';
import { HistorialComponent } from './components/historial/historial.component';
import { AprobacionesComponent } from './components/aprobaciones/aprobaciones.component';
import { TicketTiComponent } from './components/ticket-ti/ticket-ti.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';

export const routes: Routes = [

  // Redirección base
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Login
  { path: 'login', component: LoginComponent },

  // Página inicio
  { path: 'inicio', component: InicioComponent },

  // Inventario general
  { path: 'inventario', component: InventarioComponent },

  // Compras
  { path: 'compras', component: ComprasComponent },

  // Historial
  { path: 'historial', component: HistorialComponent },

  // Aprobaciones (ADMIN)
  { path: 'aprobaciones', component: AprobacionesComponent },

  // TI – módulos del rol TI
  { path: 'tickets', component: TicketTiComponent },
  { path: 'usuarios', component: UsuariosComponent },

  // Página por defecto
  { path: '**', redirectTo: 'inicio' }
];
