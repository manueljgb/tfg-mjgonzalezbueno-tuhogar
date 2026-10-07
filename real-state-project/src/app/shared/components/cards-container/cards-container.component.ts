import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cards-container',
  templateUrl: './cards-container.component.html',
  styleUrls: ['./cards-container.component.scss']
})
export class CardsContainerComponent implements OnInit {

  places = [
    {
      label: 'Huelva',
      img: './assets/jpg/huelva.jpg',
      link: 'huelva'
    },
    {
      label: 'Punta Umbría',
      img: './assets/jpg/punta-umbria.jpg',
      link: 'punta-umbria'
    },
    {
      label: 'El Portil',
      img: './assets/jpg/el-portil.jpg',
      link: 'el-portil'
    },
    {
      label: 'El Rompido',
      img: './assets/jpg/el-rompido.jpg',
      link: 'el-rompido'
    },
  ]
  constructor() { }

  ngOnInit(): void {
  }

}
