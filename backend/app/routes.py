from flask import Blueprint, jsonify
from app.scrape.api_helpers import create_db
from app.scrape.scraper import scrape_year_data

routes = Blueprint('routes', __name__)

@routes.route('/create_database', methods=['POST'])
def create_database():
    try:
        create_db()
        return jsonify({"message": "Database created successfully!"}), 200
    except Exception as e:
        return jsonify({"error": "Failed to create database", "message": str(e)}), 500
    
@routes.route('/scrape_database', methods=['POST'])
def scrape_database():
    try:
        scrape_year_data()
        return jsonify({"message": "Database scraped successfully!"}), 200
    except Exception as e:
        return jsonify({"error": "Failed to scraped database", "message": str(e)}), 500
