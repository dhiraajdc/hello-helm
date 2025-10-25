# EMI Foreclosure Calculator

A full-stack web application to help you decide whether paying off your loan EMI early (foreclosure) is financially beneficial.

## Features

- Calculate outstanding loan principal
- Analyze interest already paid vs. future interest
- Calculate potential savings from foreclosure
- Get clear recommendations on whether foreclosure is beneficial
- Beautiful, responsive UI built with React
- RESTful API backend with Node.js/Express

## Tech Stack

**Frontend:**
- React 18
- Axios for API calls
- Responsive CSS

**Backend:**
- Node.js
- Express.js
- CORS enabled for cross-origin requests

## Project Structure

```
emi-calculator/
├── backend/
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   └── EmiCalculator.js
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.js
│   └── package.json
└── README.md
```

## Installation & Setup

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd emi-calculator/backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the backend server:
   ```bash
   npm start
   ```

   The backend API will run on `http://localhost:5000`

   For development with auto-reload:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd emi-calculator/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the React development server:
   ```bash
   npm start
   ```

   The application will open in your browser at `http://localhost:3000`

## Usage

1. **Enter Loan Details:**
   - **Loan Amount**: The original principal amount borrowed
   - **Duration**: Total loan duration in months
   - **Interest Rate**: Annual interest rate (%)
   - **EMI Amount**: Your monthly EMI payment
   - **Amount Paid So Far**: Total amount paid till date

2. **Click Calculate**: The application will analyze your loan and provide:
   - Current loan status (EMIs paid, remaining, outstanding principal)
   - Foreclosure analysis (amount needed, savings potential)
   - Interest breakdown (paid vs. future interest)
   - Clear recommendation on whether foreclosure is beneficial

3. **Review Results**: The calculator will show:
   - Whether foreclosure is beneficial
   - How much you'll save
   - Detailed breakdown of all calculations

## How It Works

### Calculation Logic

The calculator uses standard EMI formulas to determine:

1. **Outstanding Principal**:
   ```
   Outstanding = P × [(1+r)^n - (1+r)^p] / [(1+r)^n - 1]
   ```
   Where:
   - P = Original loan amount
   - r = Monthly interest rate
   - n = Total number of EMIs
   - p = Number of EMIs already paid

2. **Interest Already Paid**:
   ```
   Interest Paid = Amount Paid - (Principal - Outstanding Principal)
   ```

3. **Future Interest**:
   ```
   Future Interest = (Remaining EMIs × EMI Amount) - Outstanding Principal
   ```

4. **Savings by Foreclosure**:
   ```
   Savings = Future Interest (amount saved by avoiding future interest payments)
   ```

## API Endpoints

### POST /api/calculate

Calculate EMI foreclosure benefits.

**Request Body:**
```json
{
  "loanAmount": 1000000,
  "duration": 240,
  "interestRate": 8.5,
  "emiAmount": 8678,
  "amountPaidSoFar": 520000
}
```

**Response:**
```json
{
  "loanDetails": {
    "originalLoanAmount": "1000000.00",
    "totalDuration": 240,
    "monthlyEmi": "8678.00",
    "interestRate": "8.50%"
  },
  "currentStatus": {
    "amountPaidSoFar": "520000.00",
    "emisPaid": 59,
    "remainingEmis": 181,
    "outstandingPrincipal": "728543.21",
    "interestAlreadyPaid": "248456.79"
  },
  "foreclosureAnalysis": {
    "amountToPayForForeclosure": "728543.21",
    "futureInterestIfContinuing": "843274.58",
    "totalAmountIfContinuing": "2091274.58",
    "savingsByForeclosure": "843274.58",
    "isForeclosureBeneficial": true,
    "recommendation": "Yes! You will save 843274.58 by paying off the loan now."
  },
  "interestBreakdown": {
    "interestAlreadyPaid": "248456.79",
    "futureInterest": "843274.58",
    "totalInterest": "1091731.37",
    "percentageOfLoanAsInterest": "109.17%"
  }
}
```

### GET /api/health

Health check endpoint.

**Response:**
```json
{
  "status": "OK",
  "message": "EMI Calculator API is running"
}
```

## Example Scenario

Let's say you took a home loan:
- Loan Amount: 1,000,000
- Duration: 20 years (240 months)
- Interest Rate: 8.5% per annum
- Monthly EMI: 8,678
- Amount Paid So Far: 520,000 (after ~5 years)

The calculator will show:
- Outstanding Principal: ~728,543
- Future Interest if continuing: ~843,275
- **Savings by foreclosure: ~843,275**
- **Recommendation: Yes, foreclosure is beneficial!**

By paying the outstanding principal now, you save the entire future interest component.

## Contributing

Feel free to fork this project and submit pull requests for any improvements.

## License

This project is open source and available under the MIT License.

## Support

If you encounter any issues or have questions, please open an issue in the repository.

---

Built with React and Node.js
