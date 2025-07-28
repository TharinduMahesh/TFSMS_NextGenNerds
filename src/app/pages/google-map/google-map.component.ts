// import { Component, Input, OnChanges, SimpleChanges, ElementRef, ViewChild, AfterViewInit, OnDestroy, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
// import { CommonModule } from '@angular/common';

// export enum MapSelectionState { IDLE, SELECTING_START, SELECTING_END, ROUTE_SHOWN }
// export interface MapClickResult { address: string; lat: number; lng: number; }

// declare global {
//   interface Window { google: any; googleMapsLoaded?: boolean; initGoogleMaps?: () => void; }
// }


// @Component({
//   selector: 'app-google-map',
//   standalone: true,
//   imports: [CommonModule],
//   template: `
//     <div #mapContainer class="map-container">
//       @if (isLoading) { <div class="loading-overlay"><p>{{ loadingMessage }}</p></div> }
//       @if (hasError) { <div class="error-overlay"><p>{{ errorMessage }}</p></div> }
//       @if (isMapReady()) { <div class="map-ready-indicator">Map Ready ✓</div> }
//       @switch (selectionState) {
//         @case (MapSelectionState.SELECTING_START) { <div class="click-instruction">Click on the map to select the START location</div> }
//         @case (MapSelectionState.SELECTING_END) { <div class="click-instruction">Click on the map to select the END location</div> }
//       }
//     </div>
//   `,
//   styles: [`
//     :host, .map-container { width: 100%; height: 100%; display: block; }
//     .map-container { border-radius: 12px; position: relative; overflow: hidden; background: #eafaf3; }
//     .loading-overlay, .error-overlay { display: flex; align-items: center; justify-content: center; height: 100%; position: absolute; top: 0; left: 0; right: 0; bottom: 0; z-index: 10; color: #333; }
//     .loading-overlay { background-color: #f0f9f4; }
//     .error-overlay { background-color: #ffebee; color: #c62828; }
//     .map-ready-indicator { position: absolute; top: 10px; left: 10px; background: rgba(255, 255, 255, 0.9); padding: 8px 12px; border-radius: 6px; font-size: 12px; z-index: 5; color: #28a745; font-weight: 600; border: 1px solid #d4edda; }
//     .click-instruction { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(40, 167, 69, 0.95); color: white; padding: 12px 20px; border-radius: 8px; font-size: 14px; font-weight: 600; z-index: 15; box-shadow: 0 4px 12px rgba(0,0,0,0.3); text-align: center; pointer-events: none; }
//   `]
// })
// export class GoogleMapComponent implements OnChanges, AfterViewInit, OnDestroy {
//   @Input() startLocation: string | null = '';
//   @Input() endLocation: string | null = '';
//   @Input() startLocationInput!: HTMLInputElement;
//   @Input() endLocationInput!: HTMLInputElement;
//   @Output() startLocationSelected = new EventEmitter<MapClickResult>();
//   @Output() endLocationSelected = new EventEmitter<MapClickResult>();
//   @Output() routeInfoUpdated = new EventEmitter<{ distance: number; duration: string }>();
//   @Output() selectionStateChanged = new EventEmitter<MapSelectionState>();
//   @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef;

  

//   public selectionState: MapSelectionState = MapSelectionState.IDLE;
//   public readonly MapSelectionState = MapSelectionState;
//   isLoading = true;
//   hasError = false;
//   loadingMessage = 'Loading map...';
//   errorMessage = '';

//   private map!: google.maps.Map;
//   private directionsService!: google.maps.DirectionsService;
//   private directionsRenderer!: google.maps.DirectionsRenderer;
//   private geocoder!: google.maps.Geocoder;

//   constructor(private cdr: ChangeDetectorRef) {}

//   ngAfterViewInit(): void {
//     if (window.googleMapsLoaded) {
//       this.initMap();
//     } else {
//       window.addEventListener('googleMapsLoaded', () => this.initMap());
//     }
//   }

//   ngOnDestroy(): void {
//     if (this.directionsRenderer) {
//       this.directionsRenderer.setMap(null);
//     }
//   }

//   ngOnChanges(changes: SimpleChanges): void {
//     // This hook is key. It will automatically trigger when the parent component loads data
//     // and the [startLocation] and [endLocation] inputs change.
//     if ((changes['startLocation'] || changes['endLocation']) && this.isMapReady()) {
//       this.calculateRoute();
//     }
//   }

//   private initMap(): void {
//     try {
//       this.map = new google.maps.Map(this.mapContainer.nativeElement, {
//         center: { lat: 7.8731, lng: 80.7718 }, // Centered on Sri Lanka
//         zoom: 8,
//         disableDefaultUI: true,
//         zoomControl: true,
//         fullscreenControl: true
//       });
//       this.geocoder = new google.maps.Geocoder();
//       this.directionsService = new google.maps.DirectionsService();
//       this.directionsRenderer = new google.maps.DirectionsRenderer({ map: this.map, suppressMarkers: false });

//       google.maps.event.addListenerOnce(this.map, 'idle', () => {
//         this.isLoading = false;
//         this.cdr.detectChanges();
//         this.initAutocomplete();
//         // After the map is ready, check if we already have locations to draw a route.
//         this.calculateRoute();
//       });

//       google.maps.event.addListener(this.map, 'click', (event: any) => this.handleMapClick(event));
//     } catch {
//       this.isLoading = false;
//       this.hasError = true;
//       this.errorMessage = 'Failed to initialize map.';
//       this.cdr.detectChanges();
//     }
//   }

//   private initAutocomplete(): void {
//     if (!this.startLocationInput || !this.endLocationInput) { return; }
//     const options = { componentRestrictions: { country: "lk" }, fields: ["formatted_address", "geometry"] };

//     const startAutocomplete = new google.maps.places.Autocomplete(this.startLocationInput, options);
//     startAutocomplete.addListener('place_changed', () => {
//       const place = startAutocomplete.getPlace();
//       if (place?.geometry?.location) {
//         this.startLocationSelected.emit({
//           address: place.formatted_address ?? '',
//           lat: place.geometry.location.lat(),
//           lng: place.geometry.location.lng()
//         });
//       }
//     });

//     const endAutocomplete = new google.maps.places.Autocomplete(this.endLocationInput, options);
//     endAutocomplete.addListener('place_changed', () => {
//       const place = endAutocomplete.getPlace();
//       if (place?.geometry?.location) {
//         this.endLocationSelected.emit({
//           address: place.formatted_address ?? '',
//           lat: place.geometry.location.lat(),
//           lng: place.geometry.location.lng()
//         });
//       }
//     });
//   }

//   private calculateRoute(): void {
//     if (!this.startLocation || !this.endLocation || !this.isMapReady()) {
//       this.clearRoute();
//       return;
//     }
//     this.isLoading = true;
//     this.cdr.detectChanges();

//     this.directionsService.route({
//       origin: this.startLocation,
//       destination: this.endLocation,
//       travelMode: google.maps.TravelMode.DRIVING
//     }, (result, status) => {
//       this.isLoading = false;
//       if (status === google.maps.DirectionsStatus.OK && result) {
//         this.directionsRenderer.setDirections(result);
//         this.map.fitBounds(result.routes[0].bounds);
//         this.setSelectionState(MapSelectionState.ROUTE_SHOWN);
//         const leg = result.routes[0].legs[0];
//         if (leg.distance && leg.duration) {
//           this.routeInfoUpdated.emit({ distance: leg.distance.value / 1000, duration: leg.duration.text });
//         }
//       } else {
//         this.resetSelection();
//         // Optionally show an error to the user that the route could not be calculated
//       }
//       this.cdr.detectChanges();
//     });
//   }

//   private setSelectionState(newState: MapSelectionState): void {
//     if (this.selectionState !== newState) {
//       this.selectionState = newState;
//       this.selectionStateChanged.emit(this.selectionState);
//       this.cdr.detectChanges();
//     }
//   }

//   public startDirectionSelection(): void {
//     this.resetSelection();
//     this.setSelectionState(MapSelectionState.SELECTING_START);
//     this.map.setOptions({ draggableCursor: 'crosshair' });
//   }

//   public resetSelection(): void {
//     this.clearRoute();
//     this.setSelectionState(MapSelectionState.IDLE);
//     this.map.setOptions({ draggableCursor: 'grab' });
//   }

