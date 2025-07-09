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
        { label: 'TEA PACKING', route: '/tea-packing', keywords: ['TEA', 'PACKING'] },
        { label: 'STOCK LEDGER', route: '/stock-ledger', keywords: ['STOCK', 'LEDGER'] }
      ]
    },
    {
      title: 'Invoice Generation and Dispatch',
      items: [
        { label: 'INVOICE CREATION', route: '/invoice-create', keywords: ['INVOICE', 'CREATION'] },
        { label: 'DISPATCH DETAILS ENTRY', route: '/d-entry', keywords: ['DISPATCH', 'DETAILS','ENTRY'] },
        { label: 'DISPATCH REGISTER', route: '/d-register', keywords: ['DISPATCH', 'REGISTER'] }
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
        { label: 'DENATURED TEA ENTRY', route: '/tea-entry', keywords: ['DENATURED', 'TEA', 'ENTRY'] },
        { label: 'DENATURED TEA REPORT', route: '/tea-report', keywords: ['DENATURED', 'TEA', 'REPORT'] }
      ]
    },
    {
      title: 'Sales Management',
      items: [
        { label: 'SLAES ENTRY', route: '/sales-entry', keywords: ['SLAES', 'issue'] },
        { label: 'GRATIS ISSUE ENTRY', route: '/gratis-e-entry', keywords: ['sales', 'change', 'entry'] },
        { label: 'SALES CHARGE ENTRY', route: '/sales-c-entry', keywords: ['sales', 'change', 'entry'] }
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
        { label: 'RETURN ENTRY', route: '/return-entry', keywords: ['return', 'requirer'] },
        { label: 'RETURN REGISTER', route: '/return-register', keywords: ['claim', 'acquaintment'] },
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