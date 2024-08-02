from flask import Blueprint, request, jsonify
import stripe
from config import Config

stripe.bp = Blueprint('stripe', __name__, url_prefix='/api/stripe')

stripe.api_key = Config.STRIPE_TEST_SECRET_KEY

@stripe.bp.route('/create-payment-intent', methods=['POST'])
def create_payment_intent():
    print("Hello")
    data = request.json
    try:
        payment_intent = stripe.PaymentIntent.create(
            amount=data['amount'],  # Amount in cents
            currency='usd',
            payment_method=data['payment_method_id'],
            confirmation_method='manual',
            confirm=True,
            return_url='https://google.com/'
        )
        return jsonify(payment_intent)
    except stripe.error.CardError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        print(f"Exception: {str(e)}")
        return jsonify({'error': 'An error occurred'}), 500
