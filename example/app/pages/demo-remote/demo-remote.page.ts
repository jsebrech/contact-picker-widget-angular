import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';

import { ContactPickerValue } from '../../../../src';

@Component({
    selector: 'app-demo-remote',
    templateUrl: './demo-remote.page.html'
})
export class DemoRemotePage {
    // person in first field
    picker1: ContactPickerValue;

    // person in first field
    picker2: ContactPickerValue;
}
