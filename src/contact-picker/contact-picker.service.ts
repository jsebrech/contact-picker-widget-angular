import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  of as observableOf,
  Observable,
} from 'rxjs';

import { ContactPickerValue } from './contact-picker.types';

@Injectable()
export class ContactPickerService {
  constructor(
    private http: HttpClient
  ) {}

  public getPeopleByQuery(
    /**
     * If an array of values, it will search in that array.
     * If a string, it will use that as URL for contacting the BFF,
     * appending search=<search> as query argument.
     */
     dataSource: ContactPickerValue[] | string,
     /** The string to search for */
     search: string
  ): Observable<ContactPickerValue[]> {
    if (Array.isArray(dataSource)) {
      return observableOf(dataSource.filter((v: ContactPickerValue) => {
        const name = v.name.toLowerCase();
        const matchOn = search.toLowerCase();
        return name.indexOf(matchOn) >= 0;
      }));
    } else if (typeof dataSource === 'string') {
      const uri = dataSource +
      ((dataSource.indexOf('?') < 0) ? '?' : '&') +
      'search=' + search;
      return this.http.get<ContactPickerValue[]>(uri);
    } else {
      // should never happen
      throw new TypeError('Unsupported dataSource type "' + (typeof dataSource) + '"');
    }
  }
}
