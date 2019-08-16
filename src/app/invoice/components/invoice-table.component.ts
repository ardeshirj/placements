import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromInvoices from "../reducers";
import { InvoiceActions } from "../actions";

@Component({
  selector: 'invoice-table',
  templateUrl: './invoice-table.component.html',
  styleUrls: ['./invoice-table.component.scss']
})
export class InvoiceTableComponent implements OnInit {

  constructor(
    private _store: Store<fromInvoices.InvoiceState>
  ) {
  }

  ngOnInit() {
    this._store.dispatch(InvoiceActions.loadInvoices({ pageNumber: 1 }));
  }

}
