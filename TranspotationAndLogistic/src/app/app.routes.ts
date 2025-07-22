import { Routes } from '@angular/router';

import { RyReviewComponent } from './pages/RouteYieldMaintain/ry-review/ry-review.component';
import { RyCreateComponent } from './pages/RouteYieldMaintain/ry-create/ry-create.component';
import { RtCreateComponent } from './pages/RouteMaintain/r-create/r-create.component';
import { RtEditComponent } from './pages/RouteMaintain/r-edit/r-edit.component';
import { RtViewComponent } from './pages/RouteMaintain/r-view/r-view.component';
import { RyViewComponent } from './pages/RouteYieldMaintain/ry-view/ry-view.component';
import { RtReviewComponent } from './pages/RouteMaintain/r-review/r-review.component';
import { RyEditComponent } from './pages/RouteYieldMaintain/ry-edit/ry-edit.component';

import { LedgerDashboardComponent } from './components/ledger-dashboard/ledger-dashboard.component';

import { CollectorReviewComponent } from './pages/CostManagement/Collector/c-review/c-review.component'; 
import { CollectorCreateComponent } from './pages/CostManagement/Collector/c-create/c-create.component'; 
import { CollectorEditComponent } from './pages/CostManagement/Collector/c-edit/c-edit.component';

import { VehicleReviewComponent } from './pages/CostManagement/Vehicle/v-review/v-review.component'; // Adjust path
import { VehicleCreateComponent } from './pages/CostManagement/Vehicle/v-create/v-create.component'; // Adjust path
import { VehicleEditComponent } from './pages/CostManagement/Vehicle/v-edit/v-edit.component';
import { TripReviewComponent } from './pages/PerformanceMonitoring/Trip Tracking/Trip-review/t-review.component';
import { TripScheduleComponent } from './pages/PerformanceMonitoring/Trip Tracking/Trip-schedule/t-sched.component';
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
    path : 'r-create',
    component : RtCreateComponent
  },
  {
    path : 'r-edit',
    component : RtEditComponent
  },
  {
    path : 'r-view',
    component : RtViewComponent
  },
  {
    path : 'l-dash',
    component : LedgerDashboardComponent
  },

  { path: 'r-edit/:id', component: RtEditComponent },

  {
    path: 'c-review',
    component: CollectorReviewComponent
  },
  {
    path: 'c-create',
    component: CollectorCreateComponent
  },
  {
    path: 'c-edit/:id', 
    component: CollectorEditComponent
  },
  {
    path: 'v-review',
    component: VehicleReviewComponent
  },
  {
    path: 'v-create',
    component: VehicleCreateComponent
  },
  {
    path: 'v-edit/:id',
    component: VehicleEditComponent
  },
  {
    path: 't-review',
    component: TripReviewComponent
  },
  {
    path: 't-sched',
    component: TripScheduleComponent
  },
  {
    path: 't-p-entry',
    component: TeaPackingEntryComponent
  },
  {
    path: 's-t-view',
    component: StockLedgerViewComponent
  },
  {
    path: 'in-create',
    component: InvoiceCreateComponent
  },
  {
    path: 'in-review',
    component: InvoiceReviewComponent
  },
  {
    path: 'dispatch-entry', 
    component: DispatchEntryComponent
  }
  ,
  {
    path: 's-entry',
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
  }
  

  ];