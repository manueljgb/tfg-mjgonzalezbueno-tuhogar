import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router'; // Añade esta línea
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule } from '@angular/material/snack-bar'; // Añade esta línea
import { MatTabsModule } from '@angular/material/tabs'; // Añade esta línea

import { DashboardComponent } from './dashboard/dashboard.component';
import { ViviendasComponent } from './viviendas/viviendas.component';
import { DatosComponent } from './datos/datos.component';
import { ViviendaFormComponent } from './viviendas/vivienda-form/vivienda-form.component';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { NgChartsModule } from 'ng2-charts';
import { ClientesComponent } from './clientes/clientes.component';

@NgModule({
  declarations: [
    DashboardComponent,
    ViviendasComponent,
    DatosComponent,
    ViviendaFormComponent,
    ClientesComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatTableModule,
    MatSortModule,
    FormsModule,
    MatTabsModule, 
    NgChartsModule
  ],
  entryComponents: [ViviendaFormComponent]
})
export class BackofficeModule { }
