import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
 
  // Valores principales y cambios porcentuales
  salesValue: string = '$15,000';
  productsValue: string = '800 Unidades';
  restockValue: string = '50 Unidades';

  salesChange: string = '-2.92%';
  productsChange: string = '+5.14%';
  restockChange: string = '-1.35%';

  // Rangos de tiempo seleccionados
  salesRange: string = '1W';
  productsRange: string = '1W';
  restockRange: string = '1W';

  constructor() { }

  ngOnInit(): void {
    // Aquí podrías cargar los datos desde un servicio o API
  }

  // Métodos para actualizar los rangos de tiempo
  updateSalesChart(range: string): void {
    this.salesRange = range;
  }

  updateProductsChart(range: string): void {
    this.productsRange = range;
  }

  updateRestockChart(range: string): void {
    this.restockRange = range;
  }
}