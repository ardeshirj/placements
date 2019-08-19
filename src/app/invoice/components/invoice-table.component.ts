import { Component, ViewChild, AfterViewInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { Store } from '@ngrx/store';
import { Observable, Subject, combineLatest, Subscription, ReplaySubject, BehaviorSubject } from 'rxjs';
import { debounceTime, startWith } from 'rxjs/operators';
import { saveAs } from 'file-saver';


import { InvoiceActions } from '../actions';
import { Invoice } from '../models';
import * as fromInvoices from '../reducers';

@Component({
  selector: 'app-invoice-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './invoice-table.component.html',
  styleUrls: ['./invoice-table.component.scss']
})
export class InvoiceTableComponent implements AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  invoices: Observable<Invoice[]>;
  totalCount: Observable<number>;
  isLoading: Observable<boolean>;
  filterSubject: Subject<string>;
  subscriptions: Subscription[];

  selection = new SelectionModel<Invoice>(true, []);
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
    this.isLoading = this._store.select(fromInvoices.getIsLoading);

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
        keyword: keyword ? keyword : '',
        pageNumber: this.paginator.pageIndex + 1,
        sort: sortObject ? sortObject.active : null,
        direction: sortObject ? sortObject.direction : null
      }));
    });

    const filterSortSub = combineLatest(
      this.filterSubject.pipe(startWith(null), debounceTime(1000)),
      this.sort.sortChange.pipe(startWith(null)),
    ).subscribe(() => {
      if (this.paginator.pageIndex !== 1) {
        this.paginator.firstPage();
      }
    });

    this.subscriptions = [
      invoicesSub,
      filterSortPaginateSub,
      filterSortSub
    ];
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

  onExportToCSV() {
    const header = [
      'Actual Amount',
      'Adjustments',
      'Booked Amount',
      'Campaign Name',
      'Line Item Name',
      'Reviewed'
    ].join(',');

    const csvEntries = [header];
    this.selection.selected.forEach(invoice => {
      csvEntries.push(Object.values(invoice).join(','));
    });

    const csvBlob = new File(
      [csvEntries.join('\n')],
      `invoices-${new Date().toISOString()}.csv`,
      { type: 'data/csv;charset=uft-8'}
    );

    saveAs(csvBlob);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
 }
