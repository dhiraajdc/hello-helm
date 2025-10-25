import React, { useState } from 'react';
import axios from 'axios';

const EmiCalculator = () => {
  const [formData, setFormData] = useState({
    loanAmount: '',
    duration: '',
    interestRate: '',
    emiAmount: '',
    amountPaidSoFar: ''
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await axios.post('/api/calculate', formData);
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred. Please check your inputs.');
      console.error('Calculation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      loanAmount: '',
      duration: '',
      interestRate: '',
      emiAmount: '',
      amountPaidSoFar: ''
    });
    setResult(null);
    setError('');
  };

  return (
    <div className="calculator-container">
      <div className="calculator-card">
        <form onSubmit={handleSubmit} className="calculator-form">
          <h2>Loan Details</h2>

          <div className="form-group">
            <label htmlFor="loanAmount">Loan Amount</label>
            <input
              type="number"
              id="loanAmount"
              name="loanAmount"
              value={formData.loanAmount}
              onChange={handleChange}
              placeholder="Enter original loan amount"
              required
              min="0"
              step="0.01"
            />
          </div>

          <div className="form-group">
            <label htmlFor="duration">Duration (in months)</label>
            <input
              type="number"
              id="duration"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              placeholder="Enter loan duration in months"
              required
              min="1"
            />
          </div>

          <div className="form-group">
            <label htmlFor="interestRate">Interest Rate (% per annum)</label>
            <input
              type="number"
              id="interestRate"
              name="interestRate"
              value={formData.interestRate}
              onChange={handleChange}
              placeholder="Enter annual interest rate"
              required
              min="0"
              step="0.01"
            />
          </div>

          <div className="form-group">
            <label htmlFor="emiAmount">Monthly EMI Amount</label>
            <input
              type="number"
              id="emiAmount"
              name="emiAmount"
              value={formData.emiAmount}
              onChange={handleChange}
              placeholder="Enter monthly EMI amount"
              required
              min="0"
              step="0.01"
            />
          </div>

          <div className="form-group">
            <label htmlFor="amountPaidSoFar">Amount Paid So Far</label>
            <input
              type="number"
              id="amountPaidSoFar"
              name="amountPaidSoFar"
              value={formData.amountPaidSoFar}
              onChange={handleChange}
              placeholder="Enter total amount paid till date"
              required
              min="0"
              step="0.01"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="button-group">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Calculating...' : 'Calculate'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={handleReset}>
              Reset
            </button>
          </div>
        </form>

        {result && (
          <div className="results-container">
            <h2>Results</h2>

            <div className="result-section">
              <h3 className={result.foreclosureAnalysis.isForeclosureBeneficial ? 'beneficial' : 'not-beneficial'}>
                {result.foreclosureAnalysis.isForeclosureBeneficial ? '✓ Foreclosure is Beneficial' : 'ℹ Foreclosure Analysis'}
              </h3>
              <p className="recommendation">{result.foreclosureAnalysis.recommendation}</p>
            </div>

            <div className="result-section">
              <h3>Current Loan Status</h3>
              <div className="result-grid">
                <div className="result-item">
                  <span className="label">Amount Paid:</span>
                  <span className="value">{result.currentStatus.amountPaidSoFar}</span>
                </div>
                <div className="result-item">
                  <span className="label">EMIs Paid:</span>
                  <span className="value">{result.currentStatus.emisPaid} of {result.loanDetails.totalDuration}</span>
                </div>
                <div className="result-item">
                  <span className="label">Remaining EMIs:</span>
                  <span className="value">{result.currentStatus.remainingEmis}</span>
                </div>
                <div className="result-item">
                  <span className="label">Outstanding Principal:</span>
                  <span className="value highlight">{result.currentStatus.outstandingPrincipal}</span>
                </div>
              </div>
            </div>

            <div className="result-section">
              <h3>Foreclosure Analysis</h3>
              <div className="result-grid">
                <div className="result-item">
                  <span className="label">Amount to Pay for Foreclosure:</span>
                  <span className="value">{result.foreclosureAnalysis.amountToPayForForeclosure}</span>
                </div>
                <div className="result-item">
                  <span className="label">Total if Continuing:</span>
                  <span className="value">{result.foreclosureAnalysis.totalAmountIfContinuing}</span>
                </div>
                <div className="result-item">
                  <span className="label">Future Interest (if continuing):</span>
                  <span className="value">{result.foreclosureAnalysis.futureInterestIfContinuing}</span>
                </div>
                <div className="result-item">
                  <span className="label">Savings by Foreclosure:</span>
                  <span className="value savings">{result.foreclosureAnalysis.savingsByForeclosure}</span>
                </div>
              </div>
            </div>

            <div className="result-section">
              <h3>Interest Breakdown</h3>
              <div className="result-grid">
                <div className="result-item">
                  <span className="label">Interest Already Paid:</span>
                  <span className="value">{result.interestBreakdown.interestAlreadyPaid}</span>
                </div>
                <div className="result-item">
                  <span className="label">Future Interest:</span>
                  <span className="value">{result.interestBreakdown.futureInterest}</span>
                </div>
                <div className="result-item">
                  <span className="label">Total Interest:</span>
                  <span className="value">{result.interestBreakdown.totalInterest}</span>
                </div>
                <div className="result-item">
                  <span className="label">Interest as % of Loan:</span>
                  <span className="value">{result.interestBreakdown.percentageOfLoanAsInterest}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmiCalculator;
