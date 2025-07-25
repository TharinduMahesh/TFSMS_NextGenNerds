
export interface CollectorResponse {
  collectorId: number;
  name: string;
  ratePerKm: number;
  
  // All the new fields for detailed viewing
  collectorNIC?: string;
  collectorAddressLine1?: string;
  collectorAddressLine2?: string;
  collectorCity?: string;
  collectorPostalCode?: string;
  collectorGender?: string;
  collectorDOB?: string; // Dates are strings in JSON
  collectorPhoneNum?: string;
  collectorEmail?: string;

  // Existing vehicle details
  vehicleId?: number;
  vehicleLicensePlate?: string;
  vehicleVolume?: number;
}

// For CREATING or UPDATING a collector's main details
// This now includes all the new form fields.
export interface CreateUpdateCollectorPayload {
  name: string;
  ratePerKm: number;
  
  collectorNIC: string;
  collectorAddressLine1: string;
  collectorAddressLine2?: string;
  collectorCity: string;
  collectorPostalCode?: string;
  collectorGender?: string;
  collectorDOB?: string;
  collectorPhoneNum?: string;
  collectorEmail: string;
}