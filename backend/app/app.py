from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_restful import Api

db = SQLAlchemy()
api = Api()

def create_app():
    app = Flask(__name__)

    # Configurations
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///nba.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # Initialize extensions
    db.init_app(app)
    api.init_app(app)

    # Register routes
    from app.routes import routes  # Import your Blueprint
    app.register_blueprint(routes)

    return app  # Ensure the app is returned here
