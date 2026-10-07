import { Component, OnInit } from '@angular/core';
import { HuelvaInfoEnum } from './huelva.component.enum';

@Component({
  selector: 'app-huelva',
  templateUrl: './huelva.component.html',
  styleUrls: ['./huelva.component.scss']
})
export class HuelvaComponent implements OnInit {


  title: string = 'Huelva';
  backgroundImage: string = 'assets/jpg/huelva.jpg'
  introText: string = 'Podrás descubrir las maravillas de Huelva, una provincia que lo tiene todo.'
    + ' Desde las playas más espectaculares de la costa atlántica, hasta la rica cultura y patrimonio'
    + ' histórico de la ciudad de Huelva. La gastronomía de la región es única y deliciosa, con platos'
    + ' como el jamón ibérico, el pescado y los mariscos frescos, y el aceite de oliva virgen extra de'
    + ' alta calidad. Además, podrás disfrutar de la naturaleza en su estado más puro, con extensos'
    + ' parques naturales como el Parque Nacional de Doñana y la Sierra de Aracena. La ciudad de Huelva'
    + ' también cuenta con una excelente calidad de vida, con una animada vida nocturna y un ambiente'
    + ' acogedor y relajado. ¡Descubre las mejores cosas de Huelva con nosotros!'



  placesBulletInfo = [
    { iconSource: 'assets/jpg/huelva-cultura.jpg', title: 'Cultura', info: HuelvaInfoEnum.Cultura },
    { iconSource: 'assets/jpg/huelva-gastronomia.jpg', title: 'Gastronomía', info: HuelvaInfoEnum.Gastronomia },
    { iconSource: 'assets/jpg/huelva-clima.jpg', title: 'Buen clima', info: HuelvaInfoEnum.BuenClima },
    { iconSource: 'assets/jpg/huelva-naturaleza.jpg', title: 'Naturaleza', info: HuelvaInfoEnum.Naturaleza },
    { iconSource: 'assets/jpg/huelva-calidad.jpg', title: 'Calidad de Vida', info: HuelvaInfoEnum.CalidadVida },
    { iconSource: 'assets/jpg/huelva-coste.jpg', title: 'Coste asequible', info: HuelvaInfoEnum.Coste },
  ]
  latitud: number = 37.2575874;
  longitud: number = -6.9484945;

  constructor() { }

  ngOnInit(): void {
  }

}
