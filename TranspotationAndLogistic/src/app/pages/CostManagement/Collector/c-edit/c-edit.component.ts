import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { CollectorService } from '../../../../services/LogisticAndTransport/Collector.service'
import { CollectorResponse, CreateUpdateCollectorPayload } from '../../../../models/Logistic and Transport/CollectorManagement.model';

@Component({
  selector: 'app-collector-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './c-edit.component.html',
  styleUrls: ['./c-edit.component.scss']
})
export class CollectorEditComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private collectorService = inject(CollectorService);

  collectorForm: FormGroup;
  currentCollectorId: number | null = null;
  isLoading = true;
  error: string | null = null;

  constructor() {
    this.collectorForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(150)]],
      contactNumber: ['',[Validators.required, Validators.maxLength(10)]],
      ratePerKm: [0, [Validators.required, Validators.min(0.01)]]
    });
  }

  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        if (!id) {
          this.error = 'Collector ID is missing from URL.';
          this.isLoading = false;
          throw new Error('Collector ID is required');
        }
        this.currentCollectorId = +id;
        // You need to add getById to your service!
        return this.collectorService.getCollectorById(this.currentCollectorId); 
      })
    ).subscribe({
      next: (collectorData) => {
        this.collectorForm.patchValue(collectorData);
        this.isLoading = false;
      },
      error: (err) => {
        this.error = err.message;
        this.isLoading = false;
      }
    });
  }
  
  onSubmit(): void {
    if (this.collectorForm.invalid || !this.currentCollectorId) return;
    
    const payload: CreateUpdateCollectorPayload = this.collectorForm.value;
    this.collectorService.updateCollector(this.currentCollectorId, payload).subscribe({
      next: () => {
        alert('Collector updated successfully!');
        this.router.navigate(['/c-review']);
      },
      error: (err) => alert(`Error: ${err.message}`)
    });
  }

  onCancel(): void {
    this.router.navigate(['/c-review']);
  }
}