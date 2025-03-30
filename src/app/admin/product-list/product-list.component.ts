import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

interface Product {
  idproducto?: number;
  nombre?: string;
  descripcion?: string;
  preciomayoreo?: string;
  preciomenudeo?: string;
  preciovendedor?: string;
  idtipoproducto?: number;
  image_url?: string;
  created_at?: string;
  updated_at?: string | null;
  delete_at?: string | null;
}

@Component({
  selector: 'app-product-list',
  standalone: false,
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  private apiUrl = 'http://69.48.206.136:3000/api/productos';
  selectedProduct: Product | null = null;
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  newProduct: Product = {
    idproducto: 0,
    nombre: '',
    descripcion: '',
    preciomayoreo: '',
    preciomenudeo: '',
    preciovendedor: '',
    idtipoproducto: 0,
    image_url: '',
    created_at: '',
    updated_at: null,
    delete_at: null,
  };
  isCreating: boolean = false;
  isDeleting: boolean = false;
  productToDelete: Product | null = null;
  successMessage: string = ''; // Mensaje de éxito

  // Variables para paginación
  currentPage: number = 1;
  itemsPerPage: number = 7;
  totalPages: number = 0;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.http
      .get<{ code: number; message: string; data: Product[] }>(this.apiUrl, {
        headers: { Accept: 'application/json' },
      })
      .subscribe({
        next: (response) => {
          console.log('Productos recibidos:', response.data);
          this.products = response.data;
          this.calculateTotalPages();
        },
        error: (err) => {
          console.error('Error al cargar productos:', err);
        },
      });
  }

  calculateTotalPages(): void {
    this.totalPages = Math.ceil(this.products.length / this.itemsPerPage);
  }

  getPaginatedProducts(): Product[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.products.slice(startIndex, endIndex);
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

  editProduct(product: Product): void {
    this.selectedProduct = { ...product };
    this.isCreating = false;
    this.isDeleting = false;
  }

  saveProduct(): void {
    if (!this.selectedProduct) return;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });

    this.http
      .put(`${this.apiUrl}/${this.selectedProduct.idproducto}`, this.selectedProduct, { headers })
      .subscribe({
        next: (response) => {
          console.log('Producto actualizado:', response);
          this.products = this.products.map((p) =>
            p.idproducto === this.selectedProduct!.idproducto ? { ...this.selectedProduct } : p
          );
          this.selectedProduct = null;
          this.successMessage = 'Producto editado con éxito';
          this.hideMessageAfterDelay();
          this.loadProducts();
        },
        error: (err) => {
          console.error('Error al actualizar producto:', err);
        },
      });
  }

  cancelEdit(): void {
    this.selectedProduct = null;
  }

  showCreateForm(): void {
    this.isCreating = true;
    this.selectedProduct = null;
    this.isDeleting = false;
    this.selectedFile = null;
    this.imagePreview = null;
    this.newProduct = {
      idproducto: 0,
      nombre: '',
      descripcion: '',
      preciomayoreo: '',
      preciomenudeo: '',
      preciovendedor: '',
      idtipoproducto: 0,
      image_url: '',
      created_at: '',
      updated_at: null,
      delete_at: null,
    };
  }

  createProduct(): void {
    const headers = new HttpHeaders({
      Accept: 'application/json',
    });

    const formData = new FormData();
    formData.append('nombre', this.newProduct.nombre || '');
    formData.append('descripcion', this.newProduct.descripcion || '');
    formData.append('preciomayoreo', parseFloat(this.newProduct.preciomayoreo || '0').toString());
    formData.append('preciomenudeo', parseFloat(this.newProduct.preciomenudeo || '0').toString());
    formData.append('preciovendedor', parseFloat(this.newProduct.preciovendedor || '0').toString());
    formData.append('idtipoproducto', this.newProduct.idtipoproducto?.toString() || '0');
    
    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    }

    this.http
      .post<{ code: number; message: string; data: Product }>(this.apiUrl, formData, { headers })
      .subscribe({
        next: (response) => {
          console.log('Producto creado:', response.data);
          this.products.push(response.data);
          this.isCreating = false;
          this.selectedFile = null;
          this.imagePreview = null;
          this.successMessage = 'Producto creado con éxito';
          this.hideMessageAfterDelay();
          this.loadProducts();
        },
        error: (err) => {
          console.error('Error al crear producto:', err);
        },
      });
  }

  cancelCreate(): void {
    this.isCreating = false;
    this.selectedFile = null;
    this.imagePreview = null;
  }

  deleteProduct(idproducto: number | undefined): void {
    if (!idproducto) return;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });

    this.http
      .delete<{ code: number; message: string }>(`${this.apiUrl}/${idproducto}`, { headers })
      .subscribe({
        next: (response) => {
          console.log('Producto eliminado:', response);
          this.products = this.products.filter((p) => p.idproducto !== idproducto);
          this.isDeleting = false;
          this.productToDelete = null;
          this.loadProducts();
        },
        error: (err) => {
          console.error('Error al eliminar producto:', err);
        },
      });
  }

  showDeleteConfirm(product: Product): void {
    this.productToDelete = product;
    this.isDeleting = true;
    this.isCreating = false;
    this.selectedProduct = null;
  }

  cancelDelete(): void {
    this.isDeleting = false;
    this.productToDelete = null;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  // Método para ocultar el mensaje después de 3 segundos
  hideMessageAfterDelay(): void {
    setTimeout(() => {
      this.successMessage = '';
    }, 3000); // 3 segundos
  }
}