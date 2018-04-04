import { Input, Component, OnInit, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/mergeMap';

import { ContactPickerValue } from './contact-picker.value';
import { ContactPickerService } from './contact-picker.service';
import { AutoCompleteComponent } from '@acpaas-ui/auto-complete';
import { ControlValueAccessor } from '@angular/forms';

@Component({
    selector: 'aui-contact-picker',
    templateUrl: './contact-picker.component.html',
    styleUrls: ['./contact-picker.component.css']
})
export class ContactPickerComponent
    // ControlValueAccessor as per
    // https://blog.thoughtram.io/angular/2016/07/27/custom-form-controls-in-angular-2.html
    implements OnInit, ControlValueAccessor {

    // see set data below
    private _data: ContactPickerValue[];

    /**
     * The URL to the BFF.
     * Must specify either this or the data property.
     */
    @Input() url;
    /** what to show in the input field when blank */
    @Input() placeholder = '';
    /** minimum number of characters typed before search is triggered */
    @Input() minLength = 2;
    /** message to show when there are no hits */
    @Input() noDataMessage = 'Geen resultaat gevonden';
    /** a value object property to show as differentiator (aside from name) */
    @Input() differentiator = '';
    /** the value that is displayed */
    @Input() value: ContactPickerValue;
    /** the event fired when the value changes */
    @Output() valueChange = new EventEmitter<ContactPickerValue>();

    /**
     * A set of fixed data to look through (instead of querying the url)
     * Array, matches on name property, case-insensitive
     */
    @Input() set data(value: ContactPickerValue[]) {
        this._data = value;
        // if the field hasn't been searching yet, secretly update its results list
        if (this.autocomplete && !this.autocomplete.searching) {
            this.resetSearchResults();
        }
    }
    get data(): ContactPickerValue[] {
        return this._data;
    }

    /** the results in the auto-complete list */
    searchResults: ContactPickerValue[];
    /** monitors changes in the query value to search for */
    searchChange$: Observer<string>;
    /** the autocomplete component */
    @ViewChild(AutoCompleteComponent) autocomplete: AutoCompleteComponent;

    constructor(
        private personPickerService: ContactPickerService,
        private element: ElementRef
    ) {}

    /** Set the focus in the text field. */
    public focus() {
        const nativeEl = this.element.nativeElement;
        if (nativeEl && nativeEl.querySelector) {
            const input = nativeEl.querySelector('input[type=text]');
            if (input) {
                input.select();
            }
        }
    }

    ngOnInit() {
        this.resetSearchResults();

        // trigger an autocomplete search when the query string changes
        Observable.create((observer) => {
            this.searchChange$ = observer;
        })
            .debounceTime(500)
            .mergeMap((search) =>
                this.personPickerService.getPeopleByQuery(this.data || this.url, search))
            .subscribe((results) => {
                this.searchResults = withUniqueNames(results);
            });
    }

    onSearch(searchString: string) {
        if (searchString.length >= this.minLength) {
            this.searchChange$.next(searchString);
        } else {
            this.resetSearchResults();
        }
    }

    onSelect(data: Event | ContactPickerValue) {
        if (data instanceof Event) {
            // do nothing: we don't respond to text selection events
        } else {
            this.writeValue(data as ContactPickerValue);
        }
    }

    resetSearchResults() {
        // if there are only a few static items to look through
        // show the possible results immediately on focus (without the user having to type)
        if (this.data && this.data.length && this.data.length <= 20) {
            this.searchResults = this.data;
        } else {
            this.searchResults = [];
        }
        // if an initial value is set, focusing+blurring the field
        // should not clear the field
        if (this.value && !this.searchResults.length) {
            this.searchResults = [this.value];
        }
    }

    formatLabel(input: ContactPickerValue): string {
        const search = this.autocomplete.query;
        const inputString = input.name || input.id || '';
        const regEx = new RegExp(search, 'ig');
        return inputString.replace(regEx, (match) => '<strong>' + match + '</strong>');
    }

    // ControlValueAccessor interface

    writeValue(value: ContactPickerValue|any) {
        this.value = value as ContactPickerValue;
        this.valueChange.emit(this.value);
        if (this.propagateChange) {
            this.propagateChange(this.value);
        }
        this.resetSearchResults();
    }

    propagateChange = (_: any) => {};

    registerOnChange(fn) {
        this.propagateChange = fn;
    }

    registerOnTouched() {}

}

// auto-complete component does not support duplicate labels,
// fix this by ensuring every name is unique
const withUniqueNames =
    (items: ContactPickerValue[]): ContactPickerValue[] => {
        const counts = {};
        items.forEach((item) => {
            if (!counts[item.name]) {
                counts[item.name] = 0;
            }
            if (++counts[item.name] > 1) {
                item.name += ' (' + (item.userName || counts[item.name]) + ')';
            }
        });
        return items;
    };
