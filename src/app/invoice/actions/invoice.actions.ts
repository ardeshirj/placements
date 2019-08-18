import { createAction, props } from '@ngrx/store';
import { Invoice } from '../models';

export const adjustInvoices = createAction(
  '[Adjust Invoices] Adjust',
  props<{ keyword: string, pageNumber: number, sort: string, direction: string }>()
)

export const adjustedInvoices = createAction(
  '[Adjusted Invoices] Adjusted',
  props<{ count: number, invoices: Invoice[] }>()
)
