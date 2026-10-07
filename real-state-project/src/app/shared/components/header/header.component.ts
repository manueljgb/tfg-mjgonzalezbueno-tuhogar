import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { TranslateService } from '@ngx-translate/core';
import { MenuItemDTO } from './models/MenuItemDTO';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { headerConfig } from './models/header-config';
import { MenuMobileComponent } from '../menu-mobile/menu-mobile.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  logoSrc: string = headerConfig.logoSrc;
  phoneImgSrc: string = headerConfig.phoneImgSrc;
  phoneTo!: string;
  addressImgSrc: string = headerConfig.addressImgSrc;
  mailImgSrc: string = headerConfig.mailImgSrc;
  menuItems: MenuItemDTO[] = headerConfig.menuItems;
  concesionarios: any;
  centros: any;
  localizacion = 'https://www.google.com/maps/place/C.+Ancha,+97,+21100+Punta+Umbr%C3%ADa,+Huelva/@37.1823912,-6.9628888,17z/data=!4m6!3m5!1s0xd11d0d5c6a698e5:0x372ee85caea58173!8m2!3d37.182669!4d-6.962127!16s%2Fg%2F11hc_3y51n?entry=ttu'

  @ViewChild('mobileMenu') menu!: MenuMobileComponent;


  private enteredButton = false;
  private isMatMenuOpen = false;

  constructor(
    public translate: TranslateService,
    public dialog: MatDialog,
    private spinner: NgxSpinnerService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.translate.use('es');

  }


  navigate(link: string | undefined) {
    if (link) {
      this.router.navigate([`/${link}`]);
    }
  }

  menuenter() {
    this.isMatMenuOpen = true;
  }

  menuLeave(trigger: MatMenuTrigger) {
    setTimeout(() => {
      if (!this.enteredButton) {
        this.isMatMenuOpen = false;
        trigger.closeMenu();
      } else {
        this.isMatMenuOpen = false;
      }
      let cdk = document.getElementsByClassName('cdk-overlay-container') as HTMLCollectionOf<HTMLElement>;
      cdk[0].style.zIndex = '1000';
    }, 80);
  }

  buttonEnter(trigger: MatMenuTrigger) {
    let cdk = document.getElementsByClassName('cdk-overlay-container') as HTMLCollectionOf<HTMLElement>;
    if (cdk.length !== 0) {
      cdk[0]!.style.zIndex = '1002';
    }
    setTimeout(() => {
      trigger.openMenu();
    }, 100);

  }

  buttonLeave(trigger: MatMenuTrigger) {
    setTimeout(() => {
      if (this.enteredButton && !this.isMatMenuOpen) {
        trigger.closeMenu();
      }
      if (!this.isMatMenuOpen) {
        trigger.closeMenu();
      } else {
        this.enteredButton = false;
      }
      let cdk = document.getElementsByClassName('cdk-overlay-container') as HTMLCollectionOf<HTMLElement>;
      cdk[0].style.zIndex = '1000';
    }, 100);
  }

  openMobileMenu(): void {
    this.menu.openMobileMenu();
  }

  openPhoneInfo(): void {
    document.getElementById('phone-info')!.style.display = 'flex';
  }
  closePhoneInfo(): void {
    document.getElementById('phone-info')!.style.display = 'none';
  }
}
