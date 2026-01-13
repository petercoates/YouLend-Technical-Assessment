using System.ComponentModel.DataAnnotations;

namespace YouLend.LoanManagement.Api.Models;

/// <summary>
/// Request body for creating a new loan
/// </summary>
public class CreateLoanRequest
{
    [Required(ErrorMessage = "Borrower name is required")]
    public required string BorrowerName { get; set; }

    [Required]
    [Range(0.01, double.MaxValue, ErrorMessage = "Funding amount must be greater than 0")]
    public decimal FundingAmount { get; set; }

    [Required]
    [Range(0.01, double.MaxValue, ErrorMessage = "Repayment amount must be greater than 0")]
    public decimal RepaymentAmount { get; set; }
}