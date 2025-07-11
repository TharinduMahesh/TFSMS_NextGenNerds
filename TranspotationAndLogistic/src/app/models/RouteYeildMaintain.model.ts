// This model represents the data you GET from the API (matches YieldResponseDto)
export interface YieldResponse {
  yId: number;
  rId: number;
  rName?: string;
  collected_Yield: string;
  golden_Tips_Present: string;
  collectorID?: number;
  vehicleID?: number;
}

// This model represents the data you POST or PUT to the API (matches CreateUpdateYieldDto)
export interface YieldPayload {
  rId: number;
  collected_Yield: string;
  golden_Tips_Present: string;
}