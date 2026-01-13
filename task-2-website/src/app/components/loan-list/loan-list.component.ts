import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { LoanService } from '../../services/loan.service';
import { Loan } from '../../models/loan.model';

@Component({
  selector: 'app-loan-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatSnackBarModule
  ],
  templateUrl: './loan-list.component.html',
  styleUrls: ['./loan-list.component.scss']
})

export class LoanListComponent implements OnInit {
  loans: Loan[] = [];
  displayedColumns: string[] = ['loanId', 'borrowerName', 'fundingAmount', 'repaymentAmount', 'createdAt', 'actions'];
  isLoading = false;

  constructor(
    private loanService: LoanService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadLoans();
  }

  // Load all loans from API
  loadLoans(): void {
    this.isLoading = true;
    this.loanService.getAllLoans().subscribe({
      next: (response) => {
        this.loans = response.loans || [];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading loans:', error);
        this.snackBar.open('Error loading loans. Make sure API is running!', 'Close', { duration: 5000 });
        this.isLoading = false;
      }
    });
  }

  // Delete a loan
  deleteLoan(loanId: string): void {
    if (confirm('Are you sure you want to delete this loan?')) {
      this.loanService.deleteLoan(loanId).subscribe({
        next: () => {
          this.snackBar.open('Loan deleted successfully!', 'Close', { duration: 3000 });
          this.loadLoans(); // Reload the list
        },
        error: (error) => {
          console.error('Error deleting loan:', error);
          this.snackBar.open('Error deleting loan', 'Close', { duration: 3000 });
        }
      });
    }
  }

  // Format currency
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-GB', { 
      style: 'currency', 
      currency: 'GBP' 
    }).format(amount);
  }

  // Format date
  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-GB');
  }
}