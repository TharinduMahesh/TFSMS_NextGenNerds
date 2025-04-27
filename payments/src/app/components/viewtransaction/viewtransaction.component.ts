
import { Component, OnInit } from '@angular/core';
import { Transaction } from '../../models/transaction.model';
// import { TransactionService } from '../../shared';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-transaction',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
//   providers: [TransactionService],
  templateUrl: './viewtransaction.component.html',
  styleUrls: ['./viewtransaction.component.css']
})
export class TransactionComponent implements OnInit {
  transactions: Transaction[] = [];
  transactionTypes: string[] = ['All', 'Deposit', 'Withdrawal', 'Transfer'];
  selectedType: string = 'All';
  selectedDate: string = '';
  filteredTransactions: Transaction[] = [];
  
  totalTransactions: number = 0;
  totalDeposits: number = 0;
  totalWithdrawals: number = 0;
  totalTransfers: number = 0;

  newTransaction: Transaction = { 
    TransactionId: 0, 
    AccountId: 0, 
    Amount: 0, 
    TransactionType: '', 
    TransactionDate: new Date().toISOString().split('T')[0],
    Description: ''
  };

  error: string | null = null;
  loading: boolean = false;

//   constructor(private transactionService: TransactionService) {}

  ngOnInit() {
    this.loadTransactions();
  }

  loadTransactions() {
    this.loading = true;
    this.error = null;
    
    // For demo purposes, we'll use mock data
    // In a real app, you would use the service to fetch data from the API
    setTimeout(() => {
      const mockTransactions = [
        { 
          TransactionId: 1001, 
          AccountId: 5001, 
          Amount: 1500, 
          TransactionType: 'Deposit', 
          TransactionDate: '2025-03-20', 
          Description: 'Salary deposit' 
        },
        { 
          TransactionId: 1002, 
          AccountId: 5002, 
          Amount: 500, 
          TransactionType: 'Withdrawal', 
          TransactionDate: '2025-03-21', 
          Description: 'ATM withdrawal' 
        },
        { 
          TransactionId: 1003, 
          AccountId: 5001, 
          Amount: 300, 
          TransactionType: 'Transfer', 
          TransactionDate: '2025-03-22', 
          Description: 'Transfer to savings' 
        },
        { 
          TransactionId: 1004, 
          AccountId: 5003, 
          Amount: 2000, 
          TransactionType: 'Deposit', 
          TransactionDate: '2025-03-23', 
          Description: 'Business income' 
        },
        { 
          TransactionId: 1005, 
          AccountId: 5002, 
          Amount: 150, 
          TransactionType: 'Withdrawal', 
          TransactionDate: '2025-03-24', 
          Description: 'Grocery shopping' 
        }
      ];
      
      this.transactions = mockTransactions;
      this.filteredTransactions = [...mockTransactions];
      this.calculateSummaryMetrics();
      this.loading = false;
    }, 500);
    
    // In a real app, you would use:
    /*
    this.transactionService.getTransactions().subscribe({
      next: (data) => {
        console.log('Received transactions:', data);
        
        if (Array.isArray(data)) {
          this.transactions = data;
          this.filteredTransactions = [...data];
          this.calculateSummaryMetrics();
        } else {
          console.error('Data is not an array:', data);
          this.transactions = [];
          this.filteredTransactions = [];
        }
        
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading transactions:', error);
        this.error = 'Failed to load transactions. Please try again later.';
        this.loading = false;
      }
    });
    */
  }

  calculateSummaryMetrics() {
    this.totalTransactions = this.transactions.length;
    this.totalDeposits = this.transactions
      .filter(t => t.TransactionType === 'Deposit')
      .reduce((sum, t) => sum + Number(t.Amount), 0);
    this.totalWithdrawals = this.transactions
      .filter(t => t.TransactionType === 'Withdrawal')
      .reduce((sum, t) => sum + Number(t.Amount), 0);
    this.totalTransfers = this.transactions
      .filter(t => t.TransactionType === 'Transfer')
      .reduce((sum, t) => sum + Number(t.Amount), 0);
  }

  filterTransactions() {
    this.filteredTransactions = this.transactions.filter(transaction => {
      const typeMatch = this.selectedType === 'All' || transaction.TransactionType === this.selectedType;
      const dateMatch = !this.selectedDate || transaction.TransactionDate.toString().includes(this.selectedDate);
      return typeMatch && dateMatch;
    });
  }

  addTransaction() {
    if (this.validateTransaction()) {
      this.loading = true;
      this.error = null;

      // For demo purposes, we'll simulate adding to the local array
      // In a real app, you would use the service to send to the API
      setTimeout(() => {
        // Generate a new ID (in a real app, this would come from the backend)
        const newId = Math.max(...this.transactions.map(t => t.TransactionId)) + 1;
        
        const transactionToAdd = {
          ...this.newTransaction,
          TransactionId: newId
        };
        
        this.transactions.push(transactionToAdd);
        this.filterTransactions();
        this.calculateSummaryMetrics();
        this.resetForm();
        this.loading = false;
      }, 500);
      
      // In a real app, you would use:
      /*
      const formattedTransaction = {
        ...this.newTransaction,
        TransactionDate: new Date(this.newTransaction.TransactionDate).toISOString()
      };

      this.transactionService.addTransaction(formattedTransaction).subscribe({
        next: (response) => {
          console.log('Transaction added successfully:', response);
          this.loadTransactions(); // Reload all transactions
          this.resetForm();
          this.loading = false;
        },
        error: (error) => {
          console.error('Error adding transaction:', error);
          this.error = 'Failed to add transaction. Please try again.';
          this.loading = false;
        }
      });
      */
    }
  }

  private validateTransaction(): boolean {
    if (!this.newTransaction.AccountId || this.newTransaction.AccountId <= 0) {
      this.error = 'Please enter a valid Account ID';
      return false;
    }
    if (!this.newTransaction.Amount || this.newTransaction.Amount <= 0) {
      this.error = 'Please enter a valid amount';
      return false;
    }
    if (!this.newTransaction.TransactionType) {
      this.error = 'Please select a transaction type';
      return false;
    }
    if (!this.newTransaction.TransactionDate) {
      this.error = 'Please select a transaction date';
      return false;
    }
    if (!this.newTransaction.Description) {
      this.error = 'Please enter a description';
      return false;
    }
    return true;
  }

  private resetForm() {
    this.newTransaction = {
      TransactionId: 0,
      AccountId: 0,
      Amount: 0,
      TransactionType: '',
      TransactionDate: new Date().toISOString().split('T')[0],
      Description: ''
    };
    this.error = null;
  }
}
