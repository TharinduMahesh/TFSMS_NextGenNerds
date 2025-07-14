// For VIEWING yield data (matches YieldResponseDto)
export interface YieldResponse {
  yId: number;
  rId: number;
  rName?: string;
  collected_Yield: string;
  golden_Tips_Present: string;
  collectorID?: number;
  vehicleID?: number;
}

// For CREATING or UPDATING a yield (matches CreateUpdateYieldDto)
export interface YieldPayload {
  rId: number;
  collected_Yield: string;
  golden_Tips_Present: string;
}