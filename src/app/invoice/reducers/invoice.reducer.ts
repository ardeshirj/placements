import { Invoice } from '../models/invoice';
import { createReducer, on } from '@ngrx/store';
import { InvoiceActions } from '../actions';

export const invoiceFeatureKey = 'invoiceState';

export interface State {
  isLoading: boolean;
  invoices: Invoice[];
  totalCount: number;
  pageNumber: number;
  keyword: string;
  sort: string;
  direction: string;
}

export const initialState: State = {
  isLoading: false,
  invoices: [],
  totalCount: 0,
  pageNumber: 0,
  keyword: null,
  sort: null,
  direction: null
};

export const reducer = createReducer(
  initialState,
  on(InvoiceActions.adjust,
    (state, { keyword, pageNumber, sort, direction }) => (
      {
        ...state,
        isLoading: true,
        pageNumber,
        sort,
        direction,
        keyword
      }
    )
  ),
  on(
    InvoiceActions.adjusted,
    (state, { count, invoices }) => (
      {
        ...state,
        isLoading: false,
        totalCount: count,
        invoices
      }
    )
  ),
  on(
    InvoiceActions.reviewed,
    (state) => ({ ...state, isLoading: false })
  )
);
