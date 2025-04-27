export interface Report {
    id: number;
    dispatchID: string;
    yield: string;
    bagCount: number;
    vehicleNumber: string;
    driverNIC: string;
    date: string;
    status: 'Delivered' | 'In Transit';
  }