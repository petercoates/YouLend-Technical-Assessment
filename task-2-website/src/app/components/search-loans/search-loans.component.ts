import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { LoanService } from '../../services/loan.service';
import { Loan } from '../../models/loan.model';

@Component({
  selector: 'app-search-loans',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatListModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './search-loans.component.html',
  styleUrls: ['./search-loans.component.scss']
})
export class SearchLoansComponent {
  searchName = '';
  searchResults: Loan[] = [];
  isSearching = false;
  hasSearched = false;

  constructor(
    private loanService: LoanService,
    private snackBar: MatSnackBar
  ) { }

  // Search for loans by borrower name
  searchLoans(): void {
    if (this.searchName.trim()) {
      this.isSearching = true;
      this.hasSearched = true;

      this.loanService.getLoansByBorrower(this.searchName.trim()).subscribe({
        next: (loans) => {
          this.searchResults = loans;
          this.isSearching = false;
          
          if (loans.length === 0) {
            this.snackBar.open(`No loans found for "${this.searchName}"`, 'Close', { duration: 3000 });
          }
        },
        error: (error) => {
          console.error('Error searching loans:', error);
          this.searchResults = [];
          this.isSearching = false;
          this.snackBar.open('Error searching loans', 'Close', { duration: 3000 });
        }
      });
    }
  }

  // Clear search
  clearSearch(): void {
    this.searchName = '';
    this.searchResults = [];
    this.hasSearched = false;
  }

  // Delete a loan from search results
  deleteLoan(loanId: string): void {
    if (confirm('Are you sure you want to delete this loan?')) {
      this.loanService.deleteLoan(loanId).subscribe({
        next: () => {
          this.snackBar.open('Loan deleted successfully!', 'Close', { duration: 3000 });
          this.searchLoans(); // Refresh search results
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