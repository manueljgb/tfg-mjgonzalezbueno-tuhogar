import { Component, OnInit } from '@angular/core';
import { ViviendasService } from '../../shared/services/viviendas.service';
import { PropertiesFilterService } from 'src/app/shared/services/properties-filter.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ContactToBuyComponent } from 'src/app/shared/components/contact-to-buy/contact-to-buy.component';
import { ApartmentStatus } from 'src/app/shared/components/house-card/apartment-status.enum';

@Component({
  selector: 'app-properties',
  templateUrl: './properties.component.html',
  styleUrls: ['./properties.component.scss']
})
export class PropertiesComponent implements OnInit {

  data: any[] = [];
  comparativa: any[] = [];
  avisoComparativa: string = '';
  filteredProperties$!: Observable<any[]>;
  isLoading: boolean = true;

  ubicacionesSeleccionadas: string[] = [];
  maxPrice: number | undefined;
  minRooms: number | undefined;
  extrasSeleccionados: string[] = [];
  onlyFavorites: boolean = false;

  constructor(private viviendasService: ViviendasService,
    private filtroService: PropertiesFilterService,
    private spinnerService: NgxSpinnerService,
    public dialog: MatDialog,
    ) {

  }
  ngOnInit(): void {
    this.initViviendas();
  }

  initViviendas() {
    this.spinnerService.show();
    this.viviendasService.getViviendasPorEstado(ApartmentStatus.AVAILABLE)
      .subscribe((response: any) => {
        this.data = response.body;
        this.isLoading = false;
        this.actualizarViviendasFiltradas();
        this.spinnerService.hide();
      });

  }

  compararFavoritos(): void {
    const favoritos: number[] = JSON.parse(sessionStorage.getItem('favs') || '[]');
    const viviendas = this.data.filter(vivienda => favoritos.includes(vivienda.id));
    this.comparativa = [];
    this.avisoComparativa = '';
    if (viviendas.length < 2 || viviendas.length > 3) {
      this.avisoComparativa = 'Selecciona entre dos y tres viviendas disponibles como favoritas.';
      return;
    }
    this.comparativa = viviendas;
  }

  getTemplate(): string {
    return `<img alt="spinner" title="Spinner" src='assets/gif/spinner.gif'/>`;
  }

  applyFilters() {
    this.spinnerService.show();
    setTimeout(() => {
      this.filtroService.updateUbicationFilter(this.ubicacionesSeleccionadas);
      this.filtroService.updateMaxPriceFilter(this.maxPrice || Number.MAX_SAFE_INTEGER);
      this.filtroService.updateRoomsNumberFilter(this.minRooms || 0);
      this.filtroService.updateExtrasFilter(this.extrasSeleccionados);
      this.filtroService.updateFavoritesFilter(this.onlyFavorites);
      this.actualizarViviendasFiltradas();
      this.spinnerService.hide();
    }, 1000);
  }

  private actualizarViviendasFiltradas() {
    this.filteredProperties$ = this.filtroService.getFilteredProperties(this.data);
  }

  clearFilters() {
    this.ubicacionesSeleccionadas = [];
    this.maxPrice = undefined;
    this.minRooms = undefined;
    this.extrasSeleccionados = [];
    this.onlyFavorites = false;
    this.applyFilters();
  }

  openContactForm() : void{
    const dialogRef = this.dialog.open(ContactToBuyComponent, {
      height: '80%',
      width: '100%',
    });
  }

}
