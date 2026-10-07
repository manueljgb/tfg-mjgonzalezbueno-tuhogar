import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlacesBulletInfoComponent } from './places-bullet-info.component';

describe('PlacesBulletInfoComponent', () => {
  let component: PlacesBulletInfoComponent;
  let fixture: ComponentFixture<PlacesBulletInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlacesBulletInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlacesBulletInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
