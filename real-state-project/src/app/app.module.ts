import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxSpinnerModule } from 'ngx-spinner';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './core/home/home.component';
import { AboutUsComponent } from './core/about-us/about-us.component';
import { PropertiesComponent } from './core/properties/properties.component';
import { SharedModule } from './shared/shared.module';
import { HttpClient } from '@angular/common/http';
import { SellComponent } from './core/sell/sell.component';
import { PuntaUmbriaComponent } from './core/places/punta-umbria/punta-umbria.component';
import { HuelvaComponent } from './core/places/huelva/huelva.component';
import { ElRompidoComponent } from './core/places/el-rompido/el-rompido.component';
import { ElPortilComponent } from './core/places/el-portil/el-portil.component';
import { BackofficeModule } from './backoffice/backoffice.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AboutUsComponent,
    PropertiesComponent,
    SellComponent,
    PuntaUmbriaComponent,
    HuelvaComponent,
    ElRompidoComponent,
    ElPortilComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgxSpinnerModule,
    SharedModule,
    NgxSpinnerModule,
    BackofficeModule,
    BrowserAnimationsModule, 
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoader,
        deps: [HttpClient]
      }
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
export function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
