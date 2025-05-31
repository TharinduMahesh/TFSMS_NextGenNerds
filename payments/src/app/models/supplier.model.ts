import { GreenLeaf } from './green-leaf.model';
import { Payment } from './payment.model';
import { Advance } from './advance.model';
import { Debt } from './debt.model';
import { Incentive } from './incentive.model';

export interface Supplier {
  SupplierId: number;
  Name: string;
  contact?: string;
  email?: string;
  greenLeafData?: GreenLeaf[];
  payments?: Payment[];
  advances?: Advance[];
  debts?: Debt[];
  incentives?: Incentive[];
}
