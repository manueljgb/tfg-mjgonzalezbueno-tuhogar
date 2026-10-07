import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SellerService } from 'src/app/shared/services/seller.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-sell',
  templateUrl: './sell.component.html',
  styleUrls: ['./sell.component.scss']
})
export class SellComponent implements OnInit {

  displaySuccesMessage: boolean = false;
  enviado: boolean = false;
  guardando: boolean = false;
  error: string = '';
  personalDataForm!: FormGroup;
  tiposVivienda: string[] = ['Piso', 'Casa', 'Chalet', 'Atico', 'Local'];

  constructor(
    private fb: FormBuilder,
    private sellerService: SellerService
  ) { }

  ngOnInit(): void {
    this.personalDataForm = this.fb.group({
      fullName: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      ubicacion: ['', Validators.required],
      tipoVivienda: ['', Validators.required],
      metros: ['', [Validators.required, Validators.min(20)]],
      precioOrientativo: [''],
      message: [''],
    });
  }

  submitForm() {
    if (this.guardando) return;
    this.enviado = true;
    this.error = '';
    this.displaySuccesMessage = false;

    if (this.personalDataForm.valid) {
      this.guardando = true;
      this.sellerService.createVendedor({
        nombre: this.personalDataForm.get('fullName')?.value,
        email: this.personalDataForm.get('email')?.value,
        telf: this.personalDataForm.get('phone')?.value,
        ubicacion: this.personalDataForm.get('ubicacion')?.value,
        tipoVivienda: this.personalDataForm.get('tipoVivienda')?.value,
        metros: this.personalDataForm.get('metros')?.value,
        precioOrientativo: this.personalDataForm.get('precioOrientativo')?.value,
        mensaje: this.personalDataForm.get('message')?.value,
        estado: 'NEW'
      }).pipe(finalize(() => this.guardando = false)).subscribe({ next: () => {
        this.displaySuccesMessage = true;
        this.enviado = false;
        this.personalDataForm.reset();
      }, error: () => {
        this.error = 'No se ha completado la solicitud. Conservamos el formulario para que puedas intentarlo de nuevo.';
      }});

    } else {
      this.personalDataForm.markAllAsTouched();
    }
  }

  hideSuccessMessage(): void {
    this.displaySuccesMessage = false;
  }
}
