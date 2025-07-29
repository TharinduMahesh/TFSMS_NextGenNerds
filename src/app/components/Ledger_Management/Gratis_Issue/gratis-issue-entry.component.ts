// src/app/components/gratis-issue/gratis-issue-entry/gratis-issue-entry.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HeaderComponent } from "../../header/header.component";
import { SidebarComponent } from '../../sidebar/sidebar/sidebar.component';

import { GratisIssueService } from '../../../Services/gratis-issue.service';
import { GratisIssue } from '../../../models/gratis-issue.interface';

@Component({
  selector: 'app-gratis-issue-entry',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, SidebarComponent],
  templateUrl: './gratis-issue-entry.component.html',
  styleUrls: ['./gratis-issue-entry.component.css']
})
export class GratisIssueEntryComponent implements OnInit {

  issueDate: string = '';
  purpose: string = '';
  receiver: string = '';
  quantityKg: number | null = null;
  teaGrade: string = '';
  batchLotNumber: string = '';
  referenceMemo: string = '';
  remarks: string = '';

  purposes: string[] = [
    'Sample', 'Donation', 'Internal Testing',
    'Marketing/Promotional', 'Damage/Spoilage (Disposal)',
    'Exhibition/Event', 'Staff Welfare', 'Other'
  ];

  teaGrades: string[] = [
    'BOPF', 'FBOP', 'OP', 'Pekoe', 'Green Tea Sencha',
    'Earl Grey Blend', 'Chamomile Infusion', 'Ceylon Black Tea'
  ];

  allGratisIssues: GratisIssue[] = [];
  filteredGratisIssues: GratisIssue[] = [];

  showEditModal: boolean = false;
  editingIssue: GratisIssue | null = null;

  constructor(private router: Router, private gratisIssueService: GratisIssueService) {}

  ngOnInit(): void {
    this.issueDate = new Date().toISOString().split('T')[0];
    this.loadGratisIssues();
  }

  loadGratisIssues(): void {
    this.gratisIssueService.getGratisIssues().subscribe({
      next: (data) => {
        this.allGratisIssues = data.map(issue => {
          // FIX: Ensure createdAt and updatedAt are always valid ISO strings when stored
          // Even if backend sends null, default to current time to avoid conversion errors on PUT
          const validCreatedAt = issue.createdAt && !isNaN(new Date(issue.createdAt).getTime())
                                 ? new Date(issue.createdAt) : new Date();
          const validUpdatedAt = issue.updatedAt && !isNaN(new Date(issue.updatedAt).getTime())
                                 ? new Date(issue.updatedAt) : new Date();

          return {
            id: issue.id,
            issueDate: new Date(issue.issueDate).toISOString().split('T')[0], // Ensure YYYY-MM-DD for form binding
            purpose: issue.purpose,
            receiver: issue.receiver,
            quantityKg: issue.quantityKg,
            teaGrade: issue.teaGrade,
            batchLotNumber: issue.batchLotNumber || '',
            referenceMemo: issue.referenceMemo || '',
            remarks: issue.remarks || '',
            createdAt: validCreatedAt.toISOString(), // Always send valid ISO string
            updatedAt: validUpdatedAt.toISOString()  // Always send valid ISO string
          };
        });
        this.allGratisIssues.sort((a, b) => (a.id || 0) - (b.id || 0));
        console.log('All Gratis Issues:', this.allGratisIssues);
        this.applyFilters();
      },
      error: (error) => {
        console.error('Error loading gratis issues:', error);
        alert('Failed to load gratis issues. Please check backend connections.');
      }
    });
  }

