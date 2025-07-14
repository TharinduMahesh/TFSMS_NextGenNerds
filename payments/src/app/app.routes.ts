// import { Routes } from '@angular/router';
// import { SignInComponent } from './components/user/sign-in/sign-in.component';
// import { SignUpComponent } from './components/user/sign-up/sign-up.component';
// import { PaymentComponent } from './components/paymentManager/payment/payment.component';
// import { SuccessComponent } from './components/success/success.component';
// import { HeaderComponent } from './components/header/header.component';
// import { FooterComponent } from './components/footer/footer.component';
// import { AboutusComponent } from './components/aboutus/aboutus.component';
// import { ContactComponent } from './components/contact/contact.component';
// import { authGuard } from './shared/auth.guard';
// import { HomeComponent } from './components/home/home.component';
// // Uncomment if you plan to use TransactionComponent
// import { TransactionComponent } from './components/viewtransaction/viewtransaction.component';
// import { PaymentManagmentComponent } from './components/paymentManager/payment-managment/payment-managment.component';
// import { TeaReturnEntryComponent } from './components/ledgerMangement/tea-return-entry/tea-return-entry.component';
// import { DenaturedTeaEntryComponent } from './components/ledgerMangement/denatured-tea-entry/denatured-tea-entry.component';
// import { SetNewPasswordComponent } from './components/user/set-new-password/set-new-password.component';
// import { AdminUserManagementComponent } from './components/user/admin-user-management/admin-user-management.component';

// export const routes: Routes = [
//   { path: '', redirectTo: '/home', pathMatch: 'full' },
//   { path: 'home', component: HomeComponent },
//   { path: 'sign-in', component: SignInComponent },
//   { path: 'sign-up', component: SignUpComponent },
//   { path: 'header', component: HeaderComponent },
//   { path: 'footer', component: FooterComponent },
//   { path: 'about-us', component: AboutusComponent },
//   { path: 'contact-us', component: ContactComponent },
//   {path: 'viewtrs', component: TransactionComponent}, // Assuming you have a SuccessComponent
//   { path: 'payment', component: PaymentComponent },
//   {path : 'payment-management', component: PaymentManagmentComponent},
//   {path : 'return' , component:TeaReturnEntryComponent},
//   {path : 'denatured', component:DenaturedTeaEntryComponent }, // Assuming you have a DenaturedTeaEntryComponent
//   {path : 'admin-user-management', component:AdminUserManagementComponent},
//   {path : 'set-password', component: SetNewPasswordComponent},
//   {
//     path: 'dashboard',
//     canActivate: [authGuard],
//     canActivateChild: [authGuard],
//     children: [
//       { path: '', component: SuccessComponent }, // Default dashboard view
//       // { path: 'payments', component: PaymentComponent },
//       // Add other admin operations here
//     ]
//   }
// ];

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


import type { Routes } from "@angular/router"
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
import { UserProfileComponent } from "./components/user-profile/user-profile/user-profile.component"
import { PaymentHistoryComponent } from "./components/paymentManager/payment-history/payment-history.component"
import { SupplierTotalPaymentsComponent } from "./components/paymentManager/supplier-total-payments/supplier-total-payments.component"
import path from "path"

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
  }

]