//   private handleMapClick(event: google.maps.MapMouseEvent): void {
//     if ((this.selectionState !== MapSelectionState.SELECTING_START && this.selectionState !== MapSelectionState.SELECTING_END) || !event.latLng) { return; }
//     const lat = event.latLng.lat();
//     const lng = event.latLng.lng();
//     this.geocoder.geocode({ location: { lat, lng } }, (results, status) => {
//       if (status === 'OK' && results?.[0]) {
//         const result: MapClickResult = { address: results[0].formatted_address, lat, lng };
//         if (this.selectionState === MapSelectionState.SELECTING_START) {
//           this.startLocationSelected.emit(result);
//           this.setSelectionState(MapSelectionState.SELECTING_END);
//         } else if (this.selectionState === MapSelectionState.SELECTING_END) {
//           this.endLocationSelected.emit(result);
//           this.map.setOptions({ draggableCursor: 'grab' });
//         }
//       } else {
//         alert('Could not determine address for this location.');
//       }
//     });
//   }

//   public clearRoute(): void {
//     if (this.directionsRenderer) {
//       this.directionsRenderer.setDirections({ routes: [] } as any);
//     }
//   }

//   public isMapReady = (): boolean => !this.isLoading && !this.hasError && !!this.map;
// }


// import { Component, Input, OnChanges, SimpleChanges, ElementRef, ViewChild, AfterViewInit, OnDestroy, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { GrowerMapPoint } from '../../models/Logistic and Transport/Grower.model';

// export enum MapSelectionState { 
//   IDLE, 
//   SELECTING_START, 
//   SELECTING_END, 
//   ROUTE_SHOWN,
//   SELECTING_GROWERS
// }

// export interface MapClickResult { 
//   address: string; 
//   lat: number; 
//   lng: number; 
// }

// // Import this from your existing model file instead of defining here
// // import { GrowerMapPoint } from 'path/to/your/Grower.model';

// // For now, commenting out the interface - use your existing one
// // export interface GrowerMapPoint {
// //   growerEmail: string;
// //   latitude: number;
// //   longitude: number;
// //   address: string;
// //   pendingOrdersCount: number;
// //   totalSuperTea: number;
// //   totalGreenTea: number;
// // }

// export interface SelectedGrower {
//   growerEmail: string;
//   location: {
//     latitude: number;
//     longitude: number;
//     address: string;
//   };
// }

// declare global {
//   interface Window { 
//     google: any; 
//     googleMapsLoaded?: boolean; 
//     initGoogleMaps?: () => void; 
//   }
// }

// @Component({
//   selector: 'app-google-map',
//   standalone: true,
//   imports: [CommonModule],
//   template: `
//     <div #mapContainer class="map-container">
//       @if (isLoading) { 
//         <div class="loading-overlay">
//           <p>{{ loadingMessage }}</p>
//         </div> 
//       }
//       @if (hasError) { 
//         <div class="error-overlay">
//           <p>{{ errorMessage }}</p>
//         </div> 
//       }
//       @if (isMapReady()) { 
//         <div class="map-ready-indicator">Map Ready ✓</div> 
//       }
//       @switch (selectionState) {
//         @case (MapSelectionState.SELECTING_START) { 
//           <div class="click-instruction">Click on the map to select the START location</div> 
//         }
//         @case (MapSelectionState.SELECTING_END) { 
//           <div class="click-instruction">Click on the map to select the END location</div> 
//         }
//         @case (MapSelectionState.SELECTING_GROWERS) { 
//           <div class="click-instruction grower-instruction">
//             Click on grower markers to add them to your route
//             <div class="selected-count">Selected: {{ selectedGrowers.length }}</div>
//           </div> 
//         }
//       }
      
//       <!-- Grower Selection Controls -->
//       @if (selectionState === MapSelectionState.SELECTING_GROWERS) {
//         <div class="grower-controls">
//           <button 
//             class="control-btn done-btn"
//             (click)="finishGrowerSelection()"
//             [disabled]="selectedGrowers.length === 0">
//             Done ({{ selectedGrowers.length }})
//           </button>
//           <button 
//             class="control-btn cancel-btn"
//             (click)="cancelGrowerSelection()">
//             Cancel
//           </button>
//         </div>
//       }
//     </div>
//   `,
//   styles: [`
//     :host, .map-container { 
//       width: 100%; 
//       height: 100%; 
//       display: block; 
//     }
    
//     .map-container { 
//       border-radius: 12px; 
//       position: relative; 
//       overflow: hidden; 
//       background: #eafaf3; 
//     }
    
//     .loading-overlay, .error-overlay { 
//       display: flex; 
//       align-items: center; 
//       justify-content: center; 
//       height: 100%; 
//       position: absolute; 
//       top: 0; 
//       left: 0; 
//       right: 0; 
//       bottom: 0; 
//       z-index: 10; 
//       color: #333; 
//     }
    
//     .loading-overlay { 
//       background-color: #f0f9f4; 
//     }
    
//     .error-overlay { 
//       background-color: #ffebee; 
//       color: #c62828; 
//     }
    
//     .map-ready-indicator { 
//       position: absolute; 
//       top: 10px; 
//       left: 10px; 
//       background: rgba(255, 255, 255, 0.9); 
//       padding: 8px 12px; 
//       border-radius: 6px; 
//       font-size: 12px; 
//       z-index: 5; 
//       color: #28a745; 
//       font-weight: 600; 
//       border: 1px solid #d4edda; 
//     }
    
//     .click-instruction { 
//       position: absolute; 
//       top: 50%; 
//       left: 50%; 
//       transform: translate(-50%, -50%); 
//       background: rgba(40, 167, 69, 0.95); 
//       color: white; 
//       padding: 12px 20px; 
//       border-radius: 8px; 
//       font-size: 14px; 
//       font-weight: 600; 
//       z-index: 15; 
//       box-shadow: 0 4px 12px rgba(0,0,0,0.3); 
//       text-align: center; 
//       pointer-events: none; 
//     }
    
//     .grower-instruction {
//       background: rgba(76, 175, 80, 0.95);
//       padding: 16px 24px;
//       max-width: 300px;
//     }
    
//     .selected-count {
//       margin-top: 8px;
//       font-size: 12px;
//       opacity: 0.9;
//     }
    
//     .grower-controls {
//       position: absolute;
//       bottom: 20px;
//       left: 50%;
//       transform: translateX(-50%);
//       display: flex;
//       gap: 12px;
//       z-index: 15;
//     }
    
//     .control-btn {
//       padding: 10px 20px;
//       border: none;
//       border-radius: 6px;
//       font-weight: 600;
//       cursor: pointer;
//       transition: all 0.2s ease;
//       box-shadow: 0 2px 8px rgba(0,0,0,0.2);
//     }
    
//     .done-btn {
//       background: #28a745;
//       color: white;
//     }
    
//     .done-btn:hover:not(:disabled) {
//       background: #218838;
//       transform: translateY(-1px);
//     }
    
//     .done-btn:disabled {
//       background: #6c757d;
//       cursor: not-allowed;
//     }
    
//     .cancel-btn {
//       background: #dc3545;
//       color: white;
//     }
    
//     .cancel-btn:hover {
//       background: #c82333;
//       transform: translateY(-1px);
//     }
//   `]
// })
// export class GoogleMapComponent implements OnChanges, AfterViewInit, OnDestroy {
//   @Input() startLocation: string | null = '';
//   @Input() endLocation: string | null = '';
//   @Input() growerLocations: GrowerMapPoint[] = [];
//   @Input() startLocationInput!: HTMLInputElement;
//   @Input() endLocationInput!: HTMLInputElement;
  
//   @Output() startLocationSelected = new EventEmitter<MapClickResult>();
//   @Output() endLocationSelected = new EventEmitter<MapClickResult>();
//   @Output() routeInfoUpdated = new EventEmitter<{ distance: number; duration: string }>();
//   @Output() selectionStateChanged = new EventEmitter<MapSelectionState>();
//   @Output() growersSelected = new EventEmitter<SelectedGrower[]>();
  
//   @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef;

//   public selectionState: MapSelectionState = MapSelectionState.IDLE;
//   public readonly MapSelectionState = MapSelectionState;
//   public selectedGrowers: SelectedGrower[] = [];
  
//   isLoading = true;
//   hasError = false;
//   loadingMessage = 'Loading map...';
//   errorMessage = '';

//   private map!: google.maps.Map;
//   private directionsService!: google.maps.DirectionsService;
//   private directionsRenderer!: google.maps.DirectionsRenderer;
//   private geocoder!: google.maps.Geocoder;
//   private growerMarkers: google.maps.Marker[] = [];

