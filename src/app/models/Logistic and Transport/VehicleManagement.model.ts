// For VIEWING a vehicle's details
export interface VehicleResponse {
  vehicleId: number;
  licensePlate: string;
  volume: number;
  model?: string;
  conditionNotes?: string;
  collectorId: number;
  collectorName?: string; // <-- THIS IS THE CRUCIAL ADDITION
}

// For CREATING or UPDATING a vehicle
export interface CreateUpdateVehiclePayload {
  collectorId: number;
  licensePlate: string;
  volume: number;
  model?: string;
  conditionNotes?: string;
}