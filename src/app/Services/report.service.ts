import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Report {
  dispatchID: string;
  yield: string;
  bagCount: number;
  vehicleNumber: string;
  driverNIC: string;
  date: string;
  status: 'Delivered' | 'In Transit';
}

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private apiUrl = 'https://localhost:7210'; // Update with your backend URL
  // updateReport: any;

  constructor(private http: HttpClient) {}

  getReports(): Observable<Report[]> {
    return this.http.get<Report[]>(this.apiUrl);
  }
  
  updateReport(report: Report): Observable<Report> {
    const url = `${this.apiUrl}/${report.dispatchID}`;
    return this.http.put<Report>(url, report);
  }

  deleteReport(dispatchID: string): Observable<void> {
    const url = `${this.apiUrl}/${dispatchID}`;
    return this.http.delete<void>(url);
  }

  // Add methods for updating and creating reports as needed
}
