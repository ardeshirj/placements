import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';

import { InvoiceTableComponent } from "./components/invoice-table.component";
import * as fromRoot from "./reducers/invoice.reducer";

@NgModule({
  declarations: [
    InvoiceTableComponent
  ],
  imports: [
    CommonModule,
    StoreModule.forFeature(fromRoot.invoiceFeatureKey, fromRoot.reducer)
  ],
  exports: [
    InvoiceTableComponent
  ]
})
export class InvoiceModule { }
