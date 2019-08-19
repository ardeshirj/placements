import { Action, combineReducers, createSelector, createFeatureSelector, createAction } from "@ngrx/store";

import * as fromInvoices from "./invoice.reducer";
import { Invoice } from '../models';

export interface InvoiceState {
  // All states in this module...
  [fromInvoices.invoiceFeatureKey]: fromInvoices.State;
}

export function reducers(state: InvoiceState | undefined, action: Action) {
  return combineReducers({
    [fromInvoices.invoiceFeatureKey]: fromInvoices.reducer
  })(state, action);
}

export const getInvoiceState = createFeatureSelector<InvoiceState, fromInvoices.State>(
  fromInvoices.invoiceFeatureKey
);

export const getInvoices = createSelector(
  getInvoiceState,
  state => state.invoices
)

export const getTotalCount = createSelector(
  getInvoiceState,
  state => state.totalCount
)

export const getIsLoading = createSelector(
  getInvoiceState,
  state => state.isLoading
)
