// src/app/models/sales-entry.model.ts

export interface Sale {
  id: string;
  salesDate: string;
  buyerName: string;
  teaGrade: string;
  kilosSold: number;
  discount: number;
  remarks: string;
}