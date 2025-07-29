// src/app/components/Ledger_Management/Invoice_Creation/invoice-creation.component.ts

import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common'; // For NgFor, NgIf, DatePipe
import { FormsModule } from '@angular/forms';   // For NgModel
import { Router, ActivatedRoute } from '@angular/router';       // For navigation and route params

import { InvoiceService } from '../../../Services/invoice.service'; // Import Invoice Service
import { StockLedgerEntryService } from '../../../Services/stock-ledger-entry.service'; // Import Stock Ledger Service
import { SalesChargeEntryService } from '../../../Services/sales-charge-entry.service'; // Import Sales Charge Service

import { Invoice } from '../../../models/invoice.interface'; // Import Invoice interface
import { StockLedgerEntry } from '../../../models/stock-ledger-entry.interface'; // Import StockLedgerEntry interface
import { SalesCharge } from '../../../models/sales-charge.interface'; // Import SalesCharge interface

@Component({
  selector: 'app-invoice-creation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './invoice-creation.component.html',
  styleUrls: ['./invoice-creation.component.css']
})
export class InvoiceCreationComponent implements OnInit {

  // --- Data from Stock Ledger Entry (pre-filled) ---
  stockLedgerEntryId: number | null = null;
  selectedStockEntry: StockLedgerEntry | null = null;

  // --- Invoice Form Properties ---
  invoiceNumber: string = ''; // Used for linking sales charges
  brokerName: string = '';
  invoiceDate: string = new Date().toISOString().split('T')[0];
  soldPricePerKg: number | null = null;
  totalAmount: number | null = null; // Calculated
  buyerName: string = '';
  invoiceStatus: string = 'Pending'; // Default status for new invoice

  // --- Sales Charges for this Invoice ---
  salesCharges: SalesCharge[] = [];
  newChargeType: string = '';
  newChargeAmount: number | null = null;
  newChargeDescription: string = '';

  public isBrowser: boolean;

  constructor(
    private router: Router,
    private route: ActivatedRoute, // To get query parameters
    private invoiceService: InvoiceService,
    private stockLedgerEntryService: StockLedgerEntryService,
    private salesChargeEntryService: SalesChargeEntryService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    // Get stockId from query parameters
    this.route.queryParams.subscribe(params => {
      if (params['stockId']) {
        this.stockLedgerEntryId = +params['stockId']; // Convert to number
        this.loadStockLedgerEntryDetails(this.stockLedgerEntryId);
      } else {
        // Handle case where no stockId is provided (e.g., direct navigation)
        if (this.isBrowser) {
          alert('No Stock ID provided. Please select an item from Stock Ledger.');
        }
        this.router.navigate(['/ledger-management/stock-ledger']); // Redirect back
      }
    });
  }

  /**
   * @method loadStockLedgerEntryDetails
   * @description Fetches details of the selected StockLedgerEntry and its PackedTea.
   */
  loadStockLedgerEntryDetails(id: number): void {
    this.stockLedgerEntryService.getStockLedgerEntryById(id).subscribe({
      next: (data) => {
        this.selectedStockEntry = data;
        // Pre-fill total amount with initial weight * assumed price if not provided
        if (this.selectedStockEntry.packedTea?.initialWeightKg && !this.soldPricePerKg) {
          this.soldPricePerKg = 0; // User must enter this
          this.calculateTotalAmount();
        }
        console.log('Selected Stock Entry:', this.selectedStockEntry);
      },
      error: (error) => {
        console.error('Error loading stock ledger entry details:', error);
        if (this.isBrowser) {
          alert('Failed to load stock details. Please try again.');
        }
        this.router.navigate(['/ledger-management/stock-ledger']); // Redirect back
      }
    });
  }

  /**
   * @method calculateTotalAmount
   * @description Calculates the total invoice amount based on packed tea weight and sold price.
   */
  calculateTotalAmount(): void {
    if (this.selectedStockEntry?.packedTea?.initialWeightKg !== undefined && this.soldPricePerKg !== null) {
      this.totalAmount = parseFloat((this.selectedStockEntry.packedTea.initialWeightKg * this.soldPricePerKg).toFixed(2));
    } else {
      this.totalAmount = null;
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
      chargeDate: new Date().toISOString().split('T')[0], // Set current date
      description: this.newChargeDescription || null,
      invoiceId: undefined, // Will be set when the invoice is created
      // REMOVED: saleReference - not needed as column doesn't exist in database
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
   * @method createInvoice
   * @description Creates a new invoice and associates sales charges
   */
  async createInvoice(): Promise<void> {
    try {
      // Basic validation
      if (!this.invoiceNumber || !this.brokerName || !this.invoiceDate ||
          this.soldPricePerKg === null || this.soldPricePerKg <= 0 ||
          this.totalAmount === null || this.totalAmount <= 0 ||
          this.selectedStockEntry?.stockLedgerEntryId === undefined) {
        if (this.isBrowser) {
          alert('Please fill all required invoice details (Invoice Number, Broker, Date, Sold Price) and ensure amounts are positive.');
        }
        return;
      }

      // Create invoice object using the regular Invoice interface
      const invoiceToCreate: Invoice = {
        invoiceNumber: this.invoiceNumber.trim(),
        stockLedgerEntryId: this.selectedStockEntry.stockLedgerEntryId,
        brokerName: this.brokerName.trim(),
        invoiceDate: this.invoiceDate,
        status: this.invoiceStatus || 'Pending', // Add status field
        soldPricePerKg: this.soldPricePerKg,
        totalAmount: this.totalAmount,
        buyerName: this.buyerName?.trim() || null,
      };

      console.log('Creating invoice:', invoiceToCreate);

      // Create the invoice
      const createdInvoice = await this.invoiceService.createInvoice(invoiceToCreate).toPromise();
      
      if (!createdInvoice?.invoiceId) {
        throw new Error('Invoice creation failed - no invoice ID returned');
      }

      console.log('Invoice created successfully:', createdInvoice);

      // Create sales charges if any exist
      if (this.salesCharges && this.salesCharges.length > 0) {
        console.log('Creating sales charges:', this.salesCharges);
        
        for (const charge of this.salesCharges) {
          const chargeToCreate: SalesCharge = {
            ...charge,
            invoiceId: createdInvoice.invoiceId,
            // saleReference: createdInvoice.invoiceNumber,
            // Ensure required fields are present
            chargeType: charge.chargeType || 'Miscellaneous',
            amount: charge.amount || 0,
            chargeDate: charge.chargeDate || this.invoiceDate,
            description: charge.description || null
          };

          try {
            await this.salesChargeEntryService.addSalesCharge(chargeToCreate).toPromise();
            console.log('Sales charge created:', chargeToCreate);
          } catch (chargeError) {
            console.error('Error creating sales charge:', chargeError);
            // Continue with other charges even if one fails
          }
        }
      }

      // Show success message
      if (this.isBrowser) {
        alert('Invoice created successfully!');
      }

      // Navigate to invoice register or details page
      this.router.navigate(['/ledger-management/invoice-register']);

    } catch (error) {
      console.error('Error creating invoice:', error);
      if (this.isBrowser) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        alert('Failed to create invoice: ' + errorMessage);
      }
    }
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
   * @description Navigates the user back to the stock ledger page.
   */
  exitPage(): void {
    this.router.navigate(['/ledger-management/stock-ledger']);
  }
}