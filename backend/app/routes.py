from flask import Blueprint, jsonify

main = Blueprint('main', __name__)

@main.route('/players', methods=['GET'])
def get_players():
    # Placeholder data
    players = [
        {"name": "LeBron James", "team": "Lakers", "badges": ["Scorer", "Playmaker"]},
        {"name": "Stephen Curry", "team": "Warriors", "badges": ["Shooter", "Playmaker"]}
    ]
    return jsonify(players)
