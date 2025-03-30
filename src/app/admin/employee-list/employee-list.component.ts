import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

interface Employee {
  idempleado?: number;
  nombre: string;
  apellidopaterno: string;
  apellidomaterno: string;
  telefono: string;
  rfc: string;
  fechanacimiento: string;
  nss: string;
  created_at?: string;
  update_at?: string | null;
  delete_at?: string | null;
  idusuario: number;
  idrol: number;
}

@Component({
  selector: 'app-employee-list',
  standalone: false,
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss'],
})
export class EmployeeListComponent implements OnInit {
  employees: Employee[] = [];
  selectedEmployee: Employee | null = null;
  newEmployee: Employee = {
    idempleado: 0,
    nombre: '',
    apellidopaterno: '',
    apellidomaterno: '',
    telefono: '',
    rfc: '',
    fechanacimiento: '',
    nss: '',
    created_at: '',
    update_at: null,
    delete_at: null,
    idusuario: 0,
    idrol: 0,
  };
  isCreating: boolean = false;
  isDeleting: boolean = false;
  employeeToDelete: Employee | null = null;
  errorMessage: string = '';

  private apiUrl = 'http://69.48.206.136:3000/api/empleados';

  // Variables para paginación
  currentPage: number = 1;
  itemsPerPage: number = 7;
  totalPages: number = 0;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.http
      .get<{ code: number; message: string; data: Employee[] }>(this.apiUrl, {
        headers: { Accept: 'application/json' },
      })
      .subscribe({
        next: (response) => {
          console.log('Empleados recibidos:', response.data);
          this.employees = response.data.map(emp => ({
            ...emp,
            fechanacimiento: emp.fechanacimiento.split('T')[0]
          }));
          this.calculateTotalPages();
          this.errorMessage = '';
        },
        error: (err) => {
          this.errorMessage = 'Error al cargar empleados: ' + err.message;
          console.error('Error al cargar empleados:', err);
        },
      });
  }

  calculateTotalPages(): void {
    this.totalPages = Math.ceil(this.employees.length / this.itemsPerPage);
  }

  getPaginatedEmployees(): Employee[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.employees.slice(startIndex, endIndex);
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
  restrictLettersOnly(event: KeyboardEvent): void {
    const charCode = event.key.charCodeAt(0);
    if (
      !(charCode >= 65 && charCode <= 90) && // Mayúsculas (A-Z)
      !(charCode >= 97 && charCode <= 122) && // Minúsculas (a-z)
      charCode !== 32 // Espacio
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

  restrictAlphanumeric(event: KeyboardEvent): void {
    const charCode = event.key.charCodeAt(0);
    if (
      !(charCode >= 48 && charCode <= 57) && // Números (0-9)
      !(charCode >= 65 && charCode <= 90) && // Mayúsculas (A-Z)
      !(charCode >= 97 && charCode <= 122) // Minúsculas (a-z)
    ) {
      event.preventDefault();
    }
  }

  // Validación antes de enviar
  validateForm(): boolean {
    this.errorMessage = '';

    if (!this.newEmployee.nombre || !/^[a-zA-Z\s]+$/.test(this.newEmployee.nombre)) {
      this.errorMessage = 'El nombre solo puede contener letras.';
      return false;
    }

    if (!this.newEmployee.apellidopaterno || !/^[a-zA-Z\s]+$/.test(this.newEmployee.apellidopaterno)) {
      this.errorMessage = 'El apellido paterno solo puede contener letras.';
      return false;
    }

    if (!this.newEmployee.apellidomaterno || !/^[a-zA-Z\s]+$/.test(this.newEmployee.apellidomaterno)) {
      this.errorMessage = 'El apellido materno solo puede contener letras.';
      return false;
    }

    if (!this.newEmployee.telefono || !/^\d+$/.test(this.newEmployee.telefono)) {
      this.errorMessage = 'El teléfono solo puede contener números.';
      return false;
    }

    if (!this.newEmployee.rfc || !/^[a-zA-Z0-9]{13}$/.test(this.newEmployee.rfc)) {
      this.errorMessage = 'El RFC debe tener exactamente 13 caracteres alfanuméricos.';
      return false;
    }

    if (!this.newEmployee.fechanacimiento) {
      this.errorMessage = 'La fecha de nacimiento es requerida.';
      return false;
    }

    if (!this.newEmployee.nss || !/^\d{11}$/.test(this.newEmployee.nss)) {
      this.errorMessage = 'El NSS debe tener exactamente 11 dígitos numéricos.';
      return false;
    }

    if (!this.newEmployee.idusuario || this.newEmployee.idusuario <= 0) {
      this.errorMessage = 'El ID de usuario debe ser un número positivo.';
      return false;
    }

    if (!this.newEmployee.idrol || this.newEmployee.idrol <= 0) {
      this.errorMessage = 'El ID de rol debe ser un número positivo.';
      return false;
    }

    return true;
  }

  createEmployee(): void {
    if (!this.validateForm()) {
      return;
    }

    const headers = new HttpHeaders({
      Accept: 'application/json',
    });

    const formData = new FormData();
    formData.append('Nombre', this.newEmployee.nombre || '');
    formData.append('ApellidoPaterno', this.newEmployee.apellidopaterno || '');
    formData.append('ApellidoMaterno', this.newEmployee.apellidomaterno || '');
    formData.append('Telefono', this.newEmployee.telefono || '');
    formData.append('RFC', this.newEmployee.rfc || '');
    formData.append('FechaNacimiento', new Date(this.newEmployee.fechanacimiento).toISOString().split('T')[0] || '');
    formData.append('NSS', this.newEmployee.nss || '');
    formData.append('IdUsuario', this.newEmployee.idusuario.toString() || '0');
    formData.append('IdRol', this.newEmployee.idrol.toString() || '0');

    console.log('Datos enviados en POST:', Object.fromEntries(formData));

    this.http
      .post<{ code: number; message: string; data: Employee }>(this.apiUrl, formData, { headers })
      .subscribe({
        next: (response) => {
          console.log('Empleado creado:', response.data);
          this.employees.push(response.data);
          this.isCreating = false;
          this.errorMessage = '';
          this.loadEmployees();
        },
        error: (err) => {
          this.errorMessage = 'Error al crear empleado: ' + (err.error?.message || err.message);
          console.error('Error al crear empleado:', err);
        },
      });
  }

  editEmployee(employee: Employee): void {
    this.selectedEmployee = { 
      ...employee,
      fechanacimiento: employee.fechanacimiento.split('T')[0]
    };
    this.isCreating = false;
    this.isDeleting = false;
  }

  saveEmployee(): void {
    if (!this.selectedEmployee || !this.selectedEmployee.idempleado) {
      this.errorMessage = 'No se seleccionó un empleado válido';
      return;
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });

    const employeeData = {
      Nombre: this.selectedEmployee.nombre,
      ApellidoPaterno: this.selectedEmployee.apellidopaterno,
      ApellidoMaterno: this.selectedEmployee.apellidomaterno,
      Telefono: this.selectedEmployee.telefono,
      RFC: this.selectedEmployee.rfc,
      FechaNacimiento: new Date(this.selectedEmployee.fechanacimiento).toISOString().split('T')[0],
      NSS: this.selectedEmployee.nss,
      IdUsuario: this.selectedEmployee.idusuario,
      IdRol: this.selectedEmployee.idrol
    };

    console.log('Datos enviados en PUT:', employeeData);

    this.http
      .put(`${this.apiUrl}/${this.selectedEmployee.idempleado}`, employeeData, { headers })
      .subscribe({
        next: (response) => {
          console.log('Empleado actualizado:', response);
          this.employees = this.employees.map((e) =>
            e.idempleado === this.selectedEmployee!.idempleado ? { ...this.selectedEmployee! } : e
          );
          this.selectedEmployee = null;
          this.errorMessage = '';
          this.loadEmployees();
        },
        error: (err) => {
          this.errorMessage = 'Error al actualizar empleado: ' + (err.error?.message || err.message);
          console.error('Error al actualizar empleado:', err);
        },
      });
  }

  deleteEmployee(idempleado: number | undefined): void {
    if (!idempleado) return;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });

    this.http
      .delete<{ code: number; message: string }>(`${this.apiUrl}/${idempleado}`, { headers })
      .subscribe({
        next: (response) => {
          console.log('Empleado eliminado:', response);
          this.employees = this.employees.filter((e) => e.idempleado !== idempleado);
          this.isDeleting = false;
          this.employeeToDelete = null;
          this.errorMessage = '';
          this.loadEmployees();
        },
        error: (err) => {
          this.errorMessage = 'Error al eliminar empleado: ' + (err.error?.message || err.message);
          console.error('Error al eliminar empleado:', err);
        },
      });
  }

  showCreateForm(): void {
    this.isCreating = true;
    this.selectedEmployee = null;
    this.isDeleting = false;
    this.errorMessage = '';
    this.newEmployee = {
      idempleado: 0,
      nombre: '',
      apellidopaterno: '',
      apellidomaterno: '',
      telefono: '',
      rfc: '',
      fechanacimiento: '',
      nss: '',
      created_at: '',
      update_at: null,
      delete_at: null,
      idusuario: 0,
      idrol: 0,
    };
  }

  cancelCreate(): void {
    this.isCreating = false;
  }

  cancelEdit(): void {
    this.selectedEmployee = null;
  }

  showDeleteConfirm(employee: Employee): void {
    this.employeeToDelete = employee;
    this.isDeleting = true;
    this.isCreating = false;
    this.selectedEmployee = null;
  }

  cancelDelete(): void {
    this.isDeleting = false;
    this.employeeToDelete = null;
  }
}