import { Component, Input } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';
import { headerConfig } from '../header/models/header-config';
@Component({
  selector: 'app-menu-mobile',
  templateUrl: './menu-mobile.component.html',
  styleUrls: ['./menu-mobile.component.scss']
})
export class MenuMobileComponent {
  @Input() phoneImgSrc!: string;
  @Input() phoneTo!: string;
  @Input() addressImgSrc!: string;
  @Input() mailImgSrc!: string;
  menuItems = headerConfig.menuItems;
  concesionarios: any;

  constructor(
    private router: Router,
    private spinner: NgxSpinnerService
  ) {}
  ngOnInit(): void {
   
  }

  closeMobileMenu(): void {
    document.getElementById('main-container')!.style.opacity = '0';
    document.getElementById('main-container')!.style.visibility = 'hidden';
    document.getElementById('main-container')!.style.display = 'none';
  }
  openMobileMenu(): void {
    document.getElementById('main-container')!.style.opacity = '1';
    document.getElementById('main-container')!.style.visibility = 'visible';
    document.getElementById('main-container')!.style.display = 'flex';
  }

  navigate(
    link: string | undefined,
    trigger: MatMenuTrigger,
    desplegable?: boolean
  ) {
    if (link && !desplegable) {
      this.router.navigate([link]);
      this.closeMenu(trigger);
      this.closeMobileMenu();
    }
  }
  
  closeMenu(trigger: MatMenuTrigger) {
    trigger.closeMenu();
  }
}
