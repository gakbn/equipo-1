import { Component, OnInit } from '@angular/core';
import { UserService, User } from '../../services/user.service';

@Component({
  selector: 'app-user-list',
  standalone: false,
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  selectedUser: User | null = null;
  newUser: User = {
    idusuario: 0,
    name: '',
    email: '',
    password: '',
    phone: null,
    user_type: null,
    nickname: null,
    image_url: null,
    created_at: '',
    updated_at: null,
    deleted_at: null,
  };
  isCreating: boolean = false;
  isDeleting: boolean = false;
  userToDelete: User | null = null;
  successMessage: string = ''; // Mensaje de éxito

  // Variables para paginación
  currentPage: number = 1;
  itemsPerPage: number = 7;
  totalPages: number = 0;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (users) => {
        console.log('Usuarios recibidos:', users);
        this.users = users;
        this.calculateTotalPages();
      },
      error: (err) => {
        console.error('Error al cargar usuarios:', err);
      },
    });
  }

  calculateTotalPages(): void {
    this.totalPages = Math.ceil(this.users.length / this.itemsPerPage);
  }

  getPaginatedUsers(): User[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.users.slice(startIndex, endIndex);
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  // Funciones para restringir entrada
  restrictAlphanumeric(event: KeyboardEvent): void {
    const charCode = event.key.charCodeAt(0);
    if (
      !(charCode >= 48 && charCode <= 57) && // Números (0-9)
      !(charCode >= 65 && charCode <= 90) && // Letras mayúsculas (A-Z)
      !(charCode >= 97 && charCode <= 122) && // Letras minúsculas (a-z)
      charCode !== 32 // Espacio
    ) {
      event.preventDefault();
    }
  }

  restrictEmail(event: KeyboardEvent): void {
    const charCode = event.key.charCodeAt(0);
    if (
      !(charCode >= 48 && charCode <= 57) && // Números (0-9)
      !(charCode >= 65 && charCode <= 90) && // Letras mayúsculas (A-Z)
      !(charCode >= 97 && charCode <= 122) && // Letras minúsculas (a-z)
      charCode !== 46 && // Punto (.)
      charCode !== 64 // Arroba (@)
    ) {
      event.preventDefault();
    }
  }

  restrictAlphanumericWithDot(event: KeyboardEvent): void {
    const charCode = event.key.charCodeAt(0);
    if (
      !(charCode >= 48 && charCode <= 57) && // Números (0-9)
      !(charCode >= 65 && charCode <= 90) && // Letras mayúsculas (A-Z)
      !(charCode >= 97 && charCode <= 122) && // Letras minúsculas (a-z)
      charCode !== 46 // Punto (.)
    ) {
      event.preventDefault();
    }
  }

  restrictNumbersOnly(event: KeyboardEvent): void {
    const charCode = event.key.charCodeAt(0);
    if (charCode < 48 || charCode > 57) { // Solo números (0-9)
      event.preventDefault();
    }
  }

  editUser(user: User): void {
    this.selectedUser = { ...user, password: '' };
    this.isCreating = false;
    this.isDeleting = false;
  }

  saveUser(): void {
    if (!this.selectedUser) return;

    this.userService.updateUser(this.selectedUser).subscribe({
      next: (updatedUser) => {
        console.log('Usuario actualizado:', updatedUser);
        this.users = this.users.map((u) =>
          u.idusuario === this.selectedUser!.idusuario ? updatedUser : u
        );
        this.selectedUser = null;
        this.successMessage = 'Usuario editado con éxito';
        this.hideMessageAfterDelay();
        this.loadUsers();
      },
      error: (err) => {
        console.error('Error al actualizar usuario:', err);
      },
    });
  }

  cancelEdit(): void {
    this.selectedUser = null;
  }

  showCreateForm(): void {
    this.isCreating = true;
    this.selectedUser = null;
    this.isDeleting = false;
    this.newUser = {
      idusuario: 0,
      name: '',
      email: '',
      password: '',
      phone: null,
      user_type: null,
      nickname: null,
      image_url: null,
      created_at: '',
      updated_at: null,
      deleted_at: null,
    };
  }

  createUser(): void {
    if (!this.newUser.name || !this.newUser.email || !this.newUser.password) {
      alert('Por favor, completa los campos requeridos.');
      return;
    }

    this.userService.createUser(this.newUser).subscribe({
      next: (createdUser) => {
        console.log('Usuario creado:', createdUser);
        this.users.push(createdUser);
        this.isCreating = false;
        this.successMessage = 'Usuario creado con éxito';
        this.hideMessageAfterDelay();
        this.loadUsers();
      },
      error: (err) => {
        console.error('Error al crear usuario:', err);
        alert('Error al crear usuario: ' + (err.message || 'Error desconocido'));
      },
    });
  }

  cancelCreate(): void {
    this.isCreating = false;
  }

  showDeleteConfirm(user: User): void {
    this.userToDelete = user;
    this.isDeleting = true;
    this.isCreating = false;
    this.selectedUser = null;
  }

  deleteUser(idusuario: number | undefined): void {
    if (!idusuario) return;

    this.userService.deleteUser(idusuario).subscribe({
      next: () => {
        console.log('Usuario eliminado');
        this.users = this.users.filter((u) => u.idusuario !== idusuario);
        this.isDeleting = false;
        this.userToDelete = null;
        this.successMessage = 'Usuario eliminado con éxito';
        this.hideMessageAfterDelay();
        this.loadUsers();
      },
      error: (err) => {
        console.error('Error al eliminar usuario:', err);
      },
    });
  }

  cancelDelete(): void {
    this.isDeleting = false;
    this.userToDelete = null;
  }

  // Método para ocultar el mensaje después de 3 segundos
  hideMessageAfterDelay(): void {
    setTimeout(() => {
      this.successMessage = '';
    }, 3000); // 3 segundos
  }
}