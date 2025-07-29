

// import  { Routes } from "@angular/router"
// import { SignInComponent } from "./components/user/sign-in/sign-in.component"
// import { SignUpComponent } from "./components/user/sign-up/sign-up.component"
// import { PaymentComponent } from "./components/paymentManager/payment/payment.component"
// import { SuccessComponent } from "./components/success/success.component"
// import { HeaderComponent } from "./components/header/header.component"
// import { FooterComponent } from "./components/footer/footer.component"
// import { AboutusComponent } from "./components/aboutus/aboutus.component"
// import { ContactComponent } from "./components/contact/contact.component"
// import { authGuard } from "./shared/auth.guard"
// import { HomeComponent } from "./components/home/home.component"
// import { TransactionComponent } from "./components/viewtransaction/viewtransaction.component"
// import { PaymentManagmentComponent } from "./components/paymentManager/payment-managment/payment-managment.component"
// import { TeaReturnEntryComponent } from "./components/ledgerMangement/tea-return-entry/tea-return-entry.component"
// import { DenaturedTeaEntryComponent } from "./components/ledgerMangement/denatured-tea-entry/denatured-tea-entry.component"
// // import { ForbiddenComponent } from "./components/forbidden/forbidden.component" // You'll need to create this component

// export const routes: Routes = [
//   { path: "", redirectTo: "/home", pathMatch: "full" },
//   { path: "home", component: HomeComponent },
//   { path: "sign-in", component: SignInComponent },
//   { path: "sign-up", component: SignUpComponent },
//   { path: "header", component: HeaderComponent },
//   { path: "footer", component: FooterComponent },
//   { path: "about-us", component: AboutusComponent },
//   { path: "contact-us", component: ContactComponent },
//   // { path: "forbidden", component: ForbiddenComponent }, // Route for unauthorized access

//   // Protected routes with role-based access
//   {
//     path: "dashboard",
//     canActivate: [authGuard],
//     data: { requiredRoles: ["full-admin", "transport-administrator", "floor-manager", "pending"] }, // All authenticated users can access general dashboard, including 'pending'
//     children: [
//       { path: "", component: SuccessComponent }, // Default dashboard view
//     ],
//   },
//   {
//     path: "viewtrs",
//     component: TransactionComponent,
//     canActivate: [authGuard],
//     data: { requiredRoles: ["transport-administrator", "full-admin"] }, // Transport and Logistics pages
//   },
//   {
//     path: "payment",
//     component: PaymentComponent,
//     canActivate: [authGuard],
//     data: { requiredRoles: ["transport-administrator", "full-admin"] }, // Transport and Logistics pages
//   },
//   {
//     path: "payment-management",
//     component: PaymentManagmentComponent,
//     canActivate: [authGuard],
//     data: { requiredRoles: ["transport-administrator", "full-admin"] }, // Transport and Logistics pages
//   },
//   {
//     path: "return",
//     component: TeaReturnEntryComponent,
//     canActivate: [authGuard],
//     data: { requiredRoles: ["floor-manager", "full-admin"] }, // Green Leaf pages
//   },
//   {
//     path: "denatured",
//     component: DenaturedTeaEntryComponent,
//     canActivate: [authGuard],
//     data: { requiredRoles: ["floor-manager", "full-admin"] }, // Green Leaf pages
//   },
//   // Add other routes here, applying authGuard with appropriate roles
//   // Example for a full-admin only page:
//   // {
//   //   path: 'admin-settings',
//   //   component: AdminSettingsComponent, // Assuming you have this component
//   //   canActivate: [authGuard],
//   //   data: { requiredRoles: ['full-admin'] }
//   // }
// ]

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



