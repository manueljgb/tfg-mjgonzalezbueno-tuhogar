import { AfterViewInit, Component, ElementRef, HostListener, Input, OnDestroy, ViewChild } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-place-info',
  templateUrl: './place-info.component.html',
  styleUrls: ['./place-info.component.scss']
})
export class PlaceInfoComponent implements AfterViewInit, OnDestroy{
  @ViewChild("mapRef") mapRef!: ElementRef<HTMLElement>;

  @Input() title: string;
  @Input() backgroundImage: string;
  @Input() introText: string;
  @Input() data: any;
  @Input() latitud: number = 0;
  @Input() longitud: number = 0;
  isMobile: boolean = window.innerWidth <= 740;
  displayFullText: boolean = !this.isMobile;
  mapa!: L.Map;
  @HostListener('window:resize', ['$event'])
  onResize(_event: any) {
    this.isMobile = window.innerWidth <= 740;;
  }

  constructor() {
    this.title = '';
    this.backgroundImage = '';
    this.introText = '';
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  ngOnDestroy(): void {
    if (this.mapa) this.mapa.remove();
  }


  toggleText(): void {
    this.displayFullText = !this.displayFullText;
    console.log(this.displayFullText);
  }

  initMap() {
    const ubicacion: L.LatLngExpression = [this.latitud, this.longitud];
    this.mapa = L.map(this.mapRef.nativeElement, {
      center: ubicacion,
      zoom: 15,
      scrollWheelZoom: false
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap'
    }).addTo(this.mapa);

    L.marker(ubicacion, {
      icon: L.divIcon({ className: 'house-map-marker' })
    }).addTo(this.mapa);
  }
}
