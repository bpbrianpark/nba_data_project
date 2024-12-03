from flask import Blueprint, jsonify
from app.api_helpers import create_db, connect_to_db, col_directory, get_cols
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
        columns = [desc[0] for desc in cur.description]  
        data = [dict(zip(columns, row)) for row in rows]
        cur.close()
        con.close()
        return jsonify({"columns": columns, "data": data}), 200 
    except Exception as e:
        print(f"Error: {e}") 
        return jsonify({"error": str(e)}), 500
    

# Get Players
@routes.route('/get_players/<int:year>', methods=['GET'])
def get_players(year):
    try:
        table_name = f"pergame_{year}"
        con = None
        con = connect_to_db(con)
        cur = con.cursor()
        cur.execute(f"SELECT DISTINCT pid, name FROM {table_name} ORDER BY name")
        players = cur.fetchall()
        cur.close()
        con.close()

        player_list = [{"pid": player[0], "name": player[1]} for player in players]
        return jsonify({"players": player_list}), 200
    except Exception as e:
        print(f"Error: {e}") 
        return jsonify({"error": str(e)}), 500
    
# Get player stats
@routes.route('/get_yearly_stats/<int:pid>/<string:table_prefix>/<string:col_name>', methods=['GET'])
def get_yearly_stats(pid, table_prefix, col_name):
    try:
        years = range(2022, 2025)
        con = None
        con = connect_to_db(con)
        cur = con.cursor()
        stats = []
        for year in years:
            table_name = f"{table_prefix}_{year}"
            try:
                query = f"SELECT {col_name} FROM {table_name} WHERE pid = {pid}"
                cur.execute(query)
                rows = cur.fetchall()
                if rows:
                    stats.append({
                        "year": year,
                        "column": col_name,
                        "value": rows[0][0]
                    })
            except Exception as table_error:
                print(f"Skipping table {table_name}: {table_error}")
        cur.close()
        con.close()
        if not stats:
            return jsonify({"message": "Player data doesn't exist in the given years"}), 404
        return jsonify({"pid": pid, "stats": stats}), 200
    except Exception as e:
        print(f"Error: {e}") 
        return jsonify({"error": str(e)}), 500

# TODO: get all column names
# Get all column names
@routes.route('/get_all_columns/<string:table_name>', methods=['GET'])
def get_all_columns(table_name):
    try:
        columns = get_cols(table_name)
        return jsonify({"columns": columns}), 200
    except Exception as e:
        print(f"Error: {e}") 
        return jsonify({"error": str(e)}), 500
    
# TODO: fix the col_directory
# Get Modified Column Name Endpoint 
@routes.route('/get_column_name/<string:col_name>', methods=['GET'])
def get_column_name(col_name):
    try:
        clean_name = col_directory(col_name)
        return jsonify({"col_name": clean_name}), 200
    except Exception as e:
        print(f"Error: {e}") 
        return jsonify({"error": str(e)}), 500
