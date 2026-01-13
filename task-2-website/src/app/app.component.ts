import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { LoanFormComponent } from './components/loan-form/loan-form.component';
import { LoanListComponent } from './components/loan-list/loan-list.component';
import { SearchLoansComponent } from './components/search-loans/search-loans.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    LoanFormComponent,
    LoanListComponent,
    SearchLoansComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'YouLend Loan Management';
  
  @ViewChild(LoanListComponent) loanList!: LoanListComponent;

  // Refresh loan list when a new loan is created
  onLoanCreated(): void {
    if (this.loanList) {
      this.loanList.loadLoans();
    }
  }
}