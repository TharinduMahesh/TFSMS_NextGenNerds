import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaymentComponent } from '../payment/payment.component';
import { IncentiveComponent } from '../incentive/incentive.component';
import { HeaderComponent } from "../../header/header.component";
// import { DebtComponent } from '../debt/debt.component';
// import { AdvanceComponent } from '../advance/advance.component';

@Component({
  selector: 'app-payment-managment',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    ReactiveFormsModule,
    PaymentComponent,
    IncentiveComponent,
    HeaderComponent
  ],
  templateUrl: './payment-managment.component.html',
  styleUrls: ['./payment-managment.component.css']
})
export class PaymentManagmentComponent implements OnInit {
  activeTab: string = 'payments';
  
  constructor() { }

  ngOnInit(): void {
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
}