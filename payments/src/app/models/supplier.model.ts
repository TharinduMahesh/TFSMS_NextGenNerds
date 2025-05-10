import { GreenLeaf } from './green-leaf.model';
import { Payment } from './payment.model';
import { Advance } from './advance.model';
import { Debt } from './debt.model';
import { Incentive } from './incentive.model';

export interface Supplier {
  supplierId: number;
  name: string;
  area?: string;
  contact?: string;
  email?: string;
  status: string;
  registrationDate?: Date;
  greenLeafData?: GreenLeaf[];
  payments?: Payment[];
  advances?: Advance[];
  debts?: Debt[];
  incentives?: Incentive[];
}