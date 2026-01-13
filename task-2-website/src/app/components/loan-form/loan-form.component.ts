import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { LoanService } from '../../services/loan.service';
import { CreateLoanRequest } from '../../models/loan.model';

@Component({
  selector: 'app-loan-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule
  ],
  templateUrl: './loan-form.component.html',
  styleUrls: ['./loan-form.component.scss']
})
export class LoanFormComponent {
  @Output() loanCreated = new EventEmitter<void>();
  
  loanForm: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private loanService: LoanService,
    private snackBar: MatSnackBar
  ) {
    this.loanForm = this.fb.group({
      borrowerName: ['', [Validators.required, Validators.minLength(1)]],
      fundingAmount: ['', [Validators.required, Validators.min(0.01)]],
      repaymentAmount: ['', [Validators.required, Validators.min(0.01)]]
    });
  }

  onFundingAmountChange(): void {
    const fundingAmount = this.loanForm.get('fundingAmount')?.value;
    
    if (fundingAmount && fundingAmount > 0) {
      // Calculate 10% increase
      const repaymentAmount = fundingAmount * 1.10;
      
      // Round to 2 decimal places
      const roundedAmount = Math.round(repaymentAmount * 100) / 100;
      
      // Update repayment amount field
      this.loanForm.patchValue({
        repaymentAmount: roundedAmount
      }, { emitEvent: false });
    } else {
      // Clear repayment if funding is empty or invalid
      this.loanForm.patchValue({
        repaymentAmount: ''
      }, { emitEvent: false });
    }
  }

  // Submit the form
  onSubmit(): void {
    if (this.loanForm.valid) {
      this.isSubmitting = true;
      const loan: CreateLoanRequest = this.loanForm.value;

      this.loanService.createLoan(loan).subscribe({
        next: () => {
          this.snackBar.open('✓ Loan created successfully!', 'Close', { 
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          
          // Reset form and mark as untouched/pristine to remove red borders
          this.loanForm.reset();
          Object.keys(this.loanForm.controls).forEach(key => {
            this.loanForm.get(key)?.setErrors(null);
            this.loanForm.get(key)?.markAsUntouched();
            this.loanForm.get(key)?.markAsPristine();
          });
          
          this.isSubmitting = false;
          this.loanCreated.emit(); // Notify parent to refresh list
        },
        error: (error) => {
          console.error('Error creating loan:', error);
          this.snackBar.open('✗ Error creating loan. Make sure API is running!', 'Close', { 
            duration: 5000,
            panelClass: ['error-snackbar']
          });
          this.isSubmitting = false;
        }
      });
    }
  }

  // Get error message for a field
  getErrorMessage(fieldName: string): string {
    const field = this.loanForm.get(fieldName);
    if (field?.hasError('required')) {
      return 'This field is required';
    }
    if (field?.hasError('min')) {
      return 'Value must be greater than 0';
    }
    if (field?.hasError('minlength')) {
      return 'Name is too short';
    }
    return '';
  }
}