//   constructor(private cdr: ChangeDetectorRef) {}

//   ngAfterViewInit(): void {
//     if (window.googleMapsLoaded) {
//       this.initMap();
//     } else {
//       window.addEventListener('googleMapsLoaded', () => this.initMap());
//     }
//   }

//   ngOnDestroy(): void {
//     this.clearGrowerMarkers();
//     if (this.directionsRenderer) {
//       this.directionsRenderer.setMap(null);
//     }
//   }

//   ngOnChanges(changes: SimpleChanges): void {
//     if (changes['growerLocations'] && this.isMapReady()) {
//       this.displayGrowerMarkers();
//     }
    
//     if ((changes['startLocation'] || changes['endLocation']) && this.isMapReady()) {
//       this.calculateRoute();
//     }
//   }

//   private initMap(): void {
//     try {
//       this.map = new google.maps.Map(this.mapContainer.nativeElement, {
//         center: { lat: 7.8731, lng: 80.7718 }, // Centered on Sri Lanka
//         zoom: 8,
//         disableDefaultUI: true,
//         zoomControl: true,
//         fullscreenControl: true
//       });
      
//       this.geocoder = new google.maps.Geocoder();
//       this.directionsService = new google.maps.DirectionsService();
//       this.directionsRenderer = new google.maps.DirectionsRenderer({ 
//         map: this.map, 
//         suppressMarkers: false 
//       });

//       google.maps.event.addListenerOnce(this.map, 'idle', () => {
//         this.isLoading = false;
//         this.cdr.detectChanges();
//         this.initAutocomplete();
//         this.calculateRoute();
//         this.displayGrowerMarkers();
//       });

//       google.maps.event.addListener(this.map, 'click', (event: any) => this.handleMapClick(event));
//     } catch {
//       this.isLoading = false;
//       this.hasError = true;
//       this.errorMessage = 'Failed to initialize map.';
//       this.cdr.detectChanges();
//     }
//   }

//   private initAutocomplete(): void {
//     if (!this.startLocationInput || !this.endLocationInput) { return; }
//     const options = { 
//       componentRestrictions: { country: "lk" }, 
//       fields: ["formatted_address", "geometry"] 
//     };

//     const startAutocomplete = new google.maps.places.Autocomplete(this.startLocationInput, options);
//     startAutocomplete.addListener('place_changed', () => {
//       const place = startAutocomplete.getPlace();
//       if (place?.geometry?.location) {
//         this.startLocationSelected.emit({
//           address: place.formatted_address ?? '',
//           lat: place.geometry.location.lat(),
//           lng: place.geometry.location.lng()
//         });
//       }
//     });

//     const endAutocomplete = new google.maps.places.Autocomplete(this.endLocationInput, options);
//     endAutocomplete.addListener('place_changed', () => {
//       const place = endAutocomplete.getPlace();
//       if (place?.geometry?.location) {
//         this.endLocationSelected.emit({
//           address: place.formatted_address ?? '',
//           lat: place.geometry.location.lat(),
//           lng: place.geometry.location.lng()
//         });
//       }
//     });
//   }

//   private calculateRoute(): void {
//     if (!this.startLocation || !this.endLocation || !this.isMapReady()) {
//       this.clearRoute();
//       return;
//     }
//     this.isLoading = true;
//     this.cdr.detectChanges();

//     this.directionsService.route({
//       origin: this.startLocation,
//       destination: this.endLocation,
//       travelMode: google.maps.TravelMode.DRIVING
//     }, (result, status) => {
//       this.isLoading = false;
//       if (status === google.maps.DirectionsStatus.OK && result) {
//         this.directionsRenderer.setDirections(result);
//         this.map.fitBounds(result.routes[0].bounds);
//         this.setSelectionState(MapSelectionState.ROUTE_SHOWN);
//         const leg = result.routes[0].legs[0];
//         if (leg.distance && leg.duration) {
//           this.routeInfoUpdated.emit({ 
//             distance: leg.distance.value / 1000, 
//             duration: leg.duration.text 
//           });
//         }
//       } else {
//         this.resetSelection();
//       }
//       this.cdr.detectChanges();
//     });
//   }

//   private clearGrowerMarkers(): void {
//     this.growerMarkers.forEach(marker => {
//       marker.setMap(null);
//     });
//     this.growerMarkers = [];
//   }

//   private displayGrowerMarkers(): void {
//     this.clearGrowerMarkers();

//     if (!this.map || !this.growerLocations.length) {
//       return;
//     }

//     this.growerLocations.forEach(grower => {
//       if (grower.latitude && grower.longitude) {
//         const isSelected = this.selectedGrowers.some(sg => sg.growerEmail === grower.growerEmail);
        
//         const marker = new google.maps.Marker({
//           position: { lat: grower.latitude, lng: grower.longitude },
//           map: this.map,
//           title: `${grower.growerEmail} - ${grower.pendingOrdersCount} pending orders`,
//           icon: {
//             url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
//               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//                 <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="${isSelected ? '#FF5722' : '#4CAF50'}"/>
//                 <circle cx="12" cy="9" r="2.5" fill="white"/>
//                 ${isSelected ? '<text x="12" y="11" text-anchor="middle" fill="#FF5722" font-size="8">✓</text>' : ''}
//               </svg>
//             `),
//             scaledSize: new google.maps.Size(30, 30),
//             anchor: new google.maps.Point(15, 30)
//           }
//         });

//         const infoWindow = new google.maps.InfoWindow({
//           content: `
//             <div style="padding: 8px; max-width: 250px;">
//               <h4 style="margin: 0 0 8px 0; color: ${isSelected ? '#FF5722' : '#4CAF50'};">
//                 ${grower.growerEmail}
//                 ${isSelected ? ' ✓ Selected' : ''}
//               </h4>
//               <p style="margin: 4px 0; font-size: 12px;"><strong>Address:</strong> ${grower.address}</p>
//               <p style="margin: 4px 0; font-size: 12px;"><strong>Pending Orders:</strong> ${grower.pendingOrdersCount}</p>
//               <p style="margin: 4px 0; font-size: 12px;"><strong>Super Tea:</strong> ${grower.totalSuperTea}kg</p>
//               <p style="margin: 4px 0; font-size: 12px;"><strong>Green Tea:</strong> ${grower.totalGreenTea}kg</p>
//               ${this.selectionState === MapSelectionState.SELECTING_GROWERS ? 
//                 `<button onclick="window.selectGrower('${grower.growerEmail}')" 
//                          style="margin-top: 8px; padding: 4px 8px; background: ${isSelected ? '#FF5722' : '#4CAF50'}; 
//                                 color: white; border: none; border-radius: 4px; cursor: pointer;">
//                    ${isSelected ? 'Remove' : 'Select'}
//                  </button>` : ''
//               }
//             </div>
//           `
//         });

//         marker.addListener('click', () => {
//           // Close any open info windows
//           this.growerMarkers.forEach(m => {
//             const iw = (m as any).infoWindow;
//             if (iw) iw.close();
//           });
          
//           if (this.selectionState === MapSelectionState.SELECTING_GROWERS) {
//             this.toggleGrowerSelection(grower);
//           } else {
//             infoWindow.open(this.map, marker);
//             (marker as any).infoWindow = infoWindow;
//           }
//         });

//         this.growerMarkers.push(marker);
//       }
//     });

//     // Set up global function for info window buttons
//     (window as any).selectGrower = (growerEmail: string) => {
//       const grower = this.growerLocations.find(g => g.growerEmail === growerEmail);
//       if (grower) {
//         this.toggleGrowerSelection(grower);
//       }
//     };

//     // Adjust map bounds to include grower locations if no route is selected
//     if (!this.directionsRenderer && this.growerLocations.length > 0) {
//       const bounds = new google.maps.LatLngBounds();
//       this.growerLocations.forEach(grower => {
//         if (grower.latitude && grower.longitude) {
//           bounds.extend({ lat: grower.latitude, lng: grower.longitude });
//         }
//       });
//       this.map.fitBounds(bounds);
//     }
//   }

//   private toggleGrowerSelection(grower: GrowerMapPoint): void {
//     const existingIndex = this.selectedGrowers.findIndex(sg => sg.growerEmail === grower.growerEmail);
    
