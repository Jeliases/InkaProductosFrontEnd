import { Routes } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { InventarioComponent } from './components/inventario/inventario.component';
import { ComprasComponent } from './components/compras/compras.component';
import { HistorialComponent } from './components/historial/historial.component';
import { AdminSolicitudesComponent } from './components/historial/admin-solicitudes.component';
import { TicketTiComponent } from './components/ticket-ti/ticket-ti.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { roleGuard } from './guards/role.guard';

export const routes: Routes = [

  // Redirección base
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Login
  { path: 'login', component: LoginComponent },

  // Página inicio
  { path: 'inicio', component: InicioComponent, canActivate: [roleGuard], data: { roles: ['ADMIN', 'SUPERVISOR', 'USUARIO'] } },

  // Inventario general
  { path: 'inventario', component: InventarioComponent, canActivate: [roleGuard], data: { roles: ['ADMIN', 'SUPERVISOR', 'USUARIO'] } },

  // Compras
  { path: 'compras', component: ComprasComponent, canActivate: [roleGuard], data: { roles: ['SUPERVISOR', 'USUARIO'] } },

  // Historial
  { path: 'historial', component: HistorialComponent, canActivate: [roleGuard], data: { roles: ['ADMIN', 'SUPERVISOR', 'USUARIO'] } },

  // Aprobaciones (Exclusivo SUPERVISOR)
  { path: 'aprobaciones', component: AdminSolicitudesComponent, canActivate: [roleGuard], data: { roles: ['SUPERVISOR'] } },

  // TI – módulos del rol TI
  { path: 'tickets', component: TicketTiComponent, canActivate: [roleGuard], data: { roles: ['ADMIN'] } },
  { path: 'usuarios', component: UsuariosComponent, canActivate: [roleGuard], data: { roles: ['ADMIN'] } },

  // Página por defecto
  { path: '**', redirectTo: 'inicio' }
];
