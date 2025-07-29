

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

// In src/app/shared/services/user.service.ts

import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class UserService {
  private baseUrl = "https://localhost:7197/api/UserProfile";

  constructor(private http: HttpClient) {}

  getUserProfile(): Observable<any> {
    return this.http.get(`${this.baseUrl}/`);
  }

  updateUserProfile(userData: { FirstName: string; LastName: string; MobileNo: string }): Observable<any> {
    return this.http.put(`${this.baseUrl}/`, userData);
  }

  changePassword(passwordData: { currentPassword: string; newPassword: string }): Observable<any> {
    
    const requestBody = {
      CurrentPassword: passwordData.currentPassword,
      NewPassword: passwordData.newPassword
    };

    return this.http.post(`${this.baseUrl}/change-password`, requestBody);
  }
}
