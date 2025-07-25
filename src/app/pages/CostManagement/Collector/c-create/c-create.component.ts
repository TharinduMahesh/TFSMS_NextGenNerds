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
    this.collectorForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(150)]],
      contactNumber: ['',[Validators.required, Validators.maxLength(10)]],
      ratePerKm: [0, [Validators.required, Validators.min(0.01)]]
    });
  }

  onSubmit(): void {
    if (this.collectorForm.invalid) {
      alert('Please fill out all required fields correctly.');
      return;
    }
    const payload: CreateUpdateCollectorPayload = this.collectorForm.value;
    this.collectorService.createCollector(payload).subscribe({
      next: () => {
        alert('Collector created successfully!');
        this.router.navigate(['/c-review']);
      },
      error: (err) => alert(`Error: ${err.message}`)
    });
  }

  onCancel(): void {
    this.router.navigate(['/c-review']);
  }
}