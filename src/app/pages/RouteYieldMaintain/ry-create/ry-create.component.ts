import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RyService } from '../../../Services/LogisticAndTransport/RouteYieldMaintain.service';
import { YieldPayload } from '../../../models/Logistic and Transport/RouteYeildMaintain.model';
import { RouteService } from '../../../Services/LogisticAndTransport/RouteMaintain.service';
import { RtList } from '../../../models/Logistic and Transport/RouteMaintain.model';
import { signal } from '@angular/core';

@Component({
  selector: 'app-ry-create',
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
  routes = signal<RtList[]>([]);
  isLoadingRoutes = signal(true);
  routeError = signal<string | null>(null);

  constructor() {
    this.yieldForm = this.fb.group({
      rId: [null, Validators.required],
      collected_Yield: ['', Validators.required],
      golden_Tips_Present: ['No', Validators.required] // Default to 'No'
    });
  }

  ngOnInit(): void {
    this.isLoadingRoutes.set(true);
    this.routeService.getAllRoutes().subscribe({
      next: (data) => {
        this.routes.set(data);
        this.isLoadingRoutes.set(false);
      },
      error: (err) => {
        this.routeError.set(`Failed to load routes: ${err.message}`);
        this.isLoadingRoutes.set(false);
      }
    });
  }

  submitForm(): void {
    if (this.yieldForm.invalid) {
      alert('Please fill all required fields.');
      return;
    }
    const payload: YieldPayload = this.yieldForm.value;
    this.ryService.createYieldList(payload).subscribe({
      next: () => {
        alert('Yield created successfully!');
        this.router.navigate(['/ry-review']);
      },
      error: (err) => alert(`Error: ${err.message}`)
    });
  }
  
  // --- ADDED THIS METHOD ---
  onCancel(): void {
    this.router.navigate(['/ry-review']);
  }
}