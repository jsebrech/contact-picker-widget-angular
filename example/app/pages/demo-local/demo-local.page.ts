import { Component, OnInit, ViewChild } from '@angular/core';
import { Http } from '@angular/http';

import { ContactPickerValue, ContactPickerComponent } from '../../../../src';

@Component({
    selector: 'app-demo-local',
    templateUrl: './demo-local.page.html'
})
export class DemoLocalPage implements OnInit {
    // person in first field
    picker1: ContactPickerValue = { id: '-2', name: 'Hendrik Conscience' } as ContactPickerValue;

    // person in second field
    picker2: ContactPickerValue;

    // picker 1 component
    @ViewChild('picker1cmp') picker1Cmp: ContactPickerComponent;

    listOfPeople1: ContactPickerValue[] = [];

    listOfPeople2: ContactPickerValue[] = [];

    title = 'app';

    constructor(private http: Http) {}

    ngOnInit() {
        this.http.get('./assets/antwerpenaars.json')
          .subscribe(response => {
            let counter = 0;
            this.listOfPeople1 = response.json().map(v => {
                return { id: (counter++).toString(), name: v } as ContactPickerValue;
            });
        });
        this.http.get('./assets/suskeenwiske.json')
          .subscribe(response => {
            let counter = 0;
            this.listOfPeople2 = response.json().map(v => {
                return { id: (counter++).toString(), name: v } as ContactPickerValue;
            });
        });
    }

    onPicker1BtnClick() {
        this.picker1Cmp.focus();
    }
}
