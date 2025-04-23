import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from "../../header/header.component";
import { FooterComponent } from "../../footer/footer.component";
import  {AbstractControl, ReactiveFormsModule, Validators} from '@angular/forms';
import { AuthService } from '../../../shared/services/auth.service';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HeaderComponent,FooterComponent,ReactiveFormsModule,RouterLink],
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {
  form: any;
  isSubmitted: boolean = false;
   constructor(public formBuilder: FormBuilder,
    private service: AuthService,
    private router:Router
   )
     {
           
      this.form = this.formBuilder.group({
                  Email: ['' ,Validators.required],
                  password: ['',
                   Validators.required]
                
              })
   
      } 
   
      ngOnInit(): void {
        if(this.service.isLoggedIn()) {
          this.router.navigateByUrl('/dashboard');
        }
      }
    
          hasDisplayError(controlName: string): Boolean {
            const control = this.form.get(controlName);
            return Boolean(control?.invalid) && 
            (this.isSubmitted || Boolean(control?.touched) || Boolean(control?.dirty)); ;
         }

         onSubmit(){
          this.isSubmitted = true;
    
             if (this.form.valid) {
              this.service.signin(this.form.value).subscribe({
                next: (res : any) => {
                  this.service.savetoken(res.token);
                  this.router.navigateByUrl('/dashboard');
    
                },
                error:err=>{
                  if(err.status == 400){
                    alert("invalid username or password");
                  }
                    else{
                      alert("Something went wrong");
                    }
                }
              })
            }
          }   


 
  menuOpen = false;

  toggleMenu(): void {
    console.log("Hamburger menu clicked!");
    this.menuOpen = !this.menuOpen;
  }
  
  
}