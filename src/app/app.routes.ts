import { Routes } from '@angular/router';

import { RyReviewComponent } from './pages/RouteYieldMaintain/ry-review/ry-review.component';
import { RyCreateComponent } from './pages/RouteYieldMaintain/ry-create/ry-create.component';
import { RyViewComponent } from './pages/RouteYieldMaintain/ry-view/ry-view.component';
import { RtReviewComponent } from './pages/RouteMaintain/r-review/r-review.component';
import { RyEditComponent } from './pages/RouteYieldMaintain/ry-edit/ry-edit.component';

import { LedgerDashboardComponent } from './components/ledger-dashboard/ledger-dashboard.component';

import { CollectorReviewComponent } from './pages/CostManagement/Collector/c-review/c-review.component'; 

import { VehicleReviewComponent } from './pages/CostManagement/Vehicle/v-review/v-review.component'; 
import { TripReviewComponent } from './pages/PerformanceMonitoring/Trip Tracking/Trip-review/t-review.component';

import { CostReportComponent } from './pages/CostManagement/Cost-report/ct-report.component';
import { CollectorPerformanceReportComponent } from './pages/PerformanceMonitoring/Reports/Collector-performance-report/c-p-report.component';
import { RoutePerformanceReportComponent } from './pages/PerformanceMonitoring/Reports/route-performance-report/r-p-report.component';import { CostAnalysisComponent } from './pages/CostManagement/CostAnalysis/cost-analysis.component';
import { CollectorPerformanceAnalysisComponent } from './pages/PerformanceMonitoring/CollectorPerformanceAnalysis/cp-analysis.component';
import { TeaPackingEntryComponent } from './pages/ledgerManagement/TeaPackingEntry/t-p-entry.component';
import { StockLedgerViewComponent } from './pages/ledgerManagement/StockLedgerView/s-t-view.component';
import { InvoiceCreateComponent } from './pages/ledgerManagement/InvoiceCreate/in-create.component';
import { InvoiceReviewComponent } from './pages/ledgerManagement/InvoiceReview/in-review.component';
import { DispatchEntryComponent } from './pages/ledgerManagement/Dispatch Entry/dispatch-entry.component';
import { SalesEntryComponent } from './pages/ledgerManagement/SalesEntry/s-entry.component';
import { TransportDashboardComponent } from './pages/transpotation and logistic dashboard/tnlDash.component';
import { PerformanceDashboardComponent } from './pages/Performance Monitoring dashboard/pdashboard.component';
import { RoutePerformanceAnalysisComponent } from './pages/PerformanceMonitoring/Routes Performance Analysis/r-p-analysis.component';

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
    path : 'ry-edit/:id',
    component: RyEditComponent
  },
  {
    path : 'ry-view',
    component: RyViewComponent
  },
  {
    path : 'ledgerManagementdashboard',
    component : LedgerDashboardComponent
  },
  {
    path: 'ledgerManagementdashboard/invoice-create',
    component: InvoiceCreateComponent
  },
  {
    path: 'ledgerManagementdashboard/invoice-review',
    component: InvoiceReviewComponent
  },
  {
    path: 'ledgerManagementdashboard/dispatch-entry', 
    component: DispatchEntryComponent
  }
  ,
  {
    path: 'ledgerManagementdashboard/sales-entry',
    component: SalesEntryComponent
  },
  {
    path: 'transportdashboard',
    component: TransportDashboardComponent
  },
  {
    path: 'transportdashboard/c-review',
    component: CollectorReviewComponent
  },
  {
    path: 'transportdashboard/r-review',
    component: RtReviewComponent
  },
  {
    path: 'transportdashboard/v-review',
    component: VehicleReviewComponent
  },
  {
    path: 'transportdashboard/t-review',
    component: TripReviewComponent
  },
  {
    path: 'performancedashboard',
    component: PerformanceDashboardComponent
  },
  {
    path: 'performancedashboard/costs-report',
    component: CostReportComponent
  },
  {
    path: 'performancedashboard/collector-report',
    component: CollectorPerformanceReportComponent
  },
  {
    path: 'performancedashboard/route-report',
    component: RoutePerformanceReportComponent
  },
  {
    path: 'performancedashboard/cost-analysis',
    component: CostAnalysisComponent
  },
  {
    path: 'performancedashboard/collector-performance-analysis',
    component: CollectorPerformanceAnalysisComponent
  },
  {
    path: 'performancedashboard/routes-analysis',
    component: RoutePerformanceAnalysisComponent
  },
  {
    path: 'ledgerManagementdashboard/tea-packing',
    component: TeaPackingEntryComponent
  },
  {
    path: 'ledgerManagementdashboard/stock-ledger',
    component: StockLedgerViewComponent
  }
  ];