export interface Rview {
    id?: number;
    rName: string;
    startLocation: string;
    endLocation: string;
    distance: string;
    collectorId?: number;
    vehicleId?: number;
  }

export interface YieldList{
  routeId: number;
  routeName: string;
  collected_Yield: string;
  golden_Tips_Present: string;
  collectorID: number;
  vehicalID: number;
}