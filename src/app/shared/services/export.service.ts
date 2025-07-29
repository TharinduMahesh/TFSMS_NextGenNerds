import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ExportService {
  private apiUrl = "https://localhost:7197";

  constructor(private http: HttpClient) { }

  //  exportPayments(format: string): Observable<Blob> {
  //   // [THE FIX] Construct the URL correctly using the base URL and the correct path.
  //   // This was likely missing the '/api/' part.
  //   const url = `${this.apiUrl}/api/Payments/export?format=${encodeURIComponent(format)}`;
    
  //   console.log("Exporting payments from URL:", url); // Add a log for debugging

  //   return this.http.get(url, { responseType: "blob" }).pipe(
  //     catchError((error) => {
  //       console.error("Error exporting payments:", error);
  //       // It's better to re-throw the error so the component's error block can handle it.
  //       return throwError(() => new Error("Failed to export payments file."));
  //     })
  //   );
  // }

   exportPayments(format: string, startDate?: string, endDate?: string): Observable<Blob> {
  const url = `${this.apiUrl}/api/Payments/export?format=${encodeURIComponent(format)}`;
    
    // Use HttpParams to safely build the query string
    let params = new HttpParams().set('format', format);

    // [THE FIX] Only add date parameters if they are valid, non-empty strings.
    if (startDate) {
      params = params.set('startDate', startDate);
    }
    if (endDate) {
      params = params.set('endDate', endDate);
    }
    
    console.log(`Exporting payments from URL: ${url} with params:`, params.toString());

    return this.http.get(url, { params: params, responseType: "blob" }).pipe(
      catchError((error) => {
        console.error("Error exporting payments:", error);
        return throwError(() => new Error("Failed to export payments file."));
      })
    );
  }

  
  exportSupplierPayments(SupplierId: number, format: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/supplier/${SupplierId}/payments?format=${format}`, { responseType: 'blob' });
  }

 

  exportIncentives(format: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/incentives?format=${format}`, { responseType: 'blob' });
  }

  downloadFile(data: Blob, filename: string): void {
    const blob = new Blob([data], { type: data.type });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  }
}