// home.component.ts
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  featuredProducts: any[] = [];
  errorMessage: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchFeaturedProducts();
  }

  fetchFeaturedProducts() {
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

          // Take only the first 4 products
          this.featuredProducts = productList.slice(0, 4);
        },
        (error) => {
          console.error('Error en la solicitud HTTP:', error);
          this.errorMessage = `Error al cargar productos: ${error.status} - ${error.statusText}`;
        }
      );
  }
}