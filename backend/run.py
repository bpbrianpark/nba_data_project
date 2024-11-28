from flask import Flask, jsonify, request
from flask_cors import CORS
from app.app import create_app

# app = Flask(__name__)
app = create_app()
print("App object:", app)
CORS(app)  # Enable Cross-Origin Resource Sharing

if __name__ == '__main__':
    app.run(debug=True)

