// ==========================================================
// Filename: t-sched.component.ts (FINAL & CORRECTED)
// ==========================================================
import { Component, OnInit, signal, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';

// Child Component & Models
import { GoogleMapComponent, SelectedGrower } from '../../../google-map/google-map.component';
import { ScheduleTripPayload } from '../../../../models/Logistic and Transport/TripTracking.model';
import { RtList } from '../../../../models/Logistic and Transport/RouteMaintain.model';
import { CollectorResponse } from '../../../../models/Logistic and Transport/CollectorManagement.model';
import { GrowerMapPoint } from '../../../../models/Logistic and Transport/Grower.model';

// Services
import { TransportReportService } from '../../../../Services/LogisticAndTransport/TransportReport.service';
import { RouteService } from '../../../../Services/LogisticAndTransport/RouteMaintain.service';
import { CollectorService } from '../../../../Services/LogisticAndTransport/Collector.service';
import { GrowerService } from '../../../../Services/LogisticAndTransport/Grower.service';
import { TnLNavbarComponent } from "../../../../components/TnLNavbar/tnlnav.component";

@Component({
  selector: 'app-trip-schedule',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, GoogleMapComponent, TnLNavbarComponent],
  templateUrl: './t-sched.component.html',
  styleUrls: ['./t-sched.component.scss']
})
export class TripScheduleComponent implements OnInit {
  // --- Injections & Services ---
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private transportReportService = inject(TransportReportService);
  private routeService = inject(RouteService);
  private collectorService = inject(CollectorService);
  private growerService = inject(GrowerService);

  // --- Child Component Reference ---
  @ViewChild(GoogleMapComponent) googleMapComp!: GoogleMapComponent;

  // --- Form & Data Signals ---
  tripForm: FormGroup;
  routes = signal<RtList[]>([]);
  collectors = signal<CollectorResponse[]>([]); // This will hold all available collectors for the dropdown
  
  selectedRoute = signal<RtList | null>(null);
  startLocationForMap = signal<string | null>(null);
  endLocationForMap = signal<string | null>(null);
  estimatedDuration = signal<string | null>(null);

  // --- Grower-related Signals ---
  growerLocations = signal<GrowerMapPoint[]>([]);
  showGrowerLocations = signal<boolean>(false);
  growerLoadingState = signal<boolean>(false);
  growerError = signal<string | null>(null);
  
  isAddingGrowers = signal<boolean>(false);
  addedGrowers = signal<SelectedGrower[]>([]);

  // --- General State Signals ---
  isLoading = signal(true); 
  error = signal<string | null>(null);

  constructor() {
    this.tripForm = this.fb.group({
      routeId: [null, Validators.required],
      // The collectorId control is now enabled by default.
      collectorId: [null, Validators.required],
      scheduledDeparture: ['', Validators.required],
      scheduledArrival: ['', Validators.required] 
    });
  }

  ngOnInit(): void {
    this.isLoading.set(true); 
    this.error.set(null);
    this.growerError.set(null);
    this.showGrowerLocations.set(false);
    this.growerLoadingState.set(false);

    // Load all necessary data in parallel
    forkJoin({
      routes: this.routeService.getAllRoutes(),
      collectors: this.collectorService.getAllCollectors()
    }).subscribe({
      next: ({ routes, collectors }) => {
        this.routes.set(routes);
        this.collectors.set(collectors); // Populate the collectors signal
        this.isLoading.set(false);
        this.setupRouteChangeListener();
      },
      error: (err) => {
        this.error.set('Failed to load required data: ' + err.message);
        this.isLoading.set(false);
      }
    });
  }

  private setupRouteChangeListener(): void {
    this.tripForm.get('routeId')?.valueChanges.subscribe(selectedIdAsString => {
      if (!selectedIdAsString) return;
      const selectedId = +selectedIdAsString;

      const route = this.routes().find(r => r.rId === selectedId) || null;
      this.selectedRoute.set(route);

      if (route) {
        this.startLocationForMap.set(route.startLocationAddress || null);
        this.endLocationForMap.set(route.endLocationAddress || null);
        
        if (route.distance) this.estimatedDuration.set(this.calculateEstimatedDuration(route.distance));
        else this.estimatedDuration.set(null);

        // Use patchValue to suggest the collector but keep the field enabled.
        if (route.collectorId) {
          this.tripForm.patchValue({ collectorId: route.collectorId });
        } else {
          // If the route has no default collector, clear the selection.
          this.tripForm.patchValue({ collectorId: null });
        }
      } else {
        // Clear everything if no route is selected
        this.startLocationForMap.set(null);
        this.endLocationForMap.set(null);
        this.estimatedDuration.set(null);
        this.tripForm.patchValue({ collectorId: null });
      }
    });
  }

  private calculateEstimatedDuration(distance: number): string {
    const avgSpeed = 30;
    const hours = distance / avgSpeed;
    const totalMinutes = Math.round(hours * 60);
    if (totalMinutes < 60) return `${totalMinutes} mins`;
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  }

  onSubmit(): void {
    if (this.tripForm.invalid) {
      alert('Please fill out all required fields.');
      this.tripForm.markAllAsTouched();
      return;
    }

    const formValue = this.tripForm.value; // Use .value as all controls are enabled
    const growerEmails = this.addedGrowers().map(g => g.growerEmail);

    const payload: ScheduleTripPayload = {
      routeId: formValue.routeId,
      collectorId: formValue.collectorId,
      scheduledDeparture: formValue.scheduledDeparture,
      scheduledArrival: formValue.scheduledArrival,
      growerEmails: growerEmails
    };

    this.transportReportService.scheduleTrip(payload).subscribe({
      next: () => {
        alert('Trip scheduled successfully!');
        this.router.navigate(['/transportdashboard/trip-review']);
      },
      error: (err) => alert(`Error scheduling trip: ${err.error?.title || err.message}`)
    });
  }

  onCancel(): void { this.router.navigate(['/transportdashboard/trip-review']); }

  findGrowers(): void {
    this.growerError.set(null);
    this.growerLoadingState.set(true);
    this.growerService.getPendingGrowerLocations().subscribe({
      next: (growers) => {
        if (growers && growers.length > 0) {
          this.growerLocations.set(this.growerService.formatForMap(growers));
          this.showGrowerLocations.set(true);
        } else {
          this.growerError.set('No growers with pending orders found.');
        }
      },
      error: () => this.growerError.set('Failed to load grower locations.'),
      complete: () => this.growerLoadingState.set(false)
    });
  }

  hideGrowerLocations(): void {
    this.showGrowerLocations.set(false);
    this.growerLocations.set([]);
    this.growerError.set(null);
  }

  onStartAddingGrowers(): void {
    if (!this.googleMapComp) return;
    this.isAddingGrowers.set(true);
    this.googleMapComp.startAddingGrowers();
  }

  onGrowerAdded(grower: SelectedGrower): void {
    const alreadyExists = this.addedGrowers().some(g => g.growerEmail === grower.growerEmail);
    if (!alreadyExists) {
      this.addedGrowers.update(currentGrowers => [...currentGrowers, grower]);
    }
  }

  removeAddedGrower(growerEmail: string): void {
    this.addedGrowers.update(currentGrowers => 
      currentGrowers.filter(g => g.growerEmail !== growerEmail)
    );
  }

  onFinishAddingGrowers(): void {
    if (!this.googleMapComp) return;
    this.isAddingGrowers.set(false);
    this.googleMapComp.finishAddingGrowers();
  }
}