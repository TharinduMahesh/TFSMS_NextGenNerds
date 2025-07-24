import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

interface LedgerSection {
  title: string;
  features: { label: string; route: string }[];
}

@Component({
  selector: 'app-ledger-management',
  templateUrl: './Ledger_Homepage.component.html',
  styleUrls: ['./Ledger_Homepage.component.css'],
  standalone: true,
  imports: [RouterModule, CommonModule]
})
export class LedgerManagementComponent {
  sections: LedgerSection[] = [
    {
      title: 'Tea Packing and Ledger Update',
      features: [
        { label: 'TEA PACKING', route: 'tea-packing' },
        { label: 'STOCK LEDGER', route: 'stock-ledger' }
      ]
    },
    {
      title: 'Invoice Generation and Dispatch',
      features: [
        { label: 'INVOICE CREATION', route: 'invoice-creation' },
        { label: 'DISPATCH DETAILS ENTRY', route: 'dispatch-details' },
        { label: 'DISPATCH REGISTER', route: 'dispatch-register' }
      ]
    },
    {
      title: 'Claims and Returns',
      features: [
        { label: 'CLAIMS ENTRY', route: 'claims-entry' },
        { label: 'CLAIM APPROVAL', route: 'claim-approval' },
        { label: 'CLAIM REGISTER', route: 'claim-register' }
      ]
    },
    {
      title: 'Denatured Tea Handling',
      features: [
        { label: 'DENATURED TEA ENTRY', route: 'denatured-tea-entry' },
        { label: 'DENATURED TEA REPORT', route: 'denatured-tea-report' }
      ]
    },
    {
      title: 'Sales Management',
      features: [
        { label: 'SALES ENTRY', route: 'sales-entry' },
        { label: 'GRATIS ISSUE ENTRY', route: 'gratis-issue-entry' },
        { label: 'SALES CHARGE ENTRY', route: 'sales-charge-entry' }
      ]
    },
    {
      title: 'Monthly NSA',
      features: [
        { label: 'NSA ENTRY', route: 'nsa-entry' },
        { label: 'NSA TRENDS', route: 'nsa-analysis' }
      ]
    },
    {
      title: 'Tea Returns and Claims Handling',
      features: [
        { label: 'RETURN ENTRY', route: 'return-entry' },
        { label: 'RETURN ANALYSIS', route: 'returns-analysis' },
        { label: 'CLAIM ADJUSTMENT', route: 'claim-adjustment' },
        { label: 'CLAIM ANALYSIS', route: 'claim-analysis' }
      ]
    }
  ];
}
