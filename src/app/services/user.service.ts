import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

// Interfaz para la respuesta completa de la API
export interface ApiResponse {
  code: number;
  message: string;
  data: User[] | User; // Soporta tanto GET (array) como POST/PUT (objeto)
}

// Interfaz para el modelo de Usuario según la API
export interface User {
  idusuario: number;
  name: string;
  email: string;
  password: string;
  phone: string | null;
  user_type: string | null;
  nickname: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string | null;
  deleted_at: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://69.48.206.136:3000/api/usuarios';

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    }),
  };

  constructor(private http: HttpClient) {}

  // GET /api/usuarios - Obtiene todos los usuarios
  getUsers(): Observable<User[]> {
    return this.http.get<ApiResponse>(this.apiUrl, this.httpOptions).pipe(
      map((response) => response.data as User[]),
      catchError(this.handleError)
    );
  }

  // POST /api/usuarios - Crea un nuevo usuario
  createUser(user: User): Observable<User> {
    return this.http
      .post<ApiResponse>(this.apiUrl, user, this.httpOptions)
      .pipe(
        map((response) => response.data as User),
        catchError(this.handleError)
      );
  }

  // PUT /api/usuarios/{id} - Actualiza un usuario por ID
  updateUser(user: User): Observable<User> {
    return this.http
      .put<ApiResponse>(`${this.apiUrl}/${user.idusuario}`, user, this.httpOptions)
      .pipe(
        map((response) => response.data as User),
        catchError(this.handleError)
      );
  }

  // DELETE /api/usuarios/{id} - Elimina un usuario por ID
  deleteUser(idusuario: number): Observable<void> {
    return this.http
      .delete<ApiResponse>(`${this.apiUrl}/${idusuario}`, this.httpOptions)
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