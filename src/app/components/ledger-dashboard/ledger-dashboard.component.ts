import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface DashboardSection {
  title: string;
  items: {
    label: string;
    route: string;
    keywords: string[];
  }[];
}

@Component({
  selector: 'app-ledger-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './ledger-dashboard.component.html',
  styleUrls: ['./ledger-dashboard.component.scss']
})
export class LedgerDashboardComponent {
  filterTerm = signal<string>('');

  sections: DashboardSection[] = [
    {
      title: 'Tea Packing and Ledger Update',
      items: [
        { label: 'TEA PACKING', route: '/ledgerManagementdashboard/tea-packing', keywords: ['TEA', 'PACKING'] },
        { label: 'STOCK LEDGER', route: '/ledgerManagementdashboard/stock-ledger', keywords: ['STOCK', 'LEDGER'] }
      ]
    },
    {
      title: 'Invoice Generation and Dispatch',
      items: [
        { label: 'INVOICE CREATION', route: '/ledgerManagementdashboard/m-iid-entry', keywords: ['INVOICE', 'CREATION'] },
        { label: 'INVOICE DETAILS', route: '/ledgerManagementdashboard/invoice-review', keywords: ['DISPATCH', 'REGISTER'] },
        { label: 'DISPATCH DETAILS ENTRY', route: '/ledgerManagementdashboard/m-dis-entry', keywords: ['DISPATCH', 'DETAILS','ENTRY'] },
        
      ]
    },
    {
      title: 'Sales Management',
      items: [
        
        // { label: 'SALES CHARGE ENTRY', route: '/ledgerManagementdashboard/sales-entry', keywords: ['sales', 'change', 'entry'] },
        { label: 'Sales Entry', route: '/ledgerManagementdashboard/m-s-entry', keywords: ['sales', 'change', 'entry'] },
      ]
    },
    {
      title: 'Claims and Returns',
      items: [
        { label: 'CLAIMS ENTRY', route: '/claim-entry', keywords: ['CLAIMS', 'ENTRY'] },
        { label: 'CLAIM APPROVAL', route: '/claim-approval', keywords: ['CLAIM ', 'APPROVAL'] },
        { label: 'CLAIM REGISTER', route: '/claim-register', keywords: ['CLAIM', 'REGISTER'] }
      ]
    },
    {
      title: 'Denatured Tea Handling',
      items: [
        { label: 'DENATURED TEA ENTRY', route: '/d-t-entry', keywords: ['DENATURED', 'TEA', 'ENTRY'] },
        { label: 'DENATURED TEA REPORT', route: '/d-t-report', keywords: ['DENATURED', 'TEA', 'REPORT'] }
      ]
    },
    
    {
      title: 'Monthly NSA',
      items: [
        { label: 'NSA ENTRY', route: '/nsa-entry', keywords: ['hsa', 'trends'] },
        { label: 'NSA TREND', route: '/nsa-trend', keywords: ['hsa', 'trends'] }
      ]
    },
    {
      title: 'Tea Return and Claims Handling',
      items: [
        { label: 'RETURN ENTRY', route: '/t-return-entry', keywords: ['return', 'requirer'] },
        { label: 'RETURN REGISTER', route: '/r-register', keywords: ['claim', 'acquaintment'] },
        { label: 'CLAIM AJUSTMENT', route: '/claim-ajustment', keywords: ['claim', 'analysis'] },
        { label: 'CLAIM ANALYSIS', route: '/claim-analysis', keywords: ['claim', 'analysis'] }
      ]
    }
  ];

  filteredSections = signal<DashboardSection[]>(this.sections);

  updateFilter(searchTerm: string): void {
    this.filterTerm.set(searchTerm.toLowerCase());
    
    if (!searchTerm) {
      this.filteredSections.set(this.sections);
      return;
    }

    this.filteredSections.set(
      this.sections.map(section => ({
        ...section,
        items: section.items.filter(item => 
          item.label.toLowerCase().includes(this.filterTerm()) || 
          item.keywords.some(keyword => keyword.includes(this.filterTerm()))
        )
      })).filter(section => section.items.length > 0)
    );
  }
}