// import type { Routes } from "@angular/router"
import { SignInComponent } from "./components/user/sign-in/sign-in.component"
// import { SignUpComponent } from "./components/user/sign-up/sign-up.component"
import { PaymentComponent } from "./components/paymentManager/payment/payment.component"
import { SuccessComponent } from "./components/success/success.component"
import { HeaderComponent } from "./components/header/header.component"
import { FooterComponent } from "./components/footer/footer.component"
import { AboutusComponent } from "./components/aboutus/aboutus.component"
import { ContactComponent } from "./components/contact/contact.component"
import { authGuard } from "./shared/auth.guard"
import { HomeComponent } from "./components/home/home.component"
import { TransactionComponent } from "./components/viewtransaction/viewtransaction.component"
import { PaymentManagmentComponent } from "./components/paymentManager/payment-managment/payment-managment.component"
import { TeaReturnEntryComponent } from "./components/ledgerMangement/tea-return-entry/tea-return-entry.component"
import { DenaturedTeaEntryComponent } from "./components/ledgerMangement/denatured-tea-entry/denatured-tea-entry.component"
import { ForbiddenComponent } from "./components/forbidden.component"
import { AdminUserManagementComponent } from "./components/user/admin-user-management/admin-user-management.component" // New
import { SetNewPasswordComponent } from "./components/user/set-new-password/set-new-password.component" // New
import { UserProfileComponent } from "./components/user/user-profile/user-profile.component"
import { PaymentHistoryComponent } from "./components/paymentManager/payment-history/payment-history.component"
import { SupplierTotalPaymentsComponent } from "./components/paymentManager/supplier-total-payments/supplier-total-payments.component"
<<<<<<< HEAD
import { ChangePasswordComponent } from "./components/user/change-password/change-password.component" 
import { ManualIdEntryComponent } from './pages/ledgerManagement/InvoiceCreate/mannualId-entry/m-id-entry.component';
import { ManualDispatchEntryComponent } from './pages/ledgerManagement/Dispatch Entry/manual-dispatch-entry/menualdis.component';
import { ManualSalesEntryComponent } from './pages/ledgerManagement/SalesEntry/menualSalesentry/m-s-entry.component';
import { CollectorCreateComponent } from './pages/CostManagement/Collector/c-create/c-create.component';
import { CollectorEditComponent } from './pages/CostManagement/Collector/c-edit/c-edit.component';
import { VehicleCreateComponent } from './pages/CostManagement/Vehicle/v-create/v-create.component';
import { VehicleViewComponent } from './pages/CostManagement/Vehicle/v-view/v-view.component';
import { CollectorViewComponent } from './pages/CostManagement/Collector/c-view/c-view.component';
import { VehicleEditComponent } from './pages/CostManagement/Vehicle/v-edit/v-edit.component';
import { RtCreateComponent } from './pages/RouteMaintain/r-create/r-create.component';
import { RtEditComponent } from './pages/RouteMaintain/r-edit/r-edit.component';
import { RtViewComponent } from './pages/RouteMaintain/r-view/r-view.component';
import { TripScheduleComponent } from './pages/PerformanceMonitoring/Trip Tracking/Trip-schedule/t-sched.component';
=======
import { ChangePasswordComponent } from "./components/user/change-password/change-password.component" // New
import { ForgotPasswordComponent } from './components/user/forgot-password/forgot-password.component';
>>>>>>> main

