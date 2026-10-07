import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { BehaviorSubject, Observable, combineLatest, map, startWith } from 'rxjs';
import { ClientInterface } from 'src/app/shared/components/client-card/client.interface';
import { ClientsService } from 'src/app/shared/services/clients.service';
import { ViviendasService } from 'src/app/shared/services/viviendas.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.scss']
})
export class ClientesComponent implements OnInit {
  viviendas$ = this.viviendasService.viviendas$;
  guardando: boolean = false;
  filtrosForm!: FormGroup;
  notaForm!: FormGroup;
  clientesFiltrados$!: Observable<ClientInterface[]>;
  resumenClientes$ = this.clientsService.getResumenClientes();
  clienteSeleccionado$ = new BehaviorSubject<ClientInterface | null>(null);
  estados = [
    { value: 'NEW', label: 'Nuevo' },
    { value: 'CONTACTED', label: 'Contactado' },
    { value: 'FOLLOW_UP', label: 'Seguimiento' },
    { value: 'CLOSED', label: 'Cerrado' }
  ];

  constructor(
    private clientsService: ClientsService,
    private viviendasService: ViviendasService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.filtrosForm = this.fb.group({
      busqueda: [''],
      estado: ['']
    });
    this.notaForm = this.fb.group({
      nota: ['']
    });

    const filtros$ = this.filtrosForm.valueChanges.pipe(startWith(this.filtrosForm.value));

    this.clientesFiltrados$ = combineLatest([
      this.clientsService.clientes$,
      filtros$
    ]).pipe(
      map(([clientes, filtros]) => clientes.filter(cliente => {
        const texto = `${cliente.name} ${cliente.phone} ${cliente.mail}`.toLowerCase();
        const estado = cliente.status || 'NEW';

        return (
          (!filtros.busqueda || texto.includes(filtros.busqueda.toLowerCase())) &&
          (!filtros.estado || estado === filtros.estado)
        );
      }))
    );


  }

  seleccionarCliente(cliente: ClientInterface): void {
    this.clienteSeleccionado$.next(cliente);
    this.notaForm.reset();
  }

  cerrarDetalle(): void {
    this.clienteSeleccionado$.next(null);
    this.notaForm.reset();
  }

  getNombreCliente(cliente: ClientInterface): string {
    return cliente.name && cliente.name.trim() ? cliente.name : 'Cliente sin nombre';
  }

  getMensajesCliente(cliente: ClientInterface): string[] {
    return (cliente.messages || []).filter(message => message && message.trim());
  }

  getNotasCliente(cliente: ClientInterface): string[] {
    return (cliente.notes || []).filter(note => note && note.trim());
  }

  getEstadoLabel(status: string | undefined): string {
    const estado = this.estados.find(item => item.value === (status || 'NEW'));
    return estado ? estado.label : 'Nuevo';
  }

  cambiarEstado(cliente: ClientInterface, status: string): void {
    this.clientsService.actualizarEstadoCliente(cliente, status).subscribe({ next: actualizado => {
      this.clienteSeleccionado$.next(actualizado);
      this.clientsService.refrescarClientes();
    }, error: () => this.snackBar.open('No se ha actualizado el estado', 'Cerrar', { duration: 3000 }) });
  }

  addNota(cliente: ClientInterface): void {
    const nota = this.notaForm.get('nota')?.value?.trim();
    if (nota) {
      this.clientsService.addNotaCliente(cliente, nota).subscribe({ next: actualizado => {
        this.clienteSeleccionado$.next(actualizado);
        this.notaForm.reset();
        this.clientsService.refrescarClientes();
      }, error: () => this.snackBar.open('No se ha guardado la nota', 'Cerrar', { duration: 3000 }) });
    }
  }
  getViviendasCliente(cliente: ClientInterface, viviendas: any[]): any[] {
    return viviendas.filter(vivienda => (cliente.favs_appartments || []).includes(vivienda.id) ||
      vivienda.client_id === cliente.id || (vivienda.operations || []).some((operacion: any) => operacion.client_id === cliente.id));
  }

  registrarOperacion(cliente: ClientInterface, vivienda: any, estado: 'RESERVED' | 'SOLD' | 'AVAILABLE'): void {
    if (this.guardando || cliente.id === undefined) return;
    const titulo = estado === 'RESERVED' ? 'Reservar vivienda' : estado === 'SOLD' ? 'Registrar venta' : 'Cancelar reserva';
    this.dialog.open(ConfirmationDialogComponent, {
      width: '400px', data: { title: titulo, message: `Vivienda ${vivienda.id} para ${cliente.name}` }
    }).afterClosed().subscribe(confirmado => {
      if (!confirmado || this.guardando) return;
      this.guardando = true;
      this.viviendasService.registrarOperacion(vivienda.id, cliente.id!, estado).subscribe({
        next: () => {
          this.guardando = false;
          this.viviendasService.refrescarViviendas();
          this.snackBar.open('Operación registrada en la vivienda', 'Cerrar', { duration: 3000 });
        },
        error: () => {
          this.guardando = false;
          this.viviendasService.refrescarViviendas();
          this.snackBar.open('No se ha guardado. Revisa la disponibilidad de la vivienda.', 'Cerrar', { duration: 4000 });
        }
      });
    });
  }
}
