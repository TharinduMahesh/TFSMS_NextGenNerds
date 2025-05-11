import { GreenLeaf } from './green-leaf.model';
import { Payment } from './payment.model';
import { Advance } from './advance.model';
import { Debt } from './debt.model';
import { Incentive } from './incentive.model';

export interface Supplier {
  SupplierId: number;
  Name: string;
  area?: string;
  contact?: string;
  email?: string;
  joinDate?: Date;  // Changed from registrationDate to match backend
  isActive: boolean;  // Changed from status string to boolean to match backend
  greenLeafData?: GreenLeaf[];
  payments?: Payment[];
  advances?: Advance[];
  debts?: Debt[];
  incentives?: Incentive[];
}
