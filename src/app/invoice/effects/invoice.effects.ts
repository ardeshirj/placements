import { Injectable } from "@angular/core";
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { flatMap, map } from "rxjs/operators"

import { InvoiceActions } from "../actions";
import { InvoiceService } from '../services/invoice.service';

@Injectable()
export class InvoiceEffects {
  filterInvoices = createEffect(() =>
      this._actions.pipe(
        ofType(InvoiceActions.adjustInvoices),
        flatMap(({ keyword, pageNumber, sort, direction }) => {
          return this._invoiceService.filterInvoices(keyword, pageNumber, sort, direction);
        }),
        map(invoices => InvoiceActions.adjustedInvoices({ 
          count: invoices.count,
          invoices: invoices.items 
        }))
      )
  )

  constructor(
    private _actions: Actions,
    private _invoiceService: InvoiceService
  ) {
    
  }
}
