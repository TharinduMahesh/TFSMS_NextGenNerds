import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { YieldResponse, YieldPayload } from '../../models/RouteYeildMaintain.model';

@Injectable({
  providedIn: 'root',
})
export class RyService {
  private apiUrl = 'https://localhost:7263/api/routeyieldmaintain';

  constructor(private http: HttpClient) {}

  getAllYieldLists(): Observable<YieldResponse[]> {
    return this.http.get<YieldResponse[]>(this.apiUrl);
  }

  getYieldListById(id: number): Observable<YieldResponse> {
    return this.http.get<YieldResponse>(`${this.apiUrl}/${id}`);
  }
  
  createYieldList(yieldPayload: YieldPayload): Observable<YieldResponse> {
    return this.http.post<YieldResponse>(this.apiUrl, yieldPayload);
  }

  updateYieldList(id: number, yieldPayload: YieldPayload): Observable<YieldResponse> {
    return this.http.put<YieldResponse>(`${this.apiUrl}/${id}`, yieldPayload);
  }

  deleteYieldList(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}