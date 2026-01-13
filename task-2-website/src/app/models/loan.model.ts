// Loan model - matches the API response
export interface Loan {
  loanId: string;
  borrowerName: string;
  fundingAmount: number;
  repaymentAmount: number;
  createdAt: Date;
}

// Request model for creating a loan
export interface CreateLoanRequest {
  borrowerName: string;
  fundingAmount: number;
  repaymentAmount: number;
}

