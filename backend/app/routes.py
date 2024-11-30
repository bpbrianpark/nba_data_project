from flask import Blueprint, jsonify
from app.api_helpers import create_db, connect_to_db
from app.scraper import scrape_year_data, scrape_all_years

routes = Blueprint('routes', __name__)

# Create Database Endpoint
@routes.route('/create_database', methods=['POST'])
def create_database():
    try:
        create_db()
        return jsonify({"message": "Database created successfully!"}), 200
    except Exception as e:
        return jsonify({"error": "Failed to create database", "message": str(e)}), 500

# Scrape Database Endpoint 
@routes.route('/scrape_database', methods=['POST'])
def scrape_database():
    try:
        scrape_all_years(2024)
        return jsonify({"message": "Database scraped successfully!"}), 200
    except Exception as e:
        return jsonify({"error": "Failed to scrape database", "message": str(e)}), 500
    
# Get Tables Endpoint 
@routes.route('/get_table_data/<string:table_name>', methods=['GET'])
def get_table_data(table_name):
    try:
        con = None
        con = connect_to_db(con)
        cur = con.cursor()
        cur.execute(f"SELECT * FROM {table_name}")
        rows = cur.fetchall()
        columns = [desc[0] for desc in cur.description]  # Column order from DB
        # Construct rows as ordered dictionaries
        data = [dict(zip(columns, row)) for row in rows]
        cur.close()
        con.close()
        return jsonify({"columns": columns, "data": data}), 200  # Return column order
    except Exception as e:
        print(f"Error: {e}") 
        return jsonify({"error": str(e)}), 500

    

# Get Modified Column Name Endpoint 
@routes.route('/get_column_name/<string:col_name>', methods=['GET'])
def get_column_name(col_name):
    try:
        return jsonify(data), 200
    except Exception as e:
        print(f"Error: {e}") 
        return jsonify({"error": str(e)}), 500
