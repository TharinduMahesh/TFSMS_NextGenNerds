// src/app/services/rytrack.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { YieldList } from '../models/rview.model';

@Injectable({
  providedIn: 'root',
})
export class RytrackService {
  private apiUrl = 'https://localhost:7263/api/rytrack';
  constructor(private http: HttpClient) {}

  // Get all YieldLists
  getAllYieldLists(): Observable<YieldList[]> {
    return this.http.get<YieldList[]>(this.apiUrl);
  }

  // Create a new YieldList
  createYieldList(yieldList: YieldList): Observable<YieldList> {
    return this.http.post<YieldList>(this.apiUrl, yieldList);
  }

  // Get YieldList by ID
  getYieldListById(id: number): Observable<YieldList> {
    return this.http.get<YieldList>(`${this.apiUrl}/${id}`);
  }
  deleteYieldList(id: number): Observable<void> {
    return this.http.delete<void>(`https://localhost:7263/api/rytrack/${id}`);
  }
  
}
