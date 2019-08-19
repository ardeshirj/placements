import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { flatMap, map, withLatestFrom, concatMap } from 'rxjs/operators';

import { InvoiceActions } from '../actions';
import { InvoiceService } from '../services/invoice.service';
import * as fromInvoice from '../reducers';
import { of } from 'rxjs/internal/observable/of';

@Injectable()
export class InvoiceEffects {
  adjust = createEffect(() => {
    return this._actions.pipe(
      ofType(InvoiceActions.adjust),
      flatMap(({ keyword, pageNumber, sort, direction }) => {
        return this._invoiceService.filter(keyword, pageNumber, sort, direction);
      }),
      map(invoices => InvoiceActions.adjusted({
        count: invoices.count,
        invoices: invoices.items
      }))
    );
  });

  review = createEffect(() => {
    return this._actions.pipe(
      ofType(InvoiceActions.review),
      flatMap(({ invoices }) => this._invoiceService.review(invoices)),
      map(_ =>  InvoiceActions.reviewed())
    );
  });

  readjustOnReview = createEffect(() => {
    return this._actions.pipe(
      ofType(InvoiceActions.reviewed),
      concatMap(action => of(action).pipe(
        withLatestFrom(this._store.pipe(select(fromInvoice.getInvoiceState))),
      )),
      map(([action, state]) => {
        return InvoiceActions.adjust({
          keyword: state.keyword,
          pageNumber: state.pageNumber,
          sort: state.sort,
          direction: state.direction
        });
      })
    );
  });

  constructor(
    private _actions: Actions,
    private _invoiceService: InvoiceService,
    private _store: Store<fromInvoice.InvoiceState>
  ) {

  }
}
