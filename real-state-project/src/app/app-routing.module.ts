import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './core/home/home.component';
import { SellComponent } from './core/sell/sell.component';
import { PuntaUmbriaComponent } from './core/places/punta-umbria/punta-umbria.component';
import { HuelvaComponent } from './core/places/huelva/huelva.component';
import { ElRompidoComponent } from './core/places/el-rompido/el-rompido.component';
import { ElPortilComponent } from './core/places/el-portil/el-portil.component';
import { PropertiesComponent } from './core/properties/properties.component';
import { LoginComponent } from './shared/components/login/login.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { ViviendasComponent } from './backoffice/viviendas/viviendas.component';
import { DashboardComponent } from './backoffice/dashboard/dashboard.component';
import { DatosComponent } from './backoffice/datos/datos.component';
import { ClientesComponent } from './backoffice/clientes/clientes.component';

const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'viviendas', component: PropertiesComponent, pathMatch: 'full' },
  { path: 'vende-tu-vivienda', component: SellComponent, pathMatch: 'full' },
  { path: 'punta-umbria', component: PuntaUmbriaComponent, pathMatch: 'full' },
  { path: 'huelva', component: HuelvaComponent, pathMatch: 'full' },
  { path: 'el-rompido', component: ElRompidoComponent, pathMatch: 'full' },
  { path: 'el-portil', component: ElPortilComponent, pathMatch: 'full' },
  { path: 'login', component: LoginComponent, pathMatch: 'full' },
  {
    path: 'backoffice',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'viviendas', component: ViviendasComponent },
      { path: 'clientes', component: ClientesComponent },
      { path: 'datos', component: DatosComponent },
      { path: '', redirectTo: 'viviendas', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled',
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
