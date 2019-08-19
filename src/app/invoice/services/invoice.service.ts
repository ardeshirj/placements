import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Invoice } from '../models';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class InvoiceService {
  filter(keyword: string, pageNumber: number, sort: string, direction: string) {
    const httpParams = new HttpParams()
      .set('q', keyword)
      .set('_page', String(pageNumber))
      .set('_sort', sort)
      .set('_order', direction);

    return this._httpClient.get<Invoice[]>(
      'http://localhost:3000/invoices',
      { params: httpParams, observe: 'response' }
    ).pipe(
      map(response => {
        return {
          count: +response.headers.get('x-total-count'),
          items: response.body
        };
      })
    );
  }

  review(invoices: Invoice[]) {
    const patchObs = invoices.map(invoice => {
      return this._httpClient.patch<Invoice[]>(
        `http://localhost:3000/invoices/${invoice.id}`,
        { reviewed: true }
      );
    });
    return forkJoin(patchObs);
  }

  constructor(
    private _httpClient: HttpClient
  ) {
  }
}
