// ==================================================
// Filename: r-create.component.ts (Final & Corrected)
// ==================================================
import { Component, OnInit, signal, inject, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CreateUpdateRoutePayload } from '../../../models/Logistic and Transport/RouteMaintain.model';
import { RouteService } from '../../../Services/LogisticAndTransport/RouteMaintain.service';
import { CollectorService } from '../../../Services/LogisticAndTransport/Collector.service';
import { CollectorResponse } from '../../../models/Logistic and Transport/CollectorManagement.model';
import { GoogleMapComponent, MapSelectionState, MapClickResult } from "../../google-map/google-map.component";

@Component({
  selector: 'app-r-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, GoogleMapComponent],
  templateUrl: './r-create.component.html',
  styleUrls: ['./r-create.component.scss']
})
export class RtCreateComponent implements OnInit, AfterViewInit {
  // --- Properties ---
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private routeService = inject(RouteService);
  private collectorService = inject(CollectorService);

  @ViewChild(GoogleMapComponent) googleMapComp!: GoogleMapComponent;
  @ViewChild('startLocationInput', { static: true }) startLocationInputRef!: ElementRef<HTMLInputElement>;
  @ViewChild('endLocationInput', { static: true }) endLocationInputRef!: ElementRef<HTMLInputElement>;

  routeForm: FormGroup;
  availableCollectors = signal<CollectorResponse[]>([]);
  isLoading = signal(true); // Starts as true to show "Loading collectors..."
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
      collectorId: [null, Validators.required]
    });
  }

  // ===== THIS IS THE CRITICAL LIFECYCLE HOOK =====
  /**
   * When the component initializes, it immediately calls the function to load collectors.
   */
  ngOnInit(): void {
    this.loadCollectors();
  }

  ngAfterViewInit(): void {
    if (this.googleMapComp) {
      this.googleMapComp.startLocationInput = this.startLocationInputRef.nativeElement;
      this.googleMapComp.endLocationInput = this.endLocationInputRef.nativeElement;
    }
  }

  // ===== HANDLERS FOR MAP AND FORM INTERACTION =====
  onMapStateChanged(newState: MapSelectionState): void { this.mapSelectionState.set(newState); }

  handleDirectionButtonClick(): void {
    if (!this.googleMapComp) return;
    this.mapSelectionState() === MapSelectionState.IDLE
      ? this.googleMapComp.startDirectionSelection()
      : this.googleMapComp.resetSelection();
  }

  onStartLocationSelected(location: MapClickResult): void {
    this.routeForm.get('startLocation')?.patchValue({ address: location.address, latitude: location.lat, longitude: location.lng });
  }

  onEndLocationSelected(location: MapClickResult): void {
    this.routeForm.get('endLocation')?.patchValue({ address: location.address, latitude: location.lat, longitude: location.lng });
  }

  onRouteInfoUpdated(info: { distance: number; duration: string }): void {
    this.routeForm.patchValue({ distance: parseFloat(info.distance.toFixed(2)) });
    this.routeForm.get('distance')?.enable();
    this.estimatedDuration.set(info.duration);
  }

  // ===== THIS METHOD FETCHES AND SETS THE COLLECTOR DATA =====
  /**
   * Subscribes to the CollectorService to get the list of available collectors.
   * On success, it populates the 'availableCollectors' signal.
   * Finally, it sets 'isLoading' to false so the UI can switch from the loading message to the dropdown.
   */
  private loadCollectors(): void {
    this.collectorService.getAllCollectors().subscribe({
      next: (collectors) => {
        this.availableCollectors.set(collectors);
      },
      error: (err) => {
        console.error('Failed to load collectors:', err);
        alert('Could not load the list of collectors. Please try again later.');
      }
    }).add(() => {
      this.isLoading.set(false); // This runs on both success and error
    });
  }

  // ===== FORM SUBMISSION AND NAVIGATION =====
  onSubmit(): void {
    this.routeForm.get('distance')?.enable();
    if (this.routeForm.invalid) {
      alert('Please fill all required fields correctly.');
      this.routeForm.markAllAsTouched();
      return;
    }
    const payload: CreateUpdateRoutePayload = this.routeForm.getRawValue();
    console.log("--- SUBMITTING FINAL PAYLOAD ---", JSON.stringify(payload, null, 2));

    this.routeService.createRoute(payload).subscribe({
      next: () => {
        alert('Route created successfully!');
        this.router.navigate(['/transportdashboard/r-review']);
      },
      error: (err) => alert(`Error creating route: ${err.error?.title || 'An unknown error occurred.'}`)
    });
  }

  onCancel(): void { this.router.navigate(['/transportdashboard/r-review']); }
}