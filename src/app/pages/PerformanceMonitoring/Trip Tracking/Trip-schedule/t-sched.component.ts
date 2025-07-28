// import { Component, OnInit, signal, inject } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { Router } from '@angular/router';
// import { forkJoin } from 'rxjs';

// // Child Component
// import { GoogleMapComponent } from '../../../google-map/google-map.component';

// // Models
// import { ScheduleTripPayload } from '../../../../models/Logistic and Transport/TripTracking.model';
// import { RtList } from '../../../../models/Logistic and Transport/RouteMaintain.model';
// import { CollectorResponse } from '../../../../models/Logistic and Transport/CollectorManagement.model';
// import { GrowerMapPoint, PendingGrowerOrder } from '../../../../models/Logistic and Transport/Grower.model';

// // Services
// import { TransportReportService } from '../../../../Services/LogisticAndTransport/TransportReport.service';
// import { RouteService } from '../../../../Services/LogisticAndTransport/RouteMaintain.service';
// import { CollectorService } from '../../../../Services/LogisticAndTransport/Collector.service';
// import { GrowerService } from '../../../../Services/LogisticAndTransport/Grower.service'; // ADD THIS IMPORT

// @Component({
//   selector: 'app-trip-schedule',
//   standalone: true,
//   imports: [CommonModule, ReactiveFormsModule, GoogleMapComponent],
//   templateUrl: './t-sched.component.html',
//   styleUrls: ['./t-sched.component.scss']
// })
// export class TripScheduleComponent implements OnInit {
//   private fb = inject(FormBuilder);
//   private router = inject(Router);
//   private transportReportService = inject(TransportReportService);
//   private routeService = inject(RouteService);
//   private collectorService = inject(CollectorService);
//   private growerService = inject(GrowerService); // ADD THIS INJECTION

//   tripForm: FormGroup;
//   routes = signal<RtList[]>([]);
//   collectors = signal<CollectorResponse[]>([]);
  
//   selectedRoute = signal<RtList | null>(null);
//   assignedCollectorName = signal<string>('No route selected');
  
//   // Additional signals for map display
//   startLocationForMap = signal<string | null>(null);
//   endLocationForMap = signal<string | null>(null);
//   estimatedDuration = signal<string | null>(null);

//   // Grower-related signals
//   growerLocations = signal<GrowerMapPoint[]>([]);
//   pendingOrders = signal<PendingGrowerOrder[]>([]);
//   showGrowerLocations = signal<boolean>(false);
//   growerLoadingState = signal<boolean>(false);
//   growerError = signal<string | null>(null);

//   isLoading = signal(true); 
//   error = signal<string | null>(null);

//   constructor() {
//     this.tripForm = this.fb.group({
//       routeId: [null, Validators.required],
//       collectorId: [{ value: null, disabled: true }, Validators.required],
//       scheduledDeparture: ['', Validators.required],
//       scheduledArrival: ['', Validators.required] 
//     });
//   }

//   ngOnInit(): void {
//     this.isLoading.set(true); 
//     this.error.set(null);

//     // CLEAR any previous grower errors on init
//     this.growerError.set(null);
//     this.showGrowerLocations.set(false);
//     this.growerLoadingState.set(false);

//     console.log('=== INITIAL SIGNAL VALUES (CLEARED) ===');
//     console.log('showGrowerLocations:', this.showGrowerLocations());
//     console.log('growerLoadingState:', this.growerLoadingState());
//     console.log('growerLocations length:', this.growerLocations().length);
//     console.log('growerError:', this.growerError());

//     forkJoin({
//       routes: this.routeService.getAllRoutes(),
//       collectors: this.collectorService.getAllCollectors()
//     }).subscribe({
//       next: ({ routes, collectors }) => {
//         console.log('Loaded routes:', routes);
//         console.log('Loaded collectors:', collectors);
        
//         this.routes.set(routes);
//         this.collectors.set(collectors);
//         this.isLoading.set(false);
        
//         this.setupRouteChangeListener();
//       },
//       error: (err) => {
//         this.error.set('Failed to load required data: ' + err.message);
//         this.isLoading.set(false);
//       }
//     });
//   }

//   private setupRouteChangeListener(): void {
//     this.tripForm.get('routeId')?.valueChanges.subscribe(selectedId => {
//       console.log('Route ID changed:', selectedId);
//       console.log('Available routes:', this.routes());
      
//       const collectorControl = this.tripForm.get('collectorId');
//       const routeId = selectedId ? Number(selectedId) : null;
//       const route = this.routes().find(r => r.rId === routeId) || null;
      
//       console.log('Selected route:', route);
//       this.selectedRoute.set(route);

//       if (route) {
//         this.startLocationForMap.set(route.startLocationAddress || null);
//         this.endLocationForMap.set(route.endLocationAddress || null);
        
