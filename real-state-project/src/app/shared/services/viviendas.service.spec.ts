import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ViviendasService } from './viviendas.service';

describe('ViviendasService', () => {
  let service: ViviendasService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ViviendasService]
    });

    service = TestBed.inject(ViviendasService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('consulta viviendas usando filtros compatibles con json-server', () => {
    service.buscarViviendas({
      estado: 'AVAILABLE',
      ubicacion: 'Huelva',
      precioMaximo: 250000,
      ordenarPor: 'price',
      direccion: 'asc'
    }).subscribe();

    const req = httpMock.expectOne('http://localhost:3000/appartments?status=AVAILABLE&ubication_like=Huelva&price_lte=250000&_sort=price&_order=asc');
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('permite refrescar el listado de viviendas desde un stream', () => {
    const resultados: any[][] = [];

    service.viviendas$.subscribe(data => {
      resultados.push(data);
    });

    httpMock.expectOne('http://localhost:3000/appartments').flush([{ id: 1, status: 'AVAILABLE' }]);

    service.refrescarViviendas();

    httpMock.expectOne('http://localhost:3000/appartments').flush([{ id: 2, status: 'SOLD' }]);

    expect(resultados.length).toBe(2);
    expect(resultados[0][0].id).toBe(1);
    expect(resultados[1][0].id).toBe(2);
  });

  it('calcula datos de precio por zona y metro cuadrado', () => {
    service.getPrecioMedioPorZona().subscribe(data => {
      expect(data.find(item => item.zona === 'Huelva')?.precioMedio).toBe(200000);
      expect(data.find(item => item.zona === 'Huelva')?.precioMetro).toBe(2000);
      expect(data.find(item => item.zona === 'El Portil')?.precioMedio).toBe(300000);
    });

    httpMock.expectOne('http://localhost:3000/appartments').flush([
      { id: 1, ubication: 'Huelva', price: 150000, square_metres: 75 },
      { id: 2, ubication: 'Huelva', price: 250000, square_metres: 125 },
      { id: 3, ubication: 'El Portil', price: 300000, square_metres: 100 }
    ]);
  });

  it('reserva una vivienda disponible para un cliente y conserva el historial', () => {
    service.registrarOperacion(1, 4, 'RESERVED').subscribe();
    httpMock.expectOne('http://localhost:3000/appartments/1').flush({ id: 1, status: 'AVAILABLE', price: 150000, operations: [{ status: 'AVAILABLE' }] });
    httpMock.expectOne('http://localhost:3000/clients/4').flush({ id: 4 });
    const req = httpMock.expectOne('http://localhost:3000/appartments/1');
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body.client_id).toBe(4);
    expect(req.request.body.operations.length).toBe(2);
    expect(req.request.body.operations[1].status).toBe('RESERVED');
    req.flush(req.request.body);
  });

  it('rechaza reservar una vivienda que ya esta reservada', () => {
    let error = false;
    service.registrarOperacion(1, 4, 'RESERVED').subscribe({ error: () => error = true });
    httpMock.expectOne('http://localhost:3000/appartments/1').flush({ status: 'RESERVED', client_id: 2 });
    expect(error).toBeTrue();
    httpMock.expectNone('http://localhost:3000/clients/4');
  });

  it('impide vender una reserva de otro cliente', () => {
    let error = false;
    service.registrarOperacion(1, 4, 'SOLD').subscribe({ error: () => error = true });
    httpMock.expectOne('http://localhost:3000/appartments/1').flush({ status: 'RESERVED', client_id: 2 });
    expect(error).toBeTrue();
  });

  it('registra la fecha de venta para el cliente de la reserva', () => {
    service.registrarOperacion(1, 4, 'SOLD').subscribe();
    httpMock.expectOne('http://localhost:3000/appartments/1').flush({ status: 'RESERVED', client_id: 4, price: 150000 });
    httpMock.expectOne('http://localhost:3000/clients/4').flush({ id: 4 });
    const req = httpMock.expectOne('http://localhost:3000/appartments/1');
    expect(req.request.body.sale_date).toBeTruthy();
    expect(req.request.body.status).toBe('SOLD');
    req.flush(req.request.body);
  });

  it('cancela una reserva sin borrar el historial', () => {
    service.registrarOperacion(1, 4, 'AVAILABLE').subscribe();
    httpMock.expectOne('http://localhost:3000/appartments/1').flush({ status: 'RESERVED', client_id: 4, operations: [{ status: 'RESERVED' }] });
    httpMock.expectOne('http://localhost:3000/clients/4').flush({ id: 4 });
    const req = httpMock.expectOne('http://localhost:3000/appartments/1');
    expect(req.request.body.client_id).toBeNull();
    expect(req.request.body.operations.length).toBe(2);
    req.flush(req.request.body);
  });

  it('no escribe si el cliente no existe', () => {
    let error = false;
    service.registrarOperacion(1, 4, 'RESERVED').subscribe({ error: () => error = true });
    httpMock.expectOne('http://localhost:3000/appartments/1').flush({ status: 'AVAILABLE' });
    httpMock.expectOne('http://localhost:3000/clients/4').flush({}, { status: 404, statusText: 'Not Found' });
    expect(error).toBeTrue();
  });
});
