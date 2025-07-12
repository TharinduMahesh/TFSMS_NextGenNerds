import { Component,  OnInit } from "@angular/core"
import {  FormBuilder,  FormGroup, Validators, ReactiveFormsModule } from "@angular/forms"
import { CommonModule } from "@angular/common"
import  { DenaturedTeaService } from "../../../shared/services/denatured-tea.service"
import  { DenaturedTea } from "../../../models/denatured-tea.model"
import  { Invoice } from "../../../models/invoice.model"

@Component({
  selector: "app-denatured-tea-entry",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./denatured-tea-entry.component.html",
  styleUrl: "./denatured-tea-entry.component.css",
})
export class DenaturedTeaEntryComponent implements OnInit {
  denaturedTeas: DenaturedTea[] = []
  invoices: Invoice[] = []
  denaturedTeaForm: FormGroup
  isLoading = false
  errorMessage = ""
  teaGrades = ["PEKOE", "OP", "BOP", "FBOP", "DUST", "FANNINGS", "BROKEN"]

  constructor(
    private denaturedTeaService: DenaturedTeaService,
    private fb: FormBuilder,
  ) {
    this.denaturedTeaForm = this.fb.group({
      teaGrade: ["", [Validators.required]],
      quantityKg: ["", [Validators.required, Validators.min(0.01)]],
      reason: ["", [Validators.required]],
      date: ["", [Validators.required]],
      invoiceNumber: ["", [Validators.required]],
    })
  }

  ngOnInit(): void {
    this.loadDenaturedTeas()
    this.loadInvoices()
    // Set today's date as default
    this.denaturedTeaForm.patchValue({
      date: new Date().toISOString().split("T")[0],
    })
  }

  loadDenaturedTeas(): void {
    this.isLoading = true
    this.denaturedTeaService.getDenaturedTeas().subscribe({
      next: (data) => {
        if (Array.isArray(data)) {
          this.denaturedTeas = data
        } else if (
          data &&
          typeof data === "object" &&
          "$values" in data &&
          Array.isArray((data as { $values?: DenaturedTea[] }).$values)
        ) {
          // Handle the {$id: '1', $values: [...]} format
          this.denaturedTeas = (data as { $values: DenaturedTea[] }).$values
          console.warn("API returned data with $values property for denatured teas. Extracting $values.")
        } else {
          this.denaturedTeas = [] // Default to empty array for other non-array formats
          if (data !== null && data !== undefined) {
            console.warn("API returned unexpected non-array data for denatured teas, defaulting to empty array:", data)
          }
        }
        this.isLoading = false
      },
      error: (error) => {
        this.errorMessage = error
        this.isLoading = false
        this.denaturedTeas = [] // Ensure it's an empty array on error too
      },
    })
  }

  loadInvoices(): void {
    this.denaturedTeaService.getInvoices().subscribe({
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
    if (this.denaturedTeaForm.valid) {
      this.isLoading = true
      const formValue = this.denaturedTeaForm.value
      this.denaturedTeaService.createDenaturedTea(formValue).subscribe({
        next: (newEntry) => {
          this.denaturedTeas.push(newEntry)
          this.denaturedTeaForm.reset()
          this.denaturedTeaForm.patchValue({
            date: new Date().toISOString().split("T")[0],
          })
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

  deleteEntry(id: number): void {
    if (confirm("Are you sure you want to delete this denatured tea entry?")) {
      this.denaturedTeaService.deleteDenaturedTea(id).subscribe({
        next: () => {
          this.denaturedTeas = this.denaturedTeas.filter((tea) => tea.id !== id)
        },
        error: (error) => {
          this.errorMessage = error
        },
      })
    }
  }

  clearForm(): void {
    this.denaturedTeaForm.reset()
    this.denaturedTeaForm.patchValue({
      date: new Date().toISOString().split("T")[0],
    })
    this.errorMessage = ""
  }

  private markFormGroupTouched(): void {
    Object.keys(this.denaturedTeaForm.controls).forEach((key) => {
      const control = this.denaturedTeaForm.get(key)
      control?.markAsTouched()
    })
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.denaturedTeaForm.get(fieldName)
    return !!(field && field.invalid && (field.dirty || field.touched))
  }

  trackByFn(index: number, item: DenaturedTea): number {
    return item.id
  }
}
