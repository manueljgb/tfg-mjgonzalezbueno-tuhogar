import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { HouseCardDataInterface } from '../components/house-card/house-card-data.interface';

@Injectable({
  providedIn: 'root'
})
export class PropertiesFilterService {
  private ubicationFilter = new BehaviorSubject<string[]>([]);
  private maxPriceFilter = new BehaviorSubject<number>(Number.MAX_SAFE_INTEGER);
  private roomsNumberFilter = new BehaviorSubject<number>(0);
  private extrasFilter = new BehaviorSubject<string[]>([]);
  private favoritesFilter = new BehaviorSubject<boolean>(false);

  constructor() { }

  updateUbicationFilter(ubicaciones: string[]): void {
    this.ubicationFilter.next(ubicaciones);
  }

  updateMaxPriceFilter(precioMaximo: number): void {
    this.maxPriceFilter.next(precioMaximo);
  }

  updateRoomsNumberFilter(numHabitaciones: number): void {
    this.roomsNumberFilter.next(numHabitaciones);
  }

  updateExtrasFilter(extras: string[]): void {
    this.extrasFilter.next(extras);
  }

  updateFavoritesFilter(onlyFavorites: boolean): void {
    this.favoritesFilter.next(onlyFavorites);
  }

  getFilteredProperties(viviendas: HouseCardDataInterface[]): Observable<any[]> {
    return combineLatest([
      this.ubicationFilter,
      this.maxPriceFilter,
      this.roomsNumberFilter,
      this.extrasFilter,
      this.favoritesFilter
    ]).pipe(
      map(([ubicaciones, precioMaximo, numHabitaciones, extras, onlyFavorites]) => {
        let filteredViviendas = viviendas.filter(vivienda =>
          (ubicaciones.length === 0 || ubicaciones.includes(vivienda.ubication)) &&
          vivienda.price * ((100 - vivienda.discount) / 100) <= precioMaximo &&
          vivienda.rooms >= numHabitaciones &&
          (extras.length === 0 || extras.every(extra => vivienda.extras.includes(extra)))
        );

        if (onlyFavorites) {
          console.log('onlyFavorites', onlyFavorites);
          const favorites = JSON.parse(sessionStorage.getItem('favs') || '[]');
          console.log('favorites', favorites);
          filteredViviendas = filteredViviendas.filter(vivienda => favorites.includes(vivienda.id));
        }

        return filteredViviendas;
      }),
      distinctUntilChanged()
    );
  }

  getFilteredPropertiesByFavorites(viviendas: HouseCardDataInterface[]): Observable<any[]> {
    return this.favoritesFilter.pipe(
      map(onlyFavorites => {
        if (onlyFavorites) {
          const favorites = JSON.parse(sessionStorage.getItem('favorites') || '[]');
          return viviendas.filter(vivienda => favorites.includes(vivienda.id));
        }
        return viviendas;
      })
    );
  }
}
