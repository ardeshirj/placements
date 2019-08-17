import { Invoice } from '../models/invoice';
import { createReducer, on } from '@ngrx/store';
import { InvoiceActions } from '../actions';

export const invoiceFeatureKey = 'invoiceState';

export interface State {
  invoices: Invoice[];
  totalCount: number;
}

export const initialState: State = {
  invoices: [],
  totalCount: 0
}

export const reducer = createReducer(
  initialState,
  on(
    InvoiceActions.loadedInvoices, 
    (state, { count, invoices }) => (
      { totalCount: count, invoices: invoices }
    )
  )
)
