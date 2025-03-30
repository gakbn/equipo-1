import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  name: string = '';
  email: string = '';
  password: string = '';
  showAlert: boolean = false;
  alertMessage: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  register(): void {
    const userData = {
      name: this.name,
      email: this.email,
      password: this.password
    };

    this.http.post('http://69.48.206.136:3000/api/usuarios', userData).subscribe({
      next: (response) => {
        this.showAlert = true;
        this.alertMessage = 'Tu cuenta ha sido creada con éxito';
        this.name = '';
        this.email = '';
        this.password = '';
        // Redirigir al login después de 2 segundos
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (error) => {
        this.showAlert = true;
        this.alertMessage = 'Ha ocurrido un error al crear la cuenta';
        console.error('Error al crear usuario:', error);
      }
    });
  }

  closeAlert(): void {
    this.showAlert = false;
    this.alertMessage = '';
  }
}