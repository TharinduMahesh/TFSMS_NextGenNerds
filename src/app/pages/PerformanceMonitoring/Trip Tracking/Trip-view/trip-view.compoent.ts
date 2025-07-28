import { Component, Input, Output, EventEmitter, signal, OnChanges } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { GoogleMapComponent, GrowerMapPoint } from '../../../google-map/google-map.component';
import { TripResponse } from '../../../../models/Logistic and Transport/TripTracking.model';

@Component({
  selector: 'app-trip-view',
  standalone: true,
  imports: [CommonModule, DatePipe, GoogleMapComponent],
  template: `

    <div (click)="close.emit()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <button class="close-btn" (click)="close.emit()" title="Close">×</button>
        
        <header class="modal-header">
          <h2 class="modal-title">Trip Details: #{{ selectedTrip?.tripId }}</h2>
          <p class="route-name">{{ selectedTrip?.route?.rName }}</p>
        </header>

        <div class="view-layout">
          <div class="view-left">
            <div class="map-container">
              <app-google-map
                [startLocation]="selectedTrip?.route?.startLocationAddress ?? null"
                [endLocation]="selectedTrip?.route?.endLocationAddress ?? null"
                [growerLocations]="growerLocationsForMap()">
              </app-google-map>
            </div>
          </div>

          <!-- Right Column: Details -->
          <div class="view-right">
            <!-- Core Trip Info -->
            <div class="details-card">
              <h3 class="card-title">Core Information</h3>
              <div class="detail-item">
                <span class="icon">🆔</span>
                <span class="label">Trip ID:</span>
                <span class="value">#{{ selectedTrip?.tripId }}</span>
              </div>
              <div class="detail-item">
                <span class="icon">👤</span>
                <span class="label">Collector:</span>
                <span class="value">{{ selectedTrip?.collectorName || 'N/A' }}</span>
              </div>
            </div>

            <!-- Timeline -->
            <div class="details-card">
              <h3 class="card-title">Trip Timeline</h3>
              <div class="detail-item">
                <span class="icon">🕒</span>
                <span class="label">Scheduled Departure:</span>
                <span class="value">{{ selectedTrip?.scheduledDeparture | date:'MMM d, h:mm a' }}</span>
              </div>
              <div class="detail-item">
                <span class="icon">🕒</span>
                <span class="label">Scheduled Arrival:</span>
                <span class="value">{{ selectedTrip?.scheduledArrival | date:'MMM d, h:mm a' }}</span>
              </div>
              @if (selectedTrip?.actualDeparture) {
                <div class="detail-item actual-good">
                  <span class="icon">✅</span>
                  <span class="label">Actual Departure:</span>
                  <span class="value">{{ selectedTrip?.actualDeparture | date:'MMM d, h:mm a' }}</span>
                </div>
              }
              @if (selectedTrip?.actualArrival) {
                <div class="detail-item actual-good">
                  <span class="icon">🏁</span>
                  <span class="label">Actual Arrival:</span>
                  <span class="value">{{ selectedTrip?.actualArrival | date:'MMM d, h:mm a' }}</span>
                </div>
              }
            </div>

            <!-- Grower Stops -->
            <div class="details-card">
              <h3 class="card-title">Grower Stops ({{ selectedTrip?.stops?.length || 0 }})</h3>
              <div class="stops-list-container">
                @for(stop of selectedTrip?.stops; track stop.growerEmail) {
                  <div class="stop-item">
                    <span class="stop-order">{{ stop.stopOrder }}</span>
                    <span class="stop-email">{{ stop.growerEmail }}</span>
                  </div>
                } @empty {
                  <p class="empty-stops">No growers were added to this trip.</p>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* This styles the component's host element (<app-trip-view>) as the modal overlay */
    :host {
      position: fixed;
      inset: 0; /* shorthand for top, right, bottom, left = 0 */
      z-index: 1000;
      background: rgba(30, 41, 59, 0.4);
      display: flex;
      justify-content: center;
      align-items: center;
      backdrop-filter: blur(5px);
      animation: fadeIn 0.3s ease-in-out;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    /* The modal's content box */
    .modal-content {
      background: #f8f9fa;
      padding: 1.5rem 2rem 2rem 2rem;
      border-radius: 16px;
      width: 900px;
      max-width: 95vw;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04);
      border: 1px solid #dee2e6;
      position: relative;
      animation: slideIn 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
    }
    
    @keyframes slideIn {
        from { transform: translateY(20px) scale(0.98); opacity: 0; }
        to { transform: translateY(0) scale(1); opacity: 1; }
    }

    .close-btn {
      position: absolute;
      top: 1rem; right: 1.25rem;
      background: #e9ecef; color: #495057;
      border: none; border-radius: 50%;
      width: 32px; height: 32px;
      font-size: 1.5rem; line-height: 1;
      cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      transition: all 0.2s ease;
    }
    .close-btn:hover {
      background-color: #dee2e6;
      transform: rotate(90deg);
    }
    .modal-header {
      text-align: center;
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #e9ecef;
    }
    .modal-title {
      font-size: 1.75rem;
      font-weight: 600;
      color: #343a40;
      margin: 0;
    }
    .route-name {
      font-size: 1rem;
      color: #6c757d;
      margin-top: 0.25rem;
    }
    /* --- Layout & Columns --- */
    .view-layout {
      display: flex;
      gap: 2rem;
    }
    .view-left { flex: 1; min-width: 350px; }
    .view-right { flex: 1; display: flex; flex-direction: column; gap: 1.25rem; }
    .map-container {
      width: 100%;
      height: 480px;
      border-radius: 12px;
      overflow: hidden;
      border: 1px solid #dee2e6;
    }
    /* --- Details Cards --- */
    .details-card {
      background: #ffffff;
      border-radius: 12px;
      border: 1px solid #e9ecef;
      padding: 1.25rem;
    }
    .card-title {
      font-size: 1rem;
      font-weight: 600;
      color: #495057;
      margin: 0 0 1rem 0;
      padding-bottom: 0.5rem;
      border-bottom: 1px solid #f1f3f5;
    }
    .detail-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 0.95rem;
      margin-bottom: 0.75rem;
    }
    .detail-item:last-child { margin-bottom: 0; }
    .detail-item.actual-good { color: #1b5e20; }
    .icon { font-size: 1.1rem; }
    .label { color: #6c757d; }
    .value { font-weight: 600; color: #212529; }
    /* --- Stops List --- */
    .stops-list-container {
      max-height: 150px;
      overflow-y: auto;
      padding-right: 10px;
    }
    .stop-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.5rem 0;
      border-bottom: 1px solid #f1f3f5;
    }
    .stop-item:last-child { border-bottom: none; }
    .stop-order {
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #007bff;
      color: white;
      font-weight: 700;
      border-radius: 50%;
      width: 24px;
      height: 24px;
      font-size: 0.8rem;
    }
    .stop-email { color: #343a40; font-weight: 500; }
    .empty-stops { font-style: italic; color: #6c757d; padding: 1rem 0; }
    
    /* --- Responsive --- */
    @media (max-width: 900px) {
      .view-layout { flex-direction: column; }
      .map-container { height: 250px; }
    }
  `]
})
export class TripViewComponent implements OnChanges {
  @Input() selectedTrip: TripResponse | null = null;
  @Output() close = new EventEmitter<void>();

  growerLocationsForMap = signal<GrowerMapPoint[]>([]);

  ngOnChanges() {
    // This logic is now simple because the backend provides all necessary data.
    if (this.selectedTrip?.stops) {
      const mapPoints = this.selectedTrip.stops.map(stop => ({
        growerEmail: stop.growerEmail,
        latitude: stop.latitude,
        longitude: stop.longitude,
        address: stop.address,
        // Provide default values for other properties the map component might use
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