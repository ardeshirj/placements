import { createAction, props } from '@ngrx/store';
import { Invoice } from '../models';

export const loadInvoices = createAction(
  '[Load Invoices] Load',
  props<{ pageNumber: number }>()
);

export const loadedInvoices = createAction(
  '[Loaded Invoices] Loaded',
  props<{ count: number, invoices: Invoice[] }>()
)

export const filterInvoices = createAction(
  '[Filter Invoices] Filter',
  props<{ keyword: string, pageNumber: number }>()
)
