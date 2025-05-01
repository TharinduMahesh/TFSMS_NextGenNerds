export interface GreenLeaf {
    id: number;
    supplierId: number;
    weight: number;
    collectionDate: Date;
    quality: string;
    moisture: number;
    createdBy?: string;
    createdDate?: Date;
  }