import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ContactPickerService, ContactPickerValue } from '..';

describe('ContactPickerService', () => {
    const testValues: ContactPickerValue[] = [{
        id: '0',
        name: 'Zero'
    }, {
        id: '1',
        name: 'One'
    }];

    let service: ContactPickerService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
              HttpClientTestingModule
            ],
            providers: [
              ContactPickerService
            ]
        });
        service = TestBed.get(ContactPickerService);
        httpMock = TestBed.get(HttpTestingController);
    });

    it('should query values from static data', (done) => {
        service.getPeopleByQuery(testValues, 'One').subscribe((results) => {
            expect(results).not.toBeNull();
            expect(results.length).toEqual(1);
            expect(results[0].id).toEqual('1');
            done();
        });
    });

    it('should query values via http', (done) => {
        service.getPeopleByQuery('/people?foo=bar', 'baz').subscribe((res: any) => {
            expect(res).toEqual(testValues);
            done();
        });

        const req = httpMock.expectOne('/people?foo=bar&search=baz');
        req.flush(testValues);
    });

    it('should error out for an invalid data source', () => {
        expect(() => { service.getPeopleByQuery(42 as any, 'baz'); }).toThrow();
    });
});
