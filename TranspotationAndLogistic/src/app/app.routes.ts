import { Routes } from '@angular/router';
import { RyReviewComponent } from './pages/RouteYieldMaintain/ry-review/ry-review.component';
import { RyCreateComponent } from './pages/RouteYieldMaintain/ry-create/ry-create.component';
import { RtCreateComponent } from './pages/RouteMaintain/r-create/r-create.component';
import { RtEditComponent } from './pages/RouteMaintain/r-edit/r-edit.component';
import { RtViewComponent } from './pages/RouteMaintain/r-view/r-view.component';
import { RyViewComponent } from './pages/RouteYieldMaintain/ry-view/ry-view.component';
import { RtReviewComponent } from './pages/RouteMaintain/r-review/r-review.component';
import { RyEditComponent } from './pages/RouteYieldMaintain/ry-edit/ry-edit.component';
import { LedgerDashboardComponent } from './pages/ledgerManagement/ledger-dashboard/ledger-dashboard.component';
import { TeaPackingComponent } from './pages/ledgerManagement/tea-packing/tea-packing.component';
import { StockLedgerComponent } from './pages/ledgerManagement/stock-ledger/stock-ledger.component';
import { InvoiceManagementComponent } from './pages/ledgerManagement/invoice-management/invoice-management.component';
import { DispatchRegisterComponent } from './pages/ledgerManagement/dispatch-regis/dispatch-regis.component';
import { DispatchRegisterService } from './services/LedgerManagement/dispatch-view.service';
import { DispatchViewComponent } from './pages/ledgerManagement/dispatch-view/dispatch-view.component';
import { SalesEntryComponent } from './pages/ledgerManagement/sales-entry/sales-entry.component';
import { DenaturedTeaEntryComponent } from './pages/ledgerManagement/denatured-t-entry/denatured-t-entry.component';
import { DenaturedTeaReportComponent } from './pages/ledgerManagement/denatured-t-report/denatured-t-report.component';
import { TeaReturnEntryComponent } from './pages/ledgerManagement/t-return-entry/t-return-entry.component';
import { ReturnRegisterComponent } from './pages/ledgerManagement/r-register/r-register.component';
export const routes: Routes = [
    {
      path : 'ry-review',
      component : RyReviewComponent
    },
    {
      path : 'ry-create',
      component :RyCreateComponent
    },
  {
    path : 'ry-edit',
    component: RyEditComponent
  },
  {
    path : 'ry-view',
    component: RyViewComponent
  },
  {
    path : 'r-create',
    component : RtCreateComponent
  },
  {
    path : 'r-edit',
    component : RtEditComponent
  },
  {
    path : 'r-review',
    component : RtReviewComponent
  },
  {
    path : 'r-view',
    component : RtViewComponent
  },
  {
    path : 'l-dash',
    component : LedgerDashboardComponent
  },
  {
    path : 't-pack',
    component : TeaPackingComponent
  },
  {
    path : 's-ledger',
    component : StockLedgerComponent
  },
  {
    path : 'in-manage',
    component : InvoiceManagementComponent
  },
  {
    path : 'dis-reg',
    component : DispatchRegisterComponent
  },
  {
    path : 'dis-view',
    component : DispatchViewComponent
  },
  {
    path : 's-entry',
    component : SalesEntryComponent
  },
  {
    path : 'd-t-entry',
    component : DenaturedTeaEntryComponent
  },
  {
    path : 'd-t-report',
    component : DenaturedTeaReportComponent
  },
  {
    path : 't-return-entry',
    component : TeaReturnEntryComponent
  },
  {
    path : 'r-register',
    component : ReturnRegisterComponent
  }
  ];