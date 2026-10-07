import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-places-bullet-info',
  templateUrl: './places-bullet-info.component.html',
  styleUrls: ['./places-bullet-info.component.scss']
})
export class PlacesBulletInfoComponent implements OnInit {
  @Input() iconSource: string = '';
  @Input() title: string = '';
  @Input() info: string = '';
  constructor() { }

  ngOnInit(): void {
  }

}
