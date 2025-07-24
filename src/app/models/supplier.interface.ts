// src/app/models/supplier.interface.ts
export interface Supplier {
  supplierId: number;
  // supplierName?: string; 
  initialNormalTeaLeafWeight: number;
  initialGoldenTipTeaLeafWeight: number;
  dataDate: string; // ISO string (YYYY-MM-DD)
}
