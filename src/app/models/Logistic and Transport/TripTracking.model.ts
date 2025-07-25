// For VIEWING a trip record
export interface TripResponse {
scheduledArrival: string|number|Date;
  tripId: number;
  routeId: number;
  routeName?: string;
  collectorId: number;
  collectorName?: string;
  scheduledDeparture: string; // Dates from JSON are strings
  actualDeparture?: string;
  actualArrival?: string;
  isOnTime: boolean;
}

// For SCHEDULING a new trip
export interface ScheduleTripPayload {
  routeId: number;
  collectorId: number;
  scheduledDeparture: string;
  scheduledArrival: string; 
}

// For UPDATING a trip's status
export interface UpdateTripStatusPayload {
  actualDeparture?: string;
  actualArrival?: string;
}