import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dahsboard/dahsboard.component';
import { TeaPackingLedgerComponent } from './components/reports/tea-packing-and-ledger/tea-packing-and-ledger.component';
import { ClaimsAndReturnsComponent } from './components/reports/claims-and-returns/claims-and-returns.component';
import { SalesComponent } from './components/reports/sales/sales-daily_report/sales.component';
import { MonthlyNsaComponent } from './components/reports/monthly-nsa/monthly-nsa.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'report/tea-packing-and-ledger', component: TeaPackingLedgerComponent },
  { path: 'report/claims-and-returns', component: ClaimsAndReturnsComponent },
  { path: 'report/sales', component: SalesComponent },
  { path: 'report/monthly-nsa', component: MonthlyNsaComponent },
];
