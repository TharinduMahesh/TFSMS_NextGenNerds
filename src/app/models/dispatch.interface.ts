// src/app/models/dispatch.interface.ts

/**
 * @interface Dispatch
 * @description Defines the structure for a single Dispatch record in the frontend.
 * This mirrors the Dispatch model from your .NET backend.
 */
export interface Dispatch {
  dispatchId?: number; // Primary key, optional for creation
  invoiceId: number; // Foreign Key to Invoice
  vehicleNumber: string;
  dispatchDate: string; // YYYY-MM-DD format
  driverName: string;
  driverNic?: string; // Optional
  sealNumber?: string; // Optional
  bagCount: number;
  dispatchedWeightKg: number; // Crucial for stock deduction
  createdAt?: string;
  updatedAt?: string;

  // NEW: Include Invoice navigation property for display purposes
  // This will be populated by backend includes (e.g., in DispatchController)
  invoice?: {
    invoiceId: number;
    invoiceNumber: string;
    invoiceDate: string;
    customerName: string; // Or BrokerName, depending on your Invoice model
    totalAmount: number;
    status: string; // Combined status
  };
}
