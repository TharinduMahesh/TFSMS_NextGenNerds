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
import { RtCreateComponent } from './pages/RouteMaintain/r-create/r-create.component';
import { RtEditComponent } from './pages/RouteMaintain/r-edit/r-edit.component';
import { RtViewComponent } from './pages/RouteMaintain/r-view/r-view.component';
import { CollectorCreateComponent } from './pages/CostManagement/Collector/c-create/c-create.component';
import { CollectorEditComponent } from './pages/CostManagement/Collector/c-edit/c-edit.component';
import { CollectorViewComponent } from './pages/CostManagement/Collector/c-view/c-view.component';
import { VehicleCreateComponent } from './pages/CostManagement/Vehicle/v-create/v-create.component';
import { VehicleEditComponent } from './pages/CostManagement/Vehicle/v-edit/v-edit.component';
import { VehicleViewComponent } from './pages/CostManagement/Vehicle/v-view/v-view.component';
import { TripScheduleComponent } from './pages/PerformanceMonitoring/Trip Tracking/Trip-schedule/t-sched.component';
import { ManualIdEntryComponent } from './pages/ledgerManagement/InvoiceCreate/mannualId-entry/m-id-entry.component';

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
    path: 'transportdashboard/c-create',
    component: CollectorCreateComponent
  },
  {
    path: 'transportdashboard/c-edit/:id',
    component: CollectorEditComponent
  },
  {
    path: 'transportdashboard/c-view',
    component: CollectorViewComponent
  },
  {
    path: 'transportdashboard/r-review',
    component: RtReviewComponent
  },
  {
    path: 'transportdashboard/r-create',
    component: RtCreateComponent
  },
  {
    path: 'transportdashboard/r-edit/:id',
    component: RtEditComponent
  },
  {
    path: 'transportdashboard/r-view',
    component: RtViewComponent
  },
  {
    path: 'transportdashboard/v-review',
    component: VehicleReviewComponent
  },
  {
    path: 'transportdashboard/v-create',
    component: VehicleCreateComponent
  },
  {
    path: 'transportdashboard/v-edit/:id',
    component: VehicleEditComponent
  },
  {
    path: 'transportdashboard/v-view',
    component: VehicleViewComponent
  },
  {
    path: 'transportdashboard/trip-review',
    component: TripReviewComponent
  },
  {
    path: 'transportedashboard/trip-schedule',
    component: TripScheduleComponent
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
  },
  {
    path: 'ledgerManagementdashboard/m-iid-entry',
    component: ManualIdEntryComponent
  }
  ];