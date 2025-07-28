export interface RouteSummary {
  rId: number;
  rName: string;
  startLocationAddress: string;
  endLocationAddress: string;
}

export interface TripStop {
  growerEmail: string;
  stopOrder: number;
  latitude: number;
  longitude: number;
  address: string;
}

// For VIEWING a trip record
export interface TripResponse {
  tripId: number;
  routeId: number;
  routeName?: string;
  collectorId: number;
  collectorName?: string;
  scheduledDeparture: string;
  scheduledArrival: string;
  actualDeparture?: string;
  actualArrival?: string;
  isOnTime: boolean;
  stops: TripStop[];
  route?: RouteSummary; 
}

// For SCHEDULING a new trip
export interface ScheduleTripPayload {
  routeId: number;
  collectorId: number;
  scheduledDeparture: string;
  scheduledArrival: string; 
  // --- ADD THIS NEW PROPERTY ---
  growerEmails: string[];
}

// For UPDATING a trip's status
export interface UpdateTripStatusPayload {
  actualDeparture?: string;
  actualArrival?: string;
}