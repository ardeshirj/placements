import { Invoice } from '../models/invoice';
import { createReducer, on } from '@ngrx/store';
import { InvoiceActions } from '../actions';

export const invoiceFeatureKey = 'invoiceState';

export interface State {
  invoices: Invoice[];
}

export const initialState: State = {
  invoices: []
}

export const reducer = createReducer(
  initialState,
  on(InvoiceActions.loadedInvoices, (state, { invoices }) => ({ invoices: invoices }))
)
