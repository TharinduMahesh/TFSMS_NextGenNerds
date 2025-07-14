import { Component, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
// ** FIX: Import the DTO as well **
import { CreateUpdateRouteDto } from '../../../models/Logistic and Transport/RouteMaintain.model';
import { RouteService } from '../../../services/RouteMaintainService/RouteMaintain.service';

@Component({
  selector: 'app-rform',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './r-create.component.html',
  styleUrls: ['./r-create.component.scss']
})
export class RtCreateComponent implements OnInit {
  routeForm!: FormGroup;
  successMessage = signal<string | null>(null);

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private routeService: RouteService
  ) { }

  ngOnInit() {
    this.routeForm = this.fb.group({
      rName: ['', [Validators.required, Validators.maxLength(50)]],
      startLocation: ['', Validators.required],
      endLocation: ['', Validators.required],
      // The form will handle a string, which is what the backend wants for now
      distance: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      collectorId: [null, [Validators.min(1)]], // Make optional fields nullable
      vehicleId: [null, [Validators.min(1)]],
      growerLocations: this.fb.array([])
    });
  }

  get growerLocations(): FormArray {
    return this.routeForm.get('growerLocations') as FormArray;
  }

  addWaypoint(location: string) {
    if (!location.trim()) return;

    // ** FIX: Create a form group that matches GrowerLocationDto **
    // It should NOT have RtListId.
    this.growerLocations.push(this.fb.group({
      description: [location, Validators.required],
      latitude: [0], // Default value, DTO requires it
      longitude: [0]  // Default value, DTO requires it
    }));
  }

  removeWaypoint(index: number) {
    this.growerLocations.removeAt(index);
  }

  showSuccessMessage(message: string) {
    this.successMessage.set(message);
    setTimeout(() => this.successMessage.set(null), 3000);
  }

  get currentSuccessMessage(): string | null {
    return this.successMessage();
  }

  onSubmit() {
    if (this.routeForm.invalid) {
      this.routeForm.markAllAsTouched();
      return;
    }

    // ** FIX: Build a payload that matches CreateUpdateRouteDto exactly **
    const payload: CreateUpdateRouteDto = {
      rName: this.routeForm.value.rName,
      startLocation: this.routeForm.value.startLocation,
      endLocation: this.routeForm.value.endLocation,
      // ** FIX: Do NOT convert distance to a number. The backend expects a string. **
      distance: this.routeForm.value.distance,
      collectorId: this.routeForm.value.collectorId ? Number(this.routeForm.value.collectorId) : null,
      vehicleId: this.routeForm.value.vehicleId ? Number(this.routeForm.value.vehicleId) : null,
      growerLocations: this.routeForm.value.growerLocations
    };

    this.routeService.createRoute(payload).subscribe({
      next: () => {
        this.showSuccessMessage('Route created successfully!');
        // Adding a small delay to let the user see the message
        setTimeout(() => this.router.navigate(['/r-review']), 1500);
      },
      error: (err) => {
        alert('Error creating route: ' + err.message);
      }
    });
  }

  onCancel() {
    this.router.navigate(['/r-review']);
  }
}