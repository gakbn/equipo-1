import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  standalone: false,
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  products: any[] = [];
  filteredProducts: any[] = [];
  searchTerm: string = '';
  selectedCategory: string = 'todos';
  sortOption: string = 'precio-asc';
  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number = 1;
  pages: number[] = [];
  errorMessage: string = '';
  
  // Variables para los modales
  showAppModal: boolean = false;
  showDetailsModal: boolean = false;
  selectedProduct: any = null;

  // Datos locales para estrellas y comentarios
  productRatings: { [key: number]: { rating: number; comments: string[] } } = {};

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchProducts();
  }

  fetchProducts() {
    this.http
      .get<any>('http://69.48.206.136:3000/api/productos', {
        headers: { accept: 'application/json' }
      })
      .subscribe(
        (data) => {
          let productList: any[] = [];
          if (Array.isArray(data)) {
            productList = data;
          } else if (data && Array.isArray(data.productos)) {
            productList = data.productos;
          } else if (data && Array.isArray(data.data)) {
            productList = data.data;
          } else {
            console.error('Formato inesperado de la respuesta:', data);
            this.errorMessage = 'Error: La respuesta de la API no contiene un arreglo de productos válido.';
            return;
          }
          this.products = productList;
          // Inicializar ratings y comentarios para cada producto
          this.products.forEach(product => {
            if (!this.productRatings[product.idproducto]) {
              this.productRatings[product.idproducto] = { rating: 0, comments: [] };
            }
          });
          this.filterProducts();
          this.updatePagination();
        },
        (error) => {
          console.error('Error en la solicitud HTTP:', error);
          this.errorMessage = `Error al cargar productos: ${error.status} - ${error.statusText}`;
          if (error.status === 0) {
            this.errorMessage += ' (Posible problema de CORS o servidor no accesible)';
          }
        }
      );
  }

  searchProducts() {
    if (!this.searchTerm.trim()) {
      this.fetchProducts();
      return;
    }
    this.filteredProducts = this.products.filter(product =>
      product.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      product.descripcion.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.currentPage = 1;
    this.totalPages = Math.ceil(this.filteredProducts.length / this.pageSize);
    this.updatePagination();
  }

  filterProducts() {
    let tempProducts = [...this.products];

    if (this.searchTerm && !this.products.length) {
      this.searchProducts();
      return;
    }

    if (this.selectedCategory !== 'todos') {
      tempProducts = tempProducts.filter(product =>
        this.mapCategory(product.idtipoproducto)?.toLowerCase() === this.selectedCategory.toLowerCase()
      );
    }

    this.sortProducts(tempProducts);

    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.filteredProducts = tempProducts.slice(startIndex, startIndex + this.pageSize);
    this.totalPages = Math.ceil(tempProducts.length / this.pageSize);
    this.updatePagination();
  }

  sortProducts(products = this.filteredProducts) {
    switch (this.sortOption) {
      case 'precio-asc':
        products.sort((a, b) => parseFloat(a.preciomenudeo) - parseFloat(b.preciomenudeo));
        break;
      case 'precio-desc':
        products.sort((a, b) => parseFloat(b.preciomenudeo) - parseFloat(a.preciomenudeo));
        break;
      case 'nombre-asc':
        products.sort((a, b) => a.nombre.localeCompare(b.nombre));
        break;
      case 'nombre-desc':
        products.sort((a, b) => b.nombre.localeCompare(a.nombre));
        break;
    }
    this.filteredProducts = products;
  }

  updatePagination() {
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.filterProducts();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.filterProducts();
    }
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.filterProducts();
  }

  mapCategory(idTipoProducto: number): string {
    const categoryMap: { [key: number]: string } = {
      1: 'Productos de limpieza',
      2: 'Aromatizantes',
      3: 'Bases multiusos',
      4: 'Shampoo para manos'
    };
    return categoryMap[idTipoProducto] || 'otros';
  }

  // Métodos para los modales
  openAppModal() {
    this.showAppModal = true;
  }

  closeAppModal() {
    this.showAppModal = false;
  }

  openDetailsModal(product: any) {
    this.selectedProduct = product;
    // Asegurarnos de que el producto tenga una entrada en productRatings
    if (!this.productRatings[product.idproducto]) {
      this.productRatings[product.idproducto] = { rating: 0, comments: [] };
    }
    this.showDetailsModal = true;
  }

  closeDetailsModal() {
    this.showDetailsModal = false;
    this.selectedProduct = null;
  }

  setRating(rating: number) {
    if (this.selectedProduct && this.productRatings[this.selectedProduct.idproducto]) {
      this.productRatings[this.selectedProduct.idproducto].rating = rating;
    }
  }

  addComment(comment: string) {
    if (this.selectedProduct && this.productRatings[this.selectedProduct.idproducto] && comment.trim()) {
      this.productRatings[this.selectedProduct.idproducto].comments.push(comment);
    }
  }
}