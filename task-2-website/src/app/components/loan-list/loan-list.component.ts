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
  private initialLoadAttempted = false; // Track if initial load was attempted

  constructor(
    private loanService: LoanService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    setTimeout(() => {
    this.loadLoans();
    }, 100);
  }

  // Load all loans from API
  loadLoans(isUserTriggered: boolean = false): void {
    this.isLoading = true;
    this.loanService.getAllLoans().subscribe({
      next: (response) => {
        this.loans = response.loans || [];
        this.isLoading = false;
        this.initialLoadAttempted = true; // Mark as successfully loaded
        this.snackBar.dismiss();
      },
      error: (error) => {
        console.error('Error loading loans:', error);
        this.isLoading = false;
        
        if (isUserTriggered || this.initialLoadAttempted) {
          this.snackBar.open('Error loading loans. Make sure API is running!', undefined, { 
            duration: 5000 
          });
        } else {
          setTimeout(() => {
            this.retryInitialLoad();
          }, 2000);
        }
      }
    });
  }

  // Retry initial load once before showing error
  private retryInitialLoad(): void {
    this.loanService.getAllLoans().subscribe({
      next: (response) => {
        this.loans = response.loans || [];
        this.initialLoadAttempted = true;
        this.snackBar.dismiss();
      },
      error: (error) => {
        console.error('Error loading loans after retry:', error);
        console.log('Full error object:', JSON.stringify(error, null, 2));
        this.initialLoadAttempted = true;
        this.snackBar.open('Unable to load loans. Please check your connection.', undefined,{ 
          duration: 5000 
        });
      }
    });
  }

  // Delete a loan
  deleteLoan(loanId: string): void {
    if (confirm('Are you sure you want to delete this loan?')) {
      this.loanService.deleteLoan(loanId).subscribe({
        next: () => {
          this.snackBar.open('Loan deleted successfully!', 'Close', { duration: 3000 });
          this.loadLoans(); // Reload the list after deletion
        },
        error: (error) => {
          console.error('Error deleting loan:', error);
          this.snackBar.open('Error deleting loan. Please try again.', 'Close', { duration: 5000 });
        }
      });
    }
  }

  // Refresh loans (user-triggered)
  refreshLoans(): void {
    this.loadLoans(true);
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