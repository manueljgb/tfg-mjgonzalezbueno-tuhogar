import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ViviendasService } from '../../shared/services/viviendas.service';
import { ViviendaFormComponent } from './vivienda-form/vivienda-form.component';
import { ConfirmationDialogComponent } from '../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BehaviorSubject, Observable, combineLatest, map, startWith } from 'rxjs';
import { ClientsService } from '../../shared/services/clients.service';

@Component({
  selector: 'app-viviendas',
  templateUrl: './viviendas.component.html',
  styleUrls: ['./viviendas.component.scss']
})
export class ViviendasComponent implements OnInit {
  filtrosForm!: FormGroup;
  viviendasFiltradas$!: Observable<any[]>;
  resumenViviendas$!: Observable<any>;
  ordenActual: string = '';
  direccionOrden: 'asc' | 'desc' = 'asc';
  private orden$ = new BehaviorSubject<any>({ columna: '', direccion: 'asc' });

  constructor(
    private viviendasService: ViviendasService,
    private clientsService: ClientsService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.filtrosForm = this.fb.group({
      estado: [''],
      ubicacion: [''],
      precioMaximo: [null]
    });

    const filtros$ = this.filtrosForm.valueChanges.pipe(startWith(this.filtrosForm.value));

    this.viviendasFiltradas$ = combineLatest([
      this.viviendasService.viviendas$,
      filtros$,
      this.orden$
    ]).pipe(
      map(([viviendas, filtros, orden]) => {
        const viviendasFiltradas = viviendas.filter(vivienda => {
          return (
            (!filtros.estado || vivienda.status.toLowerCase() === filtros.estado) &&
            (!filtros.ubicacion || vivienda.ubication.toLowerCase().includes(filtros.ubicacion.toLowerCase())) &&
            (!filtros.precioMaximo || vivienda.price <= filtros.precioMaximo)
          );
        });

        if (orden.columna) {
          viviendasFiltradas.sort((a, b) => {
            const valorA = a[orden.columna];
            const valorB = b[orden.columna];

            if (valorA < valorB) return orden.direccion === 'asc' ? -1 : 1;
            if (valorA > valorB) return orden.direccion === 'asc' ? 1 : -1;
            return 0;
          });
        }

        return viviendasFiltradas;
      })
    );

    this.resumenViviendas$ = this.viviendasService.viviendas$.pipe(
      map(viviendas => {
        const disponibles = viviendas.filter(vivienda => vivienda.status === 'AVAILABLE').length;
        const reservadas = viviendas.filter(vivienda => vivienda.status === 'RESERVED').length;
        const vendidas = viviendas.filter(vivienda => vivienda.status === 'SOLD').length;
        const precioMedio = viviendas.length ? viviendas.reduce((total, vivienda) => total + vivienda.price, 0) / viviendas.length : 0;

        return {
          total: viviendas.length,
          disponibles,
          reservadas,
          vendidas,
          precioMedio
        };
      })
    );
  }

  cargarViviendas(): void {
    this.viviendasService.refrescarViviendas();
  }

  aplicarFiltros(): void {
    this.filtrosForm.updateValueAndValidity();
  }

  ordenar(columna: string): void {
    if (this.ordenActual === columna) {
      this.direccionOrden = this.direccionOrden === 'asc' ? 'desc' : 'asc';
    } else {
      this.ordenActual = columna;
      this.direccionOrden = 'asc';
    }

    this.orden$.next({ columna: this.ordenActual, direccion: this.direccionOrden });
  }

  obtenerIconoOrdenamiento(columna: string): string {
    if (this.ordenActual !== columna) return '↕';
    return this.direccionOrden === 'asc' ? '↑' : '↓';
  }

  editarVivienda(id: number): void {
    const dialogRef = this.dialog.open(ViviendaFormComponent, {
      width: '600px',
      data: { id: id }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cargarViviendas();
      }
    });
  }

  crearVivienda(): void {
    const dialogRef = this.dialog.open(ViviendaFormComponent, {
      width: '600px',
      data: { id: 'nueva-vivienda' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cargarViviendas();
      }
    });
  }

  eliminarVivienda(id: number): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: { 
        title: 'Confirmar eliminación', 
        message: '¿Está seguro de que desea eliminar esta vivienda?' 
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.viviendasService.eliminarVivienda(id).subscribe(
          () => {
            this.snackBar.open('Vivienda eliminada con éxito', 'Cerrar', { duration: 3000 });
            this.cargarViviendas();
          },
          (error) => {
            console.error('Error al eliminar la vivienda:', error);
            this.snackBar.open('Error al eliminar la vivienda', 'Cerrar', { duration: 3000 });
          }
        );
      }
    });
  }

  reservarVivienda(vivienda: any): void {
    this.confirmarOperacion(vivienda, 'RESERVED');
  }

  venderVivienda(vivienda: any): void {
    this.confirmarOperacion(vivienda, 'SOLD');
  }

  cancelarReserva(vivienda: any): void {
    this.confirmarOperacion(vivienda, 'AVAILABLE');
  }

  confirmarOperacion(vivienda: any, estado: 'RESERVED' | 'SOLD' | 'AVAILABLE'): void {
    this.clientsService.getClientes().subscribe({ next: response => {
      const clientes = response.body.filter((cliente: any) =>
        estado === 'RESERVED' || cliente.id === vivienda.client_id);
      if (!clientes.length) {
        this.snackBar.open('Hace falta un cliente asociado. Revisa la ficha de clientes.', 'Cerrar', { duration: 4000 });
        return;
      }
      const titulo = estado === 'RESERVED' ? 'Confirmar reserva' : estado === 'SOLD' ? 'Confirmar venta' : 'Cancelar reserva';
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        width: '450px',
        data: { title: titulo, message: 'Vivienda ' + vivienda.id + ' en ' + vivienda.ubication, clientes }
      });
      dialogRef.afterClosed().subscribe(clienteId => {
        if (clienteId === false || clienteId === undefined) return;
        this.viviendasService.registrarOperacion(vivienda.id, clienteId, estado).subscribe({
          next: () => {
            this.snackBar.open('Operación registrada', 'Cerrar', { duration: 3000 });
            this.cargarViviendas();
          },
          error: () => {
            this.snackBar.open('No se ha guardado la operación. Comprueba el estado y el cliente asociado.', 'Cerrar', { duration: 4000 });
            this.cargarViviendas();
          }
        });
      });
    }, error: () => this.snackBar.open('No se han podido cargar los clientes', 'Cerrar', { duration: 3000 }) });
  }
}
