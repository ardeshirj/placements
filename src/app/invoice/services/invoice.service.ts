import { Injectable } from "@angular/core";
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';

import { Invoice } from '../models';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class InvoiceService {
  getInvoices(pageNumber: number): Observable<{ count: number, items: Invoice[] }> {
    const httpParams = new HttpParams().set('_page', String(pageNumber));
    return this._httpClient.get<Invoice[]>(
      'http://localhost:3000/invoices',
      { params: httpParams, observe: 'response' }
    ).pipe(
      map(response => {
        return {
          count: +response.headers.get('x-total-count'), 
          items: response.body
        }
      })
    )
  }

  filterInvoices(keyword: string, pageNumber: number) {
    const httpParams = new HttpParams()
      .set('q', keyword)
      .set('_page', String(pageNumber));

    return this._httpClient.get<Invoice[]>(
      'http://localhost:3000/invoices',
      { params: httpParams, observe: 'response' }
    ).pipe(
      map(response => {
        return {
          count: +response.headers.get('x-total-count'), 
          items: response.body
        }
      })
    )
  }

  constructor(
    private _httpClient: HttpClient
  ) {
  }
}
