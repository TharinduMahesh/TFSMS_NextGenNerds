import { Injectable, signal } from '@angular/core';
import { Invoice } from '../../models/invoice-manangement.model'; // Adjust path if needed

@Injectable({
  providedIn: 'root'
})
export class InvoiceManagementService {
  private invoiceCounter = 1;
  
  // A signal to hold the array of invoices
  invoices = signal<Invoice[]>([]);

  // Method to add a new invoice
  addInvoice(newRecord: Omit<Invoice, 'id' | 'invoiceNo'>): void {
    const invoiceNo = `INV-${String(this.invoiceCounter++).padStart(4, '0')}`;
    const id = new Date().getTime().toString(); // Simple unique ID

    const fullRecord: Invoice = {
      ...newRecord,
      id,
      invoiceNo
    };

    // Update the signal with the new record
    this.invoices.update(currentInvoices => [...currentInvoices, fullRecord]);
  }
}