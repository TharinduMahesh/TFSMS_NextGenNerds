// src/app/models/weight-difference.interface.ts
export interface WeightDifference {
  weightDifferenceId?: number; // Optional for creation
  collectionId: number; // Foreign key to GreenLeafCollection
  supplierId: number;
  normalTeaLeafDifference: number;
  goldenTipTeaLeafDifference: number;
  differenceRecordedDate: string; // ISO string (YYYY-MM-DD)
}
