import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  backgroundImageURL: string = './assets/png/residential-house.png';

  
  constructor(private titleService: Title) {
    this.titleService.setTitle("Home | Inmobiliaria TuHogar");

  }

  ngOnInit(): void {
  }

}
