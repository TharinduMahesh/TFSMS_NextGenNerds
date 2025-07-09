import { Component, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Rview } from '../../../models/rview.model';
import { RService } from '../../../services/RouteMaintainService/RouteMaintain.service';

@Component({
  selector: 'app-rform',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './r-create.component.html',
  styleUrls: ['./r-create.component.scss']
})
export class RtCreateComponent implements OnInit {
  routeForm!: FormGroup; // definite assignment assertion

  successMessage = signal<string | null>(null);

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private rService: RService
  ) { }

  ngOnInit() {
    this.routeForm = this.fb.group({
      rName: ['', [Validators.required, Validators.maxLength(50)]],
      startLocation: ['', Validators.required],
      endLocation: ['', Validators.required],
      distance: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      collectorId: ['', [Validators.required, Validators.min(1)]],
      vehicleId: ['', [Validators.required, Validators.min(1)]],
      growerLocations: this.fb.array([])
    });
  }

  get growerLocations(): FormArray {
    return this.routeForm.get('growerLocations') as FormArray;
  }

  addWaypoint(location: string) {
    if (!location.trim()) return;

    this.growerLocations.push(this.fb.group({
      description: [location, Validators.required],
      latitude: [0],
      longitude: [0],
      RtListId: [0]
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

    const formValue: Rview = {
      ...this.routeForm.value,
      collectorId: Number(this.routeForm.value.collectorId),
      vehicleId: Number(this.routeForm.value.vehicleId),
      distance: Number(this.routeForm.value.distance),
      rId: 0 // Adjust if needed
    };

    this.rService.create(formValue).subscribe({
      next: () => {
        this.showSuccessMessage('Form submitted successfully!');
        this.router.navigate(['/r-review']);
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
