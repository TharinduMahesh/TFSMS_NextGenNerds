export interface Receipt {
    receiptNumber: string;
    date: Date;
    supplier: any;
    payment: any;
    totalDeductions: number;
    receiptDetails: {
      issuedBy: string;
      timestamp: Date;
      notes: string;
    };
  }