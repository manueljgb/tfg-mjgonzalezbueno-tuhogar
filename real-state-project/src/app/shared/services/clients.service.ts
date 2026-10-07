import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, shareReplay, switchMap } from 'rxjs';
import { ClientInterface } from '../components/client-card/client.interface';
import { environment } from 'src/environments/environment';

interface ResumenClientes {
  total: number;
  nuevos: number;
  contactados: number;
  seguimiento: number;
  cerrados: number;
  conFavoritos: number;
}

@Injectable({
  providedIn: 'root'
})
export class ClientsService {
  private apiUrl = environment.apiUrl + '/clients';
  private refreshClientes$ = new BehaviorSubject<void>(undefined);
  clientes$ = this.refreshClientes$.pipe(
    switchMap(() => this.http.get<ClientInterface[]>(`${this.apiUrl}`)),
    shareReplay(1)
  );

  constructor(private http: HttpClient) { }

  getClientes(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}`, { observe: 'response' });
  }

  refrescarClientes(): void {
    this.refreshClientes$.next();
  }
  
  getClienteByPhone(phone: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?phone=${encodeURIComponent(phone.trim())}`);
  }

  createCliente(clientData: ClientInterface): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, clientData);
  }

  guardarContactoCliente(clientData: ClientInterface): Observable<any> {
    return this.getClienteByPhone(clientData.phone).pipe(
      switchMap((data: ClientInterface[]) => {
        if (data.length > 0) {
          const oldData = data[0];
          const newData = {
            ...oldData,
            ...clientData,
            id: oldData.id,
            requests: [...(oldData.requests || []), ...(clientData.requests || [])],
            favs_appartments: [...new Set([...(oldData.favs_appartments || []), ...(clientData.favs_appartments || [])])],
            messages: [...clientData.messages],
            other_mails: [...clientData.other_mails]
          };

          oldData.messages.forEach(message => newData.messages.push(message));
          newData.other_mails = [...oldData.other_mails];
          newData.status = oldData.status || 'FOLLOW_UP';
          newData.notes = oldData.notes || [];
          newData.last_contact = new Date().toISOString().slice(0, 10);
          newData.assigned_agent = oldData.assigned_agent || '';

          if (newData.mail != oldData.mail && !oldData.other_mails.includes(oldData.mail)) {
            newData.other_mails.push(oldData.mail);
          }

          return this.http.put<any>(`${this.apiUrl}/${oldData.id}`, newData);
        }

        return this.createCliente({
          ...clientData,
          status: clientData.status || 'NEW',
          notes: clientData.notes || [],
          last_contact: new Date().toISOString().slice(0, 10),
          assigned_agent: clientData.assigned_agent || ''
        });
      })
    );
  }

  actualizarEstadoCliente(cliente: ClientInterface, status: string): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${cliente.id}`, {
      status,
      last_contact: new Date().toISOString().slice(0, 10)
    });
  }

  addNotaCliente(cliente: ClientInterface, nota: string): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${cliente.id}`, {
      notes: [...(cliente.notes || []), nota],
      last_contact: new Date().toISOString().slice(0, 10)
    });
  }

  getResumenClientes(): Observable<ResumenClientes> {
    return this.clientes$.pipe(
      map(clientes => ({
        total: clientes.length,
        nuevos: clientes.filter(cliente => (cliente.status || 'NEW') === 'NEW').length,
        contactados: clientes.filter(cliente => cliente.status === 'CONTACTED').length,
        seguimiento: clientes.filter(cliente => cliente.status === 'FOLLOW_UP').length,
        cerrados: clientes.filter(cliente => cliente.status === 'CLOSED').length,
        conFavoritos: clientes.filter(cliente => (cliente.favs_appartments || []).length > 0).length
      }))
    );
  }

  getClientesPorEstado(): Observable<{estado: string, clientes: number}[]> {
    return this.clientes$.pipe(
      map(clientes => {
        const estados: {[key: string]: number} = {};
        clientes.forEach(cliente => {
          const estado = cliente.status || 'NEW';
          estados[estado] = (estados[estado] || 0) + 1;
        });
        return Object.entries(estados).map(([estado, clientes]) => ({ estado, clientes }));
      })
    );
  }
  

  udpateCliente(id: number, newData: ClientInterface): Observable<any> {
    return this.getClienteByPhone(newData.phone).pipe(
      switchMap((data: ClientInterface[]) => {
        console.log(data[0].messages)
        data[0].messages.forEach(message => newData.messages.push(message));
        // Mantener otros correos antiguos
        newData.other_mails = data[0].other_mails;
        if (newData.mail != data[0].mail && !data[0].other_mails.includes(data[0].mail)) {
          newData.other_mails.push(data[0].mail);
        }
        return this.http.put<any>(`${this.apiUrl}/${id}`, newData);
      })
    );
  }
}
