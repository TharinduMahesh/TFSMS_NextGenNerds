import { Component, Input, Output, EventEmitter, signal, OnChanges } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { GoogleMapComponent, GrowerMapPoint } from '../../../google-map/google-map.component';
import { TripResponse } from '../../../../models/Logistic and Transport/TripTracking.model';

@Component({
  selector: 'app-trip-view',
  standalone: true,
  imports: [CommonModule, DatePipe, GoogleMapComponent],
  templateUrl: './trip-view.component.html', 
  styleUrls: ['./trip-view.component.scss'] 
})
export class TripViewComponent implements OnChanges {
  @Input() selectedTrip: TripResponse | null = null;
  @Output() close = new EventEmitter<void>();

  growerLocationsForMap = signal<GrowerMapPoint[]>([]);

  ngOnChanges() {
    if (this.selectedTrip?.stops) {
      const mapPoints = this.selectedTrip.stops.map(stop => ({
        growerEmail: stop.growerEmail,
        latitude: stop.latitude,
        longitude: stop.longitude,
        address: stop.address,
        // Provide default values for other properties the map component might use if needed by map component
        pendingOrdersCount: 0, 
        totalSuperTea: 0,
        totalGreenTea: 0,
      }));
      this.growerLocationsForMap.set(mapPoints);
    } else {
      this.growerLocationsForMap.set([]);
    }
  }
}