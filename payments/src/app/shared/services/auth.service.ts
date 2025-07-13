import { Injectable, PLATFORM_ID, Inject } from "@angular/core" // Ensure Inject and PLATFORM_ID are imported
import  { HttpClient } from "@angular/common/http"
import { isPlatformBrowser } from "@angular/common"
import { TOKEN_KEY } from "../constans"
import  { JwtPayload } from "jwt-decode" // You might need to install jwt-decode: npm install jwt-decode

interface CustomJwtPayload extends JwtPayload {
  role?: string // Add role property to the JWT payload interface
}

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object, // <-- Re-added @Inject(PLATFORM_ID) here
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId)
  }

  baseUrl = "http://localhost:5274/api"

  createUser(formData: any) {
    // The role is no longer sent from the frontend, it's assigned on the backend
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
      localStorage.setItem(TOKEN_KEY, token)
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
      localStorage.removeItem(TOKEN_KEY)
    }
  }

  getClaims(): CustomJwtPayload | null {
    // Update return type to CustomJwtPayload
    if (this.isBrowser && this.gettoken()) {
      try {
        const token = this.gettoken()
        if (token) {
          // Decode the token to get claims, including the role
          // You might need to install 'jwt-decode' for this: npm install jwt-decode
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

  // New method to check if user has a specific role
  hasRole(requiredRole: string): boolean {
    const claims = this.getClaims()
    if (claims && claims.role) {
      return claims.role === requiredRole
    }
    return false
  }

  // New method to check if user has any of the required roles
  hasAnyRole(requiredRoles: string[]): boolean {
    const claims = this.getClaims()
    if (claims && claims.role) {
      return requiredRoles.includes(claims.role)
    }
    return false
  }
}
