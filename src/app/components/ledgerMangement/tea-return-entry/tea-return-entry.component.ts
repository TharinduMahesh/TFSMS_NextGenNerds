import { Component,  OnInit } from "@angular/core"
import {  FormBuilder,  FormGroup, Validators, ReactiveFormsModule } from "@angular/forms"
import { CommonModule } from "@angular/common"
import { HeaderComponent } from "../../header/header.component";
import  { TeaReturnService } from "../../../shared/services/tea-return.service"
import  { TeaReturn } from "../../../models/tea-return.model"
import  { Invoice } from "../../../models/invoice.model"

@Component({
  selector: "app-tea-return-entry",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HeaderComponent],
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
        if (Array.isArray(data)) {
          this.teaReturns = data
        } else if (
          data &&
          typeof data === "object" &&
          "$values" in data &&
          Array.isArray((data as { $values: TeaReturn[] }).$values)
        ) {
          // Handle the {$id: '1', $values: [...]} format
          this.teaReturns = (data as { $values: TeaReturn[] }).$values
          console.warn("API returned data with $values property for tea returns. Extracting $values.")
        } else {
          this.teaReturns = [] // Default to empty array for other non-array formats
          if (data !== null && data !== undefined) {
            console.warn("API returned unexpected non-array data for tea returns, defaulting to empty array:", data)
          }
        }
        this.isLoading = false
      },
      error: (error) => {
        this.errorMessage = error
        this.isLoading = false
        this.teaReturns = [] // Ensure it's an empty array on error too
      },
    })
  }

  loadInvoices(): void {
    this.teaReturnService.getInvoices().subscribe({
      next: (data) => {
        if (Array.isArray(data)) {
          this.invoices = data
        } else if (
          data &&
          typeof data === "object" &&
          "$values" in data &&
          Array.isArray((data as { $values: Invoice[] }).$values)
        ) {
          // Handle the {$id: '1', $values: [...]} format
          this.invoices = (data as { $values: Invoice[] }).$values
          console.warn("API returned data with $values property for invoices. Extracting $values.")
        } else {
          this.invoices = [] // Default to empty array for other non-array formats
          if (data !== null && data !== undefined) {
            console.warn("API returned unexpected non-array data for invoices, defaulting to empty array:", data)
          }
        }
      },
      error: (error) => {
        console.error("Error loading invoices:", error)
        this.invoices = [] // Ensure it's an empty array on error too
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

  deleteReturn(id: number): void {
    if (confirm("Are you sure you want to delete this tea return entry?")) {
      this.teaReturnService.deleteTeaReturn(id).subscribe({
        next: () => {
          this.teaReturns = this.teaReturns.filter((teaReturn) => teaReturn.Id !== id)
        },
        error: (error) => {
          this.errorMessage = error
        },
      })
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
