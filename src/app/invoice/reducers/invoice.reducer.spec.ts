import { Action } from '@ngrx/store';

import { InvoiceActions } from '../actions';
import { reducer, initialState } from './invoice.reducer';
import { InvoiceFactory } from '../models/factories';

describe('InvoiceReducer', () => {
  describe('undefined action', () => {
    it('should return the default state', () => {
      const action = {} as Action;
      const newState = reducer(undefined, action);
      expect(newState).toEqual(initialState);
    });
  });

  describe(InvoiceActions.adjust.type, () => {
    it('should set isLoading to true & update pagination state', () => {
      const props = {
        keyword: 'foo',
        pageNumber: 1,
        sort: 'bar',
        direction: 'desc'
      };
      const action = InvoiceActions.adjust(props);
      const newState = reducer(initialState, action);
      expect(newState).toEqual({
        isLoading: true,
        invoices: [],
        totalCount: 0,
        pageNumber: 1,
        keyword: 'foo',
        sort: 'bar',
        direction: 'desc'
      });
    });
  });

  describe(InvoiceActions.adjusted.type, () => {
    it('should set isLoading, totalCount & invoices state', () => {
      const props = {
        count: 2,
        invoices: [InvoiceFactory.create(), InvoiceFactory.create()]
      };
      const action = InvoiceActions.adjusted(props);
      const newState = reducer(initialState, action);
      expect(newState).toEqual(Object.assign({}, initialState, {
        totalCount: props.count,
        invoices: props.invoices,
      }));
    });
  });

  describe(InvoiceActions.reviewed.type, () => {
    it('should set isLoading to false', () => {
      const action = InvoiceActions.reviewed();
      const newState = reducer(initialState, action);
      expect(newState).toEqual(Object.assign({}, initialState, {
        isLoading: false
      }));
    });
  });
});
