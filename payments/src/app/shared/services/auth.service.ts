import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError ,map,Observable, of } from 'rxjs';
import  {TOKEN_KEY} from '../constans';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) {}
  baseUrl = 'http://localhost:5274/api';

  createUser(formData: any) {
     return this.http.post<any>(this.baseUrl + '/sign-up', formData)
  } 

  signin(formData: any) {
    return this.http.post<any>(this.baseUrl + '/sign-in', formData)
 } 
  
 isLoggedIn(){
  return this.gettoken() !== null? true : false;
 }

 savetoken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
 }
 gettoken() {
  return localStorage.getItem(TOKEN_KEY);
 }
 
 deletetoken() {
  localStorage.removeItem(TOKEN_KEY);
 }

 getClaims() {
  return JSON.parse(window.atob(this.gettoken()!.split('.')[1]))
 }
}