//     if (existingIndex > -1) {
//       // Remove from selection
//       this.selectedGrowers.splice(existingIndex, 1);
//     } else {
//       // Add to selection
//       this.selectedGrowers.push({
//         growerEmail: grower.growerEmail,
//         location: {
//           latitude: grower.latitude,
//           longitude: grower.longitude,
//           address: grower.address
//         }
//       });
//     }
    
//     // Refresh markers to update visual state
//     this.displayGrowerMarkers();
//     this.cdr.detectChanges();
//   }

//   private setSelectionState(newState: MapSelectionState): void {
//     if (this.selectionState !== newState) {
//       this.selectionState = newState;
//       this.selectionStateChanged.emit(this.selectionState);
//       this.cdr.detectChanges();
//     }
//   }

//   private handleMapClick(event: google.maps.MapMouseEvent): void {
//     if ((this.selectionState !== MapSelectionState.SELECTING_START && 
//          this.selectionState !== MapSelectionState.SELECTING_END) || !event.latLng) { 
//       return; 
//     }
    
//     const lat = event.latLng.lat();
//     const lng = event.latLng.lng();
    
//     this.geocoder.geocode({ location: { lat, lng } }, (results, status) => {
//       if (status === 'OK' && results?.[0]) {
//         const result: MapClickResult = { 
//           address: results[0].formatted_address, 
//           lat, 
//           lng 
//         };
        
//         if (this.selectionState === MapSelectionState.SELECTING_START) {
//           this.startLocationSelected.emit(result);
//           this.setSelectionState(MapSelectionState.SELECTING_END);
//         } else if (this.selectionState === MapSelectionState.SELECTING_END) {
//           this.endLocationSelected.emit(result);
//           this.map.setOptions({ draggableCursor: 'grab' });
//         }
//       } else {
//         alert('Could not determine address for this location.');
//       }
//     });
//   }

//   // Public methods
//   public startDirectionSelection(): void {
//     this.resetSelection();
//     this.setSelectionState(MapSelectionState.SELECTING_START);
//     this.map.setOptions({ draggableCursor: 'crosshair' });
//   }

//   public startGrowerSelection(): void {
//     this.selectedGrowers = [];
//     this.setSelectionState(MapSelectionState.SELECTING_GROWERS);
//     this.displayGrowerMarkers(); // Refresh to show selection UI
//   }

//   public finishGrowerSelection(): void {
//     this.growersSelected.emit([...this.selectedGrowers]);
//     this.setSelectionState(MapSelectionState.IDLE);
//     this.displayGrowerMarkers(); // Refresh to hide selection UI
//   }

//   public cancelGrowerSelection(): void {
//     this.selectedGrowers = [];
//     this.setSelectionState(MapSelectionState.IDLE);
//     this.displayGrowerMarkers(); // Refresh to hide selection UI
//   }

//   public resetSelection(): void {
//     this.clearRoute();
//     this.selectedGrowers = [];
//     this.setSelectionState(MapSelectionState.IDLE);
//     this.map.setOptions({ draggableCursor: 'grab' });
//   }

//   public clearRoute(): void {
//     if (this.directionsRenderer) {
//       this.directionsRenderer.setDirections({ routes: [] } as any);
//     }
//   }

//   public isMapReady = (): boolean => !this.isLoading && !this.hasError && !!this.map;
// }



// import { Component, Input, OnChanges, SimpleChanges, ElementRef, ViewChild, AfterViewInit, OnDestroy, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
// import { CommonModule } from '@angular/common';

// export enum MapSelectionState { 
//   IDLE, 
//   SELECTING_START, 
//   SELECTING_END, 
//   ROUTE_SHOWN,
//   SELECTING_GROWERS,
//   ADDING_GROWERS
// }

// export interface MapClickResult { 
//   address: string; 
//   lat: number; 
//   lng: number; 
// }

// // Import this from your existing model file instead of defining here
// // import { GrowerMapPoint } from 'path/to/your/Grower.model';

// // For now, commenting out the interface - use your existing one
// // export interface GrowerMapPoint {
// //   growerEmail: string;
// //   latitude: number;
// //   longitude: number;
// //   address: string;
// //   pendingOrdersCount: number;
// //   totalSuperTea: number;
// //   totalGreenTea: number;
// // }

// export interface SelectedGrower {
//   growerEmail: string;
//   location: {
//     latitude: number;
//     longitude: number;
//     address: string;
//   };
// }

// declare global {
//   interface Window { 
//     google: any; 
//     googleMapsLoaded?: boolean; 
//     initGoogleMaps?: () => void; 
//   }
// }

// @Component({
//   selector: 'app-google-map',
//   standalone: true,
//   imports: [CommonModule],
//   template: `
//     <div #mapContainer class="map-container">
//       @if (isLoading) { 
//         <div class="loading-overlay">
//           <p>{{ loadingMessage }}</p>
//         </div> 
//       }
//       @if (hasError) { 
//         <div class="error-overlay">
//           <p>{{ errorMessage }}</p>
//         </div> 
//       }
//       @if (isMapReady()) { 
//         <div class="map-ready-indicator">Map Ready ✓</div> 
//       }
//       @switch (selectionState) {
//         @case (MapSelectionState.SELECTING_START) { 
//           <div class="click-instruction">Click on the map to select the START location</div> 
//         }
//         @case (MapSelectionState.SELECTING_END) { 
//           <div class="click-instruction">Click on the map to select the END location</div> 
//         }
//         @case (MapSelectionState.SELECTING_GROWERS) { 
//           <div class="click-instruction grower-instruction">
//             Click on grower markers to add them to your route
//             <div class="selected-count">Selected: {{ selectedGrowers.length }}</div>
//           </div> 
//         }
//         @case (MapSelectionState.ADDING_GROWERS) { 
//           <div class="click-instruction grower-instruction">
//             Click on grower markers to add them to your route list
//             <div class="selected-count">Added: {{ selectedGrowers.length }}</div>
//           </div> 
//         }
//       }
      
//       <!-- Grower Selection Controls -->
//       @if (selectionState === MapSelectionState.SELECTING_GROWERS) {
//         <div class="grower-controls">
//           <button 
//             class="control-btn done-btn"
//             (click)="finishGrowerSelection()"
//             [disabled]="selectedGrowers.length === 0">
//             Done ({{ selectedGrowers.length }})
//           </button>
//           <button 
//             class="control-btn cancel-btn"
//             (click)="cancelGrowerSelection()">
//             Cancel
//           </button>
//         </div>
//       }

//       <!-- Add Grower Controls -->
//       @if (selectionState === MapSelectionState.ADDING_GROWERS) {
//         <div class="grower-controls">
//           <button 
//             class="control-btn done-btn"
//             (click)="finishAddingGrowers()">
//             Finish Adding
//           </button>
//           <button 
//             class="control-btn cancel-btn"
//             (click)="cancelAddingGrowers()">
//             Cancel
//           </button>
//         </div>
//       }
//     </div>
//   `,
//   styles: [`
//     :host, .map-container { 
//       width: 100%; 
//       height: 100%; 
//       display: block; 
//     }
    
//     .map-container { 
//       border-radius: 12px; 
//       position: relative; 
//       overflow: hidden; 
//       background: #eafaf3; 
//     }
    
//     .loading-overlay, .error-overlay { 
//       display: flex; 
//       align-items: center; 
//       justify-content: center; 
//       height: 100%; 
//       position: absolute; 
//       top: 0; 
//       left: 0; 
//       right: 0; 
//       bottom: 0; 
//       z-index: 10; 
//       color: #333; 
//     }
    
//     .loading-overlay { 
//       background-color: #f0f9f4; 
//     }
    
//     .error-overlay { 
//       background-color: #ffebee; 
//       color: #c62828; 
//     }
    
//     .map-ready-indicator { 
//       position: absolute; 
//       top: 10px; 
//       left: 10px; 
//       background: rgba(255, 255, 255, 0.9); 
//       padding: 8px 12px; 
//       border-radius: 6px; 
//       font-size: 12px; 
//       z-index: 5; 
//       color: #28a745; 
//       font-weight: 600; 
//       border: 1px solid #d4edda; 
//     }
    
//     .click-instruction { 
//       position: absolute; 
//       top: 50%; 
//       left: 50%; 
//       transform: translate(-50%, -50%); 
//       background: rgba(40, 167, 69, 0.95); 
//       color: white; 
//       padding: 12px 20px; 
//       border-radius: 8px; 
//       font-size: 14px; 
//       font-weight: 600; 
//       z-index: 15; 
//       box-shadow: 0 4px 12px rgba(0,0,0,0.3); 
//       text-align: center; 
//       pointer-events: none; 
//     }
    
