import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, filter, map, shareReplay, switchMap, throwError } from 'rxjs';
import { ApartmentStatus } from '../components/house-card/apartment-status.enum';
import { environment } from 'src/environments/environment';

interface FiltrosViviendas {
  estado?: string;
  ubicacion?: string;
  precioMaximo?: number | null;
  ordenarPor?: string;
  direccion?: 'asc' | 'desc';
}

interface PrecioZona {
  zona: string;
  precioMedio: number;
  precioMetro: number;
  viviendas: number;
}

@Injectable({
  providedIn: 'root'
})
export class ViviendasService {
  private apiUrl = environment.apiUrl + '/appartments';
  private refreshViviendas$ = new BehaviorSubject<void>(undefined);
  viviendas$ = this.refreshViviendas$.pipe(
    switchMap(() => this.http.get<any[]>(this.apiUrl)),
    shareReplay(1)
  );

  constructor(private http: HttpClient) { }


  getViviendasPorEstado(status: ApartmentStatus): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}`, { observe: 'response' }).pipe(
      map((response: HttpResponse<any>) => {
        if (response.body) {
          const viviendasFiltradas = response.body.filter((vivienda: any) => vivienda.status === status);
          return { ...response, body: viviendasFiltradas };
        }
        return response;
      })
    );
  }

  getVivienda(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`, { observe: 'response' })
  }

  getViviendas(): Observable<HttpResponse<any>> {
    return this.http.get<any>(this.apiUrl, { observe: 'response' });
  }

  refrescarViviendas(): void {
    this.refreshViviendas$.next();
  }

  buscarViviendas(filtros: FiltrosViviendas): Observable<any[]> {
    const params: string[] = [];

    if (filtros.estado) {
      params.push(`status=${filtros.estado}`);
    }

    if (filtros.ubicacion) {
      params.push(`ubication_like=${filtros.ubicacion}`);
    }

    if (filtros.precioMaximo) {
      params.push(`price_lte=${filtros.precioMaximo}`);
    }

    if (filtros.ordenarPor) {
      params.push(`_sort=${filtros.ordenarPor}`);
      params.push(`_order=${filtros.direccion || 'asc'}`);
    }

    const url = params.length ? `${this.apiUrl}?${params.join('&')}` : this.apiUrl;
    return this.http.get<any[]>(url);
  }

  getPrecioMedioPorZona(): Observable<PrecioZona[]> {
    return this.viviendas$.pipe(
      map(viviendas => {
        const zonas: {[key: string]: any[]} = {};

        viviendas.forEach(vivienda => {
          if (!zonas[vivienda.ubication]) {
            zonas[vivienda.ubication] = [];
          }
          zonas[vivienda.ubication].push(vivienda);
        });

        return Object.entries(zonas).map(([zona, viviendasZona]) => {
          const precioTotal = viviendasZona.reduce((total, vivienda) => total + vivienda.price, 0);
          const metrosTotal = viviendasZona.reduce((total, vivienda) => total + vivienda.square_metres, 0);

          return {
            zona,
            precioMedio: Math.round(precioTotal / viviendasZona.length),
            precioMetro: Math.round(precioTotal / metrosTotal),
            viviendas: viviendasZona.length
          };
        });
      })
    );
  }

  getResumenViviendasPorEstado(): Observable<{estado: string, viviendas: number}[]> {
    return this.viviendas$.pipe(
      map(viviendas => {
        const estados: {[key: string]: number} = {};
        viviendas.forEach(vivienda => {
          estados[vivienda.status] = (estados[vivienda.status] || 0) + 1;
        });
        return Object.entries(estados).map(([estado, viviendas]) => ({estado, viviendas}));
      })
    );
  }

  getScatterPrecioMetros(): Observable<{x: number, y: number}[]> {
    return this.viviendas$.pipe(
      map(viviendas => viviendas.map(vivienda => ({
        x: vivienda.square_metres,
        y: vivienda.price
      })))
    );
  }

  crearVivienda(vivienda: any): Observable<HttpResponse<any>> {
    return this.http.post<any>(this.apiUrl, vivienda, { observe: 'response' });
  }

  actualizarVivienda(id: number, vivienda: any): Observable<HttpResponse<any>> {
    return this.http.patch<any>(`${this.apiUrl}/${id}`, vivienda, { observe: 'response' });
  }

  registrarOperacion(id: number, clienteId: number, estado: 'RESERVED' | 'SOLD' | 'AVAILABLE'): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      switchMap(vivienda => {
        const reservaValida = estado === 'RESERVED' && (vivienda.status === 'AVAILABLE' ||
          (vivienda.status === 'RESERVED' && vivienda.client_id == null));
        const cierreValido = (estado === 'SOLD' || estado === 'AVAILABLE') &&
          vivienda.status === 'RESERVED' && vivienda.client_id === clienteId;
        if (!reservaValida && !cierreValido) {
          return throwError(() => new Error('La vivienda ha cambiado de estado o pertenece a otra reserva. Actualiza el listado.'));
        }
        return this.http.get<any>(environment.apiUrl + '/clients/' + clienteId).pipe(
          switchMap(cliente => {
            const fecha = new Date().toISOString();
            return this.http.patch<any>(`${this.apiUrl}/${id}`, {
              status: estado,
              client_id: estado === 'AVAILABLE' ? null : cliente.id,
              sale_date: estado === 'SOLD' ? fecha : null,
              operations: [...(vivienda.operations || []), {
                status: estado, client_id: cliente.id, date: fecha, price: vivienda.price
              }]
            });
          })
        );
      })
    );
  }

  eliminarVivienda(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, { observe: 'response' });
  }
}
