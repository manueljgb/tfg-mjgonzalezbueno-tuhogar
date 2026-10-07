import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-first-banner',
  templateUrl: './first-banner.component.html',
  styleUrls: ['./first-banner.component.scss']
})
export class FirstBannerComponent implements OnInit {

  @Input() tittle?: string;
  @Input() backgroundImageURL: string = '';
  @Input() callToActionButtons: boolean = false;

  logoSrc: string = "assets/svg/TuHogar_Logo.svg"
  constructor() { }

  ngOnInit(): void {

  }

}
