// import { Injectable, PLATFORM_ID, Inject } from "@angular/core" // Ensure Inject and PLATFORM_ID are imported
// import { HttpClient } from "@angular/common/http"
// import { isPlatformBrowser } from "@angular/common"
// import { TOKEN_KEY } from "../constans"
// import { JwtPayload } from "jwt-decode" // You might need to install jwt-decode: npm install jwt-decode

// interface CustomJwtPayload extends JwtPayload {
//   role?: string // Add role property to the JWT payload interface
// }

// @Injectable({
//   providedIn: "root",
// })
// export class AuthService {
//   private isBrowser: boolean;

//   constructor(
//     private http: HttpClient,
//     @Inject(PLATFORM_ID) private platformId: Object, // <-- Corrected: @Inject(PLATFORM_ID) is back
//   ) {
//     this.isBrowser = isPlatformBrowser(this.platformId)
//   }

//   baseUrl = "http://localhost:5274/api"

//   // createUser(formData: any) {
//   //   // This endpoint is for self-registration, which we are moving away from for role assignment
//   //   // It will now assign a default 'public-user' role on the backend.
//   //   return this.http.post<any>(this.baseUrl + "/signup", formData)
//   // }

//   signin(formData: any) {
//      if(formData.password === "tfsms@123"){
//       alert("Please change your password after signing in for the first time.");
//       return this.http.post<any>(this.baseUrl + "/set-password", formData);
//      } 
//     return this.http.post<any>(this.baseUrl + "/signin", formData)
//   }

//   isLoggedIn() {
//     return this.gettoken() !== null ? true : false
//   }

//   savetoken(token: string) {
//     if (this.isBrowser) {
//       localStorage.setItem(TOKEN_KEY, token)
//     }
//   }

//   gettoken() {
//     if (this.isBrowser) {
//       return localStorage.getItem(TOKEN_KEY)
//     }
//     return null
//   }

//   deletetoken() {
//     if (this.isBrowser) {
//       localStorage.removeItem(TOKEN_KEY)
//     }
//   }

//   getClaims(): CustomJwtPayload | null {
//     if (this.isBrowser && this.gettoken()) {
//       try {
//         const token = this.gettoken()
//         if (token) {
//           const decodedToken: CustomJwtPayload = JSON.parse(window.atob(token.split(".")[1]))
//           return decodedToken
//         }
//       } catch (e) {
//         console.error("Error decoding token:", e)
//         return null
//       }
//     }
//     return null
//   }

//   hasRole(requiredRole: string): boolean {
//     const claims = this.getClaims()
//     if (claims && claims.role) {
//       return claims.role === requiredRole
//     }
//     return false
//   }

//   hasAnyRole(requiredRoles: string[]): boolean {
//     const claims = this.getClaims()
//     if (claims && claims.role) {
//       return requiredRoles.includes(claims.role)
//     }
//     return false
//   }

//   // --- New Admin and Password Reset Methods ---

//   // Admin creates a new user
//   createUserByAdmin(userData: {
//     Email: string;
//     FirstName: string;
//     LastName: string;
//     MobileNo: string;
//     Role: string;
//     password: string; // ✅ Added password field
//   }) {
//     return this.http.post<any>(`${this.baseUrl}/admin/users`, userData)
//   }
//   // Admin updates a user
//   updateUserByAdmin(userId: string, userData: { FirstName: string; LastName: string; MobileNo: string; Role: string }) {
//     return this.http.put<any>(`${this.baseUrl}/admin/users/${userId}`, userData)
//   }

//   // Admin deletes a user
//   deleteUserByAdmin(userId: string) {
//     return this.http.delete<any>(`${this.baseUrl}/admin/users/${userId}`)
//   }

//   // Admin gets all users
//   getAllUsers() {
//     return this.http.get<any[]>(`${this.baseUrl}/admin/users`)
//   }

//   // Admin gets a single user by ID
//   getUserById(userId: string) {
//     return this.http.get<any>(`${this.baseUrl}/admin/users/${userId}`)
//   }

//   // User sets a new password using a one-time token
//   // setNewPassword( username:string ,newPassword: string ) {
//   //   return this.http.post<any>(`${this.baseUrl}/set-password`, { Username: username,NewPassword: newPassword })
//   // }

//   setNewPassword(data: { token: string; newPassword: string }) {
//   return this.http.post<any>(`${this.baseUrl}/set-password`, data);
// }

// }


import { Injectable, PLATFORM_ID, Inject } from "@angular/core" // Ensure Inject and PLATFORM_ID are imported
import  { HttpClient } from "@angular/common/http"
import { isPlatformBrowser } from "@angular/common"
import { TOKEN_KEY } from "../constans"
import  { JwtPayload } from "jwt-decode" // You might need to install jwt-decode: npm install jwt-decode
import { Router } from "@angular/router" // Import Router
import { Observable } from "rxjs"
import { BehaviorSubject } from "rxjs"

