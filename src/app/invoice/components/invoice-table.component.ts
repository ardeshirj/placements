import { Component, ViewChild, AfterViewInit, ChangeDetectionStrategy } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { Store } from '@ngrx/store';
import { Observable, Subject, combineLatest, Subscription } from 'rxjs';
import { debounceTime, startWith } from 'rxjs/operators';


import { InvoiceActions } from "../actions";
import { Invoice } from '../models';
import * as fromInvoices from "../reducers";

@Component({
  selector: 'invoice-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './invoice-table.component.html',
  styleUrls: ['./invoice-table.component.scss']
})
export class InvoiceTableComponent implements AfterViewInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  selection = new SelectionModel<Invoice>(true, []);
  invoices: Observable<Invoice[]>;
  totalCount: Observable<number>;
  filterSubject: Subject<string>;
  subscriptions: Subscription[];
  displayedColumns: string[] = [
    'select',
    'actual_amount', 
    'adjustments', 
    'booked_amount', 
    'campaign_name',
    'line_item_name',
    'reviewed'
  ];

  private _invoices: Invoice[];

  constructor(
    private _store: Store<fromInvoices.InvoiceState>
  ) {
  }

  ngAfterViewInit() {
    this.invoices = this._store.select(fromInvoices.getInvoices);
    this.totalCount = this._store.select(fromInvoices.getTotalCount);

    this.filterSubject = new Subject<string>();

    const invoicesSub = this.invoices.subscribe(invoices => {
      this._invoices = invoices;
      this.selection.clear();
    });

    const filterSortPaginateSub = combineLatest(
      this.filterSubject.pipe(startWith(null), debounceTime(1000)),
      this.sort.sortChange.pipe(startWith(null)),
      this.paginator.page.pipe(startWith(null))
    )
    .subscribe(([keyword, sortObject, pageEvent]) => {
      this._store.dispatch(InvoiceActions.adjust({ 
        keyword: keyword ? keyword : "",
        pageNumber: this.paginator.pageIndex + 1,
        sort: sortObject ? sortObject.active : null,
        direction: sortObject ? sortObject.direction : null
      }))
    });

    const filterSortSub = combineLatest(
      this.filterSubject.pipe(startWith(null), debounceTime(1000)),
      this.sort.sortChange.pipe(startWith(null)),
    ).subscribe(() => {
      if (this.paginator.pageIndex !== 1) {
        this.paginator.firstPage();
      } 
    })

    this.subscriptions = [
      invoicesSub,
      filterSortPaginateSub,
      filterSortSub
    ]
  }

  isAllSelected() {
    const numRows = this.selection.selected.length;
    const numSelected = this._invoices.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this._invoices.forEach(row => this.selection.select(row));
  }

  onReview() {
    this._store.dispatch(InvoiceActions.review({ invoices: this.selection.selected }));
  }
  
  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
 }
