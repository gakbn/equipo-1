import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface ApiResponse {
  code: number;
  message: string;
  data: Product[] | Product;
}

export interface Product {
  idproducto: number;
  nombre: string;
  descripcion: string;
  preciomayoreo: string; // ¡Confirmado!
  preciomenudeo: string;
  preciovendedor: string;
  idtipoproducto: number;
  image_url: string;
  created_at: string;
  updated_at: string | null;
  delete_at: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = 'http://69.48.206.136:3000/api/productos';

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    }),
  };

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<ApiResponse>(this.apiUrl, this.httpOptions).pipe(
      map((response) => response.data as Product[]),
      catchError(this.handleError)
    );
  }

  createProduct(product: Product): Observable<Product> {
    return this.http
      .post<ApiResponse>(this.apiUrl, product, this.httpOptions)
      .pipe(
        map((response) => response.data as Product),
        catchError(this.handleError)
      );
  }

  updateProduct(product: Product): Observable<Product> {
    return this.http
      .put<ApiResponse>(`${this.apiUrl}/${product.idproducto}`, product, this.httpOptions)
      .pipe(
        map((response) => response.data as Product),
        catchError(this.handleError)
      );
  }

  deleteProduct(idproducto: number): Observable<void> {
    return this.http
      .delete<ApiResponse>(`${this.apiUrl}/${idproducto}`, this.httpOptions)
      .pipe(
        map(() => undefined),
        catchError(this.handleError)
      );
  }

  private handleError(error: any) {
    console.error('Error en la solicitud:', error);
    return throwError(() => new Error('Algo salió mal; intenta de nuevo más tarde.'));
  }
}