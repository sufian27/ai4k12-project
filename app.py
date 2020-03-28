import sqlite3, os
import csv, json
from flask import Flask, render_template, request, jsonify, session, redirect, url_for, g
from flask_sqlalchemy import SQLAlchemy

#init dataset database
conn = sqlite3.connect("datasets.db", check_same_thread=False) #todo: We need to serialize if multiple write operations later
c = conn.cursor()
#init app
app = Flask(__name__)
app.secret_key = os.urandom(24)
#init log database
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///logdata.db'
db = SQLAlchemy(app)
from models import User, User_Action
from helpers import get_db_data_json, create_table_from_csv, get_values_str, get_fields_str
db.create_all()
# json_object = get_db_data_json(1) #todo: store the dataset as a global variable that all the webpage can access (try session?)

@app.before_request
def before_request(): #set global user
    g.user = None
    if 'user_id' in session:
        user = User.query.get(session['user_id'])
        g.user = user
        
@app.route('/')
def index():
    if g.user == None:
        return redirect(url_for('login'))

    db.session.add(User_Action('user at home page', session['user_id'])) #log data 
    db.session.commit()
    return render_template('index.html', title='Home')

@app.route('/login', methods=['GET', 'POST'])
def login():
    valid_user = False
    if request.method == 'POST':
        session.pop('user_id', None)
        user_id = request.form['user_id']
        user_exists = db.session.query(db.exists().where(User.id == user_id)).scalar()
        if user_exists: #user logged in
            session['user_id'] = user_id
            db.session.add(User_Action('successfully logged in', user_id)) #log data
            db.session.commit()
            return redirect(url_for('index'))

        return render_template('login.html', valid = user_exists)

    return render_template('login.html', valid = True)

@app.route('/logout')
def logout():
    db.session.add(User_Action('user logged out', session['user_id'])) #log data 
    db.session.commit()
    session.pop('user_id', None)
    return redirect(url_for('login'))

@app.route('/add', methods=['GET', 'POST'])
def add():
    added = False
    unique = True
    user_id = 0
    if request.method == 'POST':
        try:
            db.session.add(User(request.form['user_id']))
            db.session.commit()
            user_id = request.form['user_id']
            added = True
        except:
            unique = False
    
    return render_template('add.html', added = added, user_id = user_id, unique = unique)

@app.route('/intro')
def introduction():
    if g.user == None:
        return redirect(url_for('login'))

    example_index = request.args.get('example', default = 0, type = int)
    create_table_from_csv(example_index)
    json_object = get_db_data_json(example_index)

    db.session.add(User_Action('user at intro page', session['user_id'])) #log data 
    db.session.commit()
    return render_template('introduction.html', json_data = json_object, example = str(example_index), title='Introduction') #render next page with passing json object

@app.route('/var', methods = ['GET', 'POST'])
def var():
    if g.user == None:
        return redirect(url_for('login'))
    if request.method == 'GET':
        example_index = request.args.get('example', default = 0, type = int)
        return render_template('var.html', example = str(example_index), title='Variable')
    else:
        return 'Invalid Data'

@app.route('/dataset2face', methods = ['GET', 'POST'])
def dataset2face():
    if g.user == None:
        return redirect(url_for('login'))
    if request.method == 'GET':
        example_index = request.args.get('example', default = 0, type = int)
        return render_template('dataset2face.html', example = str(example_index), title='Dataset to Face')
    else:
        return 'Invalid Data'

if __name__ == "__main__":
    app.run()
