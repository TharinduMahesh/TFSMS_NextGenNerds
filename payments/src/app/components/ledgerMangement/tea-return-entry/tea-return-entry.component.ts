import { Component,  OnInit } from "@angular/core"
import {  FormBuilder, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms"
import { CommonModule } from "@angular/common"
import  { TeaReturnService } from "../../../shared/services/tea-return.service"
import  { TeaReturn  } from "../../../models/tea-return.model"
import { Invoice } from "../../../models/invoice.model"

@Component({
  selector: "app-tea-return-entry",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./tea-return-entry.component.html",
  styleUrl: "./tea-return-entry.component.css",
})
export class TeaReturnEntryComponent implements OnInit {
  teaReturns: TeaReturn[] = []
  invoices: Invoice[] = []
  teaReturnForm: FormGroup
  isLoading = false
  errorMessage = ""

  constructor(
    private teaReturnService: TeaReturnService,
    private fb: FormBuilder,
  ) {
    this.teaReturnForm = this.fb.group({
      season: ["", [Validators.required]],
      gardenMark: ["", [Validators.required]],
      invoiceNumber: ["", [Validators.required]],
      returnDate: ["", [Validators.required]],
      kilosReturned: ["", [Validators.required, Validators.min(0.01)]],
      reason: ["", [Validators.required]],
    })
  }

  ngOnInit(): void {
    this.loadTeaReturns()
    this.loadInvoices()
  }

  loadTeaReturns(): void {
    this.isLoading = true
    this.teaReturnService.getTeaReturns().subscribe({
      next: (data) => {
        this.teaReturns = data
        this.isLoading = false
      },
      error: (error) => {
        this.errorMessage = error
        this.isLoading = false
      },
    })
  }

  loadInvoices(): void {
    this.teaReturnService.getInvoices().subscribe({
      next: (data) => {
        this.invoices = data
      },
      error: (error) => {
        console.error("Error loading invoices:", error)
      },
    })
  }

  onSubmit(): void {
    if (this.teaReturnForm.valid) {
      this.isLoading = true
      const formValue = this.teaReturnForm.value

      this.teaReturnService.createTeaReturn(formValue).subscribe({
        next: (newReturn) => {
          this.teaReturns.push(newReturn)
          this.teaReturnForm.reset()
          this.isLoading = false
        },
        error: (error) => {
          this.errorMessage = error
          this.isLoading = false
        },
      })
    } else {
      this.markFormGroupTouched()
    }
  }

  clearForm(): void {
    this.teaReturnForm.reset()
    this.errorMessage = ""
  }

  private markFormGroupTouched(): void {
    Object.keys(this.teaReturnForm.controls).forEach((key) => {
      const control = this.teaReturnForm.get(key)
      control?.markAsTouched()
    })
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.teaReturnForm.get(fieldName)
    return !!(field && field.invalid && (field.dirty || field.touched))
  }
}
