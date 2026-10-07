import { Injectable } from '@angular/core';
import { Observable, switchMap, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { SellerDTO } from 'src/app/core/sell/seller';
import { environment } from 'src/environments/environment';
import { ClientsService } from './clients.service';

@Injectable({
    providedIn: 'root'
})
export class SellerService {
    private apiUrl = environment.apiUrl + '/sellers';

    constructor(private http: HttpClient, private clientsService: ClientsService) { }

    getVendedores(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}`, { observe: 'response' });
    }

    getVendedorByEmail(email: string): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}?email=${email}`);
    }

    createVendedor(vendedor: SellerDTO): Observable<any> {
        return this.clientsService.guardarContactoCliente({
            name: vendedor.nombre.trim(),
            phone: vendedor.telf.trim(),
            mail: vendedor.email.trim(),
            messages: [`Solicitud de valoración: ${vendedor.tipoVivienda || ''} en ${vendedor.ubicacion || ''}. ${vendedor.metros || ''} m². Precio orientativo: ${vendedor.precioOrientativo || 'Sin indicar'}. ${vendedor.mensaje || ''}`],
            other_mails: [],
            favs_appartments: []
        }).pipe(
            tap(() => this.clientsService.refrescarClientes()),
            switchMap(cliente => this.http.post<any>(`${this.apiUrl}`, { ...vendedor, client_id: cliente.id }))
        );
    }


}
