

// import { Injectable } from "@angular/core"
// import {  HttpClient, HttpHeaders } from "@angular/common/http"
// import  { Observable } from "rxjs"
// import  { AuthService } from "./auth.service"

// @Injectable({
//   providedIn: "root",
// })
// export class UserService {
//   private baseUrl = "https://localhost:7203/api"
//   constructor(
//     private http: HttpClient,
//     private authService: AuthService,
//   ) {}

//   getUserProfile(): Observable<any> {
//     const token = this.authService.gettoken()
//     if (!token) {
//       throw new Error("No authentication token found")
//     }
//     const headers = new HttpHeaders({
//       Authorization: `Bearer ${token}`,
//     })
//     return this.http.get(`${this.baseUrl}/UserProfile`, { headers })
//   }

//   updateUserProfile(userData: { FirstName: string; LastName: string; MobileNo: string }): Observable<any> {
//     const token = this.authService.gettoken()
//     if (!token) {
//       throw new Error("No authentication token found")
//     }
//     const headers = new HttpHeaders({
//       Authorization: `Bearer ${token}`,
//     })
//     return this.http.put(`${this.baseUrl}/UserProfile`, userData, { headers })
//   }

//    changePassword(passwordData: { currentPassword: string; newPassword: string }): Observable<any> {
//         const token = this.authService.gettoken()
//     if (!token) {
//       throw new Error("No authentication token found")
//     }
//     const headers = new HttpHeaders({
//       Authorization: `Bearer ${token}`,
//     })
//     return this.http.post(`${this.baseUrl}/UserProfile/change-password`, passwordData, {
//       headers})
//   }
// }

import { Injectable } from "@angular/core"
import {  HttpClient, HttpHeaders } from "@angular/common/http"
import  { Observable } from "rxjs"
import  { AuthService } from "./auth.service"

@Injectable({
  providedIn: "root",
})
export class UserService {
  // ✅ FIX 1: Make sure baseUrl is correct and consistent
  private baseUrl = "https://localhost:7203/api"

  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) {}

  // ✅ FIX 2: Centralized method to get auth headers
  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.gettoken()
    if (!token) {
      throw new Error("No authentication token found")
    }
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    })
  }

  getUserProfile(): Observable<any> {
    return this.http.get(`${this.baseUrl}/UserProfile`, {
      headers: this.getAuthHeaders(),
    })
  }

  updateUserProfile(userData: { FirstName: string; LastName: string; MobileNo: string }): Observable<any> {
    return this.http.put(`${this.baseUrl}/UserProfile`, userData, {
      headers: this.getAuthHeaders(),
    })
  }

  changePassword(passwordData: { currentPassword: string; newPassword: string }): Observable<any> {
  // 1. Log the action for debugging purposes.
  console.log("UserService: Calling the changePassword API endpoint.");

  const changePasswordUrl = `${this.baseUrl}/UserProfile/change-password`;

  return this.http.post(changePasswordUrl, passwordData);
}

}