  addIssue(): void {
    if (!this.issueDate || !this.purpose || !this.receiver || this.quantityKg === null || this.quantityKg <= 0 || !this.teaGrade) {
      alert('Please fill all required fields: Issue Date, Purpose, Receiver, Quantity (Kg), and Tea Grade.');
      return;
    }

    const newIssue: GratisIssue = {
      issueDate: this.issueDate,
      purpose: this.purpose,
      receiver: this.receiver,
      quantityKg: this.quantityKg,
      teaGrade: this.teaGrade,
      batchLotNumber: this.batchLotNumber || undefined,
      referenceMemo: this.referenceMemo || undefined,
      remarks: this.remarks || undefined,
      // createdAt and updatedAt will be set by the backend on POST
    };

    this.gratisIssueService.addGratisIssue(newIssue).subscribe({
      next: (addedIssue) => {
        alert('Gratis Issue added successfully!');
        this.clearForm();
        this.loadGratisIssues();
      },
      error: (error) => {
        console.error('Error adding gratis issue:', error);
        alert('Failed to add gratis issue. Please try again.');
      }
    });
  }

  clearForm(): void {
    this.issueDate = new Date().toISOString().split('T')[0];
    this.purpose = '';
    this.receiver = '';
    this.quantityKg = null;
    this.teaGrade = '';
    this.batchLotNumber = '';
    this.referenceMemo = '';
    this.remarks = '';
    this.editingIssue = null;
  }

  editIssue(issue: GratisIssue): void {
    this.editingIssue = { ...issue };
    this.issueDate = issue.issueDate;
    this.purpose = issue.purpose;
    this.receiver = issue.receiver;
    this.quantityKg = issue.quantityKg;
    this.teaGrade = issue.teaGrade;
    this.batchLotNumber = issue.batchLotNumber || '';
    this.referenceMemo = issue.referenceMemo || '';
    this.remarks = issue.remarks || '';
  }

  saveEdit(): void {
    if (!this.editingIssue || !this.editingIssue.id) {
      alert('No issue selected for editing.');
      return;
    }
    if (!this.issueDate || !this.purpose || !this.receiver || this.quantityKg === null || this.quantityKg <= 0 || !this.teaGrade) {
      alert('Please fill all required fields for the edited issue.');
      return;
    }

    const updatedIssue: GratisIssue = {
      id: this.editingIssue.id,
      issueDate: this.issueDate,
      purpose: this.purpose,
      receiver: this.receiver,
      quantityKg: this.quantityKg,
      teaGrade: this.teaGrade,
      batchLotNumber: this.batchLotNumber || undefined,
      referenceMemo: this.referenceMemo || undefined,
      remarks: this.remarks || undefined,
      // FIX: Ensure createdAt is sent back in ISO string format
      // Use the stored ISO string for createdAt
      createdAt: this.editingIssue.createdAt,
      // FIX: Ensure updatedAt is sent back in ISO string format
      updatedAt: new Date().toISOString() // New ISO timestamp for update
    };

    this.gratisIssueService.updateGratisIssue(updatedIssue).subscribe({
      next: () => {
        alert('Gratis Issue updated successfully!');
        this.clearForm();
        this.loadGratisIssues();
      },
      error: (error) => {
        console.error('Error updating gratis issue:', error);
        alert('Failed to update gratis issue. Please try again.');
      }
    });
  }

  cancelEdit(): void {
    this.clearForm();
  }

  confirmDelete(id: number): void {
    if (confirm('Are you sure you want to delete this gratis issue?')) {
      this.deleteIssue(id);
    }
  }

  deleteIssue(id: number): void {
    this.gratisIssueService.deleteGratisIssue(id).subscribe({
      next: () => {
        alert('Gratis Issue deleted successfully!');
        this.loadGratisIssues();
      },
      error: (error) => {
        console.error('Error deleting gratis issue:', error);
        alert('Failed to delete gratis issue. Please try again.');
      }
    });
  }

  applyFilters(): void {
    this.filteredGratisIssues = [...this.allGratisIssues];
  }

  // FIX: Modify formatDate to handle ISO strings for display
  formatDate(dateString: string | undefined): string {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Invalid Date';
      }
      return date.toLocaleDateString(); // For display
    } catch (e) {
      return 'Invalid Date Format';
    }
  }

  exitPage(): void {
    this.router.navigate(['/ledger-management']);
  }
}
