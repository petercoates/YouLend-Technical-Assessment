using Microsoft.AspNetCore.Mvc;
using YouLend.LoanManagement.Api.Models;
using YouLend.LoanManagement.Api.Services;

namespace YouLend.LoanManagement.Api.Controllers;

/// <summary>
/// Controller for managing loans
/// All loan-related endpoints are in this one class
/// </summary>
[ApiController]
[Route("api/loans")]
public class LoansController : ControllerBase
{
    private readonly LoanStore _store;

    // Constructor - ASP.NET automatically injects the LoanStore here
    public LoansController(LoanStore store)
    {
        _store = store;
    }

    /// <summary>
    /// POST /api/loans - Create a new loan
    /// </summary>
    [HttpPost]
    public IActionResult CreateLoan([FromBody] CreateLoanRequest request)
    {
        var loan = new Loan
        {
            LoanId = Guid.NewGuid().ToString(),
            BorrowerName = request.BorrowerName,
            FundingAmount = request.FundingAmount,
            RepaymentAmount = request.RepaymentAmount,
            CreatedAt = DateTime.UtcNow
        };

        _store.Add(loan);

        // Return 201 Created with the new loan
        return CreatedAtAction(nameof(GetLoanById), new { loanId = loan.LoanId }, loan);
    }

    /// <summary>
    /// GET /api/loans/{loanId} - Get a specific loan by its ID
    /// </summary>
    [HttpGet("{loanId}")]
    public IActionResult GetLoanById(string loanId)
    {
        var loan = _store.GetById(loanId);

        if (loan == null)
        {
            return NotFound($"Loan with ID '{loanId}' not found");
        }

        return Ok(loan);
    }

    /// <summary>
    /// GET /api/loans/borrower/{borrowerName} - Get all loans for a borrower
    /// </summary>
    [HttpGet("borrower/{borrowerName}")]
    public IActionResult GetLoansByBorrower(string borrowerName)
    {
        var loans = _store.GetByBorrowerName(borrowerName);

        if (loans.Count == 0)
        {
            return NotFound($"No loans found for borrower '{borrowerName}'");
        }

        return Ok(loans);
    }    

    /// <summary>
    /// GET /api/loans - Get all loans in the system
    /// </summary>
    [HttpGet]
    public IActionResult GetAllLoans()
    {
        var loans = _store.GetAll();

        return Ok(new 
        { 
            TotalCount = loans.Count, 
            Loans = loans 
        });
    }

    /// <summary>
    /// DELETE /api/loans/{loanId} - Delete a loan by its ID
    /// </summary>
    [HttpDelete("{loanId}")]
    public IActionResult DeleteLoan(string loanId)
    {
        var deleted = _store.Delete(loanId);

        if (!deleted)
        {
            return NotFound($"Loan with ID '{loanId}' not found");
        }

        // Return 204 No Content (standard for successful DELETE)
        return NoContent();
    }
}