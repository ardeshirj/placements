import { Invoice } from '../models/invoice';
import { createReducer, on } from '@ngrx/store';
import { InvoiceActions } from '../actions';
import { Directionality } from '@angular/cdk/bidi';

export const invoiceFeatureKey = 'invoiceState';

export interface State {
  invoices: Invoice[];
  totalCount: number;
  pageNumber: number,
  keyword: string,
  sort: string,
  direction: string
}

export const initialState: State = {
  invoices: [],
  totalCount: 0,
  pageNumber: 0,
  keyword: null,
  sort: null,
  direction: null
}

export const reducer = createReducer(
  initialState,
  on(InvoiceActions.adjust, 
    (state, { keyword, pageNumber, sort, direction }) => (
      { 
        ...state,
        pageNumber: pageNumber, 
        sort: sort, 
        direction: direction,
        keyword: keyword
      }
    )
  ),
  on(
    InvoiceActions.adjusted, 
    (state, { count, invoices }) => (
      { 
        ...state,
        totalCount: count, 
        invoices: invoices
      }
    )
  )
)
