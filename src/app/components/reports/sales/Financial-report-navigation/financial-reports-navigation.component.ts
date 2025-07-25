// financial-reports-navigation.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from "../../../header/header.component"; // Assuming this path is correct

@Component({
  selector: 'app-financial-reports-navigation',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  templateUrl: './financial-reports-navigation.component.html',
  styleUrls: ['./financial-reports-navigation.component.css']
})
export class FinancialReportsNavigationComponent {

  constructor(private router: Router) {}

  navigateToReport(reportType: string): void {
    switch(reportType) {
      case 'farmer-loans':
        // Assuming this navigates to a specific Farmer Loan report, e.g., /report/sales/farmer-loan-report
        this.router.navigate(['report/sales/farmer-loan-report']); // FIX: Updated path based on app-routing
        break;
      case 'sales-report': // This is for your general Sales Report
        this.router.navigate(['report/general-sales']); // FIX: Correct path for Sales Report
        break;
      case 'sales-charges-report': // NEW CASE: For Sales Charges Report
        this.router.navigate(['report/sales-charges']); // FIX: Correct path for Sales Charges Report
        break;
      case 'gratis-issue-report': // FIX: Added case for Gratis Issue Report
        this.router.navigate(['report/gratis-issues']); // Correct path from app-routing.module.ts
        break;
      // case 'profit-loss':
      //   // This path might need to be adjusted based on your actual Profit & Loss component route
      //   this.router.navigate(['/financial-reports/profit-loss']);
      //   break;
      // case 'supplier-payments':
      //   // This path might need to be adjusted based on your actual Supplier Payments component route
      //   this.router.navigate(['/financial-reports/supplier-payments']);
      //   break;
      // case 'claims-impact': // For Claims Financial Impact
      //   // Assuming this navigates to Claims and Returns report or a specific claims financial impact report
      //   this.router.navigate(['report/claims-and-returns']); // FIX: Updated path based on app-routing
      //   break;
      default:
        console.warn('Unknown report type:', reportType);
    }
  }
}
