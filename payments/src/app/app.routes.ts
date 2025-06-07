import { Routes } from '@angular/router';
import { SignInComponent } from './components/user/sign-in/sign-in.component';
import { SignUpComponent } from './components/user/sign-up/sign-up.component';
import { PaymentComponent } from './components/paymentManager/payment/payment.component';
import { SuccessComponent } from './components/success/success.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { AboutusComponent } from './components/aboutus/aboutus.component';
import { ContactComponent } from './components/contact/contact.component';
import { authGuard } from './shared/auth.guard';
import { HomeComponent } from './components/home/home.component';
// Uncomment if you plan to use TransactionComponent
import { TransactionComponent } from './components/viewtransaction/viewtransaction.component';
import { PaymentCalculatorComponent } from './components/paymentManager/payment-calculater/payment-calculater.component';
import { PaymentManagmentComponent } from './components/paymentManager/payment-managment/payment-managment.component';
import { TeaReturnEntryComponent } from './components/ledgerMangement/tea-return-entry/tea-return-entry.component';
import { DenaturedTeaEntryComponent } from './components/ledgerMangement/denatured-tea-entry/denatured-tea-entry.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'sign-in', component: SignInComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'header', component: HeaderComponent },
  { path: 'footer', component: FooterComponent },
  { path: 'about-us', component: AboutusComponent },
  { path: 'contact-us', component: ContactComponent },
  {path: 'viewtrs', component: TransactionComponent}, // Assuming you have a SuccessComponent
  { path: 'payment', component: PaymentComponent },
  { path: 'payment-calculator', component: PaymentCalculatorComponent },
  {path : 'payment-management', component: PaymentManagmentComponent},
  {path : 'return' , component:TeaReturnEntryComponent},
  {path : 'denatured', component:DenaturedTeaEntryComponent }, // Assuming you have a DenaturedTeaEntryComponent
  {
    path: 'dashboard',
    canActivate: [authGuard],
    canActivateChild: [authGuard],
    children: [
      { path: '', component: SuccessComponent }, // Default dashboard view
      // { path: 'payments', component: PaymentComponent },
      // Add other admin operations here
    ]
  }
];
