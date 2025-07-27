// ==================================================
// Filename: models/Logistic and Transport/RouteMaintain.model.ts (Corrected)
// ==================================================

// This interface matches the camelCase JSON sent by the backend
export interface RtList {
  rId: number;
  rName: string;
  startLocationAddress: string;
  startLocationLatitude: number;
  startLocationLongitude: number;
  endLocationAddress: string;
  endLocationLatitude: number;
  endLocationLongitude: number;
  distance: number;
  collectorId?: number | null;
  // Note: The 'Collector' navigation property is usually not sent in list views,
  // but can be included if your API does so.
}

// The payload for creating/updating a route.
// This matches the FormGroup structure.
export interface RouteLocationPayload {
  address: string;
  latitude: number;
  longitude: number;
}

export interface CreateUpdateRoutePayload {
  rName: string;
  startLocation: RouteLocationPayload;
  endLocation: RouteLocationPayload;
  distance: number;
  collectorId?: number | null;
}