import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

interface Inventory {
  idinventario: number;
  cantidad: number;
  idproducto: number;
  nombreproducto: string;
  created_at: string;
  update_at: string | null;
  delete_at: string | null;
}

interface ApiResponse {
  code: number;
  message: string;
  data: Inventory[] | Inventory;
}

@Component({
  selector: 'app-inventory-list',
  standalone: false,
  templateUrl: './inventory-list.component.html',
  styleUrls: ['./inventory-list.component.scss'],
})
export class InventoryListComponent implements OnInit {
  inventories: Inventory[] = [];
  private apiUrl = 'http://69.48.206.136:3000/api/inventario';
  selectedInventory: Inventory | null = null;
  newInventory: Partial<Inventory> = {
    cantidad: 0,
    idproducto: 0,
    nombreproducto: '',
  };
  isCreating: boolean = false;
  isDeleting: boolean = false;
  inventoryToDelete: Inventory | null = null;

  // Variables para paginación
  currentPage: number = 1;
  itemsPerPage: number = 7;
  totalPages: number = 0;

  // Errores de validación
  validationErrors: { [key: string]: string } = {};

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadInventories();
  }

  loadInventories(): void {
    this.http
      .get<ApiResponse>(this.apiUrl, {
        headers: { Accept: 'application/json' },
      })
      .subscribe({
        next: (response) => {
          console.log('Inventarios recibidos:', response);
          this.inventories = Array.isArray(response.data) ? response.data : [response.data];
          this.calculateTotalPages();
        },
        error: (err) => {
          console.error('Error al cargar inventarios:', err);
        },
      });
  }

  // Calcular el total de páginas
  calculateTotalPages(): void {
    this.totalPages = Math.ceil(this.inventories.length / this.itemsPerPage);
  }

  // Obtener los inventarios de la página actual
  getPaginatedInventories(): Inventory[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.inventories.slice(startIndex, endIndex);
  }

  // Cambiar a la página anterior
  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  // Cambiar a la página siguiente
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  // Ir a una página específica
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  // Funciones para restringir entrada
  restrictNumbersOnly(event: KeyboardEvent): void {
    const charCode = event.key.charCodeAt(0);
    if (charCode < 48 || charCode > 57) { // Solo permite números (0-9)
      event.preventDefault();
    }
  }

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

  restrictNumbersAndDecimal(event: KeyboardEvent): void {
    const charCode = event.key.charCodeAt(0);
    const input = (event.target as HTMLInputElement).value;
    if (
      !(charCode >= 48 && charCode <= 57) && // Números (0-9)
      !(charCode === 46 && !input.includes('.')) // Punto decimal (solo uno)
    ) {
      event.preventDefault();
    }
  }

  // Validación del formulario (por si acaso)
  validateForm(): boolean {
    this.validationErrors = {};

    if (!this.newInventory.idproducto || !/^\d+$/.test(this.newInventory.idproducto.toString())) {
      this.validationErrors['idproducto'] = 'El ID del producto debe ser un número entero positivo.';
    }

    if (!this.newInventory.nombreproducto || !/^[a-zA-Z0-9\s]+$/.test(this.newInventory.nombreproducto)) {
      this.validationErrors['nombreproducto'] = 'El nombre del producto solo puede contener letras y números.';
    }

    if (!this.newInventory.cantidad || !/^\d+(\.\d+)?$/.test(this.newInventory.cantidad.toString())) {
      this.validationErrors['cantidad'] = 'La cantidad debe ser un número (puede incluir decimales).';
    }

    return Object.keys(this.validationErrors).length === 0;
  }

  editInventory(inventory: Inventory): void {
    this.selectedInventory = { ...inventory };
    this.isCreating = false;
    this.isDeleting = false;
  }

  saveInventory(): void {
    if (!this.selectedInventory || !this.selectedInventory.idproducto || !this.selectedInventory.nombreproducto) {
      alert('Por favor, completa todos los campos requeridos.');
      return;
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });

    const body = {
      IdProducto: this.selectedInventory.idproducto,
      NombreProducto: this.selectedInventory.nombreproducto,
      Cantidad: this.selectedInventory.cantidad,
      update_at: new Date().toISOString(),
    };

    this.http
      .put<ApiResponse>(`${this.apiUrl}/${this.selectedInventory.idinventario}`, body, { headers })
      .subscribe({
        next: (response) => {
          console.log('Respuesta de PUT:', response);
          const updatedInventory = response.data as Inventory;
          this.inventories = this.inventories.map((i) =>
            i.idinventario === updatedInventory.idinventario ? updatedInventory : i
          );
          this.selectedInventory = null;
          this.loadInventories();
        },
        error: (err) => {
          console.error('Error en PUT:', err);
          alert('Error al actualizar el inventario: ' + (err.error?.message || 'Error desconocido'));
        },
      });
  }

  cancelEdit(): void {
    this.selectedInventory = null;
  }

  showCreateForm(): void {
    this.isCreating = true;
    this.selectedInventory = null;
    this.isDeleting = false;
    this.validationErrors = {};
    this.newInventory = {
      cantidad: 0,
      idproducto: 0,
      nombreproducto: '',
    };
  }

  createInventory(): void {
    if (!this.validateForm()) {
      return;
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });

    const body = {
      IdProducto: this.newInventory.idproducto,
      NombreProducto: this.newInventory.nombreproducto,
      Cantidad: this.newInventory.cantidad,
      created_at: new Date().toISOString(),
      update_at: new Date().toISOString(),
    };

    this.http
      .post<ApiResponse>(this.apiUrl, body, { headers })
      .subscribe({
        next: (response) => {
          console.log('Respuesta de POST:', response);
          const newInventory = response.data as Inventory;
          this.inventories.push(newInventory);
          this.isCreating = false;
          this.loadInventories();
        },
        error: (err) => {
          console.error('Error en POST:', err);
          alert('Error al crear el inventario: ' + (err.error?.message || 'Error desconocido'));
        },
      });
  }

  cancelCreate(): void {
    this.isCreating = false;
    this.validationErrors = {};
  }

  showDeleteConfirm(inventory: Inventory): void {
    this.inventoryToDelete = inventory;
    this.isDeleting = true;
    this.isCreating = false;
    this.selectedInventory = null;
  }

  deleteInventory(idinventario: number | undefined): void {
    if (!idinventario) return;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });

    this.http
      .delete<ApiResponse>(`${this.apiUrl}/${idinventario}`, { headers })
      .subscribe({
        next: (response) => {
          console.log('Inventario eliminado:', response);
          this.inventories = this.inventories.filter((i) => i.idinventario !== idinventario);
          this.isDeleting = false;
          this.inventoryToDelete = null;
          this.loadInventories();
        },
        error: (err) => {
          console.error('Error al eliminar:', err);
          alert('Error al eliminar el inventario');
        },
      });
  }

  cancelDelete(): void {
    this.isDeleting = false;
    this.inventoryToDelete = null;
  }
}