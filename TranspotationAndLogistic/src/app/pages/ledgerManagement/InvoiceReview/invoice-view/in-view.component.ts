import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common'; // Import necessary pipes
import { InvoiceResponse } from '../../../../models/Ledger Management/invoiceSales.model';
import { SalesCharge } from '../../../../models/Ledger Management/salesCharge.model'; // Assuming SalesCharge model exists

@Component({
  selector: 'app-invoice-view',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, DatePipe], // Make pipes available to the template
  templateUrl: './in-view.component.html',
  styleUrls: ['./in-view.component.scss']
})
export class InvoiceViewComponent {
  // Use @Input({ required: true }) for better type safety
  @Input({ required: true }) invoice!: InvoiceResponse;
  @Output() close = new EventEmitter<void>();

  // This method will be called by the overlay or close button
  closeModal() {
    this.close.emit();
  }
}