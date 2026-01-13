import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Loan, CreateLoanRequest } from '../models/loan.model';

@Injectable({
  providedIn: 'root'
})
export class LoanService {
  // API base URL - change this to match your API port
  private apiUrl = 'http://localhost:5103/api/loans';

  constructor(private http: HttpClient) { }

  // Get all loans
  getAllLoans(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  // Get loan by ID
  getLoanById(loanId: string): Observable<Loan> {
    return this.http.get<Loan>(`${this.apiUrl}/${loanId}`);
  }

  // Get loans by borrower name
  getLoansByBorrower(borrowerName: string): Observable<Loan[]> {
    return this.http.get<Loan[]>(`${this.apiUrl}/borrower/${borrowerName}`);
  }

  // Create a new loan
  createLoan(loan: CreateLoanRequest): Observable<Loan> {
    return this.http.post<Loan>(this.apiUrl, loan);
  }

  // Delete a loan
  deleteLoan(loanId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${loanId}`);
  }
}