import { Component, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subject, combineLatest } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';

import { InvoiceActions } from "../actions";
import { Invoice } from '../models';
import * as fromInvoices from "../reducers";
import { debounceTime, startWith } from 'rxjs/operators';

@Component({
  selector: 'invoice-table',
  templateUrl: './invoice-table.component.html',
  styleUrls: ['./invoice-table.component.scss']
})
export class InvoiceTableComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  private _previousFilter: string;

  invoices: Observable<Invoice[]>;
  totalCount: Observable<number>;

  filterSubject: Subject<string>;

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

    this.filterSubject = new Subject<string>();

    combineLatest(
      this.filterSubject.pipe(startWith(null), debounceTime(1000)),
      this.paginator.page.pipe(startWith(null)),
    )
    .subscribe(([keyword, pageEvent]) => {
      if (keyword !== this._previousFilter) {
        this.paginator.firstPage();
      }

      this._previousFilter = keyword;

      this._store.dispatch(InvoiceActions.filterInvoices({ 
        keyword: keyword ? keyword : "",
        pageNumber: this.paginator.pageIndex + 1
      }))
    });
  }
}
