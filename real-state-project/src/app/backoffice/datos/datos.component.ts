import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientsService } from 'src/app/shared/services/clients.service';
import { DatosVentasService } from 'src/app/shared/services/datos-ventas.service';
import { ViviendasService } from 'src/app/shared/services/viviendas.service';

@Component({
  selector: 'app-datos',
  templateUrl: './datos.component.html',
  styleUrls: ['./datos.component.scss']
})
export class DatosComponent implements OnInit, OnDestroy {
  annosGraficas: number[] = [2020, 2021, 2022, 2023];
  filtrosVentasForm!: FormGroup;
  totalVentas: number = 0;
  ubicaciones: string[] = ['Huelva', 'Punta Umbría', 'El Rompido', 'El Portil'];
  tiposVivienda = [{ value: 'Apartment', label: 'Apartamento' }, { value: 'House', label: 'Casa' }];
  private subscriptions = new Subscription();
  chartOptions: ChartOptions = { responsive: true, maintainAspectRatio: false, animation: false };
  ventasOptions: ChartOptions = {
    responsive: true, maintainAspectRatio: false, animation: false,
    scales: { y: { beginAtZero: true, ticks: { precision: 0 } } }
  };
  ventasData: ChartData<'bar'> = {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    datasets: []
  };
  viviendasData: ChartData<'doughnut'> = { labels: [], datasets: [{ data: [] }] };
  clientesData: ChartData<'doughnut'> = { labels: [], datasets: [{ data: [] }] };

  constructor(
    private viviendasService: ViviendasService,
    private clientsService: ClientsService,
    private datosVentasService: DatosVentasService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.filtrosVentasForm = this.fb.group({
      precioMinimo: [null, Validators.min(0)],
      precioMaximo: [null, Validators.min(0)],
      ubicacion: [''],
      tipoVivienda: ['']
    });
    const colores = ['#227c9d', '#17a398', '#ffcb77', '#7b8c9e'];
    this.ventasData.datasets = this.annosGraficas.map((anno, index) => ({
      data: Array(12).fill(0), label: 'Ventas ' + anno, backgroundColor: colores[index]
    }));
    this.aplicarFiltrosVentas();
    this.subscriptions.add(this.viviendasService.getResumenViviendasPorEstado().subscribe(data => {
      this.viviendasData = { labels: data.map(item => this.getEstadoLabel(item.estado)),
        datasets: [{ data: data.map(item => item.viviendas), backgroundColor: ['#227c9d', '#ffcb77', '#7b8c9e'] }] };
    }));
    this.subscriptions.add(this.clientsService.getClientesPorEstado().subscribe(data => {
      this.clientesData = { labels: data.map(item => this.getEstadoLabel(item.estado)),
        datasets: [{ data: data.map(item => item.clientes), backgroundColor: ['#227c9d', '#17a398', '#ffcb77', '#7b8c9e'] }] };
    }));
  }

  rangoPrecioInvalido(): boolean {
    const { precioMinimo, precioMaximo } = this.filtrosVentasForm.value;
    return precioMinimo != null && precioMaximo != null && precioMinimo > precioMaximo;
  }

  aplicarFiltrosVentas(): void {
    if (this.filtrosVentasForm.invalid || this.rangoPrecioInvalido()) return;
    const filtros = this.filtrosVentasForm.value;
    this.annosGraficas.forEach((anno, index) => {
      this.subscriptions.add(this.datosVentasService.getResumenMensualPorAnno(anno, filtros).subscribe(data => {
        this.ventasData.datasets[index].data = data.ventas;
        this.ventasData = { ...this.ventasData };
        this.totalVentas = this.ventasData.datasets.reduce((total, serie) =>
          total + serie.data.reduce<number>((suma, valor) => suma + Number(valor), 0), 0);
      }));
    });
  }

  borrarFiltrosVentas(): void {
    this.filtrosVentasForm.reset({ precioMinimo: null, precioMaximo: null, ubicacion: '', tipoVivienda: '' });
    this.aplicarFiltrosVentas();
  }

  getEstadoLabel(estado: string): string {
    const estados: {[key: string]: string} = {
      NEW: 'Nuevo', CONTACTED: 'Contactado', FOLLOW_UP: 'Seguimiento', CLOSED: 'Cerrado',
      AVAILABLE: 'Disponible', RESERVED: 'Reservada', SOLD: 'Vendida'
    };
    return estados[estado] || estado;
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
