import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
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

  getReports(): Observable<Report[]> {
    return this.http.get<Report[]>(this.apiUrl);
  }
  
  updateReport(report: Report): Observable<Report> {
    const url = `${this.apiUrl}/${report.dispatchID}`;
    return this.http.put<Report>(url, report, { 
      headers: this.getHeaders()
    });
  }

  deleteReport(dispatchID: string): Observable<void> {
    const url = `${this.apiUrl}/${dispatchID}`;
    return this.http.delete<void>(url);
  }

  createReport(report: Report): Observable<Report> {
    return this.http.post<Report>(this.apiUrl, report, { 
      headers: this.getHeaders()
    });
  }
}