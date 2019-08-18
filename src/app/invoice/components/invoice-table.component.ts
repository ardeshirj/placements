import { Component, ViewChild, AfterViewInit, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subject, combineLatest, Subscribable, Subscription } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';

import { InvoiceActions } from "../actions";
import { Invoice } from '../models';
import * as fromInvoices from "../reducers";
import { debounceTime, startWith, distinctUntilChanged } from 'rxjs/operators';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'invoice-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './invoice-table.component.html',
  styleUrls: ['./invoice-table.component.scss']
})
export class InvoiceTableComponent implements AfterViewInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  private _previousFilter: string;

  invoices: Observable<Invoice[]>;
  totalCount: Observable<number>;

  filterSubject: Subject<string>;

  filterSortPaginateSub: Subscription;
  filterSortSub: Subscription;

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

  ngAfterViewInit() {
    this.invoices = this._store.select(fromInvoices.getInvoices);
    this.totalCount = this._store.select(fromInvoices.getTotalCount);

    this.filterSubject = new Subject<string>();

    this.filterSortPaginateSub = combineLatest(
      this.filterSubject.pipe(startWith(null), debounceTime(1000)),
      this.sort.sortChange.pipe(startWith(null)),
      this.paginator.page.pipe(startWith(null))
    )
    .subscribe(([keyword, sortObject, pageEvent]) => {
      this._store.dispatch(InvoiceActions.adjustInvoices({ 
        keyword: keyword ? keyword : "",
        pageNumber: this.paginator.pageIndex + 1,
        sort: sortObject ? sortObject.active : null,
        direction: sortObject ? sortObject.direction : null
      }))
    });

    this.filterSortSub = combineLatest(
      this.filterSubject.pipe(startWith(null), debounceTime(1000)),
      this.sort.sortChange.pipe(startWith(null)),
    ).subscribe(() => {
      if (this.paginator.pageIndex !== 1) {
        this.paginator.firstPage();
      } 
    })
  }

  ngOnDestroy() {
    if (this.filterSortPaginateSub) {
      this.filterSortPaginateSub.unsubscribe();
    }

    if (this.filterSortSub) {
      this.filterSortSub.unsubscribe();
    }
  }
 }
