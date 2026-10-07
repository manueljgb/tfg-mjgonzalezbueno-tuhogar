import { ContactToBuyComponent } from './contact-to-buy.component';
import { of, throwError, Subject } from 'rxjs';

describe('ContactToBuyComponent', () => {
  let component: ContactToBuyComponent;
  let clients: any;
  let spinner: any;
  beforeEach(() => {
    clients = jasmine.createSpyObj('ClientsService', ['guardarContactoCliente', 'refrescarClientes']);
    spinner = jasmine.createSpyObj('Spinner', ['show', 'hide']);
    component = new ContactToBuyComponent(spinner, clients, {} as any);
    component.fullName = 'Cliente de prueba'; component.phone = '600000000';
    component.email = 'cliente@example.com'; component.message = 'Quiero visitar la vivienda';
    sessionStorage.removeItem('favs');
  });
  afterEach(() => sessionStorage.removeItem('favs'));
  it('envia sin favoritos usando una lista vacia', () => {
    clients.guardarContactoCliente.and.returnValue(of({ id: 1 }));
    component.submitForm();
    expect(clients.guardarContactoCliente.calls.mostRecent().args[0].favs_appartments).toEqual([]);
    expect(component.displaySuccesMessage).toBeTrue();
  });
  it('conserva el formulario y no muestra exito si falla el servidor', () => {
    clients.guardarContactoCliente.and.returnValue(throwError(() => new Error('Sin conexion')));
    component.submitForm();
    expect(component.displaySuccesMessage).toBeFalse();
    expect(component.message).toBe('Quiero visitar la vivienda');
    expect(component.error).toBeTruthy();
    expect(spinner.hide).toHaveBeenCalled();
  });
  it('evita dos envios mientras hay una peticion pendiente', () => {
    const respuesta = new Subject();
    clients.guardarContactoCliente.and.returnValue(respuesta);
    component.submitForm(); component.submitForm();
    expect(clients.guardarContactoCliente).toHaveBeenCalledTimes(1);
    respuesta.complete();
  });
  it('asocia la solicitud de reserva a los favoritos', () => {
    sessionStorage.setItem('favs', '[2]'); component.tipoSolicitud = 'Reserva';
    clients.guardarContactoCliente.and.returnValue(of({ id: 1 })); component.submitForm();
    expect(clients.guardarContactoCliente.calls.mostRecent().args[0].requests[0].apartment_id).toBe(2);
    expect(clients.guardarContactoCliente.calls.mostRecent().args[0].requests[0].type).toBe('Reserva');
  });
  it('no envia un correo invalido', () => {
    component.email = 'correo'; component.submitForm();
    expect(clients.guardarContactoCliente).not.toHaveBeenCalled();
  });

  it('no solicita reserva sin una vivienda favorita', () => {
    component.tipoSolicitud = 'Reserva';
    component.submitForm();
    expect(clients.guardarContactoCliente).not.toHaveBeenCalled();
  });
});
