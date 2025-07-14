import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { VehicleResponse, CreateUpdateVehiclePayload } from '../../models/Logistic and Transport/VehicleManagement.model';

@Injectable({
    providedIn: 'root'
})
export class VehicleService {
    private vehiclesApiUrl = 'https://localhost:7263/api/Vehicles';

    constructor(private http: HttpClient) { }

    getAllVehicles(): Observable<VehicleResponse[]> {
        return this.http.get<VehicleResponse[]>(this.vehiclesApiUrl).pipe(catchError(this.handleError));
    }

    getVehicleById(id: number): Observable<VehicleResponse> {
        return this.http.get<VehicleResponse>(`${this.vehiclesApiUrl}/${id}`).pipe(catchError(this.handleError));
    }

    createVehicle(payload: CreateUpdateVehiclePayload): Observable<VehicleResponse> {
        return this.http.post<VehicleResponse>(this.vehiclesApiUrl, payload).pipe(catchError(this.handleError));
    }

    updateVehicle(id: number, payload: CreateUpdateVehiclePayload): Observable<VehicleResponse> {
        return this.http.put<VehicleResponse>(`${this.vehiclesApiUrl}/${id}`, payload).pipe(catchError(this.handleError));
    }

    deleteVehicle(id: number): Observable<void> {
        return this.http.delete<void>(`${this.vehiclesApiUrl}/${id}`).pipe(catchError(this.handleError));
    }

    private handleError(error: HttpErrorResponse): Observable<never> {
        const errorMessage = error.error?.message || error.error?.title || error.message || 'An unknown server error occurred.';
        console.error('API Error in VehicleService:', errorMessage, error);
        return throwError(() => new Error(errorMessage));
    }
}