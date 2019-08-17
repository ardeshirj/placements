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
  invoices: Observable<Invoice[]>;
  displayedColumns: string[];

  constructor(
    private _store: Store<fromInvoices.InvoiceState>
  ) {
  }

  ngOnInit() {
    this._store.dispatch(InvoiceActions.loadInvoices({ pageNumber: 1 }));
    this.invoices = this._store.select(fromInvoices.getInvoices);
    this.displayedColumns = [
      'actual_amount', 
      'adjustments', 
      'booked_amount', 
      'campaign_name',
      'line_item_name'
    ];
  }

}
