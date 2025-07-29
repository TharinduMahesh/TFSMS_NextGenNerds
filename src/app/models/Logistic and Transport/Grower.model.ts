
export interface GrowerMapPoint {
  growerEmail: string;
  latitude: number;
  longitude: number;
  address: string;
  pendingOrdersCount: number;
  totalSuperTea: number;
  totalGreenTea: number;
}

export interface PendingGrowerOrder {
  growerOrderId: number;
  growerEmail: string;
  superTeaQuantity: number;
  greenTeaQuantity: number;
  placeDate: string;
  transportMethod: string;
  paymentMethod: string;
  location?: {
    locationId: number;
    growerEmail: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    postalCode?: string;
    latitude?: number;
    longitude?: number;
    fullAddress: string;
  };
}
