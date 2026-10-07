import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ViviendasService } from '../../../shared/services/viviendas.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-vivienda-form',
  templateUrl: './vivienda-form.component.html',
  styleUrls: ['./vivienda-form.component.scss']
})
export class ViviendaFormComponent implements OnInit {
  viviendaForm: FormGroup = new FormGroup({});
  isEditMode: boolean;
  extrasOptions: string[] = ['piscina', 'jardin', 'garaje', 'terraza', 'buhardilla', 'balcón'];
  imageOptions: string[] = [
    'images/casa1-baño.jpg', 'images/casa1-cocina.jpg', 'images/casa1-salon.jpg', 'images/casa1-frontal.jpg', 'images/casa1-dorm1.jpg', 'images/casa1-dorm2.jpg',
    'images/casa2-baño.jpg', 'images/casa2-salon.jpg', 'images/casa2-frontal.jpg', 'images/casa2-dorm1.jpg', 'images/casa2-dorm2.jpg'
  ];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ViviendaFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: number | 'nueva-vivienda' },
    private viviendasService: ViviendasService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.isEditMode = data.id !== 'nueva-vivienda';
  }

  ngOnInit(): void {
    this.initForm();
    if (this.isEditMode) {
      this.loadViviendaData();
    }
  }

  initForm(): void {
    this.viviendaForm = this.fb.group({
      price: ['', [Validators.required, Validators.min(0)]],
      discount: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      type: ['', Validators.required],
      images: [[], Validators.required],
      ubication: ['', Validators.required],
      square_metres: ['', [Validators.required, Validators.min(0)]],
      energy_efficiency: ['', Validators.required],
      rooms: ['', [Validators.required, Validators.min(0)]],
      bathrooms: ['', [Validators.required, Validators.min(0)]],
      date_built: ['', [Validators.required, Validators.min(1800), Validators.max(new Date().getFullYear())]],
      floors: ['', [Validators.required, Validators.min(0)]],
      extras: [[], Validators.required],
      status: [{ value: 'AVAILABLE', disabled: true }],
      latitud: ['', [Validators.required, Validators.min(-90), Validators.max(90)]],
      longitud: ['', [Validators.required, Validators.min(-180), Validators.max(180)]]
    });
  }

  loadViviendaData(): void {
    this.viviendasService.getVivienda(this.data.id as number).subscribe(
      (response) => {
        if (response.body) {
          this.viviendaForm.patchValue(response.body);
        }
      },
      (error) => {
        console.error('Error al cargar los datos de la vivienda:', error);
        this.snackBar.open('Error al cargar los datos de la vivienda', 'Cerrar', { duration: 3000 });
      }
    );
  }

  onSubmit(): void {
    if (this.viviendaForm.valid) {
      const viviendaData = this.viviendaForm.value;
      if (this.isEditMode) {
        this.viviendasService.actualizarVivienda(this.data.id as number, viviendaData).subscribe(
          (response) => {
            this.snackBar.open('Vivienda actualizada con éxito', 'Cerrar', { duration: 3000 });
            this.dialogRef.close(response.body);
          },
          (error) => {
            console.error('Error al actualizar la vivienda:', error);
            this.snackBar.open('Error al actualizar la vivienda', 'Cerrar', { duration: 3000 });
          }
        );
      } else {
        this.viviendasService.crearVivienda({ ...viviendaData, status: 'AVAILABLE' }).subscribe(
          (response) => {
            this.snackBar.open('Vivienda creada con éxito', 'Cerrar', { duration: 3000 });
            this.dialogRef.close(response.body);
          },
          (error) => {
            console.error('Error al crear la vivienda:', error);
            this.snackBar.open('Error al crear la vivienda', 'Cerrar', { duration: 3000 });
          }
        );
      }
    } else {
      this.snackBar.open('Por favor, complete todos los campos requeridos', 'Cerrar', { duration: 3000 });
    }
  }

  onDelete(): void {
    const confirmDialog = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Confirmar eliminación',
        message: '¿Está seguro de que desea eliminar esta vivienda?'
      }
    });

    confirmDialog.afterClosed().subscribe(result => {
      if (result === true) {
        this.viviendasService.eliminarVivienda(this.data.id as number).subscribe(
          () => {
            this.snackBar.open('Vivienda eliminada con éxito', 'Cerrar', { duration: 3000 });
            this.dialogRef.close('deleted');
          },
          (error) => {
            console.error('Error al eliminar la vivienda:', error);
            this.snackBar.open('Error al eliminar la vivienda', 'Cerrar', { duration: 3000 });
          }
        );
      }
    });
  }
}
