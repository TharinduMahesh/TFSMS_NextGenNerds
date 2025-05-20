import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dahsboard/dahsboard.component';
import { TeaPackingLedgerComponent } from './components/reports/tea-packing-and-ledger/tea-packing-and-ledger.component';
import { ClaimsAndReturnsComponent } from './components/reports/claims-and-returns/claims-and-returns.component';
import { FinancialReportsNavigationComponent } from './components/reports/sales/Financial-report-navigation/financial-reports-navigation.component';
import { MonthlyNsaComponent } from './components/reports/monthly-nsa/monthly-nsa.component';
import { FarmerLoanReportComponent} from './components/reports/sales/Fiancial-Reports/farmer-loan-report/farmer-loan-report.component'

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'report/tea-packing-and-ledger', component: TeaPackingLedgerComponent },
  { path: 'report/claims-and-returns', component: ClaimsAndReturnsComponent },
  { path: 'report/sales', component: FinancialReportsNavigationComponent },
  { path: 'report/monthly-nsa', component: MonthlyNsaComponent },
  { path: 'report/sales/farmer-loan-report', component:FarmerLoanReportComponent}

  
];
