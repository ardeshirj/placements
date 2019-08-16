import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from '@angular/common/http';

import { Invoice } from '../models';
import { Observable } from 'rxjs';

@Injectable()
export class InvoiceService {
  getInvoices(pageNumber: number): Observable<Invoice[]> {
    const httpParams = new HttpParams().set('_page', String(pageNumber));
    return this._httpClient.get<Invoice[]>(
      'http://localhost:3000/invoices',
      { params: httpParams }
    )
  }

  constructor(
    private _httpClient: HttpClient
  ) {
  }
}
