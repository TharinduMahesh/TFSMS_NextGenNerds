// import { Routes } from '@angular/router';

// export const routes: Routes = [];


import { Routes } from '@angular/router';
import { SignInComponent } from './auth/sign-in/sign-in.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { PaymentComponent } from './payment/payment.component';
import { SuccessComponent } from './auth/success/success.component';
import { HomeComponent } from './auth/home/home.component';
import { HeaderComponent } from './auth/header/header.component';
import { FooterComponent } from './auth/footer/footer.component';

export const routes: Routes = [
  { path: '', redirectTo: '/sign-in', pathMatch: 'full' },
  { path: 'sign-in', component: SignInComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'payments', component: PaymentComponent },
  {path: 'success', component: SuccessComponent},
  {path: 'home', component: HomeComponent},
  {path: 'header', component: HeaderComponent},
  {path: 'footer', component: FooterComponent}
];