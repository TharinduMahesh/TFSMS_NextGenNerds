import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of, throwError } from 'rxjs';
import { Payment } from '../../models/payment.model';
import { Supplier } from '../../models/supplier.model';
import { Receipt } from '../../models/receipt.model';
import { SupplierService } from './supplier.service';
import { environment } from '../../shared/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReceiptService {
  private apiUrl = `${environment.apiBaseUrl}/receipts`;

  constructor(
    private http: HttpClient,
    private supplierService: SupplierService
  ) { }

  generateReceipt(payment: Payment): Observable<Receipt | null> {
    if (!payment) {
      console.error('Cannot generate receipt: Payment is null or undefined');
      return of(null);
    }

    // Get supplier details to include in the receipt
    return this.supplierService.getSupplier(payment.SupplierId).pipe(
      map(supplier => {
        if (!supplier) {
          throw new Error(`Supplier with ID ${payment.SupplierId} not found`);
        }
        
        return {
          receiptNumber: `REC-${payment.PaymentId.toString().padStart(5, '0')}`,
          date: payment.PaymentDate,
          supplier: supplier,
          payment: payment,
          totalDeductions: payment.AdvanceDeduction + payment.DebtDeduction,
          receiptDetails: {
            issuedBy: 'System',
            timestamp: new Date(),
            notes: 'Thank you for your business'
          }
        };
      }),
      catchError(error => {
        console.error('Error generating receipt:', error);
        return of(null);
      })
    );
  }

  saveReceipt(receipt: Receipt): Observable<Receipt | null> {
    if (!receipt) {
      console.error('Cannot save receipt: Receipt is null or undefined');
      return of(null);
    }

    return this.http.post<Receipt>(this.apiUrl, receipt).pipe(
      catchError(error => {
        console.error('Error saving receipt:', error);
        return of(null);
      })
    );
  }

  getReceipt(receiptNumber: string): Observable<Receipt | null> {
    if (!receiptNumber) {
      console.error('Cannot get receipt: Receipt number is null or undefined');
      return of(null);
    }

    return this.http.get<Receipt>(`${this.apiUrl}/${receiptNumber}`).pipe(
      catchError(error => {
        console.error(`Error fetching receipt ${receiptNumber}:`, error);
        return of(null);
      })
    );
  }

  getReceiptsBySupplier(SupplierId: number): Observable<Receipt[]> {
    if (!SupplierId) {
      console.error('Cannot get receipts: Supplier ID is null or undefined');
      return of([]);
    }

    return this.http.get<Receipt[]>(`${this.apiUrl}/supplier/${SupplierId}`).pipe(
      map(response => Array.isArray(response) ? response : []),
      catchError(error => {
        console.error(`Error fetching receipts for supplier ${SupplierId}:`, error);
        return of([]);
      })
    );
  }

  printReceipt(payment: Payment): void {
    if (!payment) {
      console.error('Cannot print receipt: Payment is null or undefined');
      return;
    }

    this.generateReceipt(payment).subscribe({
      next: (receiptData) => {
        if (!receiptData) {
          console.error('Failed to generate receipt data for printing');
          return;
        }

        try {
          // Create a printable version of the receipt
          const printWindow = window.open('', '_blank');
          if (!printWindow) {
            console.error('Failed to open print window. Pop-up might be blocked.');
            return;
          }

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
                      <div class="value">${receiptData.supplier.SupplierId}</div>
                    </div>
                    <div class="row">
                      <div class="label">Name:</div>
                      <div class="value">${receiptData.supplier.Name || 'N/A'}</div>
                    </div>
                    <div class="row">
                      <div class="label">Area:</div>
                      <div class="value">${receiptData.supplier.area || 'N/A'}</div>
                    </div>
                    <div class="row">
                      <div class="label">Contact:</div>
                      <div class="value">${receiptData.supplier.contact || 'N/A'}</div>
                    </div>
                  </div>
                  
                  <div class="payment-info">
                    <h3>Payment Details</h3>
                    <div class="row">
                      <div class="label">Green Leaf Weight:</div>
                      <div class="value">${receiptData.payment.LeafWeight} kg</div>
                    </div>
                    <div class="row">
                      <div class="label">Rate:</div>
                      <div class="value">LKR ${receiptData.payment.Rate} per kg</div>
                    </div>
                    <div class="row">
                      <div class="label">Gross Amount:</div>
                      <div class="value">LKR ${receiptData.payment.GrossAmount.toLocaleString()}</div>
                    </div>
                    <div class="row">
                      <div class="label">Advance Deduction:</div>
                      <div class="value">LKR ${receiptData.payment.AdvanceDeduction.toLocaleString()}</div>
                    </div>
                    <div class="row">
                      <div class="label">Debt Deduction:</div>
                      <div class="value">LKR ${receiptData.payment.DebtDeduction.toLocaleString()}</div>
                    </div>
                    <div class="row">
                      <div class="label">Incentive Addition:</div>
                      <div class="value">LKR ${receiptData.payment.IncentiveAddition.toLocaleString()}</div>
                    </div>
                    <div class="row">
                      <div class="label">Payment Method:</div>
                      <div class="value">${receiptData.payment.PaymentMethod || 'N/A'}</div>
                    </div>
                  </div>
                  
                  <div class="total">
                    <div class="row">
                      <div class="label">Net Amount Paid:</div>
                      <div class="value">LKR ${receiptData.payment.NetAmount.toLocaleString()}</div>
                    </div>
                  </div>
                  
                  <div class="footer">
                    <p>Issued by: ${receiptData.receiptDetails.issuedBy}</p>
                    <p>Timestamp: ${new Date(receiptData.receiptDetails.timestamp).toLocaleString()}</p>
                    <p>${receiptData.receiptDetails.notes || ''}</p>
                  </div>
                </div>
              </body>
            </html>
          `);
          printWindow.document.close();
          
          // Add a slight delay to ensure content is loaded before printing
          setTimeout(() => {
            printWindow.print();
          }, 500);
        } catch (err) {
          console.error('Error printing receipt:', err);
        }
      },
      error: (err) => {
        console.error('Error generating receipt for printing:', err);
      }
    });
  }

  downloadReceiptPDF(payment: Payment): Observable<Blob | null> {
    if (!payment || !payment.PaymentId) {
      console.error('Cannot download receipt PDF: Invalid payment data');
      return of(null);
    }

    return this.http.get(`${this.apiUrl}/pdf/${payment.PaymentId}`, { responseType: 'blob' }).pipe(
      catchError(error => {
        console.error(`Error downloading receipt PDF for payment ${payment.PaymentId}:`, error);
        return of(null);
      })
    );
  }

  // New method to handle PDF download and save
  downloadAndSaveReceiptPDF(payment: Payment): void {
    if (!payment || !payment.PaymentId) {
      console.error('Cannot download receipt PDF: Invalid payment data');
      return;
    }

    this.downloadReceiptPDF(payment).subscribe({
      next: (blob) => {
        if (!blob) {
          console.error('Failed to download receipt PDF: No data received');
          return;
        }

        try {
          // Create a URL for the blob
          const url = window.URL.createObjectURL(blob);
          
          // Create a link element
          const link = document.createElement('a');
          link.href = url;
          link.download = `Receipt-${payment.PaymentId}.pdf`;
          
          // Append to the document, click it, and remove it
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          // Release the URL object
          window.URL.revokeObjectURL(url);
        } catch (err) {
          console.error('Error saving receipt PDF:', err);
        }
      },
      error: (err) => {
        console.error('Error downloading receipt PDF:', err);
      }
    });
  }
}