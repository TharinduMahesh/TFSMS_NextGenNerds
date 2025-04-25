import { Injectable } from "@angular/core"
import {  HttpClient, HttpHeaders } from "@angular/common/http"
import { Observable } from "rxjs"
import  { AuthService } from "./auth.service"

@Injectable({
  providedIn: "root",
})
export class UserService {
  private baseUrl = "http://localhost:5274/api"

  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) {}

  getUserProfile(): Observable<any> {
    const token = this.authService.gettoken()

    if (!token) {
      throw new Error("No authentication token found")
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    })

    return this.http.get(`${this.baseUrl}/UserProfile`, { headers })
  }
}
