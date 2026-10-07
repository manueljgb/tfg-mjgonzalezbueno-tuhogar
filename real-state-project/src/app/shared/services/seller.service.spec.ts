import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SellerService } from './seller.service';
import { ClientsService } from './clients.service';

describe('SellerService', () => {
  let service: SellerService;
  let httpMock: HttpTestingController;
  const vendedor = { nombre: 'Propietario', email: 'propietario@example.com', telf: '600000010', ubicacion: 'Huelva' };

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(SellerService);
    httpMock = TestBed.inject(HttpTestingController);
  });
  afterEach(() => httpMock.verify());

  it('relaciona la solicitud de valoracion con el cliente creado', () => {
    const listados: any[][] = [];
    TestBed.inject(ClientsService).clientes$.subscribe(clientes => listados.push(clientes));
    httpMock.expectOne('http://localhost:3000/clients').flush([]);
    service.createVendedor(vendedor).subscribe();
    httpMock.expectOne('http://localhost:3000/clients?phone=600000010').flush([]);
    const cliente = httpMock.expectOne('http://localhost:3000/clients');
    expect(cliente.request.body.name).toBe('Propietario');
    expect(cliente.request.body.messages[0]).toContain('Huelva');
    cliente.flush({ ...cliente.request.body, id: 10 });
    httpMock.expectOne('http://localhost:3000/clients').flush([{ ...cliente.request.body, id: 10 }]);
    expect(listados[1][0].id).toBe(10);
    const solicitud = httpMock.expectOne('http://localhost:3000/sellers');
    expect(solicitud.request.body.client_id).toBe(10);
    solicitud.flush(solicitud.request.body);
  });

  it('no registra una solicitud si falla el alta del cliente', () => {
    let error = false;
    service.createVendedor(vendedor).subscribe({ error: () => error = true });
    httpMock.expectOne('http://localhost:3000/clients?phone=600000010').flush([]);
    httpMock.expectOne('http://localhost:3000/clients').flush({}, { status: 500, statusText: 'Error' });
    httpMock.expectNone('http://localhost:3000/sellers');
    expect(error).toBeTrue();
  });
});
