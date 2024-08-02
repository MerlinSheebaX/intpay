import React from 'react';
import Checkout from './components/CheckoutForm';
import './App.css';

const App = () => {
  return (
    <div className="App">
      <h1>Payment Integration with Stripe</h1>
      <Checkout />
    </div>
  );
};

export default App;
