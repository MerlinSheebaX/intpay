import React, { useState } from 'react';
import { Elements, useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51PirgV071Ro3JuwZH6SWRyy6Q4PBIyyMutQAATkxlOJbQM8Zwezl4lEULMS5bE45JWTbONmMo7FOHxbX4ONPW03000XMkIz80r');

const CheckoutForm = () => {
  const [amount, setAmount] = useState(10000); // Default amount in cents
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const { error: paymentError, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
    });

    if (paymentError) {
      setError(paymentError.message);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/stripe/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount,
          payment_method_id: paymentMethod.id,
        }),
      });

      const paymentIntent = await response.json();

      if (paymentIntent.error) {
        setError(paymentIntent.error);
      } else {
        setSuccess('Payment successful!');
      }
    } catch (err) {
      setError('An error occurred');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          Amount ($):
          <input
            type="number"
            value={amount / 100}
            onChange={(e) => setAmount(Number(e.target.value) * 100)}
            min="1"
          />
        </label>
      </div>
      <CardElement />
      <button type="submit" disabled={!stripe}>
        Pay ${amount / 100}
      </button>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {success && <div style={{ color: 'green' }}>{success}</div>}
    </form>
  );
};

const Checkout = () => (
  <Elements stripe={stripePromise}>
    <CheckoutForm />
  </Elements>
);

export default Checkout;
