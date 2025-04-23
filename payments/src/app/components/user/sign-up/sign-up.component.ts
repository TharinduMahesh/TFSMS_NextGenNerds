

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../../header/header.component';
import { FooterComponent } from '../../footer/footer.component';
import { AbstractControl, ValidatorFn, Validators } from '@angular/forms';
import { AuthService } from '../../../shared/services/auth.service';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { FirstKeyPipe } from '../../../shared/pipes/first-key-pipe.pipe';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HeaderComponent, FooterComponent,ReactiveFormsModule,FirstKeyPipe],
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  form: any;
       isSubmitted: boolean = false;

       passwordMatchValidator: ValidatorFn = (control: AbstractControl): null => {
        const password = control.get('password');
        const confirmPassword = control.get('confirmPassword');

        if (password && confirmPassword && password.value !== confirmPassword.value) {
            confirmPassword?.setErrors({ mismatch: true });
        } else {
            confirmPassword?.setErrors(null);
        }
        return null;
       };

       constructor(public formBuilder: FormBuilder,
       private authService: AuthService,
      private router:Router) {
        
        
           this.form = this.formBuilder.group({
               Name: ['',Validators.required],
               Email: ['',[Validators.required,Validators.email]],
               password: ['',[
                Validators.required,
                Validators.minLength(6),
                Validators.pattern(/(?=.*[0-9])(?=.*[!@#$%^&*])/)]],
               confirmPassword: ['']
           },{validators: this.passwordMatchValidator})

           
       }

       ngOnInit(): void {
        if(this.authService.isLoggedIn()) {
          this.router.navigateByUrl('/dashboard');
        }
      }

       onSubmit() {
            this.isSubmitted = true;
            if (this.form.valid) {
              this.authService.createUser(this.form.value)
              .subscribe({
                next: (response :any)=> {
                  if(response.succeeded) {
                    console.log("User registered successfully", response);
                    this.form.reset();
                    this.isSubmitted = false;
                  }
                  console.log(response);
                },
                error: error => {
                  console.error("Error registering user", error);
                }

            });
       }
      }

       hasDisplayError(controlName: string): Boolean {
          const control = this.form.get(controlName);
          return Boolean(control?.invalid) && 
          (this.isSubmitted || Boolean(control?.touched) || Boolean(control?.dirty)); ;
       }

  menuOpen = false;

  toggleMenu(): void {
    console.log("Hamburger menu clicked!");
    this.menuOpen = !this.menuOpen;
  }
}