import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ProductsComponent } from './pages/products/products.component';
import { AdminSidebarComponent } from './admin/admin-sidebar/admin-sidebar.component'; // Cambiado aquí
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { ProductListComponent } from './admin/product-list/product-list.component';
import { UserListComponent } from './admin/user-list/user-list.component';
import { authGuard } from './guards/auth.guard'; 
import { ProductFormComponent } from './admin/product-form/product-form.component';
import { EmployeeListComponent } from './admin/employee-list/employee-list.component';
import { InventoryListComponent } from './admin/inventory-list/inventory-list.component';
import { NosotrosComponent } from './pages/nosotros/nosotros.component';
import { ContactanosComponent } from './pages/contactanos/contactanos.component';
import { VentasListComponent } from './admin/ventas-list/ventas-list.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'contactanos', component: ContactanosComponent },
  { path: 'nosotros', component: NosotrosComponent },

  {
    path: 'admin',
    component: AdminSidebarComponent, // Cambiado de DashboardComponent a AdminSidebarComponent
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'product-form', component: ProductListComponent },
      { path: 'employees', component: EmployeeListComponent },
      { path: 'inventory', component: InventoryListComponent },
      { path: 'ventas', component: VentasListComponent },
      { path: 'arduino', component: ProductFormComponent },
      { path: 'users', component: UserListComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }