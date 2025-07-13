import type { AbstractControl, ValidatorFn } from "@angular/forms"

export class ConfirmPasswordValidator {
  /**
   * Validator that checks if two form controls have matching values.
   * Useful for "password" and "confirm password" fields.
   *
   * @param controlName The name of the first control (e.g., 'password').
   * @param matchingControlName The name of the second control (e.g., 'confirmPassword').
   * @returns A ValidatorFn that returns a `mismatch` error if values don't match, otherwise `null`.
   */
  static MatchValidator(controlName: string, matchingControlName: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const password = control.get(controlName)
      const confirmPassword = control.get(matchingControlName)

      if (!password || !confirmPassword) {
        // If controls are not found, return null (no error)
        return null
      }

      // Set error on matchingControl if values don't match
      if (password.value !== confirmPassword.value) {
        confirmPassword.setErrors({ mismatch: true })
        return { mismatch: true } // Return error for the form group
      } else {
        // If they match, ensure no mismatch error is set on confirmPassword
        if (confirmPassword.hasError("mismatch")) {
          confirmPassword.setErrors(null)
        }
        return null // No error
      }
    }
  }
}
