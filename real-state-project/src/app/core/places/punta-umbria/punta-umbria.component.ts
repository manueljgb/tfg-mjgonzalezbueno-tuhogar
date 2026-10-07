import { Component, OnInit } from '@angular/core';
import { PuntaUmbriaInfoEnum } from './punta-umbria.component.enum';

@Component({
  selector: 'app-punta-umbria',
  templateUrl: './punta-umbria.component.html',
  styleUrls: ['./punta-umbria.component.scss']
})
export class PuntaUmbriaComponent implements OnInit {


  title: string = 'Punta Umbría';
  backgroundImage: string = 'assets/jpg/punta-umbria.jpg'
  introText: string = 'Punta Umbría es uno de los destinos turísticos más populares en la provincia'
    + ' de Huelva. Esta encantadora ciudad costera ofrece una amplia variedad de'
    + ' atractivos turísticos y actividades para todo tipo de visitantes. Desde sus'
    + ' playas de arena dorada y aguas cristalinas, hasta sus deliciosos mariscos y'
    + ' pescados frescos, pasando por sus festivales y tradiciones, Punta Umbría es'
    + ' el destino perfecto para aquellos que buscan un lugar tranquilo y relajante'
    + ' para disfrutar de unas vacaciones inolvidables. Descubre todo lo que Punta'
    + ' Umbría tiene para ofrecer y déjate cautivar por la magia de esta maravillosa'
    + ' ciudad.'

  placesBulletInfo = [
    { iconSource: 'assets/jpg/punta-umbria-playas.jpg', title: 'Playas', info: PuntaUmbriaInfoEnum.Playas },
    { iconSource: 'assets/jpg/punta-umbria-gastronomia.jpg', title: 'Gastronomía', info: PuntaUmbriaInfoEnum.Gastronomia },
    { iconSource: 'assets/jpg/punta-umbria-clima.jpg', title: 'Buen clima', info: PuntaUmbriaInfoEnum.BuenClima },
    { iconSource: 'assets/jpg/punta-umbria-naturaleza.jpg', title: 'Naturaleza', info: PuntaUmbriaInfoEnum.Naturaleza },
    { iconSource: 'assets/jpg/punta-umbria-deportes.jpg', title: 'Deportes acuáticos', info: PuntaUmbriaInfoEnum.DeportesAcuaticos },
    { iconSource: 'assets/jpg/punta-umbria-feria.jpg', title: 'Fiestas y tradiciones', info: PuntaUmbriaInfoEnum.FiestasYTradiciones },
  ]
  latitud: number = 37.1830237;
  longitud: number = -6.9662203;

  constructor() { }

  ngOnInit(): void {
  }

}
