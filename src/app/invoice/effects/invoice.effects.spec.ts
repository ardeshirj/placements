import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, Store } from '@ngrx/store';
import { ReplaySubject, BehaviorSubject, of } from 'rxjs';
import { take } from 'rxjs/operators';

import { InvoiceEffects } from './invoice.effects';
import { InvoiceService } from '../services/invoice.service';
import { InvoiceFactory } from '../models/factories';
import { InvoiceActions } from '../actions';
import { invoiceFeatureKey } from '../reducers/invoice.reducer';

describe('InvoiceEffects', () => {
  let effects: InvoiceEffects;
  let actions: ReplaySubject<any>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockActions(() => actions),
        InvoiceEffects,
        {
          provide: InvoiceService,
          useValue: jasmine.createSpyObj(
            'invoiceService',
            ['filter', 'review']
          )
        },
        {
          provide: Store,
          useValue: new BehaviorSubject({})
        }
      ]
    });

    effects = TestBed.get(InvoiceEffects);
    actions = new ReplaySubject<Action>(1);
  });

  describe('adjust', () => {
    it('should return adjusted action', (done) => {
      const invoiceService = TestBed.get(InvoiceService);
      const expectedInvoices = [
        InvoiceFactory.create(),
        InvoiceFactory.create()
      ];

      invoiceService.filter.and.returnValue(of({
        count: expectedInvoices.length,
        items: expectedInvoices
      }));

      actions.next(InvoiceActions.adjust({
        keyword: 'foo',
        pageNumber: 1,
        sort: null,
        direction: null
      }));

      const expectedAction = InvoiceActions.adjusted({
        count: expectedInvoices.length,
        invoices: expectedInvoices
      });

      effects.adjust.pipe(take(1))
        .subscribe(action => {
          expect(action.type).toEqual(expectedAction.type);
          expect(action.count).toEqual(expectedAction.count);
          expect(action.invoices).toEqual(expectedAction.invoices);
          done();
        });
    });
  });

  describe('review', () => {
    it('should return reviewed action', (done) => {
      const invoiceService = TestBed.get(InvoiceService);
      const invoices = [
        InvoiceFactory.create(),
        InvoiceFactory.create()
      ];

      invoiceService.review.and.returnValue(of({}));

      actions.next(InvoiceActions.review({
        invoices
      }));

      const expectedAction = InvoiceActions.reviewed();
      effects.review.pipe(take(1))
        .subscribe(action => {
          expect(action.type).toEqual(expectedAction.type);
          done();
        });
    });
  });

  describe('readjustOnReview', () => {
    it('should return adjust action', (done) => {
      const store = TestBed.get(Store);
      const invoiceState = {
        keyword: 'foo',
        pageNumber: 1,
        sort: 'bar',
        direction: 'desc'
      };

      store.next({
        [invoiceFeatureKey]: invoiceState
      });

      actions.next(InvoiceActions.reviewed());

      const expectedAction = InvoiceActions.adjust(invoiceState);
      effects.readjustOnReview.pipe(take(1))
        .subscribe(action => {
          expect(action.type).toEqual(expectedAction.type);
          expect(action.keyword).toEqual(expectedAction.keyword);
          expect(action.pageNumber).toEqual(expectedAction.pageNumber);
          expect(action.sort).toEqual(expectedAction.sort);
          expect(action.direction).toEqual(expectedAction.direction);
          done();
        });
    });
  });
});

