// For VIEWING a list of collectors or a single collector's details.
// This is used to populate dropdowns or display lists.
export interface CollectorResponse {
  collectorId: number;
  name: string;
  contactNumber?: string;
  ratePerKm: number;
  // Included vehicle details to help with route assignment
  vehicleId?: number;
  vehicleLicensePlate?: string;
  vehicleVolume?: number;
}

// For CREATING or UPDATING a collector's main details
export interface CreateUpdateCollectorPayload {
  name: string;
  contactNumber?: string;
  ratePerKm: number;
}