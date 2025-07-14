import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RyService } from '../../../services/RouteYieldMaintainService/RouteYieldMaintain.service';
import { YieldPayload } from '../../../models/Logistic and Transport/RouteYeildMaintain.model'; // Corrected import path
import { RouteService } from '../../../services/RouteMaintainService/RouteMaintain.service'; // Corrected import path
import { RtList } from '../../../models/Logistic and Transport/RouteMaintain.model';

@Component({
  selector: 'app-ry-create', // Corrected selector
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './ry-create.component.html',
  styleUrls: ['./ry-create.component.scss']
})
export class RyCreateComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private ryService = inject(RyService);
  private routeService = inject(RouteService);

  yieldForm: FormGroup;
  routes: RtList[] = [];
  isLoadingRoutes = true; // Add a loading state for the dropdown
  routeError: string | null = null; // To store any error messages

  constructor() {
    this.yieldForm = this.fb.group({
      rId: [null, Validators.required],
      collected_Yield: ['', [Validators.required, Validators.pattern('^[0-9.]+$')]],
      golden_Tips_Present: ['false', Validators.required]
    });
  }

  ngOnInit(): void {
    this.isLoadingRoutes = true;
    this.routeError = null;
    
    // ** THE FIX: Add error and complete handlers to the subscription **
    this.routeService.getAllRoutes().subscribe({
      next: (data) => {
        this.routes = data;
        console.log('Successfully fetched routes:', data); // For debugging
      },
      error: (err) => {
        // This will now catch any errors and display them
        this.routeError = `Failed to load routes. Please try again later. (Error: ${err.message})`;
        console.error('Error fetching routes:', err);
      },
      complete: () => {
        this.isLoadingRoutes = false;
      }
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
        alert('Yield created successfully!');
        this.router.navigate(['/ry-review']);
      },
      error: (err) => {
        alert(`Failed to create yield: ${err.message}`);
      }
    });
  }
}