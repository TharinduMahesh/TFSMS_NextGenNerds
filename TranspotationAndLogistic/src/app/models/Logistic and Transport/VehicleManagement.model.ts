// For VIEWING a vehicle's details
export interface VehicleResponse {
  vehicleId: number;
  licensePlate: string;
  volume: number;
  model?: string;
  conditionNotes?: string;
  collectorId: number;
}

// For CREATING or UPDATING a vehicle (and linking it to a collector)
export interface CreateUpdateVehiclePayload {
  collectorId: number;
  licensePlate: string;
  volume: number;
  model?: string;
  conditionNotes?: string;
}