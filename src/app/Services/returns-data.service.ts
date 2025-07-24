// src/app/services/returns-data.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReturnEntry } from '../models/return-analysis.interface'; // FIX: Import ReturnEntry

@Injectable({
  providedIn: 'root' // Makes the service a singleton and available throughout the app
})
export class ReturnsDataService {
  // FIX: Set apiUrl to the primary HTTPS port from launchSettings.json (https://localhost:7210)
  // This matches your backend's common running URL and the correct controller route.
  private apiUrl = 'http://localhost:5105/api/ReturnsAnalysis';

  constructor(private http: HttpClient) { }

  /**
   * @method getReturns
   * @description Fetches all return entries from the backend API.
   * @returns An Observable of an array of ReturnEntry objects.
   */
  getReturns(): Observable<ReturnEntry[]> {
    return this.http.get<ReturnEntry[]>(this.apiUrl);
  }
}
