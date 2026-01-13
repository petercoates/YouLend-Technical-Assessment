using YouLend.LoanManagement.Api.Models;

namespace YouLend.LoanManagement.Api.Services;

/// <summary>
/// In-memory data store for loans.
/// This is a simple Dictionary that stores loans while the application is running.
/// Data is lost when the application stops.
/// </summary>
public class LoanStore
{
    // Dictionary to store loans, using LoanId as the key
    private readonly Dictionary<string, Loan> _loans = new();
    
    // Lock object to ensure thread-safe access
    private readonly object _lock = new();

    /// <summary>
    /// Adds a new loan to the store
    /// </summary>
    public void Add(Loan loan)
    {
        lock (_lock)
        {
            _loans[loan.LoanId] = loan;
        }
    }
    
    /// <summary>
    /// Gets a loan by its ID
    /// </summary>
    public Loan? GetById(string loanId)
    {
        lock (_lock)
        {
            _loans.TryGetValue(loanId, out var loan);
            return loan;
        }
    }

    /// <summary>
    /// Gets all loans for a specific borrower (case-insensitive)
    /// </summary>
    public List<Loan> GetByBorrowerName(string borrowerName)
    {
        lock (_lock)
        {
            return _loans.Values
                .Where(l => l.BorrowerName.Equals(borrowerName, StringComparison.OrdinalIgnoreCase))
                .ToList();
        }
    }

    /// <summary>
    /// Gets all loans in the system
    /// </summary>
    public List<Loan> GetAll()
    {
        lock (_lock)
        {
            return _loans.Values.ToList();
        }
    }

    /// <summary>
    /// Deletes a loan by its ID
    /// Returns true if deleted, false if not found
    /// </summary>
    public bool Delete(string loanId)
    {
        lock (_lock)
        {
            return _loans.Remove(loanId);
        }
    }
}