import { SharedModule } from '../../shared/shared.module';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertiesComponent } from './properties.component';

describe('PropertiesComponent', () => {
  let component: PropertiesComponent;
  let fixture: ComponentFixture<PropertiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedModule, HttpClientTestingModule, NoopAnimationsModule, TranslateModule.forRoot(), RouterTestingModule, NgxSpinnerModule],
      declarations: [ PropertiesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    TestBed.inject(HttpTestingController).expectOne('http://localhost:3000/appartments').flush([]);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('compara solo los favoritos disponibles', () => {
    sessionStorage.setItem('favs', '[1,2,3]');
    component.data = [{ id: 1 }, { id: 2 }];
    component.compararFavoritos();
    expect(component.comparativa.map(vivienda => vivienda.id)).toEqual([1, 2]);
    sessionStorage.removeItem('favs');
  });

  it('pide reducir la seleccion si hay mas de tres favoritos', () => {
    sessionStorage.setItem('favs', '[1,2,3,4]');
    component.data = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];
    component.compararFavoritos();
    expect(component.comparativa).toEqual([]);
    expect(component.avisoComparativa).toBeTruthy();
    sessionStorage.removeItem('favs');
  });
});
