import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from "../../header/header.component";
import { SidebarComponent } from '../../sidebar/sidebar/sidebar.component';

interface LedgerSection {
  title: string;
  features: { label: string; route: string }[];
}

@Component({
  selector: 'app-ledger-management',
  templateUrl: './Ledger_Homepage.component.html',
  styleUrls: ['./Ledger_Homepage.component.css'],
  standalone: true,
  imports: [RouterModule, CommonModule, HeaderComponent, SidebarComponent]
})
export class LedgerManagementComponent {
  sections: LedgerSection[] = [
    {
      title: 'Tea Packing and Stock Management',
      features: [
        { label: 'TEA PACKING ENTRY', route: 'tea-packing-entry' }, // FIX: Changed route to 'tea-packing-entry'
        { label: 'STOCK LEDGER', route: 'stock-ledger' }
      ]
    },
    {
      title: 'Invoice Generation and Dispatch',
      features: [
        { label: 'INVOICE REGISTER', route: 'invoice-register' },
        { label: 'DISPATCH DETAILS ENTRY', route: 'dispatch-details' },
        { label: 'FINALIZE SALE', route: 'finalize-sale' }
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
      title: 'Claims and Returns Handling',
      features: [
        { label: 'CLAIMS ENTRY', route: 'claims-entry' },
        { label: 'CLAIM ADJUSTMENT', route: 'claim-adjustment' },
        { label: 'RETURN ENTRY', route: 'return-entry' }
      ]
    },
    {
      title: 'Reporting & Analysis',
      features: [
        { label: 'NSA ANALYSIS', route: 'nsa-analysis' },
        { label: 'CLAIMS ANALYSIS', route: 'claim-analysis' },
        { label: 'RETURNS ANALYSIS', route: 'returns-analysis' }
      ]
    }
  ];
}