//         console.log('Map locations set:', {
//           start: route.startLocationAddress,
//           end: route.endLocationAddress
//         });
        
//         if (route.distance) {
//           this.estimatedDuration.set(this.calculateEstimatedDuration(route.distance));
//         } else {
//           this.estimatedDuration.set(null);
//         }

//         if (route.collectorId) {
//           const assignedCollector = this.collectors().find(c => c.collectorId === route.collectorId);
          
//           collectorControl?.patchValue(route.collectorId);
//           collectorControl?.disable();
          
//           if (assignedCollector) {
//             const displayName = `${assignedCollector.name}${assignedCollector.vehicleLicensePlate ? ` (${assignedCollector.vehicleLicensePlate})` : ' (No Vehicle)'}`;
//             this.assignedCollectorName.set(displayName);
//           } else {
//             this.assignedCollectorName.set('Assigned collector not found');
//           }
//         } else {
//           collectorControl?.patchValue(null);
//           collectorControl?.disable();
//           this.assignedCollectorName.set('No collector assigned to this route');
//         }
//       } else {
//         this.startLocationForMap.set(null);
//         this.endLocationForMap.set(null);
//         this.estimatedDuration.set(null);
//         collectorControl?.patchValue(null);
//         collectorControl?.disable();
//         this.assignedCollectorName.set('No route selected');
//       }
//     });
//   }

//   private calculateEstimatedDuration(distance: number): string {
//     const avgSpeed = 30;
//     const hours = distance / avgSpeed;
//     const totalMinutes = Math.round(hours * 60);
//     if (totalMinutes < 60) return `${totalMinutes} mins`;
//     const h = Math.floor(totalMinutes / 60);
//     const m = totalMinutes % 60;
//     return m > 0 ? `${h}h ${m}m` : `${h}h`;
//   }

//   onSubmit(): void {
//     const collectorControl = this.tripForm.get('collectorId');
//     collectorControl?.enable();

//     if (this.tripForm.invalid) {
//       alert('Please fill out all fields before submitting.');
//       this.tripForm.markAllAsTouched();
//       collectorControl?.disable();
//       return;
//     }

//     if (!collectorControl?.value) {
//       alert('The selected route must have an assigned collector to schedule a trip.');
//       collectorControl?.disable();
//       return;
//     }

//     const payload: ScheduleTripPayload = this.tripForm.getRawValue();

//     this.transportReportService.scheduleTrip(payload).subscribe({
//       next: () => {
//         alert('Trip scheduled successfully!');
//         this.router.navigate(['/transportdashboard/trip-review']);
//       },
//       error: (err) => {
//         console.error('Error scheduling trip:', err);
//         alert(`Error scheduling trip: ${err.error?.title || err.message}`);
//         collectorControl?.disable();
//       }
//     });
//   }

//   onCancel(): void {
//     this.router.navigate(['/transportdashboard/trip-review']);
//   }

//   // FIXED: Grower functionality using GrowerService
//   async findGrowers(): Promise<void> {
//     console.log('=== FIND GROWERS CALLED ===');
    
//     // Clear any previous errors
//     this.growerError.set(null);
//     this.growerLoadingState.set(true);

//     try {
//       console.log('Making API call via GrowerService...');
      
//       this.growerService.getPendingGrowerLocations().subscribe({
//         next: (growers) => {
//           console.log('API Response received:', growers);
          
//           if (growers && growers.length > 0) {
//             const validGrowers = this.growerService.formatForMap(growers);
//             console.log('Valid growers after formatting:', validGrowers);
            
//             this.growerLocations.set(validGrowers);
//             this.showGrowerLocations.set(true);
//             this.growerError.set(null);
            
//             console.log('After success - showGrowerLocations:', this.showGrowerLocations());
//             console.log('After success - growerLocations length:', this.growerLocations().length);
            
//           } else {
//             console.log('No growers found in response');
//             this.growerError.set('No growers with pending orders found.');
//             this.growerLocations.set([]);
//             this.showGrowerLocations.set(false);
//           }
//         },
//         error: (error) => {
//           console.error('API Error Details:', {
//             message: error.message,
//             error: error,
//             url: 'https://localhost:7146/api/grower/pending-locations'
//           });
          
//           // More specific error messages
//           let errorMessage = 'Failed to load grower locations';
//           if (error.message.includes('Failed to fetch')) {
//             errorMessage = 'Cannot connect to server. Please check if the backend is running on https://localhost:7146';
//           } else if (error.message.includes('404')) {
//             errorMessage = 'Grower API endpoint not found. Please check if the GrowerController is implemented.';
//           } else if (error.message.includes('CORS')) {
//             errorMessage = 'CORS error. Please check backend CORS configuration.';
//           } else {
//             errorMessage = error.message;
//           }
          
