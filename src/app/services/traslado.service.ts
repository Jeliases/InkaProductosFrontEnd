import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TrasladoService {
  private apiUrl = 'http://localhost:8081/api/traslados';

  constructor(private http: HttpClient) {}

  registrarTrasladoDirecto(data: any): Observable<any> {
    // Le decimos a Angular que espere texto para que no falle al parsear JSON
    return this.http.post(this.apiUrl, data, { responseType: 'text' });
  }

  getKardexPorProducto(productoId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/kardex/producto/${productoId}`);
  }

  getKardexPorAlmacen(almacenId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/kardex/almacen/${almacenId}`);
  }
}