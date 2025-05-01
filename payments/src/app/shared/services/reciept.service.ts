import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map } from 'rxjs';
import { Payment } from '../../models/payment.model';
import { Supplier } from '../../models/supplier.model';
import { Receipt } from '../../models/receipt.model';
import { SupplierService } from './supplier.service';

@Injectable({
  providedIn: 'root'
})
export class ReceiptService {
  private apiUrl =  "http://localhost:5274/api/receipts";

  constructor(
    private http: HttpClient,
    private supplierService: SupplierService
  ) { }

  generateReceipt(payment: Payment): Observable<Receipt> {
    // Get supplier details to include in the receipt
    return this.supplierService.getSupplier(payment.supplierId).pipe(
      map(supplier => {
        return {
          receiptNumber: `REC-${payment.paymentId.toString().padStart(5, '0')}`,
          date: payment.paymentDate,
          supplier: supplier,
          payment: payment,
          totalDeductions: payment.advanceDeduction + payment.debtDeduction,
          receiptDetails: {
            issuedBy: 'System',
            timestamp: new Date(),
            notes: 'Thank you for your business'
          }
        };
      })
    );
  }

  saveReceipt(receipt: Receipt): Observable<Receipt> {
    return this.http.post<Receipt>(this.apiUrl, receipt);
  }

  getReceipt(receiptNumber: string): Observable<Receipt> {
    return this.http.get<Receipt>(`${this.apiUrl}/${receiptNumber}`);
  }

  getReceiptsBySupplier(supplierId: number): Observable<Receipt[]> {
    return this.http.get<Receipt[]>(`${this.apiUrl}/supplier/${supplierId}`);
  }

  printReceipt(payment: Payment): void {
    this.generateReceipt(payment).subscribe({
      next: (receiptData) => {
        // Create a printable version of the receipt
        const printWindow = window.open('', '_blank');
        if (printWindow) {
          printWindow.document.write(`
            <html>
              <head>
                <title>Payment Receipt #${receiptData.receiptNumber}</title>
                <style>
                  body { font-family: Arial, sans-serif; margin: 20px; }
                  .header { text-align: center; margin-bottom: 20px; }
                  .receipt { border: 1px solid #ccc; padding: 20px; max-width: 800px; margin: 0 auto; }
                  .supplier-info, .payment-info { margin-bottom: 20px; }
                  .row { display: flex; margin-bottom: 5px; }
                  .label { font-weight: bold; width: 200px; }
                  .value { flex: 1; }
                  .total { font-size: 1.2em; font-weight: bold; margin-top: 20px; text-align: right; }
                  .footer { margin-top: 30px; text-align: center; font-size: 0.9em; color: #666; }
                </style>
              </head>
              <body>
                <div class="receipt">
                  <div class="header">
                    <h2>Payment Receipt</h2>
                    <p>Receipt Number: ${receiptData.receiptNumber}</p>
                    <p>Date: ${new Date(receiptData.date).toLocaleDateString()}</p>
                  </div>
                  
                  <div class="supplier-info">
                    <h3>Supplier Information</h3>
                    <div class="row">
                      <div class="label">Supplier ID:</div>
                      <div class="value">${receiptData.supplier.supplierId}</div>
                    </div>
                    <div class="row">
                      <div class="label">Name:</div>
                      <div class="value">${receiptData.supplier.name}</div>
                    </div>
                    <div class="row">
                      <div class="label">Area:</div>
                      <div class="value">${receiptData.supplier.area}</div>
                    </div>
                    <div class="row">
                      <div class="label">Contact:</div>
                      <div class="value">${receiptData.supplier.contact}</div>
                    </div>
                  </div>
                  
                  <div class="payment-info">
                    <h3>Payment Details</h3>
                    <div class="row">
                      <div class="label">Green Leaf Weight:</div>
                      <div class="value">${receiptData.payment.leafWeight} kg</div>
                    </div>
                    <div class="row">
                      <div class="label">Rate:</div>
                      <div class="value">LKR ${receiptData.payment.rate} per kg</div>
                    </div>
                    <div class="row">
                      <div class="label">Gross Amount:</div>
                      <div class="value">LKR ${receiptData.payment.grossAmount.toLocaleString()}</div>
                    </div>
                    <div class="row">
                      <div class="label">Advance Deduction:</div>
                      <div class="value">LKR ${receiptData.payment.advanceDeduction.toLocaleString()}</div>
                    </div>
                    <div class="row">
                      <div class="label">Debt Deduction:</div>
                      <div class="value">LKR ${receiptData.payment.debtDeduction.toLocaleString()}</div>
                    </div>
                    <div class="row">
                      <div class="label">Incentive Addition:</div>
                      <div class="value">LKR ${receiptData.payment.incentiveAddition.toLocaleString()}</div>
                    </div>
                    <div class="row">
                      <div class="label">Payment Method:</div>
                      <div class="value">${receiptData.payment.paymentMethod}</div>
                    </div>
                  </div>
                  
                  <div class="total">
                    <div class="row">
                      <div class="label">Net Amount Paid:</div>
                      <div class="value">LKR ${receiptData.payment.netAmount.toLocaleString()}</div>
                    </div>
                  </div>
                  
                  <div class="footer">
                    <p>Issued by: ${receiptData.receiptDetails.issuedBy}</p>
                    <p>Timestamp: ${receiptData.receiptDetails.timestamp.toLocaleString()}</p>
                    <p>${receiptData.receiptDetails.notes}</p>
                  </div>
                </div>
              </body>
            </html>
          `);
          printWindow.document.close();
          printWindow.print();
        }
      },
      error: (err) => {
        console.error('Error generating receipt:', err);
      }
    });
  }

  downloadReceiptPDF(payment: Payment): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/pdf/${payment.paymentId}`, { responseType: 'blob' });
  }
}