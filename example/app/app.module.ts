import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ContactPickerModule } from '../../src';
import { AppRoutingModule } from './app-routing.module';
import { Pages } from './pages';

@NgModule({
  declarations: [
    AppComponent,
    ...Pages
  ],
  imports: [
    BrowserModule,
    ContactPickerModule,
    HttpModule,
    AppRoutingModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
