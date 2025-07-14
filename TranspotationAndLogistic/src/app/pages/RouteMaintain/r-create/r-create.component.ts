import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';

import { CreateUpdateRoutePayload } from '../../../models/Logistic and Transport/RouteMaintain.model';
import { RouteService } from '../../../services/LogisticAndTransport/RouteMaintain.service';
import { CollectorService } from '../../../services/LogisticAndTransport/Collector.service';
import { CollectorResponse } from '../../../models/Logistic and Transport/CollectorManagement.model';

@Component({
  selector: 'app-r-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './r-create.component.html',
  styleUrls: ['./r-create.component.scss']
})
export class RtCreateComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private routeService = inject(RouteService);
  private collectorService = inject(CollectorService);

  routeForm: FormGroup;
  availableCollectors = signal<CollectorResponse[]>([]);

  constructor() {
    this.routeForm = this.fb.group({
      rName: ['', [Validators.required, Validators.maxLength(50)]],
      startLocation: ['', Validators.required],
      endLocation: ['', Validators.required],
      distance: [0, [Validators.required, Validators.min(0)]],
      collectorId: [null, Validators.required], // Collector is required for new routes
      growerLocations: this.fb.array([])
    });
  }

  ngOnInit(): void {
    // Fetch collectors to populate the dropdown menu
    this.collectorService.getAllCollectors().subscribe(collectors => this.availableCollectors.set(collectors));
  }

  get growerLocations(): FormArray {
    return this.routeForm.get('growerLocations') as FormArray;
  }
  
  addGrowerLocation(): void {
    this.growerLocations.push(this.fb.group({
        latitude: [null, Validators.required],
        longitude: [null, Validators.required],
        description: ['']
    }));
  }
  removeGrowerLocation(index: number): void {
    this.growerLocations.removeAt(index);
  }

  onSubmit(): void {
    if (this.routeForm.invalid) {
      alert('Please fill all required fields correctly.');
      return;
    }
    const payload: CreateUpdateRoutePayload = this.routeForm.value;
    this.routeService.createRoute(payload).subscribe({
      next: () => {
        alert('Route created successfully!');
        this.router.navigate(['/r-review']);
      },
      error: (err) => alert(`Error: ${err.message}`)
    });
  }

  onCancel(): void {
    this.router.navigate(['/r-review']);
  }
}