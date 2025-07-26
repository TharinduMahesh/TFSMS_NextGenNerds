import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';

// Models and Services
import { CreateUpdateRoutePayload } from '../../../models/Logistic and Transport/RouteMaintain.model';
import { RouteService } from '../../../Services/LogisticAndTransport/RouteMaintain.service';
import { CollectorService } from '../../../Services/LogisticAndTransport/Collector.service';
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
  isLoading = signal(true); // Signal to manage loading state of collectors

  constructor() {
    this.routeForm = this.fb.group({
      rName: ['', [Validators.required, Validators.maxLength(100)]],
      startLocation: ['', Validators.required],
      endLocation: ['', Validators.required],
      distance: [null, [Validators.required, Validators.min(1)]],
      collectorId: [null, Validators.required],
      growerLocations: this.fb.array([])
    });
  }

  ngOnInit(): void {
    // Fetch collectors to populate the dropdown menu
    this.collectorService.getAllCollectors().subscribe({
      next: (collectors) => {
        this.availableCollectors.set(collectors);
        this.isLoading.set(false);
      },
      error: (err) => {
        alert('Failed to load collectors. Please try again later.');
        console.error(err);
        this.isLoading.set(false);
      }
    });
  }

  // Getter for easy access to the growerLocations FormArray in the template
  get growerLocations(): FormArray {
    return this.routeForm.get('growerLocations') as FormArray;
  }
  
  // Method to add a new grower location with default lat/lng
  addGrowerLocation(): void {
    this.growerLocations.push(this.fb.group({
      // Latitude and Longitude now have default values and no user input
      latitude: [0], 
      longitude: [0],
      // Only the description is required from the user
      description: ['', Validators.required] 
    }));
  }

  // Method to remove a grower location
  removeGrowerLocation(index: number): void {
    this.growerLocations.removeAt(index);
  }

  // Method to handle form submission
  onSubmit(): void {
    if (this.routeForm.invalid) {
      alert('Please fill all required fields correctly.');
      this.routeForm.markAllAsTouched(); // Helps show validation errors
      return;
    }
    const payload: CreateUpdateRoutePayload = this.routeForm.value;
    this.routeService.createRoute(payload).subscribe({
      next: () => {
        alert('Route created successfully!');
        this.router.navigate(['/transportdashboard/r-review']); // Navigate back to the list
      },
      error: (err) => alert(`Error creating route: ${err.message}`)
    });
  }

  // Method to handle cancellation
  onCancel(): void {
    this.router.navigate(['/transportdashboard/r-review']); // Navigate back to the list
  }
}