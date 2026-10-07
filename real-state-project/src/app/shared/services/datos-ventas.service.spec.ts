import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DatosVentasService } from './datos-ventas.service';

describe('DatosVentasService', () => {
  let service: DatosVentasService;
  let httpMock: HttpTestingController;

  const ventas = [
    { id: 1, fecha_firma: '01-01-2023', id_catastro: 10, precio: 200000, nombre_cliente: 'Ana', dni: '1A', contacto_cliente: 'ana@mail.com', banco: 'BBVA', agente: 'Juan' },
    { id: 2, fecha_firma: '15-01-2023', id_catastro: 11, precio: 300000, nombre_cliente: 'Luis', dni: '2B', contacto_cliente: 'luis@mail.com', banco: 'Santander', agente: 'Ana' },
    { id: 3, fecha_firma: '03-02-2023', id_catastro: 12, precio: 100000, nombre_cliente: 'Eva', dni: '3C', contacto_cliente: 'eva@mail.com', banco: 'BBVA', agente: 'Juan' }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DatosVentasService]
    });

    service = TestBed.inject(DatosVentasService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('reutiliza la misma peticion de ventas para varios calculos', () => {
    service.getDatosVentasPorMes(0, 2023).subscribe(data => {
      expect(data.length).toBe(2);
    });

    service.getHipotecasPorBanco().subscribe(data => {
      expect(data.find(item => item.banco === 'BBVA')?.hipotecas).toBe(2);
    });

    const req = httpMock.expectOne('http://localhost:3000/ventas');
    expect(req.request.method).toBe('GET');
    req.flush(ventas);
  });

  it('calcula ventas e ingresos mensuales por anno', () => {
    service.getResumenMensualPorAnno(2023).subscribe(resumen => {
      expect(resumen.ventas[0]).toBe(2);
      expect(resumen.ventas[1]).toBe(1);
      expect(resumen.ingresos[0]).toBe(30000);
      expect(resumen.ingresos[1]).toBe(6000);
    });

    const req = httpMock.expectOne('http://localhost:3000/ventas');
    req.flush(ventas);
  });

  it('filtra por precio incluyendo ambos limites sin modificar las ventas', () => {
    const originales = JSON.stringify(ventas);
    service.getResumenMensualPorAnno(2023, { precioMinimo: 200000, precioMaximo: 300000 }).subscribe(resumen => {
      expect(resumen.ventas).toEqual([2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
      expect(resumen.ingresos[0]).toBe(30000);
      expect(JSON.stringify(ventas)).toBe(originales);
    });
    httpMock.expectOne('http://localhost:3000/ventas').flush(ventas);
  });

  it('admite limites independientes y recupera la serie completa al quitarlos', () => {
    service.getResumenMensualPorAnno(2023, { precioMinimo: 250000 }).subscribe(resumen => {
      expect(resumen.ventas[0]).toBe(1);
      expect(resumen.ventas[1]).toBe(0);
    });
    httpMock.expectOne('http://localhost:3000/ventas').flush(ventas);
    service.getResumenMensualPorAnno(2023, { precioMaximo: 200000 }).subscribe(resumen => {
      expect(resumen.ventas.slice(0, 2)).toEqual([1, 1]);
    });
    service.getResumenMensualPorAnno(2023).subscribe(resumen => {
      expect(resumen.ventas.slice(0, 2)).toEqual([2, 1]);
    });
    httpMock.expectNone('http://localhost:3000/ventas');
  });

  it('devuelve doce meses a cero cuando no hay coincidencias', () => {
    service.getResumenMensualPorAnno(2023, { precioMaximo: 0 }).subscribe(resumen => {
      expect(resumen.ventas).toEqual(Array(12).fill(0));
    });
    httpMock.expectOne('http://localhost:3000/ventas').flush(ventas);
  });

  it('combina precio, ubicacion y tipo antes de agrupar por meses', () => {
    const clasificadas = [
      { ...ventas[0], ubicacion: 'El Portil', tipoVivienda: 'House' },
      { ...ventas[1], ubicacion: 'El Portil', tipoVivienda: 'Apartment' },
      { ...ventas[2], ubicacion: 'Huelva', tipoVivienda: 'Apartment' }
    ];
    service.getResumenMensualPorAnno(2023, { ubicacion: 'El Portil', tipoVivienda: 'House', precioMinimo: 200000, precioMaximo: 200000 }).subscribe(resumen => {
      expect(resumen.ventas).toEqual([1, ...Array(11).fill(0)]);
      expect(resumen.ingresos[0]).toBe(12000);
    });
    httpMock.expectOne('http://localhost:3000/ventas').flush(clasificadas);
    service.getResumenMensualPorAnno(2023, { ubicacion: 'El Portil' }).subscribe(resumen => {
      expect(resumen.ventas.slice(0, 2)).toEqual([2, 0]);
    });
    service.getResumenMensualPorAnno(2023, { tipoVivienda: 'Apartment' }).subscribe(resumen => {
      expect(resumen.ventas.slice(0, 2)).toEqual([1, 1]);
    });
    service.getResumenMensualPorAnno(2023, { ubicacion: 'Huelva', tipoVivienda: 'House' }).subscribe(resumen => {
      expect(resumen.ventas).toEqual(Array(12).fill(0));
    });
  });

  it('conserva las ventas sin clasificar en el total pero no en un filtro de ubicacion o tipo', () => {
    service.getResumenMensualPorAnno(2023, { ubicacion: 'Huelva' }).subscribe(resumen => {
      expect(resumen.ventas).toEqual(Array(12).fill(0));
    });
    httpMock.expectOne('http://localhost:3000/ventas').flush(ventas);
    service.getResumenMensualPorAnno(2023, { tipoVivienda: 'House' }).subscribe(resumen => {
      expect(resumen.ventas).toEqual(Array(12).fill(0));
    });
    service.getResumenMensualPorAnno(2023).subscribe(resumen => {
      expect(resumen.ventas.slice(0, 2)).toEqual([2, 1]);
    });
  });
});
