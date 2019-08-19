import { IdFactory } from './id.factory';
import { Invoice } from '../';

export class InvoiceFactory {
  static create(props?): Invoice {
    return Object.assign({}, props, {
      id: IdFactory.create()
    });
  }
}
