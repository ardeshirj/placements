import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvoiceTableComponent } from "./components/invoice-table.component";

@NgModule({
  declarations: [
    InvoiceTableComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    InvoiceTableComponent
  ]
})
export class InvoiceModule { }
