import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, shareReplay } from 'rxjs';
import { environment } from 'src/environments/environment';

interface Venta {
  id: number;
  fecha_firma: string;
  id_catastro: number;
  precio: number;
  ubicacion?: string;
  tipoVivienda?: string;
  nombre_cliente: string;
  dni: string;
  contacto_cliente: string;
  banco: string;
  agente: string;
}

interface HipotecaPorBanco {
  banco: string;
  hipotecas: number;
}

interface ResumenMensual {
  ventas: number[];
  ingresos: number[];
}

interface FiltrosVentas {
  precioMinimo?: number | null;
  precioMaximo?: number | null;
  ubicacion?: string | null;
  tipoVivienda?: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class DatosVentasService {
  private apiUrl = environment.apiUrl + '/ventas';
  private ventas$ = this.http.get<Venta[]>(`${this.apiUrl}`).pipe(shareReplay(1));

  constructor(private http: HttpClient) { }

  getDatosVentas(): Observable<Venta[]> {
    return this.ventas$;
  }

  getDatosVentasPorMes(mes: number, año: number): Observable<Venta[]> {
    return this.getDatosVentas().pipe(
      map(ventas => ventas.filter(venta => {
        const [dia, mesStr, añoStr] = venta.fecha_firma.split('-');
        const fechaVenta = new Date(parseInt(añoStr), parseInt(mesStr) - 1, parseInt(dia));
        return fechaVenta.getMonth() === mes && fechaVenta.getFullYear() === año;
      }))
    );
  }

  getDatosVentasPorAño(año: number): Observable<Venta[]> {
    return this.getDatosVentas().pipe(
      map(ventas => ventas.filter(venta => {
        const [dia, mesStr, añoStr] = venta.fecha_firma.split('-');
        const fechaVenta = new Date(parseInt(añoStr), parseInt(mesStr) - 1, parseInt(dia));
        return fechaVenta.getFullYear() === año;
      }))
    );
  }

  getHipotecasPorBanco(): Observable<HipotecaPorBanco[]> {
    return this.getDatosVentas().pipe(
      map(ventas => {
        const hipotecasPorBanco: { [key: string]: number } = {};

        ventas.forEach(venta => {
          if (venta.banco) {
            hipotecasPorBanco[venta.banco] = (hipotecasPorBanco[venta.banco] || 0) + 1;
          }
        });

        return Object.entries(hipotecasPorBanco).map(([banco, hipotecas]) => ({
          banco,
          hipotecas
        }));
      })
    );
  }

  getVentasPorAgente(): Observable<{agente: string, ventas: number}[]> {
    return this.getDatosVentas().pipe(
      map(ventas => {
        const ventasPorAgente: {[key: string]: number} = {};
        ventas.forEach(venta => {
          if (venta.agente) {
            ventasPorAgente[venta.agente] = (ventasPorAgente[venta.agente] || 0) + 1;
          }
        });
        return Object.entries(ventasPorAgente).map(([agente, ventas]) => ({agente, ventas}));
      })
    );
  }

  getResumenMensualPorAnno(anno: number, filtros: FiltrosVentas = {}): Observable<ResumenMensual> {
    return this.getDatosVentas().pipe(
      map(ventas => {
        const resumen: ResumenMensual = {
          ventas: Array(12).fill(0),
          ingresos: Array(12).fill(0)
        };

        ventas.forEach(venta => {
          const [dia, mesStr, annoStr] = venta.fecha_firma.split('-');
          const mes = parseInt(mesStr) - 1;

          if (parseInt(annoStr) === anno &&
              (filtros.precioMinimo == null || venta.precio >= filtros.precioMinimo) &&
              (filtros.precioMaximo == null || venta.precio <= filtros.precioMaximo) &&
              (!filtros.ubicacion || venta.ubicacion === filtros.ubicacion) &&
              (!filtros.tipoVivienda || venta.tipoVivienda === filtros.tipoVivienda)) {
            resumen.ventas[mes]++;
            resumen.ingresos[mes] += venta.precio * 0.06;
          }
        });

        return resumen;
      })
    );
  }
}
