import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-manual-id-entry', 
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './menualdis.component.html',
  styleUrls: ['./menualdis.component.scss']
})
export class ManualDispatchEntryComponent { 
  
  manualIdForm: FormGroup;
  private fb = inject(FormBuilder);
  private router = inject(Router);

  constructor() {
    
    this.manualIdForm = this.fb.group({
      invoiceId: [null, [Validators.required, Validators.min(1)]]
    });
  }

  submitId(): void {
    if (this.manualIdForm.invalid) {
      return;
    }

    const invoiceId = this.manualIdForm.value.invoiceId;

    this.router.navigate(['ledgerManagementdashboard/dispatch-entry'], { 
      queryParams: { invoiceId: invoiceId }
    });
  }
}