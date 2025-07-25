// models/farmer-loan.interface.ts
export interface FarmerLoan {
    id: number;
    farmerId: number;
    farmerName: string;
    loanAmount: number;
    loanDate: string;
    loanTerm: number; // Duration in months
    repayments: number;
    outstandingBalance: number;
    incentives: number;
    loanStatus: 'Active' | 'Paid Off' | 'Defaulted';
  }
  