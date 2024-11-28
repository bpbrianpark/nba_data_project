from flask import Blueprint, jsonify
from app.scrape.api_helpers import create_db, connect_to_db
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
        return jsonify({"error": "Failed to scrape database", "message": str(e)}), 500
    
@routes.route('/get_table_data/<string:table_name>', methods=['GET'])
def get_table_data(table_name):
    try:
        con = None
        con = connect_to_db(con)
        cur = con.cursor()
        cur.execute(f"SELECT * FROM {table_name}")
        rows = cur.fetchall()
        columns = [desc[0] for desc in cur.description]
        data = [dict(zip(columns, row)) for row in rows]
        cur.close()
        con.close()
        return jsonify(data), 200
    except Exception as e:
        print(f"Error: {e}") 
        return jsonify({"error": str(e)}), 500
