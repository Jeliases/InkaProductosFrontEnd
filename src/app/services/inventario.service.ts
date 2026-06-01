import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InventarioService {

  private url = "http://localhost:8081/api";

  constructor(private http: HttpClient) {}

  getCategorias(): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/categorias`);
  }

  getAlmacenes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/almacenes`);
  }

  filtrarProductos(categoriaId?: number, almacenId?: number): Observable<any[]> {
    let params = new HttpParams();

    if (categoriaId) params = params.set('categoriaId', categoriaId);
    if (almacenId) params = params.set('almacenId', almacenId);

    return this.http.get<any[]>(`${this.url}/productos`, { params });
  }

  eliminar(id: number) {
    return this.http.delete(`${this.url}/productos/${id}`);
  }
  
}
