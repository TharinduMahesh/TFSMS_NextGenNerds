import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CollectorService } from '../../../../services/LogisticAndTransport/Collector.service';
import { CreateUpdateCollectorPayload } from '../../../../models/Logistic and Transport/CollectorManagement.model';

@Component({
  selector: 'app-collector-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './c-create.component.html',
  styleUrls: ['./c-create.component.scss']
})
export class CollectorCreateComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private collectorService = inject(CollectorService);

  collectorForm: FormGroup;

  constructor() {
    // --- THIS IS THE CORRECTED and EXPANDED FORM GROUP ---
    this.collectorForm = this.fb.group({
      // Basic Info
      name: ['', [Validators.required, Validators.maxLength(150)]],
      collectorNIC: ['', [Validators.required, Validators.pattern('^([0-9]{9}[x|X|v|V]|[0-9]{12})$')]], // Common NIC pattern

      // Contact Info
      collectorPhoneNum: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]], // Simple 10-digit phone pattern
      collectorEmail: ['', [Validators.required, Validators.email]],
      
      // Address Info
      collectorAddressLine1: ['', Validators.required],
      collectorAddressLine2: [''], // Optional
      collectorCity: ['', Validators.required],
      collectorPostalCode: [''], // Optional

      // Personal Info
      collectorGender: [null, Validators.required],
      collectorDOB: [null, Validators.required],
      
      // Financial Info
      ratePerKm: [null, [Validators.required, Validators.min(0.01)]]
    });
  }

  onSubmit(): void {
    if (this.collectorForm.invalid) {
      this.collectorForm.markAllAsTouched(); // This helps show validation messages
      alert('Please fill out all required fields correctly.');
      return;
    }

    const payload: CreateUpdateCollectorPayload = this.collectorForm.value;
    
    this.collectorService.createCollector(payload).subscribe({
      next: () => {
        alert('Collector created successfully!');
        this.router.navigate(['transportdashboard/c-review']); // Navigate to the collector list
      },
      error: (err) => alert(`Error creating collector: ${err.message}`)
    });
  }

  onCancel(): void {
    this.router.navigate(['transportdashboard/c-review']); // Navigate back to the collector list
  }
}