import React from 'react';
import './App.css';
import EmiCalculator from './components/EmiCalculator';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>EMI Foreclosure Calculator</h1>
        <p>Decide if paying off your loan early is beneficial</p>
      </header>
      <main>
        <EmiCalculator />
      </main>
      <footer className="App-footer">
        <p>Calculate your EMI foreclosure benefits and make informed financial decisions</p>
      </footer>
    </div>
  );
}

export default App;
