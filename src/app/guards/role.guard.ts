import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // 1. Verificar si hay sesión activa
  if (!authService.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }

  // 2. Extraer los roles permitidos definidos en la ruta
  const expectedRoles: string[] = route.data['roles'] || [];
  const userRole = authService.getRol();

  // 3. Comprobar si el rol del usuario está dentro de los permitidos
  if (expectedRoles.includes(userRole)) {
    return true;
  }

  // 4. Si el rol no coincide, bloqueamos el paso y redirigimos
  alert("No tienes permisos suficientes para acceder a esta pantalla.");
  
  // Si ni siquiera tiene rol (está mal logueado), lo mandamos al login para limpiar
  if (!userRole) {
    authService.cerrarSesion();
    router.navigate(['/login']);
  } else {
    router.navigate(['/inicio']); // Si tiene rol pero intentó entrar a una vista prohibida
  }
  return false;
};