export const routes: Routes = [
  { path: "", redirectTo: "/home", pathMatch: "full" },
  { path: "home", component: HomeComponent },
  { path: "sign-in", component: SignInComponent },
  // {
  //   path: "sign-up",
  //   // component: SignUpComponent // Only full-admin can access this page
  // },
  { path: "header", component: HeaderComponent },
  { path: "footer", component: FooterComponent },
  { path: "about-us", component: AboutusComponent },
  { path: "contact-us", component: ContactComponent },
  { path: "forbidden", component: ForbiddenComponent },
  { path: "set-password", component: SetNewPasswordComponent }, // New: Accessible without login

  // Protected routes with role-based access
  {
    path: "dashboard",
    canActivate: [authGuard],
    data: { requiredRoles: ["full-admin", "transport-administrator", "floor-manager", "pending", "public-user"] }, // All authenticated users can access general dashboard
    children: [
      { path: "", component: SuccessComponent }, // Default dashboard view
    ],
  },
  {
    path: "viewtrs",
    component: TransactionComponent,
    canActivate: [authGuard],
    data: { requiredRoles: ["transport-administrator", "full-admin"] },
  },
  {
    path: "payment",
    component: PaymentComponent,
    canActivate: [authGuard],
    data: { requiredRoles: ["transport-administrator", "full-admin"] },
  },
  {
    path: "payment-management",
    component: PaymentManagmentComponent,
    // canActivate: [authGuard],
    // data: { requiredRoles: ["transport-administrator", "full-admin"] },
  },
  {
    path: "return",
    component: TeaReturnEntryComponent,
    // canActivate: [authGuard],
    // data: { requiredRoles: ["floor-manager", "full-admin"] },
  },
  {
    path: "denatured",
    component: DenaturedTeaEntryComponent,
    // canActivate: [authGuard],
    // data: { requiredRoles: ["floor-manager", "full-admin"] },
  },
  {
    path: "admin/users", // New route for admin user management
    component: AdminUserManagementComponent,
    canActivate: [authGuard],
    data: { requiredRoles: ["full-admin"] },
  },
  
  // ... (your other routes)
  { path: 'forgot-password', component: ForgotPasswordComponent },


  {
    path: "profile",
    component: UserProfileComponent,
    // canActivate: [authGuard],
    // data: { requiredRoles: ["full-admin", "transport-administrator", "floor-manager", "pending", "public-user"] }, // Any authenticated user can view their profile
  },

  {
    path: "payment-history",
    component: PaymentHistoryComponent,
  },

  {
    path: "supplier-total-payments",
    component: SupplierTotalPaymentsComponent,
  },



  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  // { path: 'dashboard', component: DashboardComponent }, // FIX: Ensure DashboardComponent is active

  // Main application routes (Green Leaf Collection Entry)
  // FIX: Removed duplicate root path definition and 'full' pathMatch if not a redirect
  { path: 'green-leaf-collection-entry', component: GreenLeafCollectionEntryComponent },

  // --- REPORT SECTION ROUTES ---
  { path: 'report/tea-packing-and-ledger', component: TeaPackingLedgerComponent },
  { path: 'report/claims-and-returns', component: ClaimsAndReturnsComponent },
  { path: 'report/sales', component: FinancialReportsNavigationComponent 
    
  },
  { path: 'report/monthly-nsa', component: MonthlyNsaComponent },
  { path: 'report/sales/farmer-loan-report', component: FarmerLoanReportComponent },
  { path: 'report/green-leaf-collection-report', component: GreenLeafCollectionReportComponent },
  { path: 'report/general-sales', component: SalesReportComponent }, // FIX: Removed trailing comma
  { path: 'report/sales-charges', component: SalesChargeReportComponent },
  { path: 'report/gratis-issue-report', component: GratisIssueEntryComponent },

  // --- LEDGER MANAGEMENT SECTION ROUTES ---
  {
    path: 'ledger-management',
    children: [
      { path: '', component: LedgerManagementComponent, pathMatch: 'full' },
      { path: 'home', component: LedgerManagementComponent },
      { path: 'claim-adjustment', component: ClaimsAdjustmentComponent },
      { path: 'claims-entry', component: ClaimsEntryComponent },
      { path: 'gratis-issue-entry', component: GratisIssueEntryComponent },
      { path: 'sales-entry', component: SalesEntryComponent },
      { path: 'sales-charge-entry', component: SalesChargeEntryComponent },
      { path: 'nsa-report', component: NsaReportComponent },
      { path: 'claim-analysis', component: ClaimAnalysisComponent },
      { path: 'nsa-analysis', component: NsaAnalysisComponent },
      { path: 'returns-analysis', component: ReturnsAnalysisComponent },
    ]
  }, // Ensure no trailing comma here if it's the last top-level route

  {
  path: 'change-password',
  component: ChangePasswordComponent,
  canActivate: [authGuard] // Only logged-in users can access this
},
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
  },
  {
    path: 'ledgerManagementdashboard/m-dis-entry',
    component: ManualDispatchEntryComponent
  },
  {
    path: 'ledgerManagementdashboard/m-s-entry',
    component: ManualSalesEntryComponent
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
    path: 'transportdashboard/v-create',
    component: VehicleCreateComponent
  },
  {
    path: 'transportdashboard/v-edit/:id',
    component: VehicleEditComponent
  },
  {
    path: 'transportdashboard/v-view',
    component: VehicleCreateComponent
  },
  {
    path: 'transportdashboard/r-create',
    component: RtCreateComponent
  },
  {
    path: 'transportdashboard/r-Edit/:id',
    component: RtEditComponent
  },
  {
    path: 'transportdashboard/r-view',
    component: RtViewComponent
  },
  {
    path: 'transportedashboard/trip-schedule',
    component: TripScheduleComponent
  },
  {
    path: 'transportdashboard/trip-review',
    component: TripReviewComponent
  }
]

    

// Assuming you'll create a 404 component
// import { NotFoundComponent } from './components/not-found/not-found.component';