//     .grower-instruction {
//       background: rgba(76, 175, 80, 0.95);
//       padding: 16px 24px;
//       max-width: 300px;
//     }
    
//     .selected-count {
//       margin-top: 8px;
//       font-size: 12px;
//       opacity: 0.9;
//     }
    
//     .grower-controls {
//       position: absolute;
//       bottom: 20px;
//       left: 50%;
//       transform: translateX(-50%);
//       display: flex;
//       gap: 12px;
//       z-index: 15;
//     }
    
//     .control-btn {
//       padding: 10px 20px;
//       border: none;
//       border-radius: 6px;
//       font-weight: 600;
//       cursor: pointer;
//       transition: all 0.2s ease;
//       box-shadow: 0 2px 8px rgba(0,0,0,0.2);
//     }
    
//     .done-btn {
//       background: #28a745;
//       color: white;
//     }
    
//     .done-btn:hover:not(:disabled) {
//       background: #218838;
//       transform: translateY(-1px);
//     }
    
//     .done-btn:disabled {
//       background: #6c757d;
//       cursor: not-allowed;
//     }
    
//     .cancel-btn {
//       background: #dc3545;
//       color: white;
//     }
    
//     .cancel-btn:hover {
//       background: #c82333;
//       transform: translateY(-1px);
//     }
//   `]
// })
// export class GoogleMapComponent implements OnChanges, AfterViewInit, OnDestroy {
//   @Input() startLocation: string | null = '';
//   @Input() endLocation: string | null = '';
//   @Input() growerLocations: GrowerMapPoint[] = [];
//   @Input() startLocationInput!: HTMLInputElement;
//   @Input() endLocationInput!: HTMLInputElement;
  
//   @Output() startLocationSelected = new EventEmitter<MapClickResult>();
//   @Output() endLocationSelected = new EventEmitter<MapClickResult>();
//   @Output() routeInfoUpdated = new EventEmitter<{ distance: number; duration: string }>();
//   @Output() selectionStateChanged = new EventEmitter<MapSelectionState>();
//   @Output() growersSelected = new EventEmitter<SelectedGrower[]>();
//   @Output() growerAdded = new EventEmitter<SelectedGrower>();
  
//   @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef;

//   public selectionState: MapSelectionState = MapSelectionState.IDLE;
//   public readonly MapSelectionState = MapSelectionState;
//   public selectedGrowers: SelectedGrower[] = [];
  
//   isLoading = true;
//   hasError = false;
//   loadingMessage = 'Loading map...';
//   errorMessage = '';

//   private map!: google.maps.Map;
//   private directionsService!: google.maps.DirectionsService;
//   private directionsRenderer!: google.maps.DirectionsRenderer;
//   private geocoder!: google.maps.Geocoder;
//   private growerMarkers: google.maps.Marker[] = [];

//   constructor(private cdr: ChangeDetectorRef) {}

//   ngAfterViewInit(): void {
//     if (window.googleMapsLoaded) {
//       this.initMap();
//     } else {
//       window.addEventListener('googleMapsLoaded', () => this.initMap());
//     }
//   }

//   ngOnDestroy(): void {
//     this.clearGrowerMarkers();
//     if (this.directionsRenderer) {
//       this.directionsRenderer.setMap(null);
//     }
//   }

//   ngOnChanges(changes: SimpleChanges): void {
//     if (changes['growerLocations'] && this.isMapReady()) {
//       this.displayGrowerMarkers();
//     }
    
//     if ((changes['startLocation'] || changes['endLocation']) && this.isMapReady()) {
//       this.calculateRoute();
//     }
//   }

//   private initMap(): void {
//     try {
//       this.map = new google.maps.Map(this.mapContainer.nativeElement, {
//         center: { lat: 7.8731, lng: 80.7718 }, // Centered on Sri Lanka
//         zoom: 8,
//         disableDefaultUI: true,
//         zoomControl: true,
//         fullscreenControl: true
//       });
      
//       this.geocoder = new google.maps.Geocoder();
//       this.directionsService = new google.maps.DirectionsService();
//       this.directionsRenderer = new google.maps.DirectionsRenderer({ 
//         map: this.map, 
//         suppressMarkers: false 
//       });

//       google.maps.event.addListenerOnce(this.map, 'idle', () => {
//         this.isLoading = false;
//         this.cdr.detectChanges();
//         this.initAutocomplete();
//         this.calculateRoute();
//         this.displayGrowerMarkers();
//       });

//       google.maps.event.addListener(this.map, 'click', (event: any) => this.handleMapClick(event));
//     } catch {
//       this.isLoading = false;
//       this.hasError = true;
//       this.errorMessage = 'Failed to initialize map.';
//       this.cdr.detectChanges();
//     }
//   }

//   private initAutocomplete(): void {
//     if (!this.startLocationInput || !this.endLocationInput) { return; }
//     const options = { 
//       componentRestrictions: { country: "lk" }, 
//       fields: ["formatted_address", "geometry"] 
//     };

//     const startAutocomplete = new google.maps.places.Autocomplete(this.startLocationInput, options);
//     startAutocomplete.addListener('place_changed', () => {
//       const place = startAutocomplete.getPlace();
//       if (place?.geometry?.location) {
//         this.startLocationSelected.emit({
//           address: place.formatted_address ?? '',
//           lat: place.geometry.location.lat(),
//           lng: place.geometry.location.lng()
//         });
//       }
//     });

//     const endAutocomplete = new google.maps.places.Autocomplete(this.endLocationInput, options);
//     endAutocomplete.addListener('place_changed', () => {
//       const place = endAutocomplete.getPlace();
//       if (place?.geometry?.location) {
//         this.endLocationSelected.emit({
//           address: place.formatted_address ?? '',
//           lat: place.geometry.location.lat(),
//           lng: place.geometry.location.lng()
//         });
//       }
//     });
//   }

//   private calculateRoute(): void {
//     if (!this.startLocation || !this.endLocation || !this.isMapReady()) {
//       this.clearRoute();
//       return;
//     }
//     this.isLoading = true;
//     this.cdr.detectChanges();

//     this.directionsService.route({
//       origin: this.startLocation,
//       destination: this.endLocation,
//       travelMode: google.maps.TravelMode.DRIVING
//     }, (result, status) => {
//       this.isLoading = false;
//       if (status === google.maps.DirectionsStatus.OK && result) {
//         this.directionsRenderer.setDirections(result);
//         this.map.fitBounds(result.routes[0].bounds);
//         this.setSelectionState(MapSelectionState.ROUTE_SHOWN);
//         const leg = result.routes[0].legs[0];
//         if (leg.distance && leg.duration) {
//           this.routeInfoUpdated.emit({ 
//             distance: leg.distance.value / 1000, 
//             duration: leg.duration.text 
//           });
//         }
//       } else {
//         this.resetSelection();
//       }
//       this.cdr.detectChanges();
//     });
//   }

//   private clearGrowerMarkers(): void {
//     this.growerMarkers.forEach(marker => {
//       marker.setMap(null);
//     });
//     this.growerMarkers = [];
//   }

//   private displayGrowerMarkers(): void {
//     this.clearGrowerMarkers();

//     if (!this.map || !this.growerLocations.length) {
//       return;
//     }

//     this.growerLocations.forEach(grower => {
//       if (grower.latitude && grower.longitude) {
//         const isSelected = this.selectedGrowers.some(sg => sg.growerEmail === grower.growerEmail);
        
//         const marker = new google.maps.Marker({
//           position: { lat: grower.latitude, lng: grower.longitude },
//           map: this.map,
//           title: `${grower.growerEmail} - ${grower.pendingOrdersCount} pending orders`,
//           icon: {
//             url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
//               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//                 <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="${isSelected ? '#FF5722' : '#4CAF50'}"/>
//                 <circle cx="12" cy="9" r="2.5" fill="white"/>
//                 ${isSelected ? '<text x="12" y="11" text-anchor="middle" fill="#FF5722" font-size="8">✓</text>' : ''}
//               </svg>
//             `),
//             scaledSize: new google.maps.Size(30, 30),
//             anchor: new google.maps.Point(15, 30)
//           }
//         });

