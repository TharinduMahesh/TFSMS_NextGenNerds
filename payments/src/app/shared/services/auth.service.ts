import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { TOKEN_KEY } from '../constans';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }
  
  baseUrl = 'http://localhost:5274/api';

  createUser(formData: any) {
     return this.http.post<any>(this.baseUrl + '/sign-up', formData);
  } 

  signin(formData: any) {
    return this.http.post<any>(this.baseUrl + '/sign-in', formData);
  } 
  
  isLoggedIn() {
    return this.gettoken() !== null ? true : false;
  }

  savetoken(token: string) {
    if (this.isBrowser) {
      localStorage.setItem(TOKEN_KEY, token);
    }
  }
  
  gettoken() {
    if (this.isBrowser) {
      return localStorage.getItem(TOKEN_KEY);
    }
    return null;
  }
  
  deletetoken() {
    if (this.isBrowser) {
      localStorage.removeItem(TOKEN_KEY);
    }
  }

  getClaims() {
    if (this.isBrowser && this.gettoken()) {
      return JSON.parse(window.atob(this.gettoken()!.split('.')[1]));
    }
    return null;
  }
}