import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

export interface Sale {
  saleId: string;
  buyerName: string;
  teaGrade: string;
  saleDate: string;
  kilosSold: number;
  discount: number;
  remarks: string;
}

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.css'],
  imports:[FormsModule,CommonModule]
})
export class SalesComponent implements OnInit {
  selectedTab: string =""; // Default to the daily report tab
  data: Sale[] = [
    {saleId: 'S-001', buyerName: 'Amal',  teaGrade: 'G01', saleDate: '01/12/2024', kilosSold: 50, discount: 10, remarks: 'Damaged packaging'},
    {saleId: 'S-002', buyerName: 'Kamal', teaGrade: 'G02', saleDate: '05/12/2024', kilosSold: 30, discount: 0, remarks: 'Damaged packaging'},
    {saleId: 'S-003', buyerName: 'Anil',  teaGrade: 'G03', saleDate: '10/12/2024', kilosSold: 20, discount: 0, remarks: 'Delayed arrival'}
  ];
  filteredData: Sale[] = [];

  ngOnInit(): void {
    this.filteredData = this.data; // Initialize filtered data with all data
    console.log(this.filteredData); // Check if data is populated
  }

  selectTab(tab: string): void {
    this.selectedTab = tab;
  }

  applyFilter(event: Event, category: string): void {
    const filterValue = (event.target as HTMLInputElement | HTMLSelectElement).value;
    if (filterValue === '') {
      this.filteredData = this.data;
    } else {
      this.filteredData = this.data.filter(item =>
        item[category as keyof Sale].toString().toLowerCase().includes(filterValue.toLowerCase())
      );
    }
  }
}
