import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-location-card',
  templateUrl: './location-card.component.html',
  styleUrls: ['./location-card.component.scss']
})
export class LocationCardComponent implements OnInit {

  @Input() imageSource: string = '';
  @Input() place: string = '';
  @Input() link: string = '';
  constructor(public route: Router) { }

  ngOnInit(): void {
  }
  goTo() {
    this.route.navigate([this.link])
  }
}