//           this.growerError.set(errorMessage);
//           this.growerLocations.set([]);
//           this.showGrowerLocations.set(false);
//         },
//         complete: () => {
//           this.growerLoadingState.set(false);
//           console.log('API call completed');
//         }
//       });

//     } catch (error: any) {
//       console.error('Unexpected error in findGrowers:', error);
//       this.growerError.set('An unexpected error occurred while loading grower data.');
//       this.growerLocations.set([]);
//       this.showGrowerLocations.set(false);
//       this.growerLoadingState.set(false);
//     }
//   }

//   hideGrowerLocations(): void {
//     this.showGrowerLocations.set(false);
//     this.growerLocations.set([]);
//     this.growerError.set(null);
//   }

//   // FIXED: Use GrowerService instead of direct HTTP
//   async loadPendingOrdersDetails(): Promise<void> {
//     try {
//       this.growerService.getPendingOrdersWithLocations().subscribe({
//         next: (orders) => {
//           this.pendingOrders.set(orders);
//           console.log('Pending orders loaded:', orders);
//         },
//         error: (error) => {
//           console.error('Error fetching pending orders:', error);
//         }
//       });
//     } catch (error: any) {
//       console.error('Error in loadPendingOrdersDetails:', error);
//     }
//   }

//   // Add method to clear grower error
//   clearGrowerError(): void {
//     this.growerError.set(null);
//     console.log('Grower error cleared');
//   }

//   // Add method to test backend connectivity
//   async testBackendConnection(): Promise<void> {
//     console.log('=== TESTING BACKEND CONNECTION ===');
    
//     try {
//       const response = await fetch('https://localhost:7146/api/grower/pending-locations', {
//         method: 'GET',
//         headers: {
//           'Accept': 'application/json',
//           'Content-Type': 'application/json'
//         }
//       });
      
//       console.log('Backend response status:', response.status);
//       console.log('Backend response ok:', response.ok);
      
//       if (response.ok) {
//         const data = await response.json();
//         console.log('Backend is working! Data:', data);
//         alert('Backend connection successful!');
//       } else {
//         console.error('Backend responded with error:', response.status, response.statusText);
//         alert(`Backend error: ${response.status} ${response.statusText}`);
//       }
      
//     } catch (error) {
//       console.error('Cannot connect to backend:', error);
//       alert('Cannot connect to backend. Make sure it\'s running on https://localhost:7146');
//     }
//   }
// }



