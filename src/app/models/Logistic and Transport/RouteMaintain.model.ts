// For VIEWING a list of routes or a single route's details
export interface RtList {
  rId: number;
  rName: string;
  startLocation: string;
  endLocation: string;
  distance: number;
  collectorId?: number;
  growerLocations: GrowerLocation[];
}

// Sub-model for viewing a grower location within a route
export interface GrowerLocation {
  gId: number;
  latitude: number;
  longitude: number;
  description?: string;
  rtListId: number;
}

// For CREATING or UPDATING a route's data
export interface CreateUpdateRoutePayload {
  rName: string;
  startLocation: string;
  endLocation: string;
  distance: number;
  collectorId?: number | null;
  growerLocations: GrowerLocationPayload[];
}

// Sub-model for the grower locations payload
export interface GrowerLocationPayload {
  latitude: number;
  longitude: number;
  description?: string;
}