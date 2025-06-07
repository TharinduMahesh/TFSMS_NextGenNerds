import { Component,  OnInit } from "@angular/core"
import {  FormBuilder,  FormGroup, Validators, ReactiveFormsModule } from "@angular/forms"
import { CommonModule } from "@angular/common"
import  { DenaturedTeaService } from "../../../shared/services/denatured-tea.service"
import  { DenaturedTea } from "../../../models/denatured-tea.model"
import { Invoice } from "../../../models/invoice.model"

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
        this.denaturedTeas = data
        this.isLoading = false
      },
      error: (error) => {
        this.errorMessage = error
        this.isLoading = false
      },
    })
  }

    loadInvoices(): void {
    this.denaturedTeaService.getInvoices().subscribe({
      next: (data) => {
        this.invoices = data
      },
      error: (error) => {
        console.error("Error loading invoices:", error)
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
