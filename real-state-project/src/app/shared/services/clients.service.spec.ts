import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ClientsService } from './clients.service';
import { ClientInterface } from '../components/client-card/client.interface';

describe('ClientsService', () => {
  let service: ClientsService;
  let httpMock: HttpTestingController;

  const clientData: ClientInterface = {
    phone: '600000000',
    name: 'Cliente Nuevo',
    mail: 'nuevo@mail.com',
    other_mails: [],
    messages: ['Quiero informacion'],
    favs_appartments: [1]
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ClientsService]
    });

    service = TestBed.inject(ClientsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('crea el cliente si no existe un telefono igual', () => {
    service.guardarContactoCliente(clientData).subscribe(result => {
      expect(result.phone).toBe('600000000');
    });

    httpMock.expectOne('http://localhost:3000/clients?phone=600000000').flush([]);
    const createReq = httpMock.expectOne('http://localhost:3000/clients');
    expect(createReq.request.method).toBe('POST');
    createReq.flush(clientData);
  });

  it('actualiza el cliente existente conservando mensajes y correos anteriores', () => {
    service.guardarContactoCliente(clientData).subscribe();

    httpMock.expectOne('http://localhost:3000/clients?phone=600000000').flush([{
      id: 4,
      phone: '600000000',
      name: 'Cliente Antiguo',
      mail: 'antiguo@mail.com',
      other_mails: [],
      messages: ['Mensaje anterior'],
      favs_appartments: []
    }]);

    const updateReq = httpMock.expectOne('http://localhost:3000/clients/4');
    expect(updateReq.request.method).toBe('PUT');
    expect(updateReq.request.body.messages).toEqual(['Quiero informacion', 'Mensaje anterior']);
    expect(updateReq.request.body.other_mails).toEqual(['antiguo@mail.com']);
    updateReq.flush({ ...clientData, id: 4 });
  });

  it('calcula resumen de clientes por estado', () => {
    service.getResumenClientes().subscribe(resumen => {
      expect(resumen.total).toBe(3);
      expect(resumen.nuevos).toBe(1);
      expect(resumen.seguimiento).toBe(1);
      expect(resumen.conFavoritos).toBe(2);
    });

    httpMock.expectOne('http://localhost:3000/clients').flush([
      { ...clientData, id: 1, status: 'NEW', favs_appartments: [1] },
      { ...clientData, id: 2, status: 'FOLLOW_UP', favs_appartments: [2, 3] },
      { ...clientData, id: 3, status: 'CLOSED', favs_appartments: [] }
    ]);
  });

  it('conserva favoritos, solicitudes, notas y agente al recibir otro contacto', () => {
    service.guardarContactoCliente({ ...clientData, favs_appartments: [1, 3] }).subscribe();
    httpMock.expectOne('http://localhost:3000/clients?phone=600000000').flush([{
      ...clientData, id: 4, favs_appartments: [1, 2], notes: ['Llamar por la tarde'], assigned_agent: 'Juan',
      requests: [{ apartment_id: 2, type: 'Visita', date: '2026-09-01' }]
    }]);
    const req = httpMock.expectOne('http://localhost:3000/clients/4');
    expect(req.request.body.favs_appartments).toEqual([1, 2, 3]);
    expect(req.request.body.notes).toEqual(['Llamar por la tarde']);
    expect(req.request.body.assigned_agent).toBe('Juan');
    expect(req.request.body.requests.length).toBe(1);
    req.flush(req.request.body);
  });
});
