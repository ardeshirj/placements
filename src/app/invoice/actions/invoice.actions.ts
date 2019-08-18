import { createAction, props } from '@ngrx/store';
import { Invoice } from '../models';

export const adjust = createAction(
  '[Adjust Invoices] Adjust',
  props<{ keyword: string, pageNumber: number, sort: string, direction: string }>()
)

export const adjusted = createAction(
  '[Adjusted Invoices] Adjusted',
  props<{ count: number, invoices: Invoice[] }>()
)

export const review = createAction(
  '[Review Invoices] Review',
  props<{ invoices: Invoice[] }>()
)

export const reviewed = createAction(
  '[Reviewed Invoices] Reviewed'
)