// ==================================================
// Filename: t-sched.component.ts (Updated Logic)
// ==================================================
import { Component, OnInit, signal, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';

// Child Component & Models from it
import { GoogleMapComponent, SelectedGrower } from '../../../google-map/google-map.component';

// Models
import { ScheduleTripPayload } from '../../../../models/Logistic and Transport/TripTracking.model';
import { RtList } from '../../../../models/Logistic and Transport/RouteMaintain.model';
import { CollectorResponse } from '../../../../models/Logistic and Transport/CollectorManagement.model';
import { GrowerMapPoint } from '../../../../models/Logistic and Transport/Grower.model';

// Services
import { TransportReportService } from '../../../../Services/LogisticAndTransport/TransportReport.service';
import { RouteService } from '../../../../Services/LogisticAndTransport/RouteMaintain.service';
import { CollectorService } from '../../../../Services/LogisticAndTransport/Collector.service';
import { GrowerService } from '../../../../Services/LogisticAndTransport/Grower.service';

@Component({
  selector: 'app-trip-schedule',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, GoogleMapComponent],
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
  
  availableCollectors = signal<CollectorResponse[]>([]);

  routes = signal<RtList[]>([]);
  collectors = signal<CollectorResponse[]>([]);
  selectedRoute = signal<RtList | null>(null);
  assignedCollectorName = signal<string>('No route selected');
  startLocationForMap = signal<string | null>(null);
  endLocationForMap = signal<string | null>(null);
  estimatedDuration = signal<string | null>(null);

  // --- Grower-related Signals ---
  growerLocations = signal<GrowerMapPoint[]>([]);
  showGrowerLocations = signal<boolean>(false);
  growerLoadingState = signal<boolean>(false);
  growerError = signal<string | null>(null);
  
  // --- NEW Signals for Adding Growers ---
  isAddingGrowers = signal<boolean>(false);
  addedGrowers = signal<SelectedGrower[]>([]);

  // --- General State Signals ---
  isLoading = signal(true); 
  error = signal<string | null>(null);

  constructor() {
    this.tripForm = this.fb.group({
      routeId: [null, Validators.required],
      collectorId: [{ value: null, disabled: true }, Validators.required],
      scheduledDeparture: ['', Validators.required],
      scheduledArrival: ['', Validators.required] 
    });
  }

  ngOnInit(): void {
    // ... (existing ngOnInit logic is unchanged)
    this.isLoading.set(true); 
    this.error.set(null);
    this.growerError.set(null);
    this.showGrowerLocations.set(false);
    this.growerLoadingState.set(false);

    forkJoin({
      routes: this.routeService.getAllRoutes(),
      collectors: this.collectorService.getAllCollectors()
    }).subscribe({
      next: ({ routes, collectors }) => {
        this.routes.set(routes);
        this.collectors.set(collectors);
        this.isLoading.set(false);
        this.setupRouteChangeListener();
      },
      error: (err) => {
        this.error.set('Failed to load required data: ' + err.message);
        this.isLoading.set(false);
      }
    });
  }

  // ... (existing setupRouteChangeListener, calculateEstimatedDuration, onSubmit, onCancel are unchanged)
  private setupRouteChangeListener(): void {
    this.tripForm.get('routeId')?.valueChanges.subscribe(selectedIdAsString => {
      if (!selectedIdAsString) return;
      const selectedId = +selectedIdAsString;

      const collectorControl = this.tripForm.get('collectorId');
      const route = this.routes().find(r => r.rId === selectedId) || null;
      
      this.selectedRoute.set(route);

      if (route) {
        this.startLocationForMap.set(route.startLocationAddress || null);
        this.endLocationForMap.set(route.endLocationAddress || null);
        
        if (route.distance) this.estimatedDuration.set(this.calculateEstimatedDuration(route.distance));
        else this.estimatedDuration.set(null);

        if (route.collectorId) {
          const assignedCollector = this.collectors().find(c => c.collectorId === route.collectorId);
          collectorControl?.reset({ value: route.collectorId, disabled: true });
          this.assignedCollectorName.set(assignedCollector?.name || 'Unknown Collector');
        } else {
          collectorControl?.reset({ value: null, disabled: true });
          this.assignedCollectorName.set('No collector assigned to this route');
        }
      } else {
        // Reset all when no route is selected
        this.startLocationForMap.set(null);
        this.endLocationForMap.set(null);
        this.estimatedDuration.set(null);
        collectorControl?.reset({ value: null, disabled: true });
        this.assignedCollectorName.set('No route selected');
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
      alert('Please fill out all fields before submitting.');
      this.tripForm.markAllAsTouched();
      return;
    }
    if (!this.tripForm.get('collectorId')?.value) {
      alert('The selected route must have an assigned collector.');
      return;
    }

    // --- THIS IS THE KEY CHANGE ---
    // 1. Get the base data from the form.
    const formValue = this.tripForm.getRawValue();
    
    // 2. Extract the grower emails from the `addedGrowers` signal.
    const growerEmails = this.addedGrowers().map(g => g.growerEmail);

    // 3. Construct the final payload object.
    const payload: ScheduleTripPayload = {
      routeId: formValue.routeId,
      collectorId: formValue.collectorId,
      scheduledDeparture: formValue.scheduledDeparture,
      scheduledArrival: formValue.scheduledArrival,
      growerEmails: growerEmails // Add the list of emails
    };

    console.log('Submitting final payload:', payload);

    // 4. Send the complete payload to the service.
    this.transportReportService.scheduleTrip(payload).subscribe({
      next: () => {
        alert('Trip scheduled successfully!');
        this.router.navigate(['/transportdashboard/trip-review']);
      },
      error: (err) => alert(`Error scheduling trip: ${err.error?.title || err.message}`)
    });
  }

  onCancel(): void { this.router.navigate(['/transportdashboard/trip-review']); }

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
  
  // --- Grower Finding Logic (unchanged) ---
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

  // --- NEW Methods for Adding Growers ---

  /**
   * Puts the map into "ADD" mode.
   */
  onStartAddingGrowers(): void {
    if (!this.googleMapComp) return;
    this.isAddingGrowers.set(true);
    this.googleMapComp.startAddingGrowers();
  }

  /**
   * Called when a grower marker is clicked on the map while in "ADD" mode.
   */
  onGrowerAdded(grower: SelectedGrower): void {
    // Prevent adding the same grower twice
    const alreadyExists = this.addedGrowers().some(g => g.growerEmail === grower.growerEmail);
    if (!alreadyExists) {
      this.addedGrowers.update(currentGrowers => [...currentGrowers, grower]);
    }
  }

  /**
   * Removes a grower from the list of added growers.
   */
  removeAddedGrower(growerEmail: string): void {
    this.addedGrowers.update(currentGrowers => 
      currentGrowers.filter(g => g.growerEmail !== growerEmail)
    );
  }

  /**
   * Finalizes the process and takes the map out of "ADD" mode.
   */
  onFinishAddingGrowers(): void {
    if (!this.googleMapComp) return;
    this.isAddingGrowers.set(false);
    this.googleMapComp.finishAddingGrowers();
  }
}