import { CommonModule, registerLocaleData } from "@angular/common";
import es from '@angular/common/locales/es';
import { LOCALE_ID, NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { TranslateModule } from '@ngx-translate/core';
import 'keen-slider/keen-slider.min.css'
import KeenSlider from 'keen-slider'

//Material:
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatCommonModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSliderModule } from '@angular/material/slider';
import { MatRadioModule } from '@angular/material/radio';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import {CdkAccordionModule} from '@angular/cdk/accordion';



//Components:
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { MenuMobileComponent } from './components/menu-mobile/menu-mobile.component';
import { FirstBannerComponent } from './components/first-banner/first-banner.component';
import { LocationCardComponent } from './components/location-card/location-card.component';
import { CardsContainerComponent } from './components/cards-container/cards-container.component';
import { MagicStepperComponent } from './components/magic-stepper/magic-stepper.component';
import { StepperContainerComponent } from './components/stepper-container/stepper-container.component';
import { PlaceInfoComponent } from './components/place-info/place-info.component';
import { PlacesBulletInfoComponent } from './components/places-bullet-info/places-bullet-info.component';
import { HouseCardComponent } from './components/house-card/house-card.component';
import { ContactToBuyComponent } from './components/contact-to-buy/contact-to-buy.component';
import { ClientCardComponent } from './components/client-card/client-card.component';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { LoginComponent } from "./components/login/login.component";
import { ConfirmationDialogComponent } from "./components/confirmation-dialog/confirmation-dialog.component";


const materialModules = [
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatSelectModule,
    MatTabsModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatDialogModule,
    MatDatepickerModule,
    MatSliderModule,
    MatRadioModule,
    MatTooltipModule,
    MatDividerModule
];

registerLocaleData(es);

@NgModule({
    declarations: [
        HeaderComponent,
        FooterComponent,
        MenuMobileComponent,
        FirstBannerComponent,
        LocationCardComponent,
        CardsContainerComponent,
        MagicStepperComponent,
        StepperContainerComponent,
        PlaceInfoComponent,
        PlacesBulletInfoComponent,
        HouseCardComponent,
        ContactToBuyComponent,
        ClientCardComponent,
        LoginComponent,
        ConfirmationDialogComponent
        
    ],
    imports: [
        CommonModule,
        RouterModule,
        ...materialModules,
        TranslateModule,
        CdkAccordionModule,
        FormsModule,
        ReactiveFormsModule 
    ],
    exports: [
        MatToolbarModule,
        HeaderComponent,
        FooterComponent,
        ...materialModules,
        TranslateModule,
        FirstBannerComponent,
        LocationCardComponent,
        CardsContainerComponent,
        MagicStepperComponent,
        CdkAccordionModule,
        StepperContainerComponent,
        PlaceInfoComponent,
        HouseCardComponent,
        ContactToBuyComponent,
        FormsModule,
        ReactiveFormsModule,
        LoginComponent        
    ],
    providers: [
        
        { provide: LOCALE_ID, useValue: 'es-Es' },
        { provide: MAT_DATE_LOCALE, useValue: 'es-ES' }
        
    ]
})
export class SharedModule { }
