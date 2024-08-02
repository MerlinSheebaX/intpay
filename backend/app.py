from flask import Flask
from flask_cors import CORS
from config import Config
from routes import stripe

app = Flask(__name__)
app.config.from_object(Config)
CORS(app)  # Enable CORS

app.register_blueprint(stripe.bp)

if __name__ == '__main__':
    app.run(debug=True)