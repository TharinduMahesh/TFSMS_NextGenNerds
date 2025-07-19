export interface CreateDispatchPayload {
  invoiceId: number;
  dispatchDate: string;
  vehicleNumber: string;
  driverName: string;
  driverNic?: string;
  sealNumber?: string;
  bagCount: number;
}

// The response you get after creating a dispatch record
export interface DispatchResponse {
  dispatchId: number;
  invoiceId: number;
  invoiceNumber: string;
  dispatchDate: string;
  vehicleNumber: string;
  driverName: string;
}