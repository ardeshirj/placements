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
      map(invoices => InvoiceActions.loadedInvoices({ invoices }))
    )
  )

  constructor(
    private _actions: Actions,
    private _invoiceService: InvoiceService
  ) {
    
  }
}
