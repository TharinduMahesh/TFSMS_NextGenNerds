// For VIEWING a vehicle's details
export interface VehicleResponse {
  vehicleId: number;
  licensePlate: string;
  volume: number;
  model?: string;
  collectorId: number;
  collectorName?: string;
  isClean: boolean;
  hasGoodTires: boolean;
  hasVentilation: boolean;
  isPestFree: boolean;
  hasValidDocs: boolean;
  hasFireExtinguisher: boolean;
}

// For CREATING or UPDATING a vehicle
export interface CreateUpdateVehiclePayload {
  collectorId: number;
  licensePlate: string;
  volume: number;
  model?: string;
  isClean: boolean;
  hasGoodTires: boolean;
  hasVentilation: boolean;
  isPestFree: boolean;
  hasValidDocs: boolean;
  hasFireExtinguisher: boolean;
}