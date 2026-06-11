import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private apiUrl = 'http://localhost:8080/api/productos';
  private categoriasUrl = 'http://localhost:8080/api/categorias';

  constructor(private http: HttpClient) {}

  getProductos(activo: boolean): Observable<any[]> {
    // Se envía activo=false cuando se quieren ver inactivos/todos, activo=true por defecto.
    const params = new HttpParams().set('activo', String(activo));
    return this.http.get<any[]>(this.apiUrl, { params });
  }

  getProductoById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createProducto(producto: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, producto);
  }

  updateProducto(id: number, producto: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, producto);
  }

  desactivarProducto(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  getCategorias(): Observable<any[]> {
    return this.http.get<any[]>(this.categoriasUrl);
  }
}