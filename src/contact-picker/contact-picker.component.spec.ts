import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ElementRef } from '@angular/core';

import { ContactPickerComponent, ContactPickerService, ContactPickerValue, ContactPickerModule } from '..';
import { of as observableOf } from 'rxjs';

describe('ContactPickerComponent', () => {

    let fixture: ComponentFixture<ContactPickerComponent>;
    let comp: ContactPickerComponent;
    let element: any;
    let testValues: ContactPickerValue[];

    class MockContactPickerService {
        getPeopleByQuery(dataSource: any, search: string) {
            return observableOf(testValues);
        }
    }

    const provideTestValues = (count: number = 1) => {
        testValues = [];
        for (let i = 0; i < count; i++) {
            testValues.push({
                id: 'test' + i,
                name: 'test'
            });
        }
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ContactPickerModule],
            providers: [
                { provide: ContactPickerService, useClass: MockContactPickerService }
            ]
        });
        provideTestValues(1);
        fixture = TestBed.createComponent(ContactPickerComponent);
        comp = fixture.componentInstance;
        comp.bufferInputMs = 0;
        element = fixture.nativeElement;
    });

    afterEach(() => {
        if (element) {
            document.body.removeChild(element);
        }
    });

    it('should show the list by default for few items', () => {
        comp.data = testValues;
        fixture.detectChanges();
        expect(comp.searchResults).toEqual(testValues);
        expect(comp.autocomplete.results).toEqual(testValues);
    });

    it('should not show the list by default for many items', () => {
        provideTestValues(50);
        fixture.detectChanges();
        expect(comp.searchResults.length).toEqual(0);
        expect(comp.autocomplete.results.length).toEqual(0);
    });

    it('should select the text on focus()', (done) => {
        comp.value = testValues[0];
        fixture.detectChanges();
        const input = element.querySelector('input[type=text]');
        input.select = () => { done(); };
        comp.focus();
    });

    it('should not query values for a short text', (done) => {
        comp.minLength = 4;
        comp.ngOnInit();
        fixture.detectChanges();
        const spy = spyOn(comp, 'resetSearchResults');
        const input = element.querySelector('input[type=text]');
        input.value = 'foo';
        input.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        setTimeout(() => {
            expect(spy).toHaveBeenCalled();
            done();
        }, 10);
    });

    it('should query values and display as unique', (done) => {
        provideTestValues(2);
        comp.ngOnInit();
        fixture.detectChanges();
        const input = element.querySelector('input[type=text]');
        input.value = 'test';
        input.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        setTimeout(() => {
            expect(comp.searchResults).not.toBeNull();
            expect(comp.searchResults.length).toEqual(2);
            expect(comp.searchResults[1].name).not.toEqual(comp.searchResults[0].name);
            done();
        }, 10);
    });

    it('should clear the search results on value clear', () => {
        comp.value = testValues[0];
        comp.searchResults = testValues;
        fixture.detectChanges();
        comp.writeValue(null);
        expect(comp.searchResults.length).toBe(0);
    });

});

class MockElementRef extends ElementRef {
    constructor() { super(null); }
}
