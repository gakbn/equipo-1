import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

interface Sale {
  folioventa: number;
  total: number;
  fechaventa: string;
  idcliente: number;
  idempleado: number;
  created_at: string;
}

interface ApiResponse {
  code: number;
  message: string;
  data: Sale[] | Sale;
}

@Component({
  selector: 'app-ventas-list',
  standalone: false,
  templateUrl: './ventas-list.component.html',
  styleUrls: ['./ventas-list.component.scss'],
})
export class VentasListComponent implements OnInit {
  sales: Sale[] = [];
  private apiUrl = 'http://69.48.206.136:3000/api/venta';
  selectedSale: Sale | null = null;
  newSale: Partial<Sale> = {
    total: 0,
    fechaventa: new Date().toISOString(),
    idcliente: 0,
    idempleado: 0,
  };
  isCreating: boolean = false;
  isDeleting: boolean = false;
  saleToDelete: Sale | null = null;
  loading: boolean = false;

  // Variables para paginación
  currentPage: number = 1;
  itemsPerPage: number = 7;
  totalPages: number = 0;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadSales();
  }

  loadSales(): void {
    this.loading = true;
    this.http
      .get<ApiResponse>(this.apiUrl, {
        headers: { Accept: 'application/json' },
      })
      .subscribe({
        next: (response) => {
          console.log('Ventas recibidas:', response);
          this.sales = Array.isArray(response.data) ? response.data : [response.data];
          this.calculateTotalPages();
          this.loading = false;
        },
        error: (err) => {
          console.error('Error al cargar ventas:', err);
          this.loading = false;
        },
      });
  }

  // Calcular el total de páginas
  calculateTotalPages(): void {
    this.totalPages = Math.ceil(this.sales.length / this.itemsPerPage);
  }

  // Obtener las ventas de la página actual
  getPaginatedSales(): Sale[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.sales.slice(startIndex, endIndex);
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

  editSale(sale: Sale): void {
    this.selectedSale = { ...sale };
    this.isCreating = false;
    this.isDeleting = false;
  }

  saveSale(): void {
    if (!this.selectedSale || !this.selectedSale.idcliente || !this.selectedSale.idempleado) {
      alert('Por favor, completa todos los campos requeridos.');
      return;
    }
    this.loading = true;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    const body = {
      total: this.selectedSale.total,
      fechaventa: this.selectedSale.fechaventa,
      idcliente: this.selectedSale.idcliente,
      idempleado: this.selectedSale.idempleado,
    };
    this.http
      .put<ApiResponse>(`${this.apiUrl}/${this.selectedSale.folioventa}`, body, { headers })
      .subscribe({
        next: (response) => {
          console.log('Respuesta de PUT:', response);
          const updatedSale = response.data as Sale;
          this.sales = this.sales.map((s) =>
            s.folioventa === updatedSale.folioventa ? updatedSale : s
          );
          this.selectedSale = null;
          this.loading = false;
          this.loadSales();
        },
        error: (err) => {
          console.error('Error en PUT:', err);
          alert('Error al actualizar la venta: ' + (err.error?.message || 'Error desconocido'));
          this.loading = false;
        },
      });
  }

  cancelEdit(): void {
    this.selectedSale = null;
  }

  showCreateForm(): void {
    this.isCreating = true;
    this.selectedSale = null;
    this.isDeleting = false;
    this.newSale = {
      total: 0,
      fechaventa: new Date().toISOString(),
      idcliente: 0,
      idempleado: 0,
    };
  }

  createSale(): void {
    if (!this.newSale.idcliente || !this.newSale.idempleado || this.newSale.total === undefined) {
      alert('Por favor, completa todos los campos requeridos.');
      return;
    }
    this.loading = true;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    const body = {
      total: this.newSale.total,
      fechaventa: this.newSale.fechaventa,
      idcliente: this.newSale.idcliente,
      idempleado: this.newSale.idempleado,
      created_at: new Date().toISOString(),
    };
    this.http
      .post<ApiResponse>(this.apiUrl, body, { headers })
      .subscribe({
        next: (response) => {
          console.log('Respuesta de POST:', response);
          const newSale = response.data as Sale;
          this.sales.push(newSale);
          this.isCreating = false;
          this.loading = false;
          this.loadSales();
        },
        error: (err) => {
          console.error('Error en POST:', err);
          alert('Error al crear la venta: ' + (err.error?.message || 'Error desconocido'));
          this.loading = false;
        },
      });
  }

  cancelCreate(): void {
    this.isCreating = false;
  }

  showDeleteConfirm(sale: Sale): void {
    this.saleToDelete = sale;
    this.isDeleting = true;
    this.isCreating = false;
    this.selectedSale = null;
  }

  deleteSale(folioventa: number | undefined): void {
    if (!folioventa) return;
    this.loading = true;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    this.http
      .delete<ApiResponse>(`${this.apiUrl}/${folioventa}`, { headers })
      .subscribe({
        next: (response) => {
          console.log('Venta eliminada:', response);
          this.sales = this.sales.filter((s) => s.folioventa !== folioventa);
          this.isDeleting = false;
          this.saleToDelete = null;
          this.loading = false;
          this.loadSales();
        },
        error: (err) => {
          console.error('Error al eliminar:', err);
          alert('Error al eliminar la venta');
          this.loading = false;
        },
      });
  }

  cancelDelete(): void {
    this.isDeleting = false;
    this.saleToDelete = null;
  }
}