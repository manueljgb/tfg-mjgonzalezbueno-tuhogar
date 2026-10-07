import { Component, OnInit } from '@angular/core';
import { ElRompidoInfoEnum } from './el-rompido.component.enum';

@Component({
  selector: 'app-el-rompido',
  templateUrl: './el-rompido.component.html',
  styleUrls: ['./el-rompido.component.scss']
})
export class ElRompidoComponent implements OnInit {
  title: string = 'El Rompido';
  backgroundImage: string = 'assets/jpg/el-rompido.jpg'
  introText: string = '¡Descubre las maravillas de El Rompido! Sumérgete en un paraíso costero donde la ' +
    'naturaleza, la tranquilidad y las playas vírgenes se combinan en armonía. Embárcate en una experiencia ' +
    'inolvidable mientras exploras sus impresionantes paisajes, disfrutas de actividades al aire libre y ' +
    'te deleitas con la exquisita gastronomía local. Descubre el encanto de un lugar donde el tiempo parece ' +
    'detenerse y cada rincón te invita a relajarte y disfrutar. Bienvenido a El Rompido, donde tus sueños de ' +
    'vivir en un entorno paradisíaco se hacen realidad. ¡Prepárate para una aventura inolvidable!'



  placesBulletInfo = [
    { iconSource: 'assets/jpg/el-rompido-playa.jpg', title: 'Playas', info: ElRompidoInfoEnum.Playas },
    { iconSource: 'assets/jpg/el-rompido-entorno.jpg', title: 'Entorno natural', info: ElRompidoInfoEnum.Entorno },
    { iconSource: 'assets/jpg/el-rompido-actividades.jpg', title: 'Actividades', info: ElRompidoInfoEnum.Actividades },
    { iconSource: 'assets/jpg/el-rompido-golf.jpg', title: 'Golf', info: ElRompidoInfoEnum.Golf },
    { iconSource: 'assets/jpg/el-rompido-ubicacion.jpg', title: 'Ubicación', info: ElRompidoInfoEnum.Ubicacion },
    { iconSource: 'assets/jpg/el-rompido-hospitalidad.jpg', title: 'Hospitalidad', info: ElRompidoInfoEnum.Hospitalidad },
  ]
  latitud: number = 37.2225915;
  longitud: number = -7.1237849;

  constructor() { }

  ngOnInit(): void {
  }

}
