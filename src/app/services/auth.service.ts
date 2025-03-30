// auth.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userRole: string = 'user'; // Rol por defecto: no autenticado

  login(username: string, password: string): void {
    if (username === 'admin@gmail.com' && password === 'admin123') {
      this.userRole = 'admin';
    } else if (username === 'invitado@gmail.com' && password === 'invitado123') {
      this.userRole = 'invitado';
    } else {
      this.userRole = 'user';
    }
  }

  logout(): void {
    this.userRole = 'user';
  }

  isAdmin(): boolean {
    return this.userRole === 'admin';
  }

  isGuest(): boolean {
    return this.userRole === 'invitado';
  }

  isAuthenticated(): boolean {
    return this.userRole === 'admin' || this.userRole === 'invitado';
  }

  getRole(): string {
    return this.userRole;
  }
}