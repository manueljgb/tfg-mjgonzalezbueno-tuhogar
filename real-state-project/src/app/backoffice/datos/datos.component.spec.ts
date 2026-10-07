import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';
import { DatosComponent } from './datos.component';

describe('DatosComponent', () => {
  let component: DatosComponent;
  let ventas: any;

  beforeEach(() => {
    ventas = jasmine.createSpyObj('DatosVentasService', ['getResumenMensualPorAnno']);
    ventas.getResumenMensualPorAnno.and.returnValue(of({ ventas: [1, ...Array(11).fill(0)], ingresos: Array(12).fill(0) }));
    component = new DatosComponent(
      { getResumenViviendasPorEstado: () => of([]) } as any,
      { getClientesPorEstado: () => of([]) } as any,
      ventas, new FormBuilder()
    );
    component.ngOnInit();
  });

  afterEach(() => component.ngOnDestroy());

  it('mantiene los cuatro años al combinar y borrar los filtros', () => {
    expect(component.totalVentas).toBe(4);
    component.filtrosVentasForm.setValue({ precioMinimo: 100000, precioMaximo: 200000, ubicacion: 'El Portil', tipoVivienda: 'House' });
    component.aplicarFiltrosVentas();
    expect(ventas.getResumenMensualPorAnno).toHaveBeenCalledWith(2020, { precioMinimo: 100000, precioMaximo: 200000, ubicacion: 'El Portil', tipoVivienda: 'House' });
    expect(component.ventasData.datasets.map(serie => serie.label)).toEqual(['Ventas 2020', 'Ventas 2021', 'Ventas 2022', 'Ventas 2023']);
    component.borrarFiltrosVentas();
    expect(ventas.getResumenMensualPorAnno).toHaveBeenCalledWith(2023, { precioMinimo: null, precioMaximo: null, ubicacion: '', tipoVivienda: '' });
  });

  it('no aplica precios negativos ni un rango invertido', () => {
    ventas.getResumenMensualPorAnno.calls.reset();
    component.filtrosVentasForm.patchValue({ precioMinimo: 200000, precioMaximo: 100000 });
    component.aplicarFiltrosVentas();
    expect(component.rangoPrecioInvalido()).toBeTrue();
    component.filtrosVentasForm.patchValue({ precioMinimo: -1 });
    component.aplicarFiltrosVentas();
    expect(ventas.getResumenMensualPorAnno).not.toHaveBeenCalled();
  });
});
