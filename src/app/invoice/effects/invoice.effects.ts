import { Injectable } from "@angular/core";
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { flatMap, map } from "rxjs/operators"

import { InvoiceActions } from "../actions";
import { InvoiceService } from '../services/invoice.service';

@Injectable()
export class InvoiceEffects {
  getInvoices = createEffect(() => 
    this._actions.pipe(
      ofType(InvoiceActions.loadInvoices),
      flatMap(({ pageNumber }) => this._invoiceService.getInvoices(pageNumber)),
      map(invoices => InvoiceActions.loadedInvoices({ 
        count: invoices.count, 
        invoices: invoices.items 
      }))
    )
  )

  filterInvoices = createEffect(() =>
      this._actions.pipe(
        ofType(InvoiceActions.filterInvoices),
        flatMap(({ keyword, pageNumber }) => this._invoiceService.filterInvoices(keyword, pageNumber)),
        map(invoices => InvoiceActions.loadedInvoices({ 
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
