import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http : HttpClient,
    private authService: AuthService
 ) { }

 baseUrl = 'http://localhost:5183/api';

 getUserProfile() {
   return this.http.get(this.baseUrl + '/userprofile')
    }
}
