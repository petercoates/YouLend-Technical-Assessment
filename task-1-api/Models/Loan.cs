namespace YouLend.LoanManagement.Api.Models;

/// <summary>
/// Represents a loan in the YouLend system
/// </summary>
public class Loan
{
    public required string LoanId { get; set; }
    public required string BorrowerName { get; set; }
    public decimal FundingAmount { get; set; }
    public decimal RepaymentAmount { get; set; }
    public DateTime CreatedAt { get; set; }
}