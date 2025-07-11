import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RyService } from '../../../services/RouteYieldMaintainService/RouteYieldMaintain.service';
import { YieldPayload } from '../../../models/RouteYeildMaintain.model';

// --- ASSUMPTION: You must provide these to get a list of routes for the dropdown ---
import { RouteService } from '../../../services/RouteMaintainService//RouteMaintain.service'; // Adjust path if needed
import { RtList } from '../../../models/RouteMaintain.model'; // Adjust path if needed

@Component({
  selector: 'app-ryform',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './ry-create.component.html',
  styleUrls: ['./ry-create.component.scss']
})
export class RyCreateComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private ryService = inject(RyService);
  private routeService = inject(RouteService); // Service to get routes

  yieldForm: FormGroup;
  routes: RtList[] = []; // For the dropdown

  constructor() {
    // The form is updated to match the API payload, with your validations preserved.
    this.yieldForm = this.fb.group({
      rId: ['', Validators.required], // This is the route dropdown
      collected_Yield: ['', [Validators.required, Validators.min(0)]],
      golden_Tips_Present: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Load existing routes to populate the dropdown
    this.routeService.getAllRoutes().subscribe(data => {
      this.routes = data;
    });
  }

  submitForm() {
    if (this.yieldForm.invalid) {
      this.yieldForm.markAllAsTouched();
      alert('Please fix the errors in the form.');
      return;
    }

    const payload: YieldPayload = this.yieldForm.value;

    this.ryService.createYieldList(payload).subscribe({
      next: () => {
        alert('Form submitted successfully!');
        this.router.navigate(['/ry-review']); // Go back to the list
      },
      error: (err) => {
        alert('Failed to submit form. See console for details.');
        console.error(err);
      }
    });
  }
}