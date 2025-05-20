import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { Observable,catchError, throwError } from 'rxjs';
import { Report } from '../models/report.interface';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private apiUrl = 'http://localhost:5105/api/reports';  // Changed to HTTP and correct port

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }

  // getReports(): Observable<Report[]> {
  //   return this.http.get<Report[]>(this.apiUrl);
  // }

  getReports(): Observable<Report[]> {
    return this.http.get<Report[]>(this.apiUrl).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Server error:', error.error);
        let errorMessage = 'Unknown error occurred';
        if (error.error instanceof ErrorEvent) {
          // Client-side error
          errorMessage = error.error.message;
        } else {
          // Server-side error
          errorMessage = error.error?.Message || error.message;
        }
        return throwError(() => new Error(errorMessage));
      })
    );
  }
  
  updateReport(report: Report): Observable<Report> {
    const url = `${this.apiUrl}/${report.id}`;
    return this.http.put<Report>(url, report, { 
      headers: this.getHeaders()
    });
  }

  deleteReport(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url);
  }

  createReport(report: Report): Observable<Report> {
    return this.http.post<Report>(this.apiUrl, report, { 
      headers: this.getHeaders()
    });
  }
}