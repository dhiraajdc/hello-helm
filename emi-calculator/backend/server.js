const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// EMI Calculation Route
app.post('/api/calculate', (req, res) => {
  try {
    const { loanAmount, duration, interestRate, emiAmount, amountPaidSoFar } = req.body;

    // Validate inputs
    if (!loanAmount || !duration || !interestRate || !emiAmount || amountPaidSoFar === undefined) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Convert inputs to numbers
    const P = parseFloat(loanAmount);
    const n = parseInt(duration);
    const r = parseFloat(interestRate) / 12 / 100; // Monthly interest rate
    const emi = parseFloat(emiAmount);
    const paid = parseFloat(amountPaidSoFar);

    // Calculate the number of EMIs already paid
    const emisPaid = paid / emi;

    // Calculate remaining EMIs
    const remainingEmis = n - emisPaid;

    // Calculate total amount to be paid if continuing with EMIs
    const totalAmountWithEmis = paid + (remainingEmis * emi);

    // Calculate outstanding principal
    // Using the formula: Outstanding = P * [(1+r)^n - (1+r)^p] / [(1+r)^n - 1]
    // where p is number of EMIs paid
    const outstandingPrincipal = P * (Math.pow(1 + r, n) - Math.pow(1 + r, emisPaid)) / (Math.pow(1 + r, n) - 1);

    // Interest component already paid
    const interestPaid = paid - (P - outstandingPrincipal);

    // Future interest if continuing with EMIs
    const futureInterest = (remainingEmis * emi) - outstandingPrincipal;

    // Total interest if continuing
    const totalInterest = interestPaid + futureInterest;

    // Savings by foreclosure (avoiding future interest)
    const savingsByForeclosure = futureInterest;

    // Calculate break-even (when savings equal outstanding amount)
    const isForeclosureBeneficial = savingsByForeclosure > 0;

    const result = {
      loanDetails: {
        originalLoanAmount: P.toFixed(2),
        totalDuration: n,
        monthlyEmi: emi.toFixed(2),
        interestRate: (interestRate).toFixed(2) + '%'
      },
      currentStatus: {
        amountPaidSoFar: paid.toFixed(2),
        emisPaid: Math.floor(emisPaid),
        remainingEmis: Math.ceil(remainingEmis),
        outstandingPrincipal: outstandingPrincipal.toFixed(2),
        interestAlreadyPaid: interestPaid.toFixed(2)
      },
      foreclosureAnalysis: {
        amountToPayForForeclosure: outstandingPrincipal.toFixed(2),
        futureInterestIfContinuing: futureInterest.toFixed(2),
        totalAmountIfContinuing: totalAmountWithEmis.toFixed(2),
        savingsByForeclosure: savingsByForeclosure.toFixed(2),
        isForeclosureBeneficial: isForeclosureBeneficial,
        recommendation: isForeclosureBeneficial
          ? `Yes! You will save ${savingsByForeclosure.toFixed(2)} by paying off the loan now.`
          : `Based on the inputs, there are no additional savings from foreclosure.`
      },
      interestBreakdown: {
        interestAlreadyPaid: interestPaid.toFixed(2),
        futureInterest: futureInterest.toFixed(2),
        totalInterest: totalInterest.toFixed(2),
        percentageOfLoanAsInterest: ((totalInterest / P) * 100).toFixed(2) + '%'
      }
    };

    res.json(result);
  } catch (error) {
    console.error('Calculation error:', error);
    res.status(500).json({ error: 'An error occurred during calculation' });
  }
});

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'EMI Calculator API is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
