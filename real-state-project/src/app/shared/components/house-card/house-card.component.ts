import { Component, Input, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ApartmentStatus } from './apartment-status.enum';
import { ViviendasService } from '../../services/viviendas.service';
import { HouseCardDataInterface } from './house-card-data.interface';
import KeenSlider, { KeenSliderInstance, KeenSliderPlugin } from "keen-slider"
import * as L from 'leaflet';


function ThumbnailPlugin(main: KeenSliderInstance): KeenSliderPlugin {
  return (slider) => {
    function removeActive() {
      slider.slides.forEach((slide) => {
        slide.classList.remove("active")
      })
    }
    function addActive(idx: number) {
      slider.slides[idx].classList.add("active")
    }

    function addClickEvents() {
      slider.slides.forEach((slide, idx) => {
        slide.addEventListener("click", () => {
          main.moveToIdx(idx)
        })
      })
    }

    slider.on("created", () => {
      addActive(slider.track.details.rel)
      addClickEvents()
      main.on("animationStarted", (main) => {
        removeActive()
        const next = main.animator.targetIdx || 0
        addActive(main.track.absToRel(next))
        slider.moveToIdx(Math.min(slider.track.details.maxIdx, next))
      })
    })
  }
}
@Component({
  selector: 'app-house-card',
  templateUrl: './house-card.component.html',
  styleUrls: [
    './house-card.component.scss',
    "../../../../../node_modules/keen-slider/keen-slider.min.css"
  ]
})
export class HouseCardComponent implements OnInit {

  @ViewChild("sliderRef") sliderRef!: ElementRef<HTMLElement>;
  @ViewChild("thumbnailRef") thumbnailRef!: ElementRef<HTMLElement>;
  @ViewChild("mapRef") mapRef!: ElementRef<HTMLElement>;

  slider!: KeenSliderInstance;
  thumbnailSlider!: KeenSliderInstance;
  mapa!: L.Map;
  fav: boolean = false;

  @Input() appartmentData!: HouseCardDataInterface;
  @Input() mapIndex!: number;

  constructor() { }

  ngOnInit(): void {
    const favs: number[] = JSON.parse(sessionStorage.getItem('favs') || '[]');
    this.fav = favs.includes(this.appartmentData.id);
  }

  getDiscountedPrice(price: number, discount: number): number {
    return price * ((100 - discount) / 100);
  }


  ngAfterViewInit() {
    this.initMap();
    this.slider = new KeenSlider(this.sliderRef.nativeElement)
    this.thumbnailSlider = new KeenSlider(
      this.thumbnailRef.nativeElement,
      {
        initial: 0,
        slides: {
          perView: 4,
          spacing: 10,
        },
      },
      [ThumbnailPlugin(this.slider)]
    )
  }

  ngOnDestroy() {
    if (this.slider) this.slider.destroy()
    if (this.thumbnailSlider) this.thumbnailSlider.destroy()
    if (this.mapa) this.mapa.remove()
  }

  initMap() {
    const ubicacion: L.LatLngExpression = [this.appartmentData.latitud, this.appartmentData.longitud];
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

    L.circle(ubicacion, {
      radius: 150,
      color: '#227c9d',
      fillColor: '#227c9d',
      fillOpacity: 0.25
    }).addTo(this.mapa);
  }

  toggleFavStatus(): void {
    let favs: number[] = JSON.parse(sessionStorage.getItem('favs') || '[]');
    !this.fav? favs.push(this.appartmentData.id) : favs = favs.filter(item => item != this.appartmentData.id);
    this.fav = !this.fav;
    favs.sort();
    sessionStorage.setItem('favs', JSON.stringify(favs));
  }
}
