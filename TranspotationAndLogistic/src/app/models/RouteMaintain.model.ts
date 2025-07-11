// For VIEWING data (e.g., in a list)
export interface RtList {
  rId: number;
  rName: string;
  startLocation: string;
  endLocation: string;
  distance: number;
  collectorId?: number;
  vehicleId?: number;
  growerLocations: GrowerLocation[];
}

export interface GrowerLocation {
  gId?: number;
  latitude: number;
  longitude: number;
  description?: string;
  rtListId?: number;
}

// For CREATING or UPDATING a route (The DTO)
export interface CreateUpdateRouteDto {
  rName: string;
  startLocation: string;
  endLocation: string;
  distance: number;
  collectorId?: number | null;
  vehicleId?: number | null;
  growerLocations: GrowerLocationDto[];
}

export interface GrowerLocationDto {
  latitude: number;
  longitude: number;
  description?: string;
}