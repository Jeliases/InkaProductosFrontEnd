import { inject } from '@angular/core';
import { HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (request: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
  const router = inject(Router);
  
  const token = localStorage.getItem('token'); // O donde almacenes tu token
  
  if (token) {
    request = request.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 || error.status === 403) {
        // Extraemos el mensaje real que Spring Boot intentó enviarnos
        const mensajeReal = error.error?.message || error.error?.error || 'No se especificó el motivo en el JSON';
        
        console.error('🔥 Error de Seguridad devuelto por Spring Boot:');
        console.error(error); // Imprime el objeto completo para que lo veas en F12
        
        alert(`⚠️ Bloqueo de Seguridad (${error.status})\nRuta: ${request.url}\nMotivo real: ${mensajeReal}`);
        router.navigate(['/login']); // Volvemos a activar la redirección
      } else if (error.status === 400) {
        const msg = error.error?.error || error.error?.message || 'Error en la petición (Bad Request)';
        alert(msg);
      }
      return throwError(() => error);
    })
  );
};