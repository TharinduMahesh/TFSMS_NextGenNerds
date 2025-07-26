import { Component, OnInit, inject, signal, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { RouteService } from '../../../Services/LogisticAndTransport/RouteMaintain.service';
import { CreateUpdateRoutePayload, RtList } from '../../../models/Logistic and Transport/RouteMaintain.model';
import { CollectorService } from '../../../Services/LogisticAndTransport/Collector.service';
import { CollectorResponse } from '../../../models/Logistic and Transport/CollectorManagement.model';

@Component({
  selector: 'app-r-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './r-edit.component.html',
  styleUrls: ['./r-edit.component.scss']
})
export class RtEditComponent implements OnInit {
  // --- Component Inputs and Outputs ---
  @Input() routeId: number | null | undefined = null;
  @Output() save = new EventEmitter<CreateUpdateRoutePayload>();
  @Output() close = new EventEmitter<void>();

  // --- Injected Services ---
  private fb = inject(FormBuilder);
  private routeService = inject(RouteService);
  private collectorService = inject(CollectorService);

  // --- Form and State Properties ---
  routeForm: FormGroup;
  availableCollectors = signal<CollectorResponse[]>([]);
  isLoading = signal(true);
  error = signal<string | null>(null);

  constructor() {
    this.routeForm = this.fb.group({
      rName: ['', [Validators.required, Validators.maxLength(50)]],
      startLocation: ['', Validators.required],
      endLocation: ['', Validators.required],
      distance: [0, [Validators.required, Validators.min(0)]],
      collectorId: [null],
      growerLocations: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.loadInitialData();
  }

  private loadInitialData(): void {
    this.isLoading.set(true);
    this.error.set(null);

    // Fetch available collectors for the dropdown
    this.collectorService.getAllCollectors().subscribe({
      next: (collectors) => this.availableCollectors.set(collectors),
      error: (err) => this.error.set(`Failed to load collectors: ${err.message}`)
    });

    if (this.routeId) {
      this.routeService.getById(this.routeId).subscribe({
        next: (routeData) => {
          this.populateForm(routeData);
          this.isLoading.set(false);
        },
        error: (err) => {
          this.error.set(`Failed to load route data: ${err.message}`);
          this.isLoading.set(false);
        }
      });
    } else {
      this.error.set('No Route ID provided.');
      this.isLoading.set(false);
    }
  }

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
    });
    this.growerLocations.clear();
    route.growerLocations.forEach(loc => {
      this.growerLocations.push(this.fb.group({
        latitude: [loc.latitude, Validators.required],
        longitude: [loc.longitude, Validators.required],
        description: [loc.description]
      }));
    });
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
      alert('Form is invalid. Please correct the errors.');
      return;
    }
    const payload: CreateUpdateRoutePayload = this.routeForm.value;
    this.save.emit(payload);
  }

  onCancel(): void {
    this.close.emit();
  }
}