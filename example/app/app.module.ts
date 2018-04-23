import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
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
        HttpClientModule,
        AppRoutingModule
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
