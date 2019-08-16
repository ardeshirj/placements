import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import { InvoiceActions } from "../actions";
import { Invoice } from '../models';
import * as fromInvoices from "../reducers";

@Component({
  selector: 'invoice-table',
  templateUrl: './invoice-table.component.html',
  styleUrls: ['./invoice-table.component.scss']
})
export class InvoiceTableComponent implements OnInit {
  private invoices: Observable<Invoice[]>;

  constructor(
    private _store: Store<fromInvoices.InvoiceState>
  ) {
  }

  ngOnInit() {
    this._store.dispatch(InvoiceActions.loadInvoices({ pageNumber: 1 }));
    this.invoices = this._store.select(fromInvoices.getInvoices);
  }

}
