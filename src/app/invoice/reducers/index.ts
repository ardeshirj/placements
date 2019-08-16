import { Action, combineReducers } from "@ngrx/store";

import * as fromInvoices from "./invoice.reducer";

export interface InvoiceState {
  // All states in this module...
  [fromInvoices.invoiceFeatureKey]: fromInvoices.State;
}

export function reducers(state: InvoiceState | undefined, action: Action) {
  return combineReducers({
    [fromInvoices.invoiceFeatureKey]: fromInvoices.reducer
  })(state, action);
}
