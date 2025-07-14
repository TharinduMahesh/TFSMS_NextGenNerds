// For the costs-by-collector report
export interface CollectorCostReport {
  collectorId: number;
  collectorName: string;
  totalTrips: number;
  totalDistance: number;
  totalCost: number;
}

// For the performance-by-collector report
export interface CollectorPerformanceReport {
  collectorId: number;
  collectorName: string;
  totalTripsCompleted: number;
  onTimeTrips: number;
  onTimePercentage: number;
}

// For the performance-by-route report
export interface RoutePerformanceReport {
  routeId: number;
  routeName: string;
  totalTrips: number;
  averageTripDurationHours: number;
  onTimeDeparturePercentage: number;
  totalCost: number;
  costPerKm: number;
}