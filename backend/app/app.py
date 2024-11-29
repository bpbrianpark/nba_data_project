from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_restful import Api
from app.routes import routes  

db = SQLAlchemy()
api = Api()

def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///nba.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    db.init_app(app)
    api.init_app(app)

    app.register_blueprint(routes)
    return app  
