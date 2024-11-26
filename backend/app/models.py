from . import db

class Player(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    team = db.Column(db.String(100), nullable=False)
    assists = db.Column(db.Float, default=0)
    rebounds = db.Column(db.Float, default=0)

    def __repr__(self):
        return f"<Player {self.name}>"
