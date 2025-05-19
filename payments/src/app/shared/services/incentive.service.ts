import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import { Incentive } from '../../models/incentive.model';
import { environment } from '../../shared/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IncentiveService {
  private apiUrl = `${environment.apiBaseUrl}/api/incentives`;

  constructor(private http: HttpClient) { }

  getAllIncentives(): Observable<Incentive[]> {
    console.log("Fetching incentives from:", this.apiUrl);
    return this.http.get<any>(this.apiUrl).pipe(
      map((response) => {
        console.log("Raw API response for incentives:", response);

        // Handle the response based on its structure
        if (Array.isArray(response)) {
          console.log("Response is an array with length:", response.length);
          return response;
        } else if (response && typeof response === "object") {
          // If the response is an object, extract the data
          if (Array.isArray(response.data)) {
            console.log("Response has data array with length:", response.data.length);
            return response.data;
          } else if (response.data) {
            console.log("Response has data object, converting to array");
            return [response.data];
          } else {
            // Check if the response itself might be a single incentive object
            if (response.IncentiveId !== undefined || response.incentiveId !== undefined) {
              console.log("Response appears to be a single incentive object, converting to array");
              return [response];
            }

            // Last resort: try to extract any array-like property from the response
            const possibleArrayProps = Object.keys(response).filter(
              (key) =>
                Array.isArray(response[key]) &&
                response[key].length > 0 &&
                (response[key][0].IncentiveId !== undefined || response[key][0].incentiveId !== undefined),
            );

            if (possibleArrayProps.length > 0) {
              console.log(`Found possible incentives array in property: ${possibleArrayProps[0]}`);
              return response[possibleArrayProps[0]];
            }

            console.log("Could not find incentives data in response, returning empty array");
            return [];
          }
        }

        console.log("Response format not recognized, returning empty array");
        return [];
      }),
      catchError((error) => {
        console.error("Error fetching all incentives:", error);
        return of([]);
      }),
    );
  }

  getIncentive(id: number): Observable<Incentive | null> {
    return this.http.get<Incentive>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error(`Error fetching incentive with id ${id}:`, error);
        return of(null);
      })
    );
  }

  getIncentivesBySupplier(supplierId: number): Observable<Incentive[]> {
    return this.http.get<any>(`${this.apiUrl}/supplier/${supplierId}`).pipe(
      map((response) => {
        if (Array.isArray(response)) {
          return response;
        } else if (response && typeof response === "object") {
          return Array.isArray(response.data) ? response.data : [response];
        }
        return [];
      }),
      catchError(error => {
        console.error(`Error fetching incentives for supplier ${supplierId}:`, error);
        return of([]);
      })
    );
  }

  getCurrentIncentiveForSupplier(supplierId: number): Observable<Incentive | null> {
    return this.http.get<Incentive>(`${this.apiUrl}/supplier/${supplierId}/current`).pipe(
      catchError(error => {
        console.error(`Error fetching current incentive for supplier ${supplierId}:`, error);
        return of(null);
      })
    );
  }

  createIncentive(incentive: Incentive): Observable<Incentive | null> {
    return this.http.post<Incentive>(this.apiUrl, incentive).pipe(
      catchError(error => {
        console.error('Error creating incentive:', error);
        return of(null);
      })
    );
  }

  updateIncentive(incentive: Incentive): Observable<Incentive | null> {
    return this.http.put<Incentive>(`${this.apiUrl}/${incentive.IncentiveId}`, incentive).pipe(
      catchError(error => {
        console.error(`Error updating incentive with id ${incentive.IncentiveId}:`, error);
        return of(null);
      })
    );
  }

  deleteIncentive(id: number): Observable<boolean> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      map(() => true),
      catchError(error => {
        console.error(`Error deleting incentive with id ${id}:`, error);
        return of(false);
      })
    );
  }

  getTotalIncentivesCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/count`).pipe(
      map(response => typeof response === 'number' ? response : 0),
      catchError(error => {
        console.error('Error fetching total incentives count:', error);
        return of(0);
      })
    );
  }

  getTotalQualityBonusAmount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/totalQualityBonus`).pipe(
      map(response => typeof response === 'number' ? response : 0),
      catchError(error => {
        console.error('Error fetching total quality bonus amount:', error);
        return of(0);
      })
    );
  }

  getTotalLoyaltyBonusAmount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/totalLoyaltyBonus`).pipe(
      map(response => typeof response === 'number' ? response : 0),
      catchError(error => {
        console.error('Error fetching total loyalty bonus amount:', error);
        return of(0);
      })
    );
  }
}