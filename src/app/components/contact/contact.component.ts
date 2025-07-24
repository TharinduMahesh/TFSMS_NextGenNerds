import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { HeaderComponent } from "../header/header.component"
import { FooterComponent } from "../footer/footer.component"
import { HttpClient } from "@angular/common/http"
import { AuthService } from "../../shared/services/auth.service"
import { UserService } from "../../shared/services/user.service"

@Component({
  selector: "app-contact",
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, FooterComponent],
  templateUrl: "./contact.component.html",
  styleUrls: ["./contact.component.css"],
})
export class ContactComponent implements OnInit {
  contactForm = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  }

  isSubmitting = false
  submitSuccess = false
  submitError = false

  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  ngOnInit() {
    // If user is logged in, pre-fill the form with user data
    if (this.authService.isLoggedIn()) {
      this.userService.getUserProfile().subscribe({
        next: (userData: any) => {
          if (userData) {
            this.contactForm.firstName = userData.firstName || ""
            this.contactForm.lastName = userData.lastName || ""
            this.contactForm.email = userData.email || ""
            this.contactForm.phone = userData.MobileNo || ""
          }
        },
        error: (error) => {
          console.error("Error fetching user data", error)
        },
      })
    }
  }

  onSubmit() {
    this.isSubmitting = true
    this.submitSuccess = false
    this.submitError = false

    console.log("Contact form submitted", this.contactForm)

    // Simulate API call
    setTimeout(() => {
      this.isSubmitting = false
      this.submitSuccess = true

      // Reset form after successful submission
      setTimeout(() => {
        if (this.submitSuccess) {
          this.contactForm.message = ""
        }
      }, 3000)
    }, 1500)

   

    // In a real application, you would send the form data to your backend:
    /*
    this.http.post('your-api-endpoint/contact', this.contactForm).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        this.submitSuccess = true;
        this.contactForm.message = '';
      },
      error: (error) => {
        this.isSubmitting = false;
        this.submitError = true;
        console.error('Error submitting contact form', error);
      }
    });
    */
  }
}
