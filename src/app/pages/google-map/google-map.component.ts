
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
//   @Input() startLocation: string = '';
//   @Input() endLocation: string = '';
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
//   ngAfterViewInit(): void { if (window.googleMapsLoaded) { this.initMap(); } else { window.addEventListener('googleMapsLoaded', () => this.initMap()); } }
//   ngOnDestroy(): void { if (this.directionsRenderer) { this.directionsRenderer.setMap(null); } }
//   ngOnChanges(changes: SimpleChanges): void { if ((changes['startLocation'] || changes['endLocation']) && this.isMapReady()) { this.calculateRoute(); } }
//   private setSelectionState(newState: MapSelectionState): void { if (this.selectionState !== newState) { this.selectionState = newState; this.selectionStateChanged.emit(this.selectionState); this.cdr.detectChanges(); } }
//   public startDirectionSelection(): void { this.resetSelection(); this.setSelectionState(MapSelectionState.SELECTING_START); this.map.setOptions({ draggableCursor: 'crosshair' }); }
//   public resetSelection(): void { this.clearRoute(); this.setSelectionState(MapSelectionState.IDLE); this.map.setOptions({ draggableCursor: 'grab' }); }
//   private handleMapClick(event: google.maps.MapMouseEvent): void {
//     if ((this.selectionState !== MapSelectionState.SELECTING_START && this.selectionState !== MapSelectionState.SELECTING_END) || !event.latLng) { return; }
//     const lat = event.latLng.lat();
//     const lng = event.latLng.lng();
//     this.geocoder.geocode({ location: { lat, lng } }, (results, status) => {
//       if (status === 'OK' && results?.[0]) {
//         const result: MapClickResult = { address: results[0].formatted_address, lat, lng };
//         if (this.selectionState === MapSelectionState.SELECTING_START) { this.startLocationSelected.emit(result); this.setSelectionState(MapSelectionState.SELECTING_END); }
//         else if (this.selectionState === MapSelectionState.SELECTING_END) { this.endLocationSelected.emit(result); this.map.setOptions({ draggableCursor: 'grab' }); }
//       } else { alert('Could not determine address for this location.'); }
//     });
//   }
//   // (Removed duplicate implementation of initMap)
//   private calculateRoute(): void {
//     if (!this.startLocation || !this.endLocation) { this.clearRoute(); return; }
//     this.directionsService.route({ origin: this.startLocation, destination: this.endLocation, travelMode: google.maps.TravelMode.DRIVING }, (result, status) => {
//       if (status === google.maps.DirectionsStatus.OK && result) {
//         this.directionsRenderer.setDirections(result);
//         this.map.fitBounds(result.routes[0].bounds);
//         this.setSelectionState(MapSelectionState.ROUTE_SHOWN);
//         const leg = result.routes[0].legs[0];
//         if (leg.distance && leg.duration) { this.routeInfoUpdated.emit({ distance: leg.distance.value / 1000, duration: leg.duration.text }); }
//       } else { this.resetSelection(); }
//     });
//   }
//   public clearRoute(): void { if (this.directionsRenderer) { this.directionsRenderer.setDirections({ routes: [] } as any); } }
//   public isMapReady = (): boolean => !this.isLoading && !this.hasError && !!this.map;
//   private initMap(): void {
//     try {
//       this.map = new google.maps.Map(this.mapContainer.nativeElement, { center: { lat: 7.8731, lng: 80.7718 }, zoom: 8, disableDefaultUI: true, zoomControl: true, fullscreenControl: true });
//       this.geocoder = new google.maps.Geocoder();
//       this.directionsService = new google.maps.DirectionsService();
//       this.directionsRenderer = new google.maps.DirectionsRenderer({ map: this.map, suppressMarkers: false });
//       google.maps.event.addListenerOnce(this.map, 'idle', () => { this.isLoading = false; this.cdr.detectChanges(); this.initAutocomplete(); });
//       google.maps.event.addListener(this.map, 'click', (event: any) => this.handleMapClick(event));
//     } catch { this.hasError = true; this.errorMessage = 'Failed to initialize map.'; }
//   }
  
  

//   // ===== THE FIX IS IN THIS METHOD =====
//   private initAutocomplete(): void {
//     if (!this.startLocationInput || !this.endLocationInput) { return; }
//     const options = { componentRestrictions: { country: "lk" }, fields: ["formatted_address", "geometry"] };
    
//     const startAutocomplete = new google.maps.places.Autocomplete(this.startLocationInput, options);
//     startAutocomplete.addListener('place_changed', () => {
//       const place = startAutocomplete.getPlace();
//       if (place?.geometry?.location) {
//         // CORRECTED: The emitted object now includes all required properties
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
//         // CORRECTED: The emitted object now includes all required properties
//         this.endLocationSelected.emit({
//           address: place.formatted_address ?? '',
//           lat: place.geometry.location.lat(),
//           lng: place.geometry.location.lng()
//         });
//       }
//     });
//   }
// }



