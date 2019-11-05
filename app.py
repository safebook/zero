from flask import Flask, request, escape, jsonify
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__, static_url_path='')

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    data = db.Column(db.Text)

    def serialize(self):
        return {
            'id': self.id,
            'data': self.data
        }

db.create_all()

@app.route('/')
def root():
    return app.send_static_file('index.html')

@app.route('/messages', methods = ['GET'])
def messages():
    messages = Message.query.all()
    return jsonify(messages = [m.serialize() for m in messages])

@app.route('/messages', methods = ['POST'])
def create_message():
    message = Message(data=request.json['data'])
    db.session.add(message)
    db.session.commit()
    return jsonify(message.serialize())
