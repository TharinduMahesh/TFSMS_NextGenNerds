export interface TeaPacking {
  id?: string;
  grade: string;
  gardenMark: string;
  financialYear: string;
  packingType: string;
  quantity: number;
}

export interface PackingType {
  value: string;
  label: string;
}

export const PACKING_TYPES: PackingType[] = [
  { value: 'loose', label: 'Loose Tea' },
  { value: 'bags', label: 'Tea Bags' },
  { value: 'boxes', label: 'Tea Boxes' },
  { value: 'pouches', label: 'Tea Pouches' },
  { value: 'bulk', label: 'Bulk Packing' }
];