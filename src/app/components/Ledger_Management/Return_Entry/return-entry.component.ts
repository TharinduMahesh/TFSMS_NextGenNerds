import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // For NgFor, NgIf, DatePipe
import { FormsModule } from '@angular/forms';   // For NgModel
import { Router } from '@angular/router';       // For navigation

// Temporary interface for frontend development - UPDATED
interface ReturnEntry {
  id?: number;
  returnDate: string;
  invoiceNumber: string;
  productCode: string;
  returnedQuantity: number;
  reason: string;
  // Removed notes: string;
}

@Component({
  selector: 'app-return-entry',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './return-entry.component.html',
  styleUrls: ['./return-entry.component.css']
})
export class ReturnEntryComponent implements OnInit {
  // Form fields - UPDATED
  returnDate: string = '';
  invoiceNumber: string = '';
  productCode: string = '';
  returnedQuantity: number | null = null;
  reason: string = '';
  // Removed notes: string = '';

  recentReturns: ReturnEntry[] = []; // Data for the table

  constructor(private router: Router) { } // No service injected yet

  ngOnInit(): void {
    this.loadRecentReturns(); // Load existing records when the page initializes
  }

  loadRecentReturns(): void {
    // This would typically call a service to fetch data from the backend
    // For now, using dummy data - UPDATED (removed notes)
    this.recentReturns = [
      { id: 1, returnDate: '2025-07-01', invoiceNumber: 'INV-001', productCode: 'TP-A1', returnedQuantity: 10, reason: 'Damage' },
      { id: 2, returnDate: '2025-07-05', invoiceNumber: 'INV-003', productCode: 'TP-B2', returnedQuantity: 5, reason: 'Wrong Item' }
    ];
  }

  clearForm(): void {
    this.returnDate = '';
    this.invoiceNumber = '';
    this.productCode = '';
    this.returnedQuantity = null;
    this.reason = '';
    // Removed this.notes = '';
  }

  addReturn(): void {
    // Basic validation
    if (!this.returnDate || !this.invoiceNumber || !this.productCode || this.returnedQuantity === null || !this.reason) {
      alert('Please fill in all required fields (Return Date, Invoice No., Product Code, Returned Quantity, Reason).');
      return;
    }

    const newReturn: ReturnEntry = {
      id: this.recentReturns.length > 0 ? Math.max(...this.recentReturns.map(r => r.id || 0)) + 1 : 1, // Simple ID generation
      returnDate: this.returnDate,
      invoiceNumber: this.invoiceNumber,
      productCode: this.productCode,
      returnedQuantity: this.returnedQuantity,
      reason: this.reason,
      // Removed notes: this.notes
    };

    this.recentReturns.push(newReturn); // Add to local array for display
    this.clearForm(); // Clear the form after successful submission
    alert('Return Entry added successfully (frontend only)!');

    // In a real scenario, you'd call a service here:
    // this.returnEntryService.addReturn(newReturn).subscribe({
    //   next: (addedRecord) => {
    //     this.recentReturns.push(addedRecord);
    //     this.clearForm();
    //     alert('Return Entry added successfully!');
    //   },
    //   error: (error) => {
    //     console.error('Error adding return entry:', error);
    //     alert('Failed to add return entry. Please try again.');
    //   }
    // });
  }

  exitPage(): void {
    this.router.navigate(['/ledger-management']); // Navigate back to Ledger Management homepage
  }
}