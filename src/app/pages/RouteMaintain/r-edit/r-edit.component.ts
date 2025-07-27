// ==================================================
// Filename: r-edit.component.ts (Final & Corrected)
// ==================================================
import { Component, OnInit, signal, inject, Input, Output, EventEmitter, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

// Models
import { CreateUpdateRoutePayload, RtList } from '../../../models/Logistic and Transport/RouteMaintain.model';
import { CollectorResponse } from '../../../models/Logistic and Transport/CollectorManagement.model';

// Services
import { RouteService } from '../../../Services/LogisticAndTransport/RouteMaintain.service';
import { CollectorService } from '../../../Services/LogisticAndTransport/Collector.service';

// Child Component
import { GoogleMapComponent, MapSelectionState, MapClickResult } from "../../google-map/google-map.component";

@Component({
  selector: 'app-r-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, GoogleMapComponent],
  templateUrl: './r-edit.component.html',
  styleUrls: ['./r-edit.component.scss']
})
export class RtEditComponent implements OnInit, AfterViewInit {
  // --- Component Inputs & Outputs ---
  @Input() routeId: number | null = null;
  @Output() save = new EventEmitter<void>(); // Changed from saveSuccess to save
  @Output() saveSuccess = new EventEmitter<void>(); // Keep both for compatibility
  @Output() close = new EventEmitter<void>();

  // --- Injected Services & Dependencies ---
  private fb = inject(FormBuilder);
  private routeService = inject(RouteService);
  private collectorService = inject(CollectorService);

  // --- View Children & Component State ---
  @ViewChild(GoogleMapComponent) googleMapComp!: GoogleMapComponent;
  @ViewChild('startLocationInput', { static: true }) startLocationInputRef!: ElementRef<HTMLInputElement>;
  @ViewChild('endLocationInput', { static: true }) endLocationInputRef!: ElementRef<HTMLInputElement>;

  routeForm: FormGroup;
  availableCollectors = signal<CollectorResponse[]>([]);
  isLoading = signal(true); // Overall loading state
  isCollectorLoading = signal(false); // Separate collector loading state
  error = signal<string | null>(null);
  estimatedDuration = signal<string | null>(null);
  mapSelectionState = signal<MapSelectionState>(MapSelectionState.IDLE);
  public readonly MapSelectionState = MapSelectionState;

  constructor() {
    this.routeForm = this.fb.group({
      rName: ['', [Validators.required, Validators.maxLength(100)]],
      startLocation: this.fb.group({
        address: ['', Validators.required],
        latitude: [0],
        longitude: [0]
      }),
      endLocation: this.fb.group({
        address: ['', Validators.required],
        latitude: [0],
        longitude: [0]
      }),
      distance: [{ value: null, disabled: true }, [Validators.required, Validators.min(0.1)]],
      collectorId: [null] // Not required for edit - can be unassigned
    });
  }

  // ===== LIFECYCLE HOOKS =====
  ngOnInit(): void {
    console.log('RtEditComponent ngOnInit - routeId:', this.routeId);
    if (!this.routeId) {
      this.error.set('Error: No Route ID was provided to the edit component.');
      this.isLoading.set(false);
      return;
    }
    this.loadInitialData();
  }

  ngAfterViewInit(): void {
    console.log('RtEditComponent ngAfterViewInit');
    if (this.googleMapComp) {
      this.googleMapComp.startLocationInput = this.startLocationInputRef.nativeElement;
      this.googleMapComp.endLocationInput = this.endLocationInputRef.nativeElement;
      console.log('Google Map component configured');
    }
    
    // If still loading after view init, retry data loading
    setTimeout(() => {
      if (this.isLoading() && this.routeId) {
        console.log('Retrying data load after view init delay');
        this.loadInitialData();
      }
    }, 100);
  }

  // ===== DATA LOADING =====
  /**
   * Loads both route data and collectors data simultaneously using forkJoin
   */
  private loadInitialData(): void {
    console.log('Loading initial data for routeId:', this.routeId);
    this.isCollectorLoading.set(true);
    this.isLoading.set(true);
    this.error.set(null);
    
    const routeData$ = this.routeService.getById(this.routeId!);
    const collectors$ = this.collectorService.getAllCollectors();

    forkJoin({ route: routeData$, collectors: collectors$ }).pipe(
      catchError(err => {
        console.error('Failed to load initial data:', err);
        this.error.set(`Failed to load data: ${err.error?.message || err.message || 'Unknown error occurred'}`);
        return of(null);
      })
    ).subscribe({
      next: (result) => {
        console.log('Data loaded successfully:', result);
        if (result) {
          // Set collectors first
          this.availableCollectors.set(result.collectors);
          console.log('Available collectors:', result.collectors);
          
          // Then populate the form with route data
          this.populateForm(result.route);
          console.log('Form populated with route:', result.route);
          
          // Set estimated duration if distance exists
          if (result.route.distance) {
            this.estimatedDuration.set(this.calculateEstimatedDuration(result.route.distance));
          }
        }
      },
      error: (err) => {
        console.error('Subscription error:', err);
        this.error.set(`Failed to load data: ${err.message || 'Unknown error occurred'}`);
      },
      complete: () => {
        // Always set loading states to false
        console.log('Data loading completed');
        this.isLoading.set(false);
        this.isCollectorLoading.set(false);
      }
    });
  }

  /**
   * Populates the form with the loaded route data
   */
  private populateForm(route: RtList): void {
    console.log('Populating form with route data:', route);
    
    try {
      this.routeForm.patchValue({
        rName: route.rName || '',
        startLocation: {
          address: route.startLocationAddress || '',
          latitude: route.startLocationLatitude || 0,
          longitude: route.startLocationLongitude || 0
        },
        endLocation: {
          address: route.endLocationAddress || '',
          latitude: route.endLocationLatitude || 0,
          longitude: route.endLocationLongitude || 0
        },
        distance: route.distance || null,
        collectorId: route.collectorId || null
      });
      
      // Enable the distance field after populating
      this.routeForm.get('distance')?.enable();
      
      // Mark form as pristine after initial population
      this.routeForm.markAsPristine();
      
      console.log('Form populated successfully. Form value:', this.routeForm.value);
      console.log('Form valid:', this.routeForm.valid);
    } catch (error) {
      console.error('Error populating form:', error);
      this.error.set('Error populating form with route data');
    }
  }

  /**
   * Simple duration calculation (same logic as in create component)
   */
  private calculateEstimatedDuration(distance: number): string {
    const avgSpeed = 30; // km/h average speed
    const hours = distance / avgSpeed;
    const totalMinutes = Math.round(hours * 60);
    
    if (totalMinutes < 60) {
      return `${totalMinutes} mins`;
    } else {
      const h = Math.floor(totalMinutes / 60);
      const m = totalMinutes % 60;
      return m > 0 ? `${h}h ${m}m` : `${h}h`;
    }
  }

  // ===== MAP AND UI EVENT HANDLERS =====
  onMapStateChanged(newState: MapSelectionState): void { 
    this.mapSelectionState.set(newState); 
  }

  handleDirectionButtonClick(): void {
    if (!this.googleMapComp) return;
    this.mapSelectionState() === MapSelectionState.IDLE
      ? this.googleMapComp.startDirectionSelection()
      : this.googleMapComp.resetSelection();
  }

  onStartLocationSelected(location: MapClickResult): void {
    this.routeForm.get('startLocation')?.patchValue({ 
      address: location.address, 
      latitude: location.lat, 
      longitude: location.lng 
    });
    this.routeForm.markAsDirty();
  }

  onEndLocationSelected(location: MapClickResult): void {
    this.routeForm.get('endLocation')?.patchValue({ 
      address: location.address, 
      latitude: location.lat, 
      longitude: location.lng 
    });
    this.routeForm.markAsDirty();
  }

  onRouteInfoUpdated(info: { distance: number; duration: string }): void {
    this.routeForm.patchValue({ distance: parseFloat(info.distance.toFixed(2)) });
    this.routeForm.get('distance')?.enable();
    this.estimatedDuration.set(info.duration);
    this.routeForm.markAsDirty();
  }

  // ===== FORM SUBMISSION AND NAVIGATION =====
  onSubmit(): void {
    // Re-enable distance field before validation
    this.routeForm.get('distance')?.enable();
    
    if (this.routeForm.invalid) {
      alert('Please fill all required fields correctly.');
      this.routeForm.markAllAsTouched();
      return;
    }

    if (!this.routeForm.dirty) {
      alert('No changes have been made to save.');
      return;
    }

    if (!this.routeId) {
      alert('Error: No route ID available for update.');
      return;
    }

    const payload: CreateUpdateRoutePayload = this.routeForm.getRawValue();
    console.log("--- SUBMITTING UPDATE PAYLOAD ---", JSON.stringify(payload, null, 2));

    this.routeService.updateRoute(this.routeId, payload).subscribe({
      next: (updatedRoute) => {
        alert(`Route "${updatedRoute.rName}" updated successfully!`);
        this.save.emit(); // Emit to parent component
        this.saveSuccess.emit(); // Keep for compatibility
        this.onCancel();
      },
      error: (err) => {
        console.error('Error updating route:', err);
        alert(`Error updating route: ${err.error?.title || err.message || 'An unknown error occurred.'}`);
      }
    });
  }

  onCancel(): void {
    this.close.emit();
  }
}