//         const infoWindow = new google.maps.InfoWindow({
//           content: `
//             <div style="padding: 8px; max-width: 250px;">
//               <h4 style="margin: 0 0 8px 0; color: ${isSelected ? '#FF5722' : '#4CAF50'};">
//                 ${grower.growerEmail}
//                 ${isSelected ? ' ✓ Selected' : ''}
//               </h4>
//               <p style="margin: 4px 0; font-size: 12px;"><strong>Address:</strong> ${grower.address}</p>
//               <p style="margin: 4px 0; font-size: 12px;"><strong>Pending Orders:</strong> ${grower.pendingOrdersCount}</p>
//               <p style="margin: 4px 0; font-size: 12px;"><strong>Super Tea:</strong> ${grower.totalSuperTea}kg</p>
//               <p style="margin: 4px 0; font-size: 12px;"><strong>Green Tea:</strong> ${grower.totalGreenTea}kg</p>
//               ${this.selectionState === MapSelectionState.SELECTING_GROWERS ? 
//                 `<button onclick="window.selectGrower('${grower.growerEmail}')" 
//                          style="margin-top: 8px; padding: 4px 8px; background: ${isSelected ? '#FF5722' : '#4CAF50'}; 
//                                 color: white; border: none; border-radius: 4px; cursor: pointer;">
//                    ${isSelected ? 'Remove' : 'Select'}
//                  </button>` : ''
//               }
//             </div>
//           `
//         });

//         marker.addListener('click', () => {
//           // Close any open info windows
//           this.growerMarkers.forEach(m => {
//             const iw = (m as any).infoWindow;
//             if (iw) iw.close();
//           });
          
//           if (this.selectionState === MapSelectionState.SELECTING_GROWERS) {
//             this.toggleGrowerSelection(grower);
//           } else if (this.selectionState === MapSelectionState.ADDING_GROWERS) {
//             this.addGrowerToRoute(grower);
//           } else {
//             infoWindow.open(this.map, marker);
//             (marker as any).infoWindow = infoWindow;
//           }
//         });

//         this.growerMarkers.push(marker);
//       }
//     });

//     // Set up global function for info window buttons
//     (window as any).selectGrower = (growerEmail: string) => {
//       const grower = this.growerLocations.find(g => g.growerEmail === growerEmail);
//       if (grower) {
//         this.toggleGrowerSelection(grower);
//       }
//     };

//     // Adjust map bounds to include grower locations if no route is selected
//     if (!this.directionsRenderer && this.growerLocations.length > 0) {
//       const bounds = new google.maps.LatLngBounds();
//       this.growerLocations.forEach(grower => {
//         if (grower.latitude && grower.longitude) {
//           bounds.extend({ lat: grower.latitude, lng: grower.longitude });
//         }
//       });
//       this.map.fitBounds(bounds);
//     }
//   }

//   private toggleGrowerSelection(grower: GrowerMapPoint): void {
//     const existingIndex = this.selectedGrowers.findIndex(sg => sg.growerEmail === grower.growerEmail);
    
//     if (existingIndex > -1) {
//       // Remove from selection
//       this.selectedGrowers.splice(existingIndex, 1);
//     } else {
//       // Add to selection
//       this.selectedGrowers.push({
//         growerEmail: grower.growerEmail,
//         location: {
//           latitude: grower.latitude,
//           longitude: grower.longitude,
//           address: grower.address
//         }
//       });
//     }
    
//     // Refresh markers to update visual state
//     this.displayGrowerMarkers();
//     this.cdr.detectChanges();
//   }

//   private addGrowerToRoute(grower: GrowerMapPoint): void {
//     const selectedGrower: SelectedGrower = {
//       growerEmail: grower.growerEmail,
//       location: {
//         latitude: grower.latitude,
//         longitude: grower.longitude,
//         address: grower.address
//       }
//     };
    
//     // Emit the individual grower addition
//     this.growerAdded.emit(selectedGrower);
    
//     // Visual feedback - briefly highlight the marker
//     console.log('Added grower to route:', selectedGrower);
//   }

//   private setSelectionState(newState: MapSelectionState): void {
//     if (this.selectionState !== newState) {
//       this.selectionState = newState;
//       this.selectionStateChanged.emit(this.selectionState);
//       this.cdr.detectChanges();
//     }
//   }

//   private handleMapClick(event: google.maps.MapMouseEvent): void {
//     if ((this.selectionState !== MapSelectionState.SELECTING_START && 
//          this.selectionState !== MapSelectionState.SELECTING_END) || !event.latLng) { 
//       return; 
//     }
    
//     const lat = event.latLng.lat();
//     const lng = event.latLng.lng();
    
//     this.geocoder.geocode({ location: { lat, lng } }, (results, status) => {
//       if (status === 'OK' && results?.[0]) {
//         const result: MapClickResult = { 
//           address: results[0].formatted_address, 
//           lat, 
//           lng 
//         };
        
//         if (this.selectionState === MapSelectionState.SELECTING_START) {
//           this.startLocationSelected.emit(result);
//           this.setSelectionState(MapSelectionState.SELECTING_END);
//         } else if (this.selectionState === MapSelectionState.SELECTING_END) {
//           this.endLocationSelected.emit(result);
//           this.map.setOptions({ draggableCursor: 'grab' });
//         }
//       } else {
//         alert('Could not determine address for this location.');
//       }
//     });
//   }

//   // Public methods
//   public startDirectionSelection(): void {
//     this.resetSelection();
//     this.setSelectionState(MapSelectionState.SELECTING_START);
//     this.map.setOptions({ draggableCursor: 'crosshair' });
//   }

//   public startGrowerSelection(): void {
//     this.selectedGrowers = [];
//     this.setSelectionState(MapSelectionState.SELECTING_GROWERS);
//     this.displayGrowerMarkers(); // Refresh to show selection UI
//   }

//   public startAddingGrowers(): void {
//     this.setSelectionState(MapSelectionState.ADDING_GROWERS);
//     this.displayGrowerMarkers(); // Refresh to show add UI
//   }

//   public finishGrowerSelection(): void {
//     this.growersSelected.emit([...this.selectedGrowers]);
//     this.setSelectionState(MapSelectionState.IDLE);
//     this.displayGrowerMarkers(); // Refresh to hide selection UI
//   }

//   public finishAddingGrowers(): void {
//     this.setSelectionState(MapSelectionState.IDLE);
//     this.displayGrowerMarkers(); // Refresh to hide add UI
//   }

//   public cancelGrowerSelection(): void {
//     this.selectedGrowers = [];
//     this.setSelectionState(MapSelectionState.IDLE);
//     this.displayGrowerMarkers(); // Refresh to hide selection UI
//   }

//   public cancelAddingGrowers(): void {
//     this.setSelectionState(MapSelectionState.IDLE);
//     this.displayGrowerMarkers(); // Refresh to hide add UI
//   }

//   public resetSelection(): void {
//     this.clearRoute();
//     this.selectedGrowers = [];
//     this.setSelectionState(MapSelectionState.IDLE);
//     this.map.setOptions({ draggableCursor: 'grab' });
//   }

//   public clearRoute(): void {
//     if (this.directionsRenderer) {
//       this.directionsRenderer.setDirections({ routes: [] } as any);
//     }
//   }

//   public isMapReady = (): boolean => !this.isLoading && !this.hasError && !!this.map;
// }


