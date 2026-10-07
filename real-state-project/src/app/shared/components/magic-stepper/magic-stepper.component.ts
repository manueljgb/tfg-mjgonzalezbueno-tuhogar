import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-magic-stepper',
  templateUrl: './magic-stepper.component.html',
  styleUrls: ['./magic-stepper.component.scss']
})
export class MagicStepperComponent {

  @HostListener('window:resize', [])
  desktop(): boolean {
    return window.innerWidth > 1100;
  }

  containerWidth = 1080;

  carouselWidth = 1080;

  haveBeenInside = true;


  constructor() { }
  
  makeContainerWidder(): void {
    this.containerWidth = 1080;
  }

  openFirstBox() {
    this.haveBeenInside = true;
  }

  closeFirstBox() {
    this.haveBeenInside = false;
  }

}
