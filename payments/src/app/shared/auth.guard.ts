import {  CanActivateFn, Router } from "@angular/router"
import { AuthService } from "./services/auth.service"
import { inject } from "@angular/core"

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService)
  const router = inject(Router)

  if (authService.isLoggedIn()) {
    const requiredRoles = route.data["requiredRoles"] as string[] // Get required roles from route data

    if (requiredRoles && requiredRoles.length > 0) {
      // Check if the user has any of the required roles
      if (authService.hasAnyRole(requiredRoles)) {
        return true
      } else {
        // User does not have the required role, redirect to forbidden page
        router.navigate(["/forbidden"]) // Create a forbidden page component
        return false
      }
    }
    // If no specific roles are required, just being logged in is enough
    return true
  } else {
    // Not logged in, redirect to sign-in page
    router.navigate(["/sign-in"])
    return false
  }
}