// google-map.component.ts
import { Component, Input, OnChanges, SimpleChanges, ElementRef, ViewChild, AfterViewInit, OnDestroy, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export enum MapSelectionState { 
  IDLE, 
  SELECTING_START, 
  SELECTING_END, 
  ROUTE_SHOWN,
  SELECTING_GROWERS,
  ADDING_GROWERS
}

export interface MapClickResult { 
  address: string; 
  lat: number; 
  lng: number; 
}

export interface GrowerMapPoint {
  growerEmail: string;
  latitude: number;
  longitude: number;
  address: string;
  pendingOrdersCount: number;
  totalSuperTea: number;
  totalGreenTea: number;
}

export interface SelectedGrower {
  growerEmail: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
}

declare global {
  interface Window { 
    google: any; 
    googleMapsLoaded?: boolean; 
    initGoogleMaps?: () => void; 
  }
}

@Component({
  selector: 'app-google-map',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div #mapContainer class="map-container">
      @if (isLoading) { 
        <div class="loading-overlay">
          <p>{{ loadingMessage }}</p>
        </div> 
      }
      @if (hasError) { 
        <div class="error-overlay">
          <p>{{ errorMessage }}</p>
        </div> 
      }
      @if (isMapReady()) { 
        <div class="map-ready-indicator">Map Ready ✓</div> 
      }
      @switch (selectionState) {
        @case (MapSelectionState.SELECTING_START) { 
          <div class="click-instruction">Click on the map to select the START location</div> 
        }
        @case (MapSelectionState.SELECTING_END) { 
          <div class="click-instruction">Click on the map to select the END location</div> 
        }
        @case (MapSelectionState.SELECTING_GROWERS) { 
          <div class="click-instruction grower-instruction">
            Click on grower markers to add them to your route
            <div class="selected-count">Selected: {{ selectedGrowers.length }}</div>
          </div> 
        }
        @case (MapSelectionState.ADDING_GROWERS) { 
          <div class="click-instruction grower-instruction">
            Click on grower markers to add them to your route list
            <div class="selected-count">Added: {{ selectedGrowers.length }}</div>
          </div> 
        }
      }
      
      <!-- Grower Selection Controls -->
      @if (selectionState === MapSelectionState.SELECTING_GROWERS) {
        <div class="grower-controls">
          <button 
            class="control-btn done-btn"
            (click)="finishGrowerSelection()"
            [disabled]="selectedGrowers.length === 0">
            Done ({{ selectedGrowers.length }})
          </button>
          <button 
            class="control-btn cancel-btn"
            (click)="cancelGrowerSelection()">
            Cancel
          </button>
        </div>
      }

      <!-- Add Grower Controls -->
      @if (selectionState === MapSelectionState.ADDING_GROWERS) {
        <div class="grower-controls">
          <button 
            class="control-btn done-btn"
            (click)="finishAddingGrowers()">
            Finish Adding
          </button>
          <button 
            class="control-btn cancel-btn"
            (click)="cancelAddingGrowers()">
            Cancel
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    :host, .map-container { 
      width: 100%; 
      height: 100%; 
      display: block; 
    }
    
    .map-container { 
      border-radius: 12px; 
      position: relative; 
      overflow: hidden; 
      background: #eafaf3; 
    }
    
    .loading-overlay, .error-overlay { 
      display: flex; 
      align-items: center; 
      justify-content: center; 
      height: 100%; 
      position: absolute; 
      top: 0; 
      left: 0; 
      right: 0; 
      bottom: 0; 
      z-index: 10; 
      color: #333; 
    }
    
    .loading-overlay { 
      background-color: #f0f9f4; 
    }
    
    .error-overlay { 
      background-color: #ffebee; 
      color: #c62828; 
    }
    
    .map-ready-indicator { 
      position: absolute; 
      top: 10px; 
      left: 10px; 
      background: rgba(255, 255, 255, 0.9); 
      padding: 8px 12px; 
      border-radius: 6px; 
      font-size: 12px; 
      z-index: 5; 
      color: #28a745; 
      font-weight: 600; 
      border: 1px solid #d4edda; 
    }
    
    .click-instruction { 
      position: absolute; 
      top: 50%; 
      left: 50%; 
      transform: translate(-50%, -50%); 
      background: rgba(40, 167, 69, 0.95); 
      color: white; 
      padding: 12px 20px; 
      border-radius: 8px; 
      font-size: 14px; 
      font-weight: 600; 
      z-index: 15; 
      box-shadow: 0 4px 12px rgba(0,0,0,0.3); 
      text-align: center; 
      pointer-events: none; 
    }
    
    .grower-instruction {
      background: rgba(76, 175, 80, 0.95);
      padding: 16px 24px;
      max-width: 300px;
    }
    
    .selected-count {
      margin-top: 8px;
      font-size: 12px;
      opacity: 0.9;
    }
    
    .grower-controls {
      position: absolute;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      gap: 12px;
      z-index: 15;
    }
    
    .control-btn {
      padding: 10px 20px;
      border: none;
      border-radius: 6px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    }
    
    .done-btn {
      background: #28a745;
      color: white;
    }
    
    .done-btn:hover:not(:disabled) {
      background: #218838;
      transform: translateY(-1px);
    }
    
    .done-btn:disabled {
      background: #6c757d;
      cursor: not-allowed;
    }
    
    .cancel-btn {
      background: #dc3545;
      color: white;
    }
    
    .cancel-btn:hover {
      background: #c82333;
      transform: translateY(-1px);
    }
  `]
})
export class GoogleMapComponent implements OnChanges, AfterViewInit, OnDestroy {
  @Input() startLocation: string | null = '';
  @Input() endLocation: string | null = '';
  @Input() growerLocations: GrowerMapPoint[] = [];
  @Input() startLocationInput!: HTMLInputElement;
  @Input() endLocationInput!: HTMLInputElement;
  
  @Output() startLocationSelected = new EventEmitter<MapClickResult>();
  @Output() endLocationSelected = new EventEmitter<MapClickResult>();
  @Output() routeInfoUpdated = new EventEmitter<{ distance: number; duration: string }>();
  @Output() selectionStateChanged = new EventEmitter<MapSelectionState>();
  @Output() growersSelected = new EventEmitter<SelectedGrower[]>();
  @Output() growerAdded = new EventEmitter<SelectedGrower>();
  
  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef;

  public selectionState: MapSelectionState = MapSelectionState.IDLE;
  public readonly MapSelectionState = MapSelectionState;
  public selectedGrowers: SelectedGrower[] = [];
  
  isLoading = true;
  hasError = false;
  loadingMessage = 'Loading map...';
  errorMessage = '';

  private map!: google.maps.Map;
  private directionsService!: google.maps.DirectionsService;
  private directionsRenderer!: google.maps.DirectionsRenderer;
  private geocoder!: google.maps.Geocoder;
  private growerMarkers: google.maps.Marker[] = [];

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    if (window.googleMapsLoaded) {
      this.initMap();
    } else {
      window.addEventListener('googleMapsLoaded', () => this.initMap());
    }
  }

  ngOnDestroy(): void {
    this.clearGrowerMarkers();
    if (this.directionsRenderer) {
      this.directionsRenderer.setMap(null);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['growerLocations'] && this.isMapReady()) {
      this.displayGrowerMarkers();
    }
    
    if ((changes['startLocation'] || changes['endLocation']) && this.isMapReady()) {
      this.calculateRoute();
    }
  }

  private initMap(): void {
    try {
      this.map = new google.maps.Map(this.mapContainer.nativeElement, {
        center: { lat: 7.8731, lng: 80.7718 }, // Centered on Sri Lanka
        zoom: 8,
        disableDefaultUI: true,
        zoomControl: true,
        fullscreenControl: true
      });
      
      this.geocoder = new google.maps.Geocoder();
      this.directionsService = new google.maps.DirectionsService();
      this.directionsRenderer = new google.maps.DirectionsRenderer({ 
        map: this.map, 
        suppressMarkers: false 
      });

      google.maps.event.addListenerOnce(this.map, 'idle', () => {
        this.isLoading = false;
        this.cdr.detectChanges();
        this.initAutocomplete();
        this.calculateRoute();
        this.displayGrowerMarkers();
      });

      google.maps.event.addListener(this.map, 'click', (event: any) => this.handleMapClick(event));
    } catch {
      this.isLoading = false;
      this.hasError = true;
      this.errorMessage = 'Failed to initialize map.';
      this.cdr.detectChanges();
    }
  }

  private initAutocomplete(): void {
    if (!this.startLocationInput || !this.endLocationInput) { return; }
    const options = { 
      componentRestrictions: { country: "lk" }, 
      fields: ["formatted_address", "geometry"] 
    };

    const startAutocomplete = new google.maps.places.Autocomplete(this.startLocationInput, options);
    startAutocomplete.addListener('place_changed', () => {
      const place = startAutocomplete.getPlace();
      if (place?.geometry?.location) {
        this.startLocationSelected.emit({
          address: place.formatted_address ?? '',
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng()
        });
      }
    });

    const endAutocomplete = new google.maps.places.Autocomplete(this.endLocationInput, options);
    endAutocomplete.addListener('place_changed', () => {
      const place = endAutocomplete.getPlace();
      if (place?.geometry?.location) {
        this.endLocationSelected.emit({
          address: place.formatted_address ?? '',
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng()
        });
      }
    });
  }

  private calculateRoute(): void {
    if (!this.startLocation || !this.endLocation || !this.isMapReady()) {
      this.clearRoute();
      return;
    }
    this.isLoading = true;
    this.cdr.detectChanges();

    this.directionsService.route({
      origin: this.startLocation,
      destination: this.endLocation,
      travelMode: google.maps.TravelMode.DRIVING
    }, (result, status) => {
      this.isLoading = false;
      if (status === google.maps.DirectionsStatus.OK && result) {
        this.directionsRenderer.setDirections(result);
        this.map.fitBounds(result.routes[0].bounds);
        this.setSelectionState(MapSelectionState.ROUTE_SHOWN);
        const leg = result.routes[0].legs[0];
        if (leg.distance && leg.duration) {
          this.routeInfoUpdated.emit({ 
            distance: leg.distance.value / 1000, 
            duration: leg.duration.text 
          });
        }
      } else {
        this.resetSelection();
      }
      this.cdr.detectChanges();
    });
  }

  private clearGrowerMarkers(): void {
    this.growerMarkers.forEach(marker => {
      marker.setMap(null);
    });
    this.growerMarkers = [];
  }

  private displayGrowerMarkers(): void {
    this.clearGrowerMarkers();

    if (!this.map || !this.growerLocations.length) {
      return;
    }

    this.growerLocations.forEach(grower => {
      if (grower.latitude && grower.longitude) {
        const isSelected = this.selectedGrowers.some(sg => sg.growerEmail === grower.growerEmail);
        
        const marker = new google.maps.Marker({
          position: { lat: grower.latitude, lng: grower.longitude },
          map: this.map,
          title: `${grower.growerEmail} - ${grower.pendingOrdersCount} pending orders`,
          icon: {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="${isSelected ? '#FF5722' : '#4CAF50'}"/>
                <circle cx="12" cy="9" r="2.5" fill="white"/>
                ${isSelected ? '<text x="12" y="11" text-anchor="middle" fill="#FF5722" font-size="8">✓</text>' : ''}
              </svg>
            `),
            scaledSize: new google.maps.Size(30, 30),
            anchor: new google.maps.Point(15, 30)
          }
        });

        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div style="padding: 8px; max-width: 250px;">
              <h4 style="margin: 0 0 8px 0; color: ${isSelected ? '#FF5722' : '#4CAF50'};">
                ${grower.growerEmail}
                ${isSelected ? ' ✓ Selected' : ''}
              </h4>
              <p style="margin: 4px 0; font-size: 12px;"><strong>Address:</strong> ${grower.address}</p>
              <p style="margin: 4px 0; font-size: 12px;"><strong>Pending Orders:</strong> ${grower.pendingOrdersCount}</p>
              <p style="margin: 4px 0; font-size: 12px;"><strong>Super Tea:</strong> ${grower.totalSuperTea}kg</p>
              <p style="margin: 4px 0; font-size: 12px;"><strong>Green Tea:</strong> ${grower.totalGreenTea}kg</p>
              ${this.selectionState === MapSelectionState.SELECTING_GROWERS ? 
                `<button onclick="window.selectGrower('${grower.growerEmail}')" 
                         style="margin-top: 8px; padding: 4px 8px; background: ${isSelected ? '#FF5722' : '#4CAF50'}; 
                                color: white; border: none; border-radius: 4px; cursor: pointer;">
                   ${isSelected ? 'Remove' : 'Select'}
                 </button>` : ''
              }
            </div>
          `
        });

        marker.addListener('click', () => {
          // Close any open info windows
          this.growerMarkers.forEach(m => {
            const iw = (m as any).infoWindow;
            if (iw) iw.close();
          });
          
          if (this.selectionState === MapSelectionState.SELECTING_GROWERS) {
            this.toggleGrowerSelection(grower);
          } else if (this.selectionState === MapSelectionState.ADDING_GROWERS) {
            this.addGrowerToRoute(grower);
          } else {
            infoWindow.open(this.map, marker);
            (marker as any).infoWindow = infoWindow;
          }
        });

        this.growerMarkers.push(marker);
      }
    });

    // Set up global function for info window buttons
    (window as any).selectGrower = (growerEmail: string) => {
      const grower = this.growerLocations.find(g => g.growerEmail === growerEmail);
      if (grower) {
        this.toggleGrowerSelection(grower);
      }
    };

    // Adjust map bounds to include grower locations if no route is selected
    if (!this.directionsRenderer && this.growerLocations.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      this.growerLocations.forEach(grower => {
        if (grower.latitude && grower.longitude) {
          bounds.extend({ lat: grower.latitude, lng: grower.longitude });
        }
      });
      this.map.fitBounds(bounds);
    }
  }

  private toggleGrowerSelection(grower: GrowerMapPoint): void {
    const existingIndex = this.selectedGrowers.findIndex(sg => sg.growerEmail === grower.growerEmail);
    
    if (existingIndex > -1) {
      // Remove from selection
      this.selectedGrowers.splice(existingIndex, 1);
    } else {
      // Add to selection
      this.selectedGrowers.push({
        growerEmail: grower.growerEmail,
        location: {
          latitude: grower.latitude,
          longitude: grower.longitude,
          address: grower.address
        }
      });
    }
    
    // Refresh markers to update visual state
    this.displayGrowerMarkers();
    this.cdr.detectChanges();
  }

  private addGrowerToRoute(grower: GrowerMapPoint): void {
    const selectedGrower: SelectedGrower = {
      growerEmail: grower.growerEmail,
      location: {
        latitude: grower.latitude,
        longitude: grower.longitude,
        address: grower.address
      }
    };
    
    // Emit the individual grower addition
    this.growerAdded.emit(selectedGrower);
    
    // Visual feedback - briefly highlight the marker
    console.log('Added grower to route:', selectedGrower);
  }

  private setSelectionState(newState: MapSelectionState): void {
    if (this.selectionState !== newState) {
      this.selectionState = newState;
      this.selectionStateChanged.emit(this.selectionState);
      this.cdr.detectChanges();
    }
  }

  private handleMapClick(event: google.maps.MapMouseEvent): void {
    if ((this.selectionState !== MapSelectionState.SELECTING_START && 
         this.selectionState !== MapSelectionState.SELECTING_END) || !event.latLng) { 
      return; 
    }
    
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    
    this.geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === 'OK' && results?.[0]) {
        const result: MapClickResult = { 
          address: results[0].formatted_address, 
          lat, 
          lng 
        };
        
        if (this.selectionState === MapSelectionState.SELECTING_START) {
          this.startLocationSelected.emit(result);
          this.setSelectionState(MapSelectionState.SELECTING_END);
        } else if (this.selectionState === MapSelectionState.SELECTING_END) {
          this.endLocationSelected.emit(result);
          this.map.setOptions({ draggableCursor: 'grab' });
        }
      } else {
        alert('Could not determine address for this location.');
      }
    });
  }

  // Public methods
  public startDirectionSelection(): void {
    this.resetSelection();
    this.setSelectionState(MapSelectionState.SELECTING_START);
    this.map.setOptions({ draggableCursor: 'crosshair' });
  }

  public startGrowerSelection(): void {
    this.selectedGrowers = [];
    this.setSelectionState(MapSelectionState.SELECTING_GROWERS);
    this.displayGrowerMarkers(); // Refresh to show selection UI
  }

  public startAddingGrowers(): void {
    this.setSelectionState(MapSelectionState.ADDING_GROWERS);
    this.displayGrowerMarkers(); // Refresh to show add UI
  }

  public finishGrowerSelection(): void {
    this.growersSelected.emit([...this.selectedGrowers]);
    this.setSelectionState(MapSelectionState.IDLE);
    this.displayGrowerMarkers(); // Refresh to hide selection UI
  }

  public finishAddingGrowers(): void {
    this.setSelectionState(MapSelectionState.IDLE);
    this.displayGrowerMarkers(); // Refresh to hide add UI
  }

  public cancelGrowerSelection(): void {
    this.selectedGrowers = [];
    this.setSelectionState(MapSelectionState.IDLE);
    this.displayGrowerMarkers(); // Refresh to hide selection UI
  }

  public cancelAddingGrowers(): void {
    this.setSelectionState(MapSelectionState.IDLE);
    this.displayGrowerMarkers(); // Refresh to hide add UI
  }

  public resetSelection(): void {
    this.clearRoute();
    this.selectedGrowers = [];
    this.setSelectionState(MapSelectionState.IDLE);
    this.map.setOptions({ draggableCursor: 'grab' });
  }

  public clearRoute(): void {
    if (this.directionsRenderer) {
      this.directionsRenderer.setDirections({ routes: [] } as any);
    }
  }

  public isMapReady = (): boolean => !this.isLoading && !this.hasError && !!this.map;
}