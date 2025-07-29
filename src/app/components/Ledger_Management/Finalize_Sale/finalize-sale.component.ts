// src/app/components/Ledger_Management/Finalize_Sale/finalize-sale.component.ts

import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common'; // For NgFor, NgIf, DatePipe
import { FormsModule } from '@angular/forms';   // For NgModel
import { Router, ActivatedRoute } from '@angular/router';       // For navigation and route params

import { InvoiceService } from '../../../Services/invoice.service'; // Import Invoice Service
import { SalesChargeEntryService } from '../../../Services/sales-charge-entry.service'; // Import Sales Charge Service

import { Invoice } from '../../../models/invoice.interface'; // Import Invoice interface
import { SalesCharge } from '../../../models/sales-charge.interface'; // Import SalesCharge interface

@Component({
  selector: 'app-finalize-sale',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './finalize-sale.component.html',
  styleUrls: ['./finalize-sale.component.css']
})
export class FinalizeSaleComponent implements OnInit {

  // --- Data from Invoice (pre-filled) ---
  invoiceId: number | null = null;
  selectedInvoice: Invoice | null = null;

  // --- Finalize Sale Form Properties ---
  finalSoldPricePerKg: number | null = null;
  finalTotalAmount: number | null = null; // Calculated
  // FIX: Add buyerName property
  buyerName: string = ''; // Initialize buyerName

  // --- Sales Charges for this Invoice ---
  salesCharges: SalesCharge[] = []; // Existing and new charges
  newChargeType: string = '';
  newChargeAmount: number | null = null;
  newChargeDescription: string = '';

  public isBrowser: boolean;

  constructor(
    private router: Router,
    private route: ActivatedRoute, // To get query parameters
    private invoiceService: InvoiceService,
    private salesChargeEntryService: SalesChargeEntryService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    // Get invoiceId from query parameters
    this.route.queryParams.subscribe(params => {
      if (params['invoiceId']) {
        this.invoiceId = +params['invoiceId']; // Convert to number
        this.loadInvoiceDetails(this.invoiceId);
      } else {
        // Handle case where no invoiceId is provided
        if (this.isBrowser) {
          alert('No Invoice ID provided. Please select an invoice from the Invoice Register.');
        }
        this.router.navigate(['/ledger-management/invoice-register']); // Redirect back
      }
    });
  }

  /**
   * @method loadInvoiceDetails
   * @description Fetches details of the selected Invoice, including existing sales charges.
   */
  loadInvoiceDetails(id: number): void {
    this.invoiceService.getInvoiceById(id).subscribe({
      next: (data) => {
        this.selectedInvoice = data;
        // Pre-fill finalSoldPricePerKg and finalTotalAmount from invoice
        this.finalSoldPricePerKg = this.selectedInvoice.soldPricePerKg;
        this.finalTotalAmount = this.selectedInvoice.totalAmount;
        // Pre-fill buyerName from invoice
        this.buyerName = this.selectedInvoice.buyerName || '';

        // Load existing sales charges for this invoice
        this.salesCharges = this.selectedInvoice?.salesCharges || [];
        console.log('Selected Invoice for Finalize Sale:', this.selectedInvoice);
      },
      error: (error) => {
        console.error('Error loading invoice details for finalize sale:', error);
        if (this.isBrowser) {
          alert('Failed to load invoice details. Please try again.');
        }
        this.router.navigate(['/ledger-management/invoice-register']); // Redirect back
      }
    });
  }

  /**
   * @method calculateFinalTotalAmount
   * @description Recalculates the final total amount based on potentially new sold price.
   */
  calculateFinalTotalAmount(): void {
    if (this.selectedInvoice?.stockLedgerEntry?.currentWeightKg !== undefined && this.finalSoldPricePerKg !== null) {
      this.finalTotalAmount = parseFloat((this.selectedInvoice.stockLedgerEntry.currentWeightKg * this.finalSoldPricePerKg).toFixed(2));
    } else {
      this.finalTotalAmount = null;
    }
  }

  /**
   * @method addSalesCharge
   * @description Adds a new sales charge to the local array.
   */
  addSalesCharge(): void {
    if (!this.newChargeType || this.newChargeAmount === null || this.newChargeAmount <= 0) {
      if (this.isBrowser) {
        alert('Please enter a Charge Type and a positive Amount for the sales charge.');
      }
      return;
    }

    const newCharge: SalesCharge = {
      chargeType: this.newChargeType,
      amount: this.newChargeAmount,
      chargeDate: new Date().toISOString().split('T')[0],
      description: this.newChargeDescription || "",
      invoiceId: this.invoiceId || undefined, // Link to current invoice
      // saleReference: this.selectedInvoice?.invoiceNumber || 'N/A' // Use invoice number as reference
    };
    this.salesCharges.push(newCharge);
    this.newChargeType = '';
    this.newChargeAmount = null;
    this.newChargeDescription = '';
  }

  /**
   * @method removeSalesCharge
   * @description Removes a sales charge from the local array.
   * @param index The index of the charge to remove.
   */
  removeSalesCharge(index: number): void {
    this.salesCharges.splice(index, 1);
  }

  /**
   * @method finalizeSale
   * @description Updates the invoice status to 'Paid' and saves final details.
   */
  finalizeSale(): void {
    if (!this.selectedInvoice || this.finalSoldPricePerKg === null || this.finalSoldPricePerKg <= 0 || this.finalTotalAmount === null || this.finalTotalAmount <= 0) {
      if (this.isBrowser) {
        alert('Please ensure final sold price and total amount are valid.');
      }
      return;
    }

    // Update the selectedInvoice object with final details
    const updatedInvoice: Invoice = {
      ...this.selectedInvoice, // Keep existing properties
      soldPricePerKg: this.finalSoldPricePerKg,
      totalAmount: this.finalTotalAmount,
      status: 'Paid', // Set final status
      buyerName: this.buyerName || this.selectedInvoice.buyerName || "" // Update buyer name if changed
    };

    this.invoiceService.updateInvoice(this.invoiceId!, updatedInvoice).subscribe({ // Use non-null assertion for invoiceId
      next: async () => {
        if (this.isBrowser) {
          alert('Sale finalized successfully! Invoice status updated to Paid.');
        }
        // Save/Update all sales charges (newly added and potentially modified existing ones)
        // This assumes SalesChargeEntryService can handle both new and existing charges
        for (const charge of this.salesCharges) {
          if (charge.salesChargeId) { // If it has an ID, it's an existing charge to update
            await this.salesChargeEntryService.updateSalesCharge(charge.salesChargeId, charge).toPromise();
          } else { // If no ID, it's a new charge to add
            await this.salesChargeEntryService.addSalesCharge(charge).toPromise();
          }
        }
        this.router.navigate(['/ledger-management/invoice-register']); // Navigate back
      },
      error: (error) => {
        console.error('Error finalizing sale:', error);
        if (this.isBrowser) {
          alert('Failed to finalize sale: ' + error.message);
        }
      }
    });
  }

  /**
   * @method formatDate
   * @description Utility function to format date strings for display.
   */
  formatDate(dateString: string | undefined): string {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Invalid Date';
      }
      return date.toLocaleDateString(); // For display
    } catch (e) {
      return 'Invalid Date Format';
    }
  }

  /**
   * @method exitPage
   * @description Navigates the user back to the invoice register page.
   */
  exitPage(): void {
    this.router.navigate(['/ledger-management/invoice-register']);
  }
}
