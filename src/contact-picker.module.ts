import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AutoCompleteModule } from '@acpaas-ui/ngx-forms';

import { ContactPickerComponent } from './contact-picker/contact-picker.component';
import { ContactPickerService } from './contact-picker/contact-picker.service';

@NgModule({
  imports: [ CommonModule, FormsModule, AutoCompleteModule, HttpClientModule ],
  declarations: [ ContactPickerComponent ],
  providers: [ ContactPickerService ],
  exports: [ ContactPickerComponent ]
})

export class ContactPickerModule {
}
