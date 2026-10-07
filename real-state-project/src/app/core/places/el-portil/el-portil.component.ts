import { Component, OnInit } from '@angular/core';
import { ElPortilInfoEnum } from './el-portil.component.enum';

@Component({
  selector: 'app-el-portil',
  templateUrl: './el-portil.component.html',
  styleUrls: ['./el-portil.component.scss']
})
export class ElPortilComponent implements OnInit {
  title: string = 'El Portil';
  backgroundImage: string = 'assets/jpg/el-portil.jpg'
  introText: string = 'Descubre la magia de El Portil, un tesoro escondido en la costa de Huelva. ' +
    'Sumérgete en un paraíso costero donde las playas de ensueño, la naturaleza exuberante y las ' +
    'actividades emocionantes se fusionan en una experiencia inigualable. Explora sus playas de arena ' +
    'dorada, disfruta de deportes acuáticos emocionantes, saborea la deliciosa gastronomía local y déjate ' +
    'envolver por la tranquilidad y el encanto de este destino único. Bienvenido a El Portil, donde cada ' +
    'día es una oportunidad para disfrutar de la vida junto al mar. ¡Prepárate para vivir momentos ' +
    'inolvidables en este rincón paradisíaco de la costa onubense!'



  placesBulletInfo = [
    { iconSource: 'assets/jpg/el-portil-playa.jpg', title: 'Playas', info: ElPortilInfoEnum.Playas },
    { iconSource: 'assets/jpg/el-portil-entorno.jpg', title: 'Entorno natural', info: ElPortilInfoEnum.Entorno },
    { iconSource: 'assets/jpg/el-portil-gastronomia.jpg', title: 'Gastronomia', info: ElPortilInfoEnum.Gastronomia },
    { iconSource: 'assets/jpg/el-portil-actividades.jpg', title: 'Actividades', info: ElPortilInfoEnum.Actividades },
    { iconSource: 'assets/jpg/el-portil-golf.jpg', title: 'Golf', info: ElPortilInfoEnum.Golf },
    { iconSource: 'assets/jpg/el-portil-ubicacion.jpg', title: 'Ubicación', info: ElPortilInfoEnum.Ubicacion },
  ]
  latitud: number = 37.211022;
  longitud: number = -7.0496953;

  constructor() { }

  ngOnInit(): void {
  }

}
