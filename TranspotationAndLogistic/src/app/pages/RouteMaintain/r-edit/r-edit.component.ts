import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';

import { RouteService } from '../../../services/RouteMaintainService/RouteMaintain.service';
import { CreateUpdateRouteDto, GrowerLocationDto } from '../../../models/Logistic and Transport/RouteMaintain.model';
import { RtList } from '../../../models/Logistic and Transport/RouteMaintain.model'; // Import RtList as well

@Component({
  selector: 'app-r-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './r-edit.component.html',
  styleUrls: ['./r-edit.component.scss']
})
export class RtEditComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private routeService = inject(RouteService);

  routeForm: FormGroup;
  currentRouteId: number | null = null;
  isLoading = true;
  error: string | null = null;

  constructor() {
    this.routeForm = this.fb.group({
      rName: ['', Validators.required],
      startLocation: ['', Validators.required],
      endLocation: ['', Validators.required],
      distance: [0, [Validators.required, Validators.min(0)]],
      collectorId: [null],
      vehicleId: [null],
      growerLocations: this.fb.array([]) // This will hold a list of FormGroups
    });
  }

  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        if (!id) throw new Error('Route ID is required');
        this.currentRouteId = +id;
        return this.routeService.getById(this.currentRouteId);
      })
    ).subscribe({
      next: (routeData) => {
        this.populateForm(routeData);
        this.isLoading = false;
      },
      error: (err) => {
        this.error = err.message || 'Failed to load route data.';
        this.isLoading = false;
      }
    });
  }

  // Getter for easy access to the growerLocations FormArray in the template
  get growerLocations(): FormArray {
    return this.routeForm.get('growerLocations') as FormArray;
  }

  private populateForm(route: RtList): void {
    this.routeForm.patchValue({
      rName: route.rName,
      startLocation: route.startLocation,
      endLocation: route.endLocation,
      distance: route.distance,
      collectorId: route.collectorId,
      vehicleId: route.vehicleId,
    });

    // Populate the FormArray with a FormGroup for each location
    this.growerLocations.clear();
    route.growerLocations.forEach(loc => {
      this.growerLocations.push(this.fb.group({
        latitude: [loc.latitude, Validators.required],
        longitude: [loc.longitude, Validators.required],
        description: [loc.description]
      }));
    });
  }
  
  // Method to add a new, empty grower location form group to the array
  addGrowerLocation(): void {
    const locationFormGroup = this.fb.group({
        latitude: [null, Validators.required],
        longitude: [null, Validators.required],
        description: ['']
    });
    this.growerLocations.push(locationFormGroup);
  }

  // Method to remove a grower location from the array at a specific index
  removeGrowerLocation(index: number): void {
    this.growerLocations.removeAt(index);
  }

  onSubmit(): void {
    if (this.routeForm.invalid || this.currentRouteId === null) {
      this.routeForm.markAllAsTouched();
      alert('Please fill out all required fields.');
      return;
    }

    const payload: CreateUpdateRouteDto = this.routeForm.value;

    this.routeService.updateRoute(this.currentRouteId, payload).subscribe({
      next: () => {
        alert('Route updated successfully!');
        this.router.navigate(['/r-review']);
      },
      error: (err) => {
        alert(`Error updating route: ${err.message}`);
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/r-review']);
  }
}