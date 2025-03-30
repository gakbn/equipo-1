import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

// Interfaz para el modelo de Inventario según la API
export interface Inventory {
  idinventario: number; // IdInventario
  cantidad: number; // Cantidad
  idproducto: number; // IdProducto
  nombreproducto: string; // NombreProducto
  created_at: string;
  update_at: string | null; // Cambiado de updated_at a update_at
  delete_at: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class InventoryService {
  private apiUrl = 'http://69.48.206.136:3000/api/inventario'; // Coincide con el cURL

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json', // Coincide con el cURL: -H 'accept: application/json'
    }),
  };

  constructor(private http: HttpClient) {}

  // GET /api/inventario - Obtiene todos los inventarios
  getInventories(): Observable<Inventory[]> {
    return this.http.get<Inventory[]>(this.apiUrl, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  // POST /api/inventario - Crea un nuevo inventario
  createInventory(inventory: Inventory): Observable<Inventory> {
    return this.http
      .post<Inventory>(this.apiUrl, inventory, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  // PUT /api/inventario/{id} - Actualiza un inventario por ID
  updateInventory(inventory: Inventory): Observable<Inventory> {
    return this.http
      .put<Inventory>(`${this.apiUrl}/${inventory.idinventario}`, inventory, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  // DELETE /api/inventario/{id} - Elimina un inventario por ID
  deleteInventory(idinventario: number): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/${idinventario}`, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: any) {
    console.error('Error en la solicitud:', error);
    return throwError(() => new Error('Algo salió mal; intenta de nuevo más tarde.'));
  }
}