import { Component, Input, OnChanges, SimpleChanges, ElementRef, ViewChild, AfterViewInit, OnDestroy, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export enum MapSelectionState { IDLE, SELECTING_START, SELECTING_END, ROUTE_SHOWN }
export interface MapClickResult { address: string; lat: number; lng: number; }

declare global {
  interface Window { google: any; googleMapsLoaded?: boolean; initGoogleMaps?: () => void; }
}


@Component({
  selector: 'app-google-map',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div #mapContainer class="map-container">
      @if (isLoading) { <div class="loading-overlay"><p>{{ loadingMessage }}</p></div> }
      @if (hasError) { <div class="error-overlay"><p>{{ errorMessage }}</p></div> }
      @if (isMapReady()) { <div class="map-ready-indicator">Map Ready ✓</div> }
      @switch (selectionState) {
        @case (MapSelectionState.SELECTING_START) { <div class="click-instruction">Click on the map to select the START location</div> }
        @case (MapSelectionState.SELECTING_END) { <div class="click-instruction">Click on the map to select the END location</div> }
      }
    </div>
  `,
  styles: [`
    :host, .map-container { width: 100%; height: 100%; display: block; }
    .map-container { border-radius: 12px; position: relative; overflow: hidden; background: #eafaf3; }
    .loading-overlay, .error-overlay { display: flex; align-items: center; justify-content: center; height: 100%; position: absolute; top: 0; left: 0; right: 0; bottom: 0; z-index: 10; color: #333; }
    .loading-overlay { background-color: #f0f9f4; }
    .error-overlay { background-color: #ffebee; color: #c62828; }
    .map-ready-indicator { position: absolute; top: 10px; left: 10px; background: rgba(255, 255, 255, 0.9); padding: 8px 12px; border-radius: 6px; font-size: 12px; z-index: 5; color: #28a745; font-weight: 600; border: 1px solid #d4edda; }
    .click-instruction { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(40, 167, 69, 0.95); color: white; padding: 12px 20px; border-radius: 8px; font-size: 14px; font-weight: 600; z-index: 15; box-shadow: 0 4px 12px rgba(0,0,0,0.3); text-align: center; pointer-events: none; }
  `]
})
export class GoogleMapComponent implements OnChanges, AfterViewInit, OnDestroy {
  @Input() startLocation: string | null = '';
  @Input() endLocation: string | null = '';
  @Input() startLocationInput!: HTMLInputElement;
  @Input() endLocationInput!: HTMLInputElement;
  @Output() startLocationSelected = new EventEmitter<MapClickResult>();
  @Output() endLocationSelected = new EventEmitter<MapClickResult>();
  @Output() routeInfoUpdated = new EventEmitter<{ distance: number; duration: string }>();
  @Output() selectionStateChanged = new EventEmitter<MapSelectionState>();
  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef;

  

  public selectionState: MapSelectionState = MapSelectionState.IDLE;
  public readonly MapSelectionState = MapSelectionState;
  isLoading = true;
  hasError = false;
  loadingMessage = 'Loading map...';
  errorMessage = '';

  private map!: google.maps.Map;
  private directionsService!: google.maps.DirectionsService;
  private directionsRenderer!: google.maps.DirectionsRenderer;
  private geocoder!: google.maps.Geocoder;

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    if (window.googleMapsLoaded) {
      this.initMap();
    } else {
      window.addEventListener('googleMapsLoaded', () => this.initMap());
    }
  }

  ngOnDestroy(): void {
    if (this.directionsRenderer) {
      this.directionsRenderer.setMap(null);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    // This hook is key. It will automatically trigger when the parent component loads data
    // and the [startLocation] and [endLocation] inputs change.
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
      this.directionsRenderer = new google.maps.DirectionsRenderer({ map: this.map, suppressMarkers: false });

      google.maps.event.addListenerOnce(this.map, 'idle', () => {
        this.isLoading = false;
        this.cdr.detectChanges();
        this.initAutocomplete();
        // After the map is ready, check if we already have locations to draw a route.
        this.calculateRoute();
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
    const options = { componentRestrictions: { country: "lk" }, fields: ["formatted_address", "geometry"] };

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
          this.routeInfoUpdated.emit({ distance: leg.distance.value / 1000, duration: leg.duration.text });
        }
      } else {
        this.resetSelection();
        // Optionally show an error to the user that the route could not be calculated
      }
      this.cdr.detectChanges();
    });
  }

  private setSelectionState(newState: MapSelectionState): void {
    if (this.selectionState !== newState) {
      this.selectionState = newState;
      this.selectionStateChanged.emit(this.selectionState);
      this.cdr.detectChanges();
    }
  }

  public startDirectionSelection(): void {
    this.resetSelection();
    this.setSelectionState(MapSelectionState.SELECTING_START);
    this.map.setOptions({ draggableCursor: 'crosshair' });
  }

  public resetSelection(): void {
    this.clearRoute();
    this.setSelectionState(MapSelectionState.IDLE);
    this.map.setOptions({ draggableCursor: 'grab' });
  }

  private handleMapClick(event: google.maps.MapMouseEvent): void {
    if ((this.selectionState !== MapSelectionState.SELECTING_START && this.selectionState !== MapSelectionState.SELECTING_END) || !event.latLng) { return; }
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    this.geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === 'OK' && results?.[0]) {
        const result: MapClickResult = { address: results[0].formatted_address, lat, lng };
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

  public clearRoute(): void {
    if (this.directionsRenderer) {
      this.directionsRenderer.setDirections({ routes: [] } as any);
    }
  }

  public isMapReady = (): boolean => !this.isLoading && !this.hasError && !!this.map;
}


