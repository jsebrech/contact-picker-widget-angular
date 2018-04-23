import { Input, Component, OnInit, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/mergeMap';

import { AutoCompleteComponent } from '@acpaas-ui/auto-complete';
import { ContactPickerValue } from './contact-picker.value';
import { ContactPickerService } from './contact-picker.service';
import withUniqueNames from './unique-names';

@Component({
    selector: 'aui-contact-picker',
    templateUrl: './contact-picker.component.html',
    styleUrls: ['./contact-picker.component.scss']
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
    @Input() public url;
    /** what to show in the input field when blank */
    @Input() public placeholder = '';
    /** minimum number of characters typed before search is triggered */
    @Input() public minLength = 2;
    /** message to show when there are no hits */
    @Input() public noDataMessage = 'Geen resultaat gevonden';
    /** a value object property to show as differentiator (aside from name) */
    @Input() public differentiator = '';
    /** the value that is displayed */
    @Input() public value: ContactPickerValue;
    /** how long to buffer keystrokes before requesting search results */
    @Input() public bufferInputMs = 500;
    /** the event fired when the value changes */
    @Output() public valueChange: EventEmitter<ContactPickerValue> =
        new EventEmitter<ContactPickerValue>();

    /**
     * A set of fixed data to look through (instead of querying the url)
     * Array, matches on name property, case-insensitive
     */
    @Input() public set data(value: ContactPickerValue[]) {
        this._data = value;
        // if the field hasn't been searching yet, secretly update its results list
        if (this.autocomplete && !this.autocomplete.searching) {
            this.resetSearchResults();
        }
    }

    public get data(): ContactPickerValue[] {
        return this._data;
    }

    /** the results in the auto-complete list */
    public searchResults: ContactPickerValue[];
    /** monitors changes in the query value to search for */
    private searchChange$: Observer<string>;
    /** the autocomplete component */
    @ViewChild(AutoCompleteComponent)
    public autocomplete: AutoCompleteComponent;

    /** used to implement ControlValueAccessor (see below) */
    private propagateChange = (_: any) => {};

    constructor(
        private personPickerService: ContactPickerService,
        private element: ElementRef
    ) {}

    /** Set the focus in the text field, selecting all text. */
    public focus() {
        const nativeEl = this.element.nativeElement;
        if (nativeEl && nativeEl.querySelector) {
            const input = nativeEl.querySelector('input[type=text]');
            if (input) {
                input.select();
            }
        }
    }

    public ngOnInit() {
        this.resetSearchResults();

        // trigger an autocomplete search when the query string changes
        Observable.create((observer) => {
            this.searchChange$ = observer;
        })
            .debounceTime(this.bufferInputMs)
            .mergeMap((search) =>
                this.personPickerService.getPeopleByQuery(this.data || this.url, search)
            )
            .subscribe((results) => {
                this.searchResults = withUniqueNames(results);
            });
    }

    /** revert the search results to the current value of the control */
    public resetSearchResults() {
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

    public onSearch(searchString: string) {
        if (searchString.length >= this.minLength) {
            this.searchChange$.next(searchString);
        } else {
            this.resetSearchResults();
        }
    }

    public onSelect(data: Event | ContactPickerValue) {
        if (data instanceof Event) {
            // do nothing: we don't respond to text selection events
        } else {
            this.writeValue(data as ContactPickerValue);
        }
    }

    private formatLabel(input: ContactPickerValue): string {
        const search = this.autocomplete.query;
        const inputString = input.name || input.id || '';
        const regEx = new RegExp(search, 'ig');
        return inputString.replace(regEx, (match) => '<strong>' + match + '</strong>');
    }

    // ControlValueAccessor interface

    public writeValue(value: ContactPickerValue|any) {
        this.value = value as ContactPickerValue;
        this.valueChange.emit(this.value);
        if (this.propagateChange) {
            this.propagateChange(this.value);
        }
        this.resetSearchResults();
    }

    public registerOnChange(fn) {
        this.propagateChange = fn;
    }

    public registerOnTouched() {}

}
