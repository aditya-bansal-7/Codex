from prisma import Client
import os
import pandas as pd
import numpy as np
from flask import Flask, request, jsonify
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LogisticRegression
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
import joblib
from flask_cors import CORS

app = Flask(__name__)

CORS(app)

# Set a path to the CSV training file
TRAIN_CSV_PATH = './data/transactions_train.csv'

# Define the feature columns (adjust as necessary)
FEATURES = [
    'transaction_amount',
    'transaction_channel',
    'transaction_payment_mode',
    'payment_gateway_bank',
    'payer_browser',
    'payee_id'
]

TARGET = 'is_fraud'


def load_and_train_model():
    # Load training data
    df = pd.read_csv(TRAIN_CSV_PATH)

    # Check if target column exists
    if TARGET not in df.columns:
        raise ValueError(
            f"Training data must include '{TARGET}' column as target.")

    X = df[FEATURES]
    y = df[TARGET]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42)

    numeric_features = ['transaction_amount']
    categorical_features = [
        feat for feat in FEATURES if feat not in numeric_features]

    numeric_transformer = Pipeline(steps=[
        ('imputer', SimpleImputer(strategy='mean')),
        ('scaler', StandardScaler())
    ])

    # For categorical features: first impute missing values with a constant, then one-hot encode
    categorical_transformer = Pipeline(steps=[
        ('imputer', SimpleImputer(strategy='constant', fill_value='missing')),
        ('onehot', OneHotEncoder(handle_unknown='ignore'))
    ])

    preprocessor = ColumnTransformer(
        transformers=[
            ('num', numeric_transformer, numeric_features),
            ('cat', categorical_transformer, categorical_features)
        ]
    )

    # Create a pipeline that preprocesses data then fits a logistic regression model
    clf = Pipeline(steps=[
        ('preprocessor', preprocessor),
        ('classifier', LogisticRegression(max_iter=1000))
    ])

    # Train the model
    clf.fit(X_train, y_train)

    # Optionally, save the model for future use
    joblib.dump(clf, 'fraud_detection_model.pkl')
    print("Model training complete and saved as 'fraud_detection_model.pkl'")
    return clf


# Train the model when the app starts (in production, you might load a pre-trained model instead)
model = load_and_train_model()


def predict_transaction(transaction, fraud_rules=[]):
    """
    Given a transaction dictionary, apply fraud detection rules from the database first.
    If a rule condition is met, return that prediction.
    Otherwise, use the trained ML model to predict.
    """

    print(transaction)
    transaction_id = transaction.get("transaction_id", "unknown")

    amount = float(transaction["transaction"]["transaction_amount"])
    # Example for location-based rules
    location = transaction.get("transaction_channel", "")

    print(amount)

    if (amount > 10000):
        return {
            "transaction_id": transaction_id,
            "is_fraud": True,
            "fraud_source": "rule",
            "fraud_reason": "High Amount",
            "fraud_score": 1.0
        }
    # Check rule-based fraud detection from database
    # for rule in fraud_rules:
    #     rule_type = rule["type"].lower()
    #     condition = rule["condition"]
    #     risk_score = rule["risk_score"]

    #     if rule_type == "amount" and amount > float(condition.split(" ")[1]):
    #         return {
    #             "transaction_id": transaction_id,
    #             "is_fraud": True,
    #             "fraud_source": "rule",
    #             "fraud_reason": rule["name"],
    #             "fraud_score": risk_score / 100.0  # Normalize score to 0-1
    #         }

    #     if rule_type == "location" and location not in condition.replace("not-in ", "").split(","):
    #         return {
    #             "transaction_id": transaction_id,
    #             "is_fraud": True,
    #             "fraud_source": "rule",
    #             "fraud_reason": rule["name"],
    #             "fraud_score": risk_score / 100.0
    #         }
    # # Otherwise, use the ML model. Build input DataFrame with the required features.
    input_data = {feat: [transaction.get("transaction").get(feat, "")] for feat in FEATURES}
    df_input = pd.DataFrame(input_data)

    # Get the probability for the positive class (fraud = 1)
    fraud_prob = model.predict_proba(df_input)[0][1]
    predicted_fraud = fraud_prob >= 0.5  # threshold can be adjusted

    fraud_reason = "Model prediction"
    return {
        "transaction_id": transaction_id,
        "is_fraud": bool(predicted_fraud),
        "fraud_source": "model",
        "fraud_reason": fraud_reason,
        "fraud_score": float(fraud_prob)
    }


def fetch_fraud_rules_from_db():
    db = Client()
    db.connect()

    try:
        fraud_rules = db.fraudrule.find_many(
            where={"status": True})  # Fetch active rules
        return fraud_rules
    finally:
        db.disconnect()


@app.route('/predict', methods=['POST'])
def predict():
    # Expecting JSON input as specified
    transaction = request.get_json()
    if not transaction:
        return jsonify({"error": "No input data provided"}), 400

    try:
        result = predict_transaction(transaction)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    # Run the Flask app
    app.run(host='0.0.0.0', port=5000)
