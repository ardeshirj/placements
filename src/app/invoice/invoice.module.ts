import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { MatTableModule } from '@angular/material/table';

import { InvoiceTableComponent } from "./components/invoice-table.component";
import { InvoiceEffects } from './effects/invoice.effects';
import { InvoiceService } from './services/invoice.service';

import * as fromRoot from "./reducers/invoice.reducer";

@NgModule({
  declarations: [
    InvoiceTableComponent
  ],
  imports: [
    // Modules
    CommonModule,
    HttpClientModule,
    MatTableModule,

    // forFeature
    StoreModule.forFeature(fromRoot.invoiceFeatureKey, fromRoot.reducer),
    EffectsModule.forFeature([InvoiceEffects]),
  ],
  exports: [
    InvoiceTableComponent
  ],
  providers: [
    InvoiceService
  ]
})
export class InvoiceModule { }
