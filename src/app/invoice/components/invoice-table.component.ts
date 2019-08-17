import { Component, OnInit, ViewChild } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';

import { InvoiceActions } from "../actions";
import { Invoice } from '../models';
import * as fromInvoices from "../reducers";
import { MatTableDataSource } from '@angular/material/table';
import { take } from 'rxjs/operators';

@Component({
  selector: 'invoice-table',
  templateUrl: './invoice-table.component.html',
  styleUrls: ['./invoice-table.component.scss']
})
export class InvoiceTableComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  invoices: Observable<Invoice[]>;
  totalCount: Observable<number>;

  displayedColumns: string[] = [
    'actual_amount', 
    'adjustments', 
    'booked_amount', 
    'campaign_name',
    'line_item_name'
  ];

  constructor(
    private _store: Store<fromInvoices.InvoiceState>
  ) {
  }

  ngOnInit() {
    this._store.dispatch(InvoiceActions.loadInvoices({ pageNumber: 1 }));
    this.invoices = this._store.select(fromInvoices.getInvoices);
    this.totalCount = this._store.select(fromInvoices.getTotalCount);

    this.paginator.page.subscribe((_: any) => {
      const pageNumber = this.paginator.pageIndex + 1;
      this._store.dispatch(InvoiceActions.loadInvoices({ pageNumber: pageNumber }));
    })
  }
}
