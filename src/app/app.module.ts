import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { ProductCardComponent } from './components/product-card/product-card.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { HttpClientModule } from '@angular/common/http'; // Importa esto
import { MatSelectModule } from '@angular/material/select';
//pages
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ProductsComponent } from './pages/products/products.component';

//admin
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { ProductListComponent } from './admin/product-list/product-list.component';
import { UserListComponent } from './admin/user-list/user-list.component';
import { ProductFormComponent } from './admin/product-form/product-form.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar'; // Para <mat-toolbar>
import { MatCardModule } from '@angular/material/card';       // Para <mat-card>
import { MatButtonModule } from '@angular/material/button';   // Para <mat-button>
import { MatFormFieldModule } from '@angular/material/form-field'; // Para <mat-form-field>
import { MatInputModule } from '@angular/material/input';     // Para <mat-input>
import { FormsModule, ReactiveFormsModule } from '@angular/forms';                 // Para formularios
import { MatIconModule } from '@angular/material/icon';
import { EmployeeListComponent } from './admin/employee-list/employee-list.component';
import { InventoryListComponent } from './admin/inventory-list/inventory-list.component';
import { NosotrosComponent } from './pages/nosotros/nosotros.component';
import { ContactanosComponent } from './pages/contactanos/contactanos.component';
import { AdminSidebarComponent } from './admin/admin-sidebar/admin-sidebar.component';
import { VentasListComponent } from './admin/ventas-list/ventas-list.component'; // Añade esto


@NgModule({
  declarations: [
    AppComponent,
    ProductCardComponent,
    NavbarComponent,
    FooterComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    ProductsComponent,
    DashboardComponent,
    ProductListComponent,
    UserListComponent,
    ProductFormComponent,
    EmployeeListComponent,
    InventoryListComponent,
    NosotrosComponent,
    ContactanosComponent,
    AdminSidebarComponent,
    VentasListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatIconModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatSelectModule,
  ],
  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
