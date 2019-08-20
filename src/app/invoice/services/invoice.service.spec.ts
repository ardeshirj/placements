import { TestBed } from '@angular/core/testing';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';

import { InvoiceService } from './invoice.service';
import { InvoiceFactory } from '../models/factories';

describe('InvoiceService', () => {
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [InvoiceService]
    });

    httpTestingController = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  describe('filter', () => {
    it('should return count & items', (done) => {
      const invoiceService = TestBed.get(InvoiceService);

      const expectedResponse = {
        count: 2,
        items: [
          InvoiceFactory.create(),
          InvoiceFactory.create()
        ]
      };

      const args = {
        keyword: 'foo',
        pageNumber: 1,
        sort: 'bar',
        direction: 'desc'
      };

      invoiceService.filter(
        args.keyword,
        args.pageNumber,
        args.sort,
        args.direction
      ).subscribe(response => {
        expect(response.count).toEqual(expectedResponse.count);
        expect(response.items).toEqual(expectedResponse.items);
        done();
      });

      const expectedParams =
        'q=' + args.keyword +
        '&_page=' + args.pageNumber +
        '&_sort=' + args.sort +
        '&_order=' + args.direction
      ;

      const req = httpTestingController
        .expectOne(httpRequest => {
          return httpRequest.url === 'http://localhost:3000/invoices';
        });

      expect(req.request.method).toEqual('GET');
      expect(req.request.params.toString()).toEqual(expectedParams);

      req.flush(
        expectedResponse.items,
        {
          headers: {
            'x-total-count': String(expectedResponse.count)
          }
        }
      );
    });
  });

  describe('review', () => {
    it('should all responses for patching invoice.reviewed', (done) => {
      const invoiceService = TestBed.get(InvoiceService);

      const invoices = [
        InvoiceFactory.create(),
        InvoiceFactory.create()
      ];

      invoiceService.review(invoices)
        .subscribe(_ => {
          // Nothing to test here...
          done();
        });

      const matchingUrls = [
        `http://localhost:3000/invoices/${invoices[0].id}`,
        `http://localhost:3000/invoices/${invoices[1].id}`,
      ];

      const reqs = httpTestingController
        .match(httpRequest => {
          return httpRequest.url === matchingUrls[0] ||
            httpRequest.url === matchingUrls[1];
        });

      expect(reqs.length).toEqual(invoices.length);

      expect(reqs[0].request.url).toEqual(matchingUrls[0]);
      expect(reqs[0].request.method).toEqual('PATCH');

      expect(reqs[1].request.url).toEqual(matchingUrls[1]);
      expect(reqs[1].request.method).toEqual('PATCH');

      reqs.forEach(req => req.flush({}));
    });
  });
});
