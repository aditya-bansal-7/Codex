# create flask app
from flask import Flask, render_template, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/')
def mainfunc():
    return render_template('index.html')

@app.route('/api/fraudDetection', methods=['POST'])
def FraudDetection():
    data = request.get_json()
    print(data)
    return data

if(__name__ == "__main__"):
    app.run(debug=True)
