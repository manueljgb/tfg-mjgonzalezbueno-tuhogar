import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { SellComponent } from './sell.component';
import { SellerService } from 'src/app/shared/services/seller.service';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('SellComponent', () => {
  let component: SellComponent;
  let fixture: ComponentFixture<SellComponent>;
  let sellerService: jasmine.SpyObj<SellerService>;

  beforeEach(async () => {
    sellerService = jasmine.createSpyObj('SellerService', ['createVendedor']);
    sellerService.createVendedor.and.returnValue(of({ telf: '666555444' }));

    await TestBed.configureTestingModule({
      declarations: [ SellComponent ],
      imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, NoopAnimationsModule],
      providers: [
        { provide: SellerService, useValue: sellerService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('envia una solicitud de venta con datos de vivienda', () => {
    component.personalDataForm.setValue({
      fullName: 'Manuel Gonzalez',
      phone: '666555444',
      email: 'manuel@email.com',
      ubicacion: 'Huelva',
      tipoVivienda: 'Piso',
      metros: 90,
      precioOrientativo: 180000,
      message: 'Quiero vender antes de verano'
    });

    component.submitForm();

    expect(sellerService.createVendedor).toHaveBeenCalledWith({
      nombre: 'Manuel Gonzalez',
      email: 'manuel@email.com',
      telf: '666555444',
      ubicacion: 'Huelva',
      tipoVivienda: 'Piso',
      metros: 90,
      precioOrientativo: 180000,
      mensaje: 'Quiero vender antes de verano',
      estado: 'NEW'
    });
    expect(component.displaySuccesMessage).toBeTrue();
  });
});
