export interface YieldList{
  rId: number;
  rName: string;
  collected_Yield: string;
  golden_Tips_Present: string;
  collectorID: number;
  vehicalID: number;
}

export interface Rview {
  rId: number;
  rName: string;
  startLocation: string;
  endLocation: string;
  distance: string;
  collectorId?: number;  
  vehicleId?: number;   
  growerLocations: GrowerLocation[];
}

export interface GrowerLocation {
  gId?: number;
  latitude: number;
  longitude: number;
  description?: string;
  RtListId?: number;
}
