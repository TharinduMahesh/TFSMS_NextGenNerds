// financial-reports-navigation.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-financial-reports-navigation',
  templateUrl: './financial-reports-navigation.component.html',
  styleUrls: ['./financial-reports-navigation.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class FinancialReportsNavigationComponent {

  constructor(private router: Router) {}

  navigateToReport(reportType: string): void {
    switch(reportType) {
      case 'farmer-loans':
        this.router.navigate(['report/sales/farmer-loan-report']);
        break;
      case 'profit-loss':
        this.router.navigate(['/financial-reports/profit-loss']);
        break;
      case 'claims-impact':
        this.router.navigate(['/financial-reports/claims-impact']);
        break;
      case 'supplier-payments':
        this.router.navigate(['/financial-reports/supplier-payments']);
        break;
      default:
        console.warn('Unknown report type:', reportType);
    }
  }
}
