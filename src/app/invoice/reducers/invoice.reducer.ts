import { Invoice } from '../models/invoice';
import { createReducer } from '@ngrx/store';

export const invoiceFeatureKey = 'invoiceState';

export interface State {
  invoices: Invoice[];
}

export const initialState: State = {
  invoices: []
}

export const reducer = createReducer(
  initialState
)
