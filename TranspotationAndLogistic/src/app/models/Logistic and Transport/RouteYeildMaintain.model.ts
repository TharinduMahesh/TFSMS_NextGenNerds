// For VIEWING a yield record with all its related context
export interface YieldResponse {
  yId: number;
  rId: number;
  rName?: string;
  collected_Yield: string;
  golden_Tips_Present: string;
  collectorID?: number;
  vehicleID?: number;
}

// For CREATING or UPDATING a yield record (the minimal payload)
export interface YieldPayload {
  rId: number;
  collected_Yield: string;
  golden_Tips_Present: string;
}