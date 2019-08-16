import { createAction, props } from '@ngrx/store';
import { Invoice } from '../models';

export const loadInvoices = createAction(
  '[Load Invoices] Load',
  props<{ pageNumber: number }>()
);

export const loadedInvoices = createAction(
  '[Loaded Invoices] Loaded',
  props<{ invoices: Invoice[] }>()
)
