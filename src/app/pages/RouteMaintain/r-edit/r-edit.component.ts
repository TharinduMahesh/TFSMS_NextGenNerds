// import { Component, OnInit, signal, inject, Input, Output, EventEmitter, ViewChild, ChangeDetectorRef } from '@angular/core';
// import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { CommonModule } from '@angular/common';
// import { HttpClientModule } from '@angular/common/http';
// import { forkJoin, of } from 'rxjs';
// import { catchError } from 'rxjs/operators';

// // Models
// import { CreateUpdateRoutePayload, RtList } from '../../../models/Logistic and Transport/RouteMaintain.model';
// import { CollectorResponse } from '../../../models/Logistic and Transport/CollectorManagement.model';

// // Services
// import { RouteService } from '../../../Services/LogisticAndTransport/RouteMaintain.service';
// import { CollectorService } from '../../../Services/LogisticAndTransport/Collector.service';

// // Child Component
// import { GoogleMapComponent, MapSelectionState, MapClickResult } from "../../google-map/google-map.component";

// @Component({
//   selector: 'app-r-edit',
//   standalone: true,
//   imports: [CommonModule, ReactiveFormsModule, HttpClientModule, GoogleMapComponent],
//   templateUrl: './r-edit.component.html',
//   styleUrls: ['./r-edit.component.scss']
// })
// export class RtEditComponent implements OnInit {
//   // --- Component Inputs & Outputs ---
//   @Input() routeId: number | null = null;
//   @Output() saveSuccess = new EventEmitter<void>();
//   @Output() close = new EventEmitter<void>();

//   // --- Injected Services & Dependencies ---
//   private fb = inject(FormBuilder);
//   private routeService = inject(RouteService);
//   private collectorService = inject(CollectorService);
//   private cdr = inject(ChangeDetectorRef);

//   // --- View Children & Component State ---
//   // @ViewChild and ngAfterViewInit are no longer needed for passing inputs.
//   @ViewChild(GoogleMapComponent) googleMapComp!: GoogleMapComponent;

//   routeForm: FormGroup;
//   availableCollectors = signal<CollectorResponse[]>([]);
//   isLoading = signal(true);
//   error = signal<string | null>(null);
//   estimatedDuration = signal<string | null>(null);
//   mapSelectionState = signal<MapSelectionState>(MapSelectionState.IDLE);
//   public readonly MapSelectionState = MapSelectionState;

//   constructor() {
//     this.routeForm = this.fb.group({
//       rName: ['', [Validators.required, Validators.maxLength(100)]],
//       startLocation: this.fb.group({
//         address: ['', Validators.required],
//         latitude: [0, Validators.required],
//         longitude: [0, Validators.required]
//       }),
//       endLocation: this.fb.group({
//         address: ['', Validators.required],
//         latitude: [0, Validators.required],
//         longitude: [0, Validators.required]
//       }),
//       distance: [null, [Validators.required, Validators.min(0.1)]],
//       collectorId: [null]
//     });
//   }

//   ngOnInit(): void {
//     if (!this.routeId) {
//       this.error.set('Error: No Route ID was provided.');
//       this.isLoading.set(false);
//       return;
//     }
//     this.loadInitialData();
//   }

//   private loadInitialData(): void {
//     this.isLoading.set(true);
//     this.error.set(null);

//     const routeData$ = this.routeService.getById(this.routeId!);
//     const collectors$ = this.collectorService.getAllCollectors();

//     forkJoin({ route: routeData$, collectors: collectors$ }).pipe(
//       catchError(err => {
//         this.error.set(`Failed to load data: ${err.error?.message || 'Unknown error'}`);
//         return of(null);
//       })
//     ).subscribe(result => {
//       if (result) {
//         this.availableCollectors.set(result.collectors);
//         this.populateForm(result.route);
//         if (result.route.distance) {
//            this.estimatedDuration.set(this.calculateEstimatedDuration(result.route.distance));
//         }
//       }
//       this.isLoading.set(false);
//       this.cdr.detectChanges();
//     });
//   }

//   private populateForm(route: RtList): void {
//     this.routeForm.patchValue({
//       rName: route.rName,
//       startLocation: { address: route.startLocationAddress, latitude: route.startLocationLatitude, longitude: route.startLocationLongitude },
//       endLocation: { address: route.endLocationAddress, latitude: route.endLocationLatitude, longitude: route.endLocationLongitude },
//       distance: route.distance,
//       collectorId: route.collectorId
//     });
//     this.routeForm.markAsPristine();
//   }

//   private calculateEstimatedDuration(distance: number): string {
//     const avgSpeed = 30; // km/h
//     const hours = distance / avgSpeed;
//     const totalMinutes = Math.round(hours * 60);
//     if (totalMinutes < 60) return `${totalMinutes} mins`;
//     const h = Math.floor(totalMinutes / 60);
//     const m = totalMinutes % 60;
//     return m > 0 ? `${h}h ${m}m` : `${h}h`;
//   }

//   onMapStateChanged(newState: MapSelectionState): void {
//     this.mapSelectionState.set(newState);
//   }

//   handleDirectionButtonClick(): void {
//     if (!this.googleMapComp) return;
//     this.mapSelectionState() === MapSelectionState.IDLE || this.mapSelectionState() === MapSelectionState.ROUTE_SHOWN
//       ? this.googleMapComp.startDirectionSelection()
//       : this.googleMapComp.resetSelection();
//   }

//   onStartLocationSelected(location: MapClickResult): void {
//     this.routeForm.get('startLocation')?.patchValue({ address: location.address, latitude: location.lat, longitude: location.lng });
//     this.routeForm.markAsDirty();
//   }

//   onEndLocationSelected(location: MapClickResult): void {
//     this.routeForm.get('endLocation')?.patchValue({ address: location.address, latitude: location.lat, longitude: location.lng });
//     this.routeForm.markAsDirty();
//   }

//   onRouteInfoUpdated(info: { distance: number; duration: string }): void {
//     this.routeForm.get('distance')?.setValue(parseFloat(info.distance.toFixed(2)));
//     this.estimatedDuration.set(info.duration);
//     this.routeForm.markAsDirty();
//   }

//   onSubmit(): void {
//     this.routeForm.get('distance')?.enable();
//     if (this.routeForm.invalid) {
//       alert('Please fill all required fields correctly.');
//       this.routeForm.markAllAsTouched();
//       return;
//     }
//     if (!this.routeForm.dirty) {
//       alert('No changes have been made to save.');
//       return;
//     }
//     if (!this.routeId) {
//       alert('Error: No route ID available for update.');
//       return;
//     }

//     const payload: CreateUpdateRoutePayload = this.routeForm.getRawValue();
//     this.routeService.updateRoute(this.routeId, payload).subscribe({
//       next: (updatedRoute) => {
//         alert(`Route "${updatedRoute.rName}" updated successfully!`);
//         this.saveSuccess.emit();
//         this.onCancel();
//       },
//       error: (err) => {
//         alert(`Error updating route: ${err.error?.title || 'An unknown error occurred.'}`);
//       }
//     });
//   }

//   onCancel(): void {
//     this.close.emit();
//   }
// }