import { Component, OnInit } from '@angular/core';
import { ClientsService } from '../../services/clients.service';
import { ClientInterface } from '../client-card/client.interface';
import { finalize } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-contact-to-buy',
  templateUrl: './contact-to-buy.component.html',
  styleUrls: ['./contact-to-buy.component.scss']
})
export class ContactToBuyComponent implements OnInit {


  fullName: string = '';
  phone: string = '';
  email: string = '';
  message: string = '';
  tipoSolicitud: string = 'Información';

  displaySuccesMessage: boolean = false
  enviando: boolean = false;
  error: string = '';

  constructor(private spinnerService: NgxSpinnerService,
    private clientsService: ClientsService,
    public dialog: MatDialog,
  ) {

  }

  ngOnInit(): void {
  }

  formValidator(): boolean {
    return !!this.fullName.trim() && /^[+\d\s()-]{9,20}$/.test(this.phone.trim()) &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email.trim()) && !!this.message.trim() &&
      (this.tipoSolicitud === 'Información' || this.tieneFavoritos());
  }

  tieneFavoritos(): boolean {
    return JSON.parse(sessionStorage.getItem('favs') || '[]').length > 0;
  }


  submitForm(): void {
    if (!this.formValidator() || this.enviando) return;
    this.enviando = true;
    this.error = '';
    this.spinnerService.show();
    const favAppartments = JSON.parse(sessionStorage.getItem('favs') || '[]');
    const clientData: ClientInterface = {
      phone: this.phone.trim(),
      name: this.fullName.trim(),
      mail: this.email.trim(),
      other_mails: [],
      messages: [this.message],
      favs_appartments: favAppartments,
      requests: favAppartments.map((id: number) => ({
        apartment_id: id, type: this.tipoSolicitud, date: new Date().toISOString()
      }))

    }

    this.clientsService.guardarContactoCliente(clientData).pipe(finalize(() => {
      this.enviando = false;
      this.spinnerService.hide();

    }))
      .subscribe({
        next: () => {
          this.resetForm();
          this.displaySuccesMessage = true;
          this.clientsService.refrescarClientes();
        },
        error: () => this.error = 'No se ha podido enviar el mensaje. Tus datos se conservan para intentarlo de nuevo.'
      });

  }
  closeDialog(): void {
    this.dialog.closeAll();
  }

  resetForm(): void {
    this.fullName = '';
    this.phone = '';
    this.email = '';
    this.message = '';
    this.tipoSolicitud = 'Información';
  }

  hideSuccessMessage(): void {
    this.displaySuccesMessage = false;
  }

}
