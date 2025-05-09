
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { YieldList } from '../../models/rview.model';

@Injectable({
  providedIn: 'root',
})

export class RyService {
  private apiUrl = 'https://localhost:7263/api/routeyieldmaintain';
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
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  updateYieldList(id: number, updated: YieldList): Observable<YieldList> {
    return this.http.put<YieldList>(`${this.apiUrl}/${id}`, updated);
  }
  
}
