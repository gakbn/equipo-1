import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  showAlert: boolean = false;
  alertMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  login(): void {
    // Validar que los campos no estén vacíos
    if (!this.username.trim() || !this.password.trim()) {
      this.showAlert = true;
      this.alertMessage = 'Por favor, rellene todos los campos';
      return;
    }

    this.authService.login(this.username, this.password);

    if (this.authService.isAdmin()) {
      this.showAlert = true;
      this.alertMessage = 'Inicio de sesión exitoso como administrador';
      setTimeout(() => {
        this.router.navigate(['/admin/dashboard']);
      }, 2000); // Redirige después de 2 segundos para que se vea el loader
    } else if (this.authService.isGuest()) {
      this.showAlert = true;
      this.alertMessage = 'Inicio de sesión exitoso como invitado';
      setTimeout(() => {
        this.router.navigate(['/admin/dashboard']);
      }, 2000); // Redirige después de 2 segundos para que se vea el loader
    } else {
      this.showAlert = true;
      this.alertMessage = 'Error al iniciar sesión. Credenciales inválidas.';
    }
  }

  closeAlert(): void {
    this.showAlert = false;
    this.alertMessage = '';
  }
}