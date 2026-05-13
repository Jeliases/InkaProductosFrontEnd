import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const tokenHeader = auth.getAuthHeader();

  // Si tenemos un token (sesión activa), clonamos la petición y añadimos la cabecera
  if (tokenHeader) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: tokenHeader
      }
    });
    return next(authReq);
  }

  // Si no hay token, la petición sigue su curso normal (ej. para el login)
  return next(req);
};