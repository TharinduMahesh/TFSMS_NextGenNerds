// src/app/components/Ledger_Management/Dispatch_Details/dispatch-details.component.ts

import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common'; // For NgFor, NgIf, DatePipe
import { FormsModule } from '@angular/forms';   // For NgModel
import { Router, ActivatedRoute } from '@angular/router';       // For navigation and route params

import { DispatchService } from '../../../Services/dispatch.service'; // Import Dispatch Service
import { InvoiceService } from '../../../Services/invoice.service'; // Import Invoice Service

import { Dispatch } from '../../../models/dispatch.interface'; // Import Dispatch interface
import { Invoice } from '../../../models/invoice.interface'; // Import Invoice interface

@Component({
  selector: 'app-dispatch-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dispatch-details.component.html',
  styleUrls: ['./dispatch-details.component.css']
})
export class DispatchDetailsComponent implements OnInit {

  // --- Data from Invoice (pre-filled) ---
  invoiceId: number | null = null;
  selectedInvoice: Invoice | null = null;

  // --- Dispatch Form Properties ---
  vehicleNumber: string = '';
  dispatchDate: string = new Date().toISOString().split('T')[0];
  driverName: string = '';
  driverNic: string = '';
  sealNumber: string = '';
  bagCount: number | null = null;
  dispatchedWeightKg: number | null = null; // This will be derived from Invoice's StockLedgerEntry weight

  public isBrowser: boolean;

  constructor(
    private router: Router,
    private route: ActivatedRoute, // To get query parameters
    private dispatchService: DispatchService,
    private invoiceService: InvoiceService,
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
        // Handle case where no invoiceId is provided (e.g., direct navigation)
        if (this.isBrowser) {
          alert('No Invoice ID provided. Please select an invoice from the Invoice Register.');
        }
        this.router.navigate(['/ledger-management/invoice-register']); // Redirect back
      }
    });
  }

  /**
   * @method loadInvoiceDetails
   * @description Fetches details of the selected Invoice.
   */
  loadInvoiceDetails(id: number): void {
    this.invoiceService.getInvoiceById(id).subscribe({
      next: (data) => {
        this.selectedInvoice = data;
        // Pre-fill dispatchedWeightKg from Invoice's StockLedgerEntry
        this.dispatchedWeightKg = this.selectedInvoice.stockLedgerEntry?.currentWeightKg || null;
        console.log('Selected Invoice for Dispatch:', this.selectedInvoice);
      },
      error: (error) => {
        console.error('Error loading invoice details for dispatch:', error);
        if (this.isBrowser) {
          alert('Failed to load invoice details. Please try again.');
        }
        this.router.navigate(['/ledger-management/invoice-register']); // Redirect back
      }
    });
  }

  /**
   * @method recordDispatch
   * @description Creates a new dispatch record in the backend.
   */
  recordDispatch(): void {
    // Basic validation
    if (!this.invoiceId || !this.vehicleNumber || !this.dispatchDate ||
        !this.driverName || this.bagCount === null || this.bagCount <= 0 ||
        this.dispatchedWeightKg === null || this.dispatchedWeightKg <= 0) {
      if (this.isBrowser) {
        alert('Please fill all required dispatch details (Vehicle, Date, Driver, Bag Count, Weight) and ensure counts/weights are positive.');
      }
      return;
    }

    const dispatchToCreate: Dispatch = {
      invoiceId: this.invoiceId,
      vehicleNumber: this.vehicleNumber,
      dispatchDate: this.dispatchDate,
      driverName: this.driverName,
      driverNic: this.driverNic || undefined,
      sealNumber: this.sealNumber || undefined,
      bagCount: this.bagCount,
      dispatchedWeightKg: this.dispatchedWeightKg,
    };

    this.dispatchService.createDispatch(dispatchToCreate).subscribe({
      next: (createdDispatch) => {
        if (this.isBrowser) {
          alert('Dispatch recorded successfully! Invoice status updated and stock deducted.');
        }
        console.log('Created Dispatch:', createdDispatch);
        this.router.navigate(['/ledger-management/invoice-register']); // Navigate back to Invoice Register
      },
      error: (error) => {
        console.error('Error recording dispatch:', error);
        if (this.isBrowser) {
          alert('Failed to record dispatch: ' + error.message);
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
