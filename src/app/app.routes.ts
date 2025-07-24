import { Routes } from '@angular/router';
import { TeaPackingLedgerComponent } from './components/reports/tea-packing-and-ledger/tea-packing-and-ledger.component';
import { ClaimsAndReturnsComponent } from './components/reports/claims-and-returns/claims-and-returns.component';
import { FinancialReportsNavigationComponent } from './components/reports/sales/Financial-report-navigation/financial-reports-navigation.component';
import { MonthlyNsaComponent } from './components/reports/monthly-nsa/monthly-nsa.component';
import { FarmerLoanReportComponent } from './components/reports/sales/Fiancial-Reports/farmer-loan-report/farmer-loan-report.component';
import { LedgerManagementComponent } from './components/Ledger_Management/Ledger_Homepage/Ledger_Homepage.component';
import { ClaimsAdjustmentComponent } from './components/Ledger_Management/Claim_Adjustment/claim-adjustment.component';
import { ClaimsEntryComponent } from './components/Ledger_Management/Clamis_Entry/claims-entry.component';
import { GratisIssueEntryComponent } from './components/Ledger_Management/Gratis_Issue/gratis-issue-entry.component';
import { SalesChargeEntryComponent } from './components/Ledger_Management/Sales_Charge/sales-charge-entry.component';
import { NsaReportComponent } from './components/Ledger_Management/NSA_Report/nsa-report.component';
import { ClaimAnalysisComponent } from './components/Ledger_Management/Claim_Analysis/claim-analysis.component';
import { NsaAnalysisComponent } from './components/Ledger_Management/NSA_Analysis/nsa-analysis.component';
import { GreenLeafCollectionEntryComponent } from './components/Green_Leaf_Collection/green-leaf-collection-entry.component';
import { GreenLeafCollectionReportComponent } from './components/reports/green-leaf-collection-report/green-leaf-collection-report.component';
import { ReturnsAnalysisComponent } from './components/Ledger_Management/Return_Analysis/returns-analysis.component';
// FIX: Uncomment and import DashboardComponent if you use it as the default landing page
// import { DashboardComponent } from './components/dashboard/dahsboard/dahsboard.component';

import { SalesReportComponent } from './components/reports/sales/sales-report/sales-report.component'; // FIX: Corrected import path for SalesReportComponent
import { SalesChargeReportComponent } from './components/reports/sales/Sales-charge-report/sales-charge-report.component';


// Assuming you'll create a 404 component
// import { NotFoundComponent } from './components/not-found/not-found.component';

export const routes: Routes = [
  // Default route: Redirect to dashboard when root path is accessed
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  // { path: 'dashboard', component: DashboardComponent }, // FIX: Ensure DashboardComponent is active

  // Main application routes (Green Leaf Collection Entry)
  // FIX: Removed duplicate root path definition and 'full' pathMatch if not a redirect
  { path: 'green-leaf-collection-entry', component: GreenLeafCollectionEntryComponent },

  // --- REPORT SECTION ROUTES ---
  { path: 'report/tea-packing-and-ledger', component: TeaPackingLedgerComponent },
  { path: 'report/claims-and-returns', component: ClaimsAndReturnsComponent },
  { path: 'report/sales', component: FinancialReportsNavigationComponent },
  { path: 'report/monthly-nsa', component: MonthlyNsaComponent },
  { path: 'report/sales/farmer-loan-report', component: FarmerLoanReportComponent },
  { path: 'report/green-leaf-collection-report', component: GreenLeafCollectionReportComponent },
  { path: 'report/general-sales', component: SalesReportComponent }, // FIX: Removed trailing comma
  { path: 'report/sales-charges', component: SalesChargeReportComponent },

  // --- LEDGER MANAGEMENT SECTION ROUTES ---
  {
    path: 'ledger-management',
    children: [
      { path: '', component: LedgerManagementComponent, pathMatch: 'full' },
      { path: 'home', component: LedgerManagementComponent },
      { path: 'claim-adjustment', component: ClaimsAdjustmentComponent },
      { path: 'claims-entry', component: ClaimsEntryComponent },
      { path: 'gratis-issue-entry', component: GratisIssueEntryComponent },
      { path: 'sales-charge-entry', component: SalesChargeEntryComponent },
      { path: 'nsa-report', component: NsaReportComponent },
      { path: 'claim-analysis', component: ClaimAnalysisComponent },
      { path: 'nsa-analysis', component: NsaAnalysisComponent },
      { path: 'returns-analysis', component: ReturnsAnalysisComponent },
    ]
  }, // Ensure no trailing comma here if it's the last top-level route

  // Wildcard route for any undefined paths (MUST BE THE LAST ROUTE)
  // { path: '**', component: NotFoundComponent } // Uncomment and create this component
];