interface CustomJwtPayload extends JwtPayload {
  role?: string // Add role property to the JWT payload interface
}

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private loggedInState = new BehaviorSubject<boolean>(this.hasToken());
  isLoggedIn$ = this.loggedInState.asObservable();
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    private router: Router, // Inject Router
    @Inject(PLATFORM_ID) private platformId: Object, // <-- Corrected: @Inject(PLATFORM_ID) is back
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId)
  }

  baseUrl = "https://localhost:7203/api"

  private hasToken(): boolean {
    if (this.isBrowser) {
      return localStorage.getItem(TOKEN_KEY) !== null;
    }
    return false;
  }

  createUser(formData: any) {
    // This endpoint is for self-registration, which we are moving away from for role assignment
    // It will now assign a default 'public-user' role on the backend.
    return this.http.post<any>(this.baseUrl + "/signup", formData)
  }

  signin(formData: any) {
    return this.http.post<any>(this.baseUrl + "/signin", formData)
  }

  isLoggedIn() {
    return this.gettoken() !== null ? true : false
  }

  savetoken(token: string) {
    if (this.isBrowser) {
      localStorage.setItem(TOKEN_KEY, token);
      
    }
  }

  gettoken() {
    if (this.isBrowser) {
      return localStorage.getItem(TOKEN_KEY)
    }
    return null
  }

  deletetoken() {
    if (this.isBrowser) {
      localStorage.removeItem(TOKEN_KEY);
            this.loggedInState.next(false);

    }
  }

  getClaims(): CustomJwtPayload | null {
    if (this.isBrowser && this.gettoken()) {
      try {
        const token = this.gettoken()
        if (token) {
          const decodedToken: CustomJwtPayload = JSON.parse(window.atob(token.split(".")[1]))
          return decodedToken
        }
      } catch (e) {
        console.error("Error decoding token:", e)
        return null
      }
    }
    return null
  }

  hasRole(requiredRole: string): boolean {
    const claims = this.getClaims()
    if (claims && claims.role) {
      return claims.role === requiredRole
    }
    return false
  }

  hasAnyRole(requiredRoles: string[]): boolean {
    const claims = this.getClaims()
    if (claims && claims.role) {
      return requiredRoles.includes(claims.role)
    }
    return false
  }

  // --- New Admin and Password Reset Methods ---

  // Admin creates a new user (no password sent from frontend)
  createUserByAdmin(userData: { Email: string; FirstName: string; LastName: string; MobileNo: string; Role: string }) {
    return this.http.post<any>(`${this.baseUrl}/api/admin/users`, userData)
  }

  // Admin updates a user
  updateUserByAdmin(userId: string, userData: { FirstName: string; LastName: string; MobileNo: string; Role: string }) {
    return this.http.put<any>(`${this.baseUrl}/api/admin/users/${userId}`, userData)
  }

  // Admin deletes a user
  deleteUserByAdmin(userId: string) {
    return this.http.delete<any>(`${this.baseUrl}/api/admin/users/${userId}`)
  }

  // Admin gets all users
  getAllUsers() {
    return this.http.get<any[]>(`${this.baseUrl}/api/admin/users`)
  }

  // Admin gets a single user by ID
  getUserById(userId: string) {
    return this.http.get<any>(`${this.baseUrl}/api/admin/users/${userId}`)
  }

  // User sets a new password using a one-time token
  setNewPassword(data: { Token: string; NewPassword: string }) {
    return this.http.post<any>(`${this.baseUrl}/set-password`, data)
  }

   logout() {
    this.deletetoken(); // This handles token removal and state broadcast
    this.router.navigateByUrl('/sign-in'); // This handles the redirect
  }

  resetUserPasswordByAdmin(userId: string): Observable<any> {
    // The authInterceptor will automatically add the admin's authorization token.
    // We are sending a POST request with an empty body {} because the userId is in the URL.
    return this.http.post(`${this.baseUrl}/api/admin/users/${userId}/reset-password`, {});
  }

  isTokenValid(): boolean {
    const token = this.gettoken()
    if (!token) {
      console.log(" No token found for validation")
      return false
    }

    try {
      const payload = JSON.parse(window.atob(token.split(".")[1]))
      const currentTime = Math.floor(Date.now() / 1000)
      const isValid = payload.exp > currentTime

      console.log(" Token validation:", {
        exp: payload.exp,
        currentTime,
        isValid,
        expiresIn: payload.exp - currentTime + " seconds",
      })

      return isValid
    } catch (error) {
      console.error("Error validating token:", error)
      return false
    }
}


forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/forgot-password`, { Email: email });